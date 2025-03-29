
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import Index from "./pages/Index";
import SadhanaPage from "./pages/SadhanaPage";
import TasksPage from "./pages/TasksPage";
import DeityPage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./lib/auth-context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipPrimitive.Provider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sadhana" element={<SadhanaPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/deity" element={<DeityPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipPrimitive.Provider>
  </QueryClientProvider>
);

export default App;
