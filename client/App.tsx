import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import SupplyDetails from "./pages/SupplyDetails";
import PurchasePatterns from "./pages/PurchasePatterns";
import MarketTrends from "./pages/MarketTrends";
import Alerts from "./pages/Alerts";
import AIBot from "./pages/AIBot";
import AIBotSimple from "./pages/AIBotSimple";
import Index from "./pages/Index";
import TestRoute from "./pages/TestRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/index" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/supplies" element={<SupplyDetails />} />
              <Route path="/supply-details" element={<SupplyDetails />} />
              <Route path="/purchase-patterns" element={<PurchasePatterns />} />
              <Route path="/market-trends" element={<MarketTrends />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/ai-bot" element={<AIBot />} />
              <Route path="/ai-bot-simple" element={<AIBotSimple />} />
              <Route path="/test" element={<TestRoute />} />

              {/* Case variations for common URL patterns */}
              <Route path="/Index" element={<Index />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Supplies" element={<SupplyDetails />} />
              <Route path="/AIBot" element={<AIBot />} />
              <Route path="/AI-Bot" element={<AIBot />} />
              <Route path="/Alerts" element={<Alerts />} />
              <Route path="/MarketTrends" element={<MarketTrends />} />
              <Route path="/Market-Trends" element={<MarketTrends />} />
              <Route path="/PurchasePatterns" element={<PurchasePatterns />} />
              <Route path="/Purchase-Patterns" element={<PurchasePatterns />} />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
