import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/DashboardHome";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import ProductPerformance from "./pages/ProductPerformance";
import Recommendations from "./pages/Recommendations";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardPage><DashboardHome /></DashboardPage>} />
          <Route path="/dashboard/sentiment" element={<DashboardPage><SentimentAnalysis /></DashboardPage>} />
          <Route path="/dashboard/products" element={<DashboardPage><ProductPerformance /></DashboardPage>} />
          <Route path="/dashboard/recommendations" element={<DashboardPage><Recommendations /></DashboardPage>} />
          <Route path="/dashboard/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
