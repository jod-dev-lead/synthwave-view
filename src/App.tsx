import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppFallback } from "@/components/AppFallback";
import { Layout } from "@/components/layout";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chat = lazy(() => import("./pages/Chat"));
const Upload = lazy(() => import("./pages/Upload"));
const Auth = lazy(() => import("./pages/Auth"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="datavision-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={
                  <Suspense fallback={<AppFallback />}>
                    <Auth />
                  </Suspense>
                } />
                <Route path="/" element={
                  <Layout>
                    <Suspense fallback={<AppFallback />}>
                      <Landing />
                    </Suspense>
                  </Layout>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<AppFallback />}>
                        <Dashboard />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<AppFallback />}>
                        <Chat />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<AppFallback />}>
                        <Upload />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<AppFallback />}>
                        <Settings />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={
                  <Suspense fallback={<AppFallback />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
