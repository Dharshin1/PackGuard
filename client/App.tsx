import { Toaster } from "@/components/ui/toaster";
import "./global.css";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hub" element={<Dashboard />} />
          <Route path="/upload" element={<Placeholder />} />
          <Route path="/new-inspection" element={<Placeholder />} />
          <Route path="/analysis" element={<Placeholder />} />
          <Route path="/result" element={<Placeholder />} />
          <Route path="/history" element={<Placeholder />} />
          <Route path="/report" element={<Placeholder />} />
          <Route path="/reports" element={<Placeholder />} />
          <Route path="/settings" element={<Placeholder />} />
          <Route path="*" element={<Placeholder />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
