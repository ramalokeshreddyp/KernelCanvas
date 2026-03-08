import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationProvider } from "@/context/SimulationContext";

const HomePage = lazy(() => import("@/pages/modules/HomePage"));
const SchedulingPage = lazy(() => import("@/pages/modules/SchedulingPage"));
const MemoryPage = lazy(() => import("@/pages/modules/MemoryPage"));
const PagingPage = lazy(() => import("@/pages/modules/PagingPage"));
const DeadlockPage = lazy(() => import("@/pages/modules/DeadlockPage"));
const DashboardPage = lazy(() => import("@/pages/modules/DashboardPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">Loading module...</div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SimulationProvider>
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
          </SimulationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
