import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import SadhanaPage from "./pages/SadhanaPage";
import SaadhanasPage from "./pages/SaadhanasPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { useUserRole } from "./hooks/useUserRole";
import RoleSelectionPage from "./pages/RoleSelectionPage";

const queryClient = new QueryClient();

// Protected route component that checks for authentication and role
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  
  if (isLoading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to="/role-selection" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/" element={<Navigate to="/sadhana" replace />} />
      <Route path="/sadhana" element={<ProtectedRoute><SadhanaPage /></ProtectedRoute>} />
      <Route path="/saadhanas" element={<ProtectedRoute><SaadhanasPage /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipPrimitive.Provider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipPrimitive.Provider>
  </QueryClientProvider>
);

export default App;
