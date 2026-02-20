import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Play, Sparkles, CheckCircle2 } from "lucide-react";
import KPICard from "@/components/KPICard";
import { MessageSquare, TrendingUp, Package, Lightbulb } from "lucide-react";

const steps = [
  { label: "Scraping posts...", duration: 1200 },
  { label: "Analyzing comments...", duration: 1500 },
  { label: "Generating insights...", duration: 1000 },
];

const DashboardHome = () => {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setCurrentStep(0);
    setCompleted(false);

    let step = 0;
    const runStep = () => {
      if (step < steps.length) {
        setCurrentStep(step);
        step++;
        setTimeout(runStep, steps[step - 1].duration);
      } else {
        setCompleted(true);
        setTimeout(() => navigate("/dashboard/sentiment"), 1000);
      }
    };
    runStep();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Analyze your Facebook page and get actionable insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Comments" value="1,234" icon={MessageSquare} trend={{ value: "12% vs last week", positive: true }} />
        <KPICard title="Avg Sentiment" value="72% Positive" icon={TrendingUp} variant="positive" trend={{ value: "5% improvement", positive: true }} />
        <KPICard title="Products Tracked" value="12 Products" icon={Package} subtitle="8 active this week" />
        <KPICard title="Insights Ready" value="8 Insights" icon={Lightbulb} variant="warning" subtitle="3 require attention" />
      </div>

      {/* Analysis Card */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="font-display">Analyze Facebook Page</CardTitle>
          </div>
          <CardDescription>Enter a Facebook page URL to start analyzing customer sentiment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!analyzing ? (
            <>
              <div className="space-y-2">
                <Label>Facebook Page URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="https://facebook.com/pagename" defaultValue={demoMode ? "https://facebook.com/shopkh" : ""} />
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
