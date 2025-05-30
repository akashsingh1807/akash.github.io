
/**
 * Main Application Component
 * Provides routing, global providers, and error handling for the entire application
 */

import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./hooks/use-theme";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SuspenseFallback } from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import { logger } from "./utils/logger";

// Lazy load pages for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Resume = React.lazy(() => import("./pages/Resume"));
const ResumeBuilder = React.lazy(() => import("./pages/ResumeBuilder"));
const NotFound = React.lazy(() => import("./pages/NotFound"));


/**
 * React Query client configuration with error handling
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error &&
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      onError: (error) => {
        logger.error('React Query mutation error', error, 'App');
      },
    },
  },
});

/**
 * Global error handler for the application
 */
const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
  logger.error('Global application error', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  }, 'App');
};

/**
 * Main App component with providers and routing
 */
function App(): JSX.Element {
  return (
    <ErrorBoundary onError={handleGlobalError} showDetails={import.meta.env.DEV}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <ChatProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<SuspenseFallback message="Loading page..." />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ChatProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
