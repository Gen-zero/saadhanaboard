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
import OnboardingPage from "./pages/OnboardingPage";
import WalkthroughPage from "./pages/WalkthroughPage";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { useDailySadhanaRefresh } from "./hooks/useDailySadhanaRefresh";


const queryClient = new QueryClient();

// Protected route component that checks for authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Onboarding route component that checks for onboarding completion
const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isOnboardingComplete } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  // Initialize daily sadhana refresh globally
  useDailySadhanaRefresh();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/walkthrough" element={<ProtectedRoute><WalkthroughPage /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/sadhana" replace />} />
      <Route path="/sadhana" element={<OnboardingRoute><SadhanaPage /></OnboardingRoute>} />
      <Route path="/saadhanas" element={<OnboardingRoute><SaadhanasPage /></OnboardingRoute>} />
      <Route path="/library" element={<OnboardingRoute><LibraryPage /></OnboardingRoute>} />
      <Route path="/settings" element={<OnboardingRoute><SettingsPage /></OnboardingRoute>} />
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
