import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Facebook, Bell, Key, User } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-display">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Seller Pro" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="demo@socialsight.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input defaultValue="ShopKH Online Store" />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-display">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email reports", desc: "Weekly sentiment summary" },
            { label: "Negative spike alerts", desc: "When negative comments exceed 30%" },
            { label: "New recommendations", desc: "When new insights are generated" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={i < 2} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-display">Connected Accounts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Facebook className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Facebook Page</p>
                <p className="text-xs text-muted-foreground">ShopKH Online Store</p>
              </div>
            </div>
            <Badge className="bg-sentiment-positive/10 text-sentiment-positive border-0 text-xs">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Config */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-display">API Configuration</CardTitle>
          </div>
          <CardDescription>Configure API keys for advanced features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Facebook Graph API Token</Label>
            <Input type="password" defaultValue="EAAxxxxxxxxx..." />
          </div>
          <div className="space-y-2">
            <Label>Sentiment API Key (optional)</Label>
            <Input placeholder="Enter API key" />
          </div>
          <Button size="sm">Update Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
