
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { AIFeaturesPage } from "./pages/AIFeaturesPage";
import MerchandisePage from "./pages/MerchandisePage"; 
import AdminPage from "./pages/AdminPage";
import { DialogflowProvider } from "./context/DialogflowContext";
import { ThemeProvider } from "./hooks/use-theme";
import { ProductProvider } from "./context/ProductContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ProductProvider>
          <TooltipProvider>
            <DialogflowProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/ai-features" element={<AIFeaturesPage />} />
                  <Route path="/merchandise" element={<MerchandisePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </DialogflowProvider>
          </TooltipProvider>
        </ProductProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
