import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { products, insights, trendingTopics } from "@/data/mockData";
import { cn } from "@/lib/utils";

const topProducts = products.filter((p) => p.positive >= 80).sort((a, b) => b.positive - a.positive);
const troubleProducts = products.filter((p) => p.negative >= 20).sort((a, b) => b.negative - a.negative);

const insightStyles = {
  success: "border-sentiment-positive/30 bg-sentiment-positive/5",
  warning: "border-sentiment-warning/30 bg-sentiment-warning/5",
  danger: "border-sentiment-negative/30 bg-sentiment-negative/5",
  info: "border-primary/30 bg-primary/5",
};

const Recommendations = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Recommendations</h1>
        <p className="text-muted-foreground mt-1">Actionable insights to grow your business based on customer feedback.</p>
      </div>

      {/* Top Performing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sentiment-positive/10">
            <TrendingUp className="h-4 w-4 text-sentiment-positive" />
          </div>
          <h2 className="text-lg font-display font-semibold">Top Satisfying Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map((p) => (
            <Card key={p.id} className="card-shadow border-sentiment-positive/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <Badge className="bg-sentiment-positive/10 text-sentiment-positive border-0 text-xs">{p.positive}% positive</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.keywords.filter((_, i) => i < 3).map((kw) => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-sentiment-positive/10 text-sentiment-positive rounded-full">{kw}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full gap-1" variant="outline">
                  <Megaphone className="h-3.5 w-3.5" />
                  Promote This Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Needs Improvement */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sentiment-warning/10">
            <AlertTriangle className="h-4 w-4 text-sentiment-warning" />
          </div>
          <h2 className="text-lg font-display font-semibold">Needs Improvement</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {troubleProducts.map((p) => (
            <Card key={p.id} className="card-shadow border-sentiment-negative/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <Badge className="bg-sentiment-negative/10 text-sentiment-negative border-0 text-xs">{p.negative}% negative</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.keywords.filter((_, i) => i < 3).map((kw) => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 bg-sentiment-negative/10 text-sentiment-negative rounded-full">{kw}</span>
                  ))}
                </div>
                <Button size="sm" className="w-full gap-1" variant="outline">
                  <ArrowRight className="h-3.5 w-3.5" />
                  View Feedback Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Actionable Insights */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-4">Actionable Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className={cn("card-shadow border", insightStyles[insight.type])}>
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
        <CardHeader>
          <CardTitle className="text-base font-display">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <span
                key={topic.word}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-medium transition-colors",
                  topic.sentiment === "positive" && "bg-sentiment-positive/10 text-sentiment-positive",
                  topic.sentiment === "negative" && "bg-sentiment-negative/10 text-sentiment-negative",
                  topic.sentiment === "neutral" && "bg-muted text-muted-foreground"
                )}
                style={{ fontSize: `${Math.max(12, Math.min(20, 10 + topic.count / 8))}px` }}
              >
                {topic.word}
                <span className="text-[10px] ml-1 opacity-60">({topic.count})</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;
