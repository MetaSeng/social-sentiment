import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { pageUrl, comments: inputComments, demoMode } = await req.json();

    // If demo mode or no FB token, use provided comments directly
    let commentsToAnalyze = inputComments || [];

    if (!demoMode && commentsToAnalyze.length === 0) {
      // In production: fetch from Facebook Graph API
      const fbToken = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
      if (fbToken) {
        try {
          // Extract page ID from URL
          const pageId = pageUrl.split("/").filter(Boolean).pop();
          const fbResponse = await fetch(
            `https://graph.facebook.com/v19.0/${pageId}/feed?fields=message,comments{message,like_count,created_time}&access_token=${fbToken}&limit=50`
          );
          const fbData = await fbResponse.json();

          if (fbData.data) {
            for (const post of fbData.data) {
              if (post.comments?.data) {
                for (const comment of post.comments.data) {
                  commentsToAnalyze.push({
                    text: comment.message,
                    likes: comment.like_count || 0,
                    date: comment.created_time,
                  });
                }
              }
            }
          }
        } catch (fbError) {
          console.error("Facebook API error:", fbError);
        }
      }
    }

    if (commentsToAnalyze.length === 0) {
      return new Response(
        JSON.stringify({ error: "No comments to analyze. Add your Facebook Access Token in Settings or use Demo Mode." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create analysis session
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .insert({ user_id: userId, page_url: pageUrl, status: "analyzing" })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Use Lovable AI for sentiment analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const commentsText = commentsToAnalyze
      .map((c: any, i: number) => `${i + 1}. "${c.text}"`)
      .join("\n");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a sentiment analysis expert for e-commerce. Analyze each comment and return a JSON response.
For each comment, determine:
- sentiment: "positive", "neutral", or "negative"
- score: 0.0 to 1.0 (0 = very negative, 1 = very positive)
- product_name: the product mentioned (if any, otherwise "General")
- keywords: array of 1-3 key topics mentioned

Also provide:
- products: aggregated product data with name, mentions count, positive/neutral/negative percentages, and top keywords
- insights: 3-6 actionable business insights based on the analysis, each with icon (emoji), title, description, and type (success/warning/danger/info)

Comments may be in Khmer, Khmerlish (Khmer-English mix), or English.

Return ONLY valid JSON with this structure:
{
  "comments": [{"index": 1, "sentiment": "positive", "score": 0.9, "product_name": "iPhone 15", "keywords": ["quality", "fast"]}],
  "products": [{"name": "iPhone 15", "mentions": 5, "positive": 70, "neutral": 20, "negative": 10, "keywords": ["battery", "camera"]}],
  "insights": [{"icon": "📦", "title": "Shipping issues", "description": "...", "type": "warning"}]
}`,
          },
          { role: "user", content: `Analyze these ${commentsToAnalyze.length} comments:\n${commentsText}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_sentiment",
              description: "Return sentiment analysis results",
              parameters: {
                type: "object",
                properties: {
                  comments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "number" },
                        sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                        score: { type: "number" },
                        product_name: { type: "string" },
                        keywords: { type: "array", items: { type: "string" } },
                      },
                      required: ["index", "sentiment", "score", "product_name"],
                    },
                  },
                  products: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        mentions: { type: "number" },
                        positive: { type: "number" },
                        neutral: { type: "number" },
                        negative: { type: "number" },
                        keywords: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "mentions", "positive", "neutral", "negative"],
                    },
                  },
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string", enum: ["success", "warning", "danger", "info"] },
                      },
                      required: ["icon", "title", "description", "type"],
                    },
                  },
                },
                required: ["comments", "products", "insights"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_sentiment" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis results returned from AI");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Store products
    const productInserts = (analysis.products || []).map((p: any) => ({
      session_id: session.id,
      user_id: userId,
      name: p.name,
      mentions: p.mentions,
      positive_pct: p.positive,
      neutral_pct: p.neutral,
      negative_pct: p.negative,
      keywords: p.keywords || [],
    }));

    let productMap: Record<string, string> = {};
    if (productInserts.length > 0) {
      const { data: insertedProducts } = await supabase
        .from("products")
        .insert(productInserts)
        .select();
      if (insertedProducts) {
        for (const p of insertedProducts) {
          productMap[p.name] = p.id;
        }
      }
    }

    // Store comments with sentiment
    const commentInserts = (analysis.comments || []).map((c: any, i: number) => {
      const original = commentsToAnalyze[c.index - 1] || commentsToAnalyze[i];
      return {
        session_id: session.id,
        user_id: userId,
        text: original?.text || "",
        product_name: c.product_name,
        product_id: productMap[c.product_name] || null,
        sentiment: c.sentiment,
        sentiment_score: c.score,
        likes: original?.likes || 0,
        comment_date: original?.date || new Date().toISOString(),
      };
    });

    if (commentInserts.length > 0) {
      await supabase.from("comments").insert(commentInserts);
    }

    // Store insights
    const insightInserts = (analysis.insights || []).map((ins: any) => ({
      session_id: session.id,
      user_id: userId,
      icon: ins.icon,
      title: ins.title,
      description: ins.description,
      type: ins.type,
    }));

    if (insightInserts.length > 0) {
      await supabase.from("insights").insert(insightInserts);
    }

    // Update session
    const avgScore =
      (analysis.comments || []).reduce((sum: number, c: any) => sum + (c.score || 0.5), 0) /
      Math.max(1, (analysis.comments || []).length);

    await supabase
      .from("analysis_sessions")
      .update({
        status: "completed",
        total_comments: commentsToAnalyze.length,
        avg_sentiment: avgScore,
        completed_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        totalComments: commentsToAnalyze.length,
        avgSentiment: avgScore,
        products: analysis.products,
        insights: analysis.insights,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-comments error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
