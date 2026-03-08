import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationProvider } from "@/context/SimulationContext";
import SchedulingPage from "@/pages/modules/SchedulingPage";
import MemoryPage from "@/pages/modules/MemoryPage";
import PagingPage from "@/pages/modules/PagingPage";
import DeadlockPage from "@/pages/modules/DeadlockPage";
import DashboardPage from "@/pages/modules/DashboardPage";
import HomePage from "@/pages/modules/HomePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SimulationProvider>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="scheduling" element={<SchedulingPage />} />
              <Route path="memory" element={<MemoryPage />} />
              <Route path="paging" element={<PagingPage />} />
              <Route path="deadlock" element={<DeadlockPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SimulationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
