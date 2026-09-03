import { Toaster } from "@/components/ui/toaster";
import "./global.css";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { AppShell } from "@/components/AppShell";
import { InspectionProvider } from "../src/context/InspectionContext";
import NewInspection from "../src/pages/NewInspection";
import AnalysisResult from "../src/pages/AnalysisResult";
import InspectionDetails from "../src/pages/InspectionDetails";
import InspectionHistory from "../src/pages/InspectionHistory";
import ReportPreview from "../src/pages/ReportPreview";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InspectionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hub" element={<Dashboard />} />
            
            {/* Real Inspection Workflow & Analysis Routes */}
            <Route path="/upload" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><NewInspection /></div></AppShell>} />
            <Route path="/new-inspection" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><NewInspection /></div></AppShell>} />
            <Route path="/analysis/:id" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><AnalysisResult /></div></AppShell>} />
            <Route path="/analysis-result/:id" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><AnalysisResult /></div></AppShell>} />
            <Route path="/analysis" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><NewInspection /></div></AppShell>} />
            <Route path="/result" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><InspectionDetails /></div></AppShell>} />
            <Route path="/result/:id" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><InspectionDetails /></div></AppShell>} />
            <Route path="/history" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><InspectionHistory /></div></AppShell>} />
            <Route path="/report" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><ReportPreview /></div></AppShell>} />
            <Route path="/report/:id" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><ReportPreview /></div></AppShell>} />
            <Route path="/reports" element={<AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><ReportPreview /></div></AppShell>} />
            <Route path="/settings" element={<Placeholder />} />
            <Route path="*" element={<Placeholder />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </InspectionProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

