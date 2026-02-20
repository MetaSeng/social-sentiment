import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import KPICard from "@/components/KPICard";
import { MessageSquare, TrendingUp, Package, Lightbulb } from "lucide-react";
import { comments, sentimentOverTime } from "@/data/mockData";
import { cn } from "@/lib/utils";

const pieData = [
  { name: "Positive", value: 58, color: "hsl(142, 71%, 45%)" },
  { name: "Neutral", value: 22, color: "hsl(215, 15%, 55%)" },
  { name: "Negative", value: 20, color: "hsl(0, 72%, 51%)" },
];

const engagementData = [
  { post: "Post 1", likes: 120, sentiment: 82 },
  { post: "Post 2", likes: 85, sentiment: 45 },
  { post: "Post 3", likes: 200, sentiment: 91 },
  { post: "Post 4", likes: 60, sentiment: 30 },
  { post: "Post 5", likes: 150, sentiment: 75 },
  { post: "Post 6", likes: 95, sentiment: 68 },
];

const SentimentAnalysis = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? comments : comments.filter((c) => c.sentiment === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Sentiment Analysis</h1>
        <p className="text-muted-foreground mt-1">Comprehensive overview of customer sentiment from your Facebook page.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Comments" value="1,234" icon={MessageSquare} trend={{ value: "12%", positive: true }} />
        <KPICard title="Avg Sentiment" value="72%" icon={TrendingUp} variant="positive" trend={{ value: "5%", positive: true }} />
        <KPICard title="Engaged Products" value="12" icon={Package} />
        <KPICard title="Insights Ready" value="8" icon={Lightbulb} variant="warning" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-display">Sentiment Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sentimentOverTime}>
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

        {/* Pie Chart */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base font-display">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name} {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-base font-display">Engagement vs Sentiment</CardTitle>
        </CardHeader>
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

      {/* Comments Table */}
      <Card className="card-shadow">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-display">Recent Comments</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
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
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        c.sentiment === "positive" && "border-sentiment-positive/40 text-sentiment-positive bg-sentiment-positive/5",
                        c.sentiment === "negative" && "border-sentiment-negative/40 text-sentiment-negative bg-sentiment-negative/5",
                        c.sentiment === "neutral" && "border-sentiment-neutral/40 text-sentiment-neutral bg-sentiment-neutral/5"
                      )}
                    >
                      {c.sentiment}
                    </Badge>
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
