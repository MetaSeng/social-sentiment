import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import KPICard from "@/components/KPICard";
import { MessageSquare, TrendingUp, Package, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { comments as fallbackComments, sentimentOverTime as fallbackTimeline } from "@/data/mockData";

const SentimentAnalysis = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const { data: dbComments } = useQuery({
    queryKey: ["comments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: dbProducts } = useQuery({
    queryKey: ["products-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: dbInsights } = useQuery({
    queryKey: ["insights-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("insights").select("id", { count: "exact", head: true });
      return count || 0;
    },
    enabled: !!user,
  });

  const hasDbData = (dbComments?.length || 0) > 0;
  const comments = hasDbData
    ? dbComments!.map((c: any) => ({
        id: c.id,
        text: c.text,
        product: c.product_name || "General",
        sentiment: c.sentiment as "positive" | "neutral" | "negative",
        score: c.sentiment_score,
        date: c.comment_date ? new Date(c.comment_date).toISOString().split("T")[0] : c.created_at?.split("T")[0],
        likes: c.likes,
      }))
    : fallbackComments;

  const filtered = filter === "all" ? comments : comments.filter((c) => c.sentiment === filter);

  const totalComments = comments.length;
  const positiveCount = comments.filter((c) => c.sentiment === "positive").length;
  const neutralCount = comments.filter((c) => c.sentiment === "neutral").length;
  const negativeCount = comments.filter((c) => c.sentiment === "negative").length;
  const avgPositive = totalComments > 0 ? Math.round((positiveCount / totalComments) * 100) : 0;

  const pieData = [
    { name: "Positive", value: positiveCount, color: "hsl(142, 71%, 45%)" },
    { name: "Neutral", value: neutralCount, color: "hsl(215, 15%, 55%)" },
    { name: "Negative", value: negativeCount, color: "hsl(0, 72%, 51%)" },
  ];

  // Group by date for timeline
  const dateMap: Record<string, { positive: number; neutral: number; negative: number }> = {};
  comments.forEach((c) => {
    const d = c.date;
    if (!dateMap[d]) dateMap[d] = { positive: 0, neutral: 0, negative: 0 };
    dateMap[d][c.sentiment]++;
  });
  const timeline = hasDbData
    ? Object.entries(dateMap).sort().map(([date, vals]) => ({ date, ...vals }))
    : fallbackTimeline;

  const engagementData = hasDbData
    ? comments.slice(0, 6).map((c, i) => ({ post: `Comment ${i + 1}`, likes: c.likes, sentiment: Math.round(c.score * 100) }))
    : [
        { post: "Post 1", likes: 120, sentiment: 82 },
        { post: "Post 2", likes: 85, sentiment: 45 },
        { post: "Post 3", likes: 200, sentiment: 91 },
        { post: "Post 4", likes: 60, sentiment: 30 },
        { post: "Post 5", likes: 150, sentiment: 75 },
        { post: "Post 6", likes: 95, sentiment: 68 },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Sentiment Analysis</h1>
        <p className="text-muted-foreground mt-1">
          {hasDbData ? "Real analysis results from your data." : "Showing sample data. Run an analysis from the Dashboard to see real results."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Comments" value={totalComments.toLocaleString()} icon={MessageSquare} />
        <KPICard title="Positive Rate" value={`${avgPositive}%`} icon={TrendingUp} variant="positive" />
        <KPICard title="Products" value={`${hasDbData ? dbProducts : 12}`} icon={Package} />
        <KPICard title="Insights" value={`${hasDbData ? dbInsights : 8}`} icon={Lightbulb} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader><CardTitle className="text-base font-display">Sentiment Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="date" fontSize={12} tick={{ fill: "hsl(215, 15%, 50%)" }} />
                <YAxis fontSize={12} tick={{ fill: "hsl(215, 15%, 50%)" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(215, 20%, 90%)", fontSize: "13px" }} />
                <Line type="monotone" dataKey="positive" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Positive" />
                <Line type="monotone" dataKey="neutral" stroke="hsl(215, 15%, 55%)" strokeWidth={2} dot={{ r: 4 }} name="Neutral" />
                <Line type="monotone" dataKey="negative" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 4 }} name="Negative" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base font-display">Distribution</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name} {totalComments > 0 ? Math.round((entry.value / totalComments) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader><CardTitle className="text-base font-display">Engagement vs Sentiment</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="post" fontSize={12} tick={{ fill: "hsl(215, 15%, 50%)" }} />
              <YAxis fontSize={12} tick={{ fill: "hsl(215, 15%, 50%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(215, 20%, 90%)", fontSize: "13px" }} />
              <Bar dataKey="likes" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Likes" />
              <Bar dataKey="sentiment" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Sentiment %" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-display">Recent Comments</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="max-w-[300px] truncate font-medium">{c.text}</TableCell>
                  <TableCell className="text-muted-foreground">{c.product}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize",
                      c.sentiment === "positive" && "border-sentiment-positive/40 text-sentiment-positive bg-sentiment-positive/5",
                      c.sentiment === "negative" && "border-sentiment-negative/40 text-sentiment-negative bg-sentiment-negative/5",
                      c.sentiment === "neutral" && "border-sentiment-neutral/40 text-sentiment-neutral bg-sentiment-neutral/5"
                    )}>{c.sentiment}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">{c.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
