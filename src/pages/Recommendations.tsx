import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { products as fallbackProducts, insights as fallbackInsights, trendingTopics as fallbackTopics } from "@/data/mockData";
import { cn } from "@/lib/utils";

const insightStyles: Record<string, string> = {
  success: "border-sentiment-positive/30 bg-sentiment-positive/5",
  warning: "border-sentiment-warning/30 bg-sentiment-warning/5",
  danger: "border-sentiment-negative/30 bg-sentiment-negative/5",
  info: "border-primary/30 bg-primary/5",
};

const Recommendations = () => {
  const { user } = useAuth();

  const { data: dbProducts } = useQuery({
    queryKey: ["products-reco", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("mentions", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: dbInsights } = useQuery({
    queryKey: ["insights", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("insights").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const hasDbData = (dbProducts?.length || 0) > 0;

  const products = hasDbData
    ? dbProducts!.map((p: any) => ({
        id: p.id,
        name: p.name,
        mentions: p.mentions,
        positive: p.positive_pct,
        neutral: p.neutral_pct,
        negative: p.negative_pct,
        keywords: p.keywords || [],
      }))
    : fallbackProducts;

  const insights = (dbInsights?.length || 0) > 0
    ? dbInsights!.map((ins: any) => ({
        id: ins.id,
        icon: ins.icon || "💡",
        title: ins.title,
        description: ins.description,
        type: ins.type as "success" | "warning" | "danger" | "info",
      }))
    : fallbackInsights;

  const topProducts = products.filter((p: any) => p.positive >= 70).sort((a: any, b: any) => b.positive - a.positive);
  const troubleProducts = products.filter((p: any) => p.negative >= 20).sort((a: any, b: any) => b.negative - a.negative);

  // Build trending topics from product keywords
  const topicMap: Record<string, { count: number; sentiment: "positive" | "neutral" | "negative" }> = {};
  products.forEach((p: any) => {
    (p.keywords || []).forEach((kw: string) => {
      if (!topicMap[kw]) topicMap[kw] = { count: 0, sentiment: p.positive > 60 ? "positive" : p.negative > 30 ? "negative" : "neutral" };
      topicMap[kw].count += p.mentions || 1;
    });
  });
  const trendingTopics = hasDbData
    ? Object.entries(topicMap).map(([word, v]) => ({ word, ...v })).sort((a, b) => b.count - a.count).slice(0, 15)
    : fallbackTopics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Recommendations</h1>
        <p className="text-muted-foreground mt-1">
          {hasDbData ? "AI-generated insights from your analysis." : "Showing sample recommendations. Run an analysis to get real insights."}
        </p>
      </div>

      {/* Top Performing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sentiment-positive/10"><TrendingUp className="h-4 w-4 text-sentiment-positive" /></div>
          <h2 className="text-lg font-display font-semibold">Top Satisfying Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map((p: any) => (
            <Card key={p.id} className="card-shadow border-sentiment-positive/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <Badge className="bg-sentiment-positive/10 text-sentiment-positive border-0 text-xs">{Math.round(p.positive)}% positive</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(p.keywords || []).slice(0, 3).map((kw: string) => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-sentiment-positive/10 text-sentiment-positive rounded-full">{kw}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full gap-1" variant="outline"><Megaphone className="h-3.5 w-3.5" />Promote This Product</Button>
              </CardContent>
            </Card>
          ))}
          {topProducts.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No top products yet.</p>}
        </div>
      </div>

      {/* Needs Improvement */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sentiment-warning/10"><AlertTriangle className="h-4 w-4 text-sentiment-warning" /></div>
          <h2 className="text-lg font-display font-semibold">Needs Improvement</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {troubleProducts.map((p: any) => (
            <Card key={p.id} className="card-shadow border-sentiment-negative/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <Badge className="bg-sentiment-negative/10 text-sentiment-negative border-0 text-xs">{Math.round(p.negative)}% negative</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(p.keywords || []).slice(0, 3).map((kw: string) => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-sentiment-negative/10 text-sentiment-negative rounded-full">{kw}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full gap-1" variant="outline"><ArrowRight className="h-3.5 w-3.5" />View Feedback Details</Button>
              </CardContent>
            </Card>
          ))}
          {troubleProducts.length === 0 && <p className="text-sm text-muted-foreground col-span-3">No products need improvement.</p>}
        </div>
      </div>

      {/* Actionable Insights */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-4">Actionable Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className={cn("card-shadow border", insightStyles[insight.type] || insightStyles.info)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base font-display">Trending Topics</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic: any) => (
              <span
                key={topic.word}
                className={cn("px-3 py-1.5 rounded-lg font-medium transition-colors",
                  topic.sentiment === "positive" && "bg-sentiment-positive/10 text-sentiment-positive",
                  topic.sentiment === "negative" && "bg-sentiment-negative/10 text-sentiment-negative",
                  topic.sentiment === "neutral" && "bg-muted text-muted-foreground"
                )}
                style={{ fontSize: `${Math.max(12, Math.min(20, 10 + topic.count / 8))}px` }}
              >
                {topic.word}<span className="text-[10px] ml-1 opacity-60">({topic.count})</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;
