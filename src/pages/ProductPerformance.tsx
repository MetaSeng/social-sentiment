import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Search, Eye, MessageSquare } from "lucide-react";
import { products, comments } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";

const ProductPerformance = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const productComments = selectedProduct
    ? comments.filter((c) => c.product === selectedProduct.name)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Product Performance</h1>
        <p className="text-muted-foreground mt-1">Track sentiment and engagement across all your products.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <Card key={product.id} className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold">{product.name}</h3>
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {product.mentions}
                </Badge>
              </div>

              {/* Sentiment Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
                  <div className="bg-sentiment-positive transition-all" style={{ width: `${product.positive}%` }} />
                  <div className="bg-sentiment-neutral transition-all" style={{ width: `${product.neutral}%` }} />
                  <div className="bg-sentiment-negative transition-all" style={{ width: `${product.negative}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span className="text-sentiment-positive">{product.positive}% pos</span>
                  <span className="text-sentiment-neutral">{product.neutral}% neu</span>
                  <span className="text-sentiment-negative">{product.negative}% neg</span>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.keywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{kw}</span>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1 opacity-80 group-hover:opacity-100" onClick={() => setSelectedProduct(product)}>
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="comments" className="mt-4">
                <TabsList>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="trend">Sentiment Trend</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="mt-4 space-y-3">
                  {productComments.length > 0 ? productComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] shrink-0 capitalize",
                          c.sentiment === "positive" && "border-sentiment-positive/40 text-sentiment-positive",
                          c.sentiment === "negative" && "border-sentiment-negative/40 text-sentiment-negative",
                          c.sentiment === "neutral" && "border-sentiment-neutral/40 text-sentiment-neutral"
                        )}
                      >
                        {c.sentiment}
                      </Badge>
                      <div>
                        <p className="text-sm">{c.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.date} · {c.likes} likes</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No comments found for this product.</p>
                  )}
                </TabsContent>

                <TabsContent value="trend" className="mt-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={selectedProduct.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
                      <Line type="monotone" dataKey="positive" stroke="hsl(142, 71%, 45%)" strokeWidth={2} name="Positive" />
                      <Line type="monotone" dataKey="negative" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Negative" />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="keywords" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.keywords.map((kw) => (
                      <span key={kw} className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium">{kw}</span>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductPerformance;
