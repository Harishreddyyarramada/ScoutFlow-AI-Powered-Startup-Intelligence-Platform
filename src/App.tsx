import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Lists from "./pages/Lists";
import SavedSearches from "./pages/SavedSearches";
import Settings from "./pages/Settings";
import SavedSearchDetails from "./pages/SavedSearchDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route element={<AppLayout />}>
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/saved" element={<SavedSearches />} />
          <Route path="/saved-search/:id" element={<SavedSearchDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
