import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { products as fallbackProducts, comments as fallbackComments } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ProductPerformance = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const { data: dbProducts } = useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("mentions", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: dbComments } = useQuery({
    queryKey: ["all-comments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("comments").select("*").order("created_at", { ascending: false });
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
    : fallbackProducts.map((p) => ({ ...p, trend: undefined }));

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  const getProductComments = (productName: string) => {
    if (hasDbData) {
      return (dbComments || [])
        .filter((c: any) => c.product_name === productName)
        .map((c: any) => ({
          id: c.id,
          text: c.text,
          sentiment: c.sentiment,
          date: c.comment_date ? new Date(c.comment_date).toISOString().split("T")[0] : "",
          likes: c.likes,
        }));
    }
    return fallbackComments.filter((c) => c.product === productName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Product Performance</h1>
        <p className="text-muted-foreground mt-1">
          {hasDbData ? "Real product data from your analysis." : "Showing sample data. Run an analysis first."}
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product: any) => (
          <Card key={product.id} className="card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold">{product.name}</h3>
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />{product.mentions}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
                  <div className="bg-sentiment-positive transition-all" style={{ width: `${product.positive}%` }} />
                  <div className="bg-sentiment-neutral transition-all" style={{ width: `${product.neutral}%` }} />
                  <div className="bg-sentiment-negative transition-all" style={{ width: `${product.negative}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span className="text-sentiment-positive">{Math.round(product.positive)}% pos</span>
                  <span className="text-sentiment-neutral">{Math.round(product.neutral)}% neu</span>
                  <span className="text-sentiment-negative">{Math.round(product.negative)}% neg</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {(product.keywords || []).slice(0, 3).map((kw: string) => (
                  <span key={kw} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{kw}</span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full gap-1 opacity-80 group-hover:opacity-100" onClick={() => setSelectedProduct(product)}>
                <Eye className="h-3.5 w-3.5" />View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-4 space-y-3">
                  {getProductComments(selectedProduct.name).map((c: any) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className={cn("text-[10px] shrink-0 capitalize",
                        c.sentiment === "positive" && "border-sentiment-positive/40 text-sentiment-positive",
                        c.sentiment === "negative" && "border-sentiment-negative/40 text-sentiment-negative",
                        c.sentiment === "neutral" && "border-sentiment-neutral/40 text-sentiment-neutral"
                      )}>{c.sentiment}</Badge>
                      <div>
                        <p className="text-sm">{c.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.date} · {c.likes} likes</p>
                      </div>
                    </div>
                  ))}
                  {getProductComments(selectedProduct.name).length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments found.</p>
                  )}
                </TabsContent>
                <TabsContent value="keywords" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.keywords || []).map((kw: string) => (
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
