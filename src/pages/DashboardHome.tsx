import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Play, Sparkles, CheckCircle2, MessageSquare, TrendingUp, Package, Lightbulb } from "lucide-react";
import KPICard from "@/components/KPICard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { comments as demoComments } from "@/data/mockData";

const steps = [
  { label: "Scraping posts...", duration: 1200 },
  { label: "Analyzing comments...", duration: 1500 },
  { label: "Generating insights...", duration: 1000 },
];

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [pageUrl, setPageUrl] = useState("https://facebook.com/shopkh");

  // Fetch stats from DB
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const [commentsRes, productsRes, insightsRes, sessionsRes] = await Promise.all([
        supabase.from("comments").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("insights").select("id", { count: "exact", head: true }),
        supabase.from("analysis_sessions").select("avg_sentiment").order("created_at", { ascending: false }).limit(1),
      ]);
      return {
        totalComments: commentsRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalInsights: insightsRes.count || 0,
        avgSentiment: sessionsRes.data?.[0]?.avg_sentiment || 0,
      };
    },
    enabled: !!user,
  });

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setCurrentStep(0);
    setCompleted(false);

    // Simulate progress steps while calling the edge function
    let step = 0;
    const progressInterval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setCurrentStep(step);
      }
    }, 1300);

    try {
      const commentsPayload = demoMode
        ? demoComments.map((c) => ({ text: c.text, likes: c.likes, date: c.date }))
        : [];

      const { data, error } = await supabase.functions.invoke("analyze-comments", {
        body: { pageUrl, comments: commentsPayload, demoMode },
      });

      clearInterval(progressInterval);

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCurrentStep(steps.length);
      setCompleted(true);
      toast({ title: "Analysis Complete!", description: `Analyzed ${data.totalComments} comments across ${data.products?.length || 0} products.` });
      setTimeout(() => navigate("/dashboard/sentiment"), 1200);
    } catch (err: any) {
      clearInterval(progressInterval);
      setAnalyzing(false);
      setCurrentStep(-1);
      toast({ title: "Analysis failed", description: err.message || "Something went wrong", variant: "destructive" });
    }
  };

  const hasData = (stats?.totalComments || 0) > 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Analyze your Facebook page and get actionable insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Comments" value={hasData ? stats!.totalComments.toLocaleString() : "0"} icon={MessageSquare} trend={hasData ? { value: "from analysis", positive: true } : undefined} />
        <KPICard title="Avg Sentiment" value={hasData ? `${Math.round((stats!.avgSentiment) * 100)}%` : "—"} icon={TrendingUp} variant={hasData ? "positive" : "default"} />
        <KPICard title="Products Tracked" value={`${stats?.totalProducts || 0}`} icon={Package} />
        <KPICard title="Insights Ready" value={`${stats?.totalInsights || 0}`} icon={Lightbulb} variant={(stats?.totalInsights || 0) > 0 ? "warning" : "default"} />
      </div>

      {/* Analysis Card */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="font-display">Analyze Facebook Page</CardTitle>
          </div>
          <CardDescription>Enter a Facebook page URL to start analyzing customer sentiment using AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!analyzing ? (
            <>
              <div className="space-y-2">
                <Label>Facebook Page URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="https://facebook.com/pagename" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="demo" checked={demoMode} onCheckedChange={setDemoMode} />
                  <Label htmlFor="demo" className="text-sm text-muted-foreground">Demo Mode (use sample data)</Label>
                </div>
                <Button onClick={handleAnalyze} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Analysis
                </Button>
              </div>
              {!demoMode && (
                <p className="text-xs text-muted-foreground">
                  💡 To fetch real comments, add your Facebook Access Token in Settings. Without it, use Demo Mode.
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4 py-2">
              {steps.map((step, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {i < currentStep || completed ? (
                      <CheckCircle2 className="h-4 w-4 text-sentiment-positive" />
                    ) : i === currentStep ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    )}
                    <span className={i <= currentStep || completed ? "text-foreground" : "text-muted-foreground"}>
                      {step.label}
                    </span>
                  </div>
                  {i === currentStep && !completed && (
                    <Progress value={65} className="h-1.5" />
                  )}
                </div>
              ))}
              {completed && (
                <div className="text-center py-4 animate-fade-in">
                  <CheckCircle2 className="h-10 w-10 text-sentiment-positive mx-auto mb-2" />
                  <p className="font-semibold text-sentiment-positive">Analysis Complete!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to results...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
