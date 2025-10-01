import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import LoginPage from "./pages/LoginPage";
import WaitlistPage from "./pages/WaitlistPage";
import DashboardPage from "./pages/DashboardPage";
import SadhanaPage from "./pages/SadhanaPage";
import SaadhanasPage from "./pages/SaadhanasPage";
import LibraryPage from "./pages/LibraryPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import PsychologicalLeversPage from "./pages/PsychologicalLeversPage";
import OnboardingPage from "./pages/OnboardingPage";
import WalkthroughPage from "./pages/WalkthroughPage";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminAssetsPage from "./pages/AdminAssetsPage";
import AdminThemesPage from "./pages/AdminThemesPage";
import ThemePreviewPage from "./pages/ThemePreviewPage";
import AdminTemplatesPage from "./pages/AdminTemplatesPage";
import AdminContentPage from "./pages/AdminContentPage";
import AdminSettingsReportsPage from "./pages/AdminSettingsReportsPage";
import AdminSystemPage from "./pages/AdminSystemPage";
import ExperimentPage from "./pages/ExperimentPage";
import MysteryLandingPage from "./pages/MysteryLandingPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import SpiritualDemoPage from "./pages/SpiritualDemoPage";
import StorePage from "./pages/StorePage";
import CommunityFeedPage from "./pages/CommunityFeedPage";
import SharedSadhanaDetailPage from "./pages/SharedSadhanaDetailPage";
import LanguageTestPage from "./pages/LanguageTestPage";
import PratyangiraPage from "./pages/PratyangiraPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Leaf } from "lucide-react";
import { useDailySadhanaRefresh } from "./hooks/useDailySadhanaRefresh";
import { useEffect, useState, useRef } from "react";
import ThemeProvider from "./components/ThemeProvider";
import { useSettings } from "./hooks/useSettings";
import ThemedBackground from "./components/ThemedBackground";
import FocusVisible from "./components/FocusVisible";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";

const queryClient = new QueryClient();

// Hindu mantras for ambient display
const hinduMantras = [
  "ॐ गं गणपतये नमः",
  "ॐ नमः शिवाय",
  "ॐ नमो भगवते वासुदेवाय",
  "ॐ श्रीं महालक्ष्म्यै नमः",
  "ॐ ह्रीं क्लीं चामुण्डायै विच्चे",
  "ॐ तारे तुत्तारे तुरे स्वाहा",
  "ॐ सर्वे भवन्तु सुखिनः",
  "ॐ भूर्भुवः स्वः",
  "ॐ तत्सत्वितुर्वरेण्यं",
  "ॐ शांतिः शांतिः शांतिः",
  "ॐ नमो नारायणाय",
  "ॐ नमः शिवाय शंभवे च विष्णवे देवाय च ध्रुवाय च",
  "ॐ ह्रीं दुर्गायै नमः",
  "ॐ ऐं सरस्वत्यै नमः",
  "ॐ ह्रीं श्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मि",
  "ॐ गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः",
  "ॐ सह नाववतु सह नौ भुनक्तु",
  "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते",
  "ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय",
  "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
  "ॐ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ",
  "ॐ मणिपद्मे हूं",
  "ॐ अहं ब्रह्मास्मि",
  "ॐ तत्त्वमसि",
  "ॐ सर्वं खल्विदं ब्रह्म",
  "ॐ ईशावास्यमिदं सर्वम्",
  "ॐ यतो वा इमानि भूतानि जायन्ते",
  "ॐ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
  "ॐ राम राम राम राम राम राम रामेति",
  "ॐ जय गणेश जय गणेश जय गणेश देवा",
  "ॐ भद्रं कर्णेभिः शृणुयाम देवाः"
];

// Protected route component that checks for authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Onboarding route component that checks for onboarding completion
const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isOnboardingComplete, checkOnboardingStatus } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    if (isLoading || isOnboardingComplete === null) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isOnboardingComplete]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Handle timeout case
  if (loadingTimeout && isOnboardingComplete === null) {
    // Assume onboarding is complete to prevent blocking the app
    return children;
  }
  
  // Handle the case when onboarding status is still loading/unknown
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

// Page transition component for smooth transitions between pages
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return (
    <div className={`transition-all duration-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
};

const AppRoutes = () => {
  // Initialize daily sadhana refresh globally
  useDailySadhanaRefresh();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<WaitlistPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/walkthrough" element={<ProtectedRoute><WalkthroughPage /></ProtectedRoute>} />
      <Route path="/your-atma-yantra" element={<ProtectedRoute><SpiritualDemoPage /></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
      <Route path="/language-test" element={<ProtectedRoute><LanguageTestPage /></ProtectedRoute>} />
      <Route path="/pratyangira" element={<ProtectedRoute><PratyangiraPage /></ProtectedRoute>} />

      <Route path="/landingpage" element={<HomePage />} />
      <Route path="/" element={<Navigate to="/landingpage" replace />} />
      <Route path="/MahakaliLandingpage" element={<ExperimentPage />} />
      <Route path="/MysteryLandingpage" element={<MysteryLandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Admin Panel */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="system" element={<AdminSystemPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        {/* legacy: assets/themes/templates routes are deprecated in favor of /admin/content */}
        <Route path="settings" element={<AdminSettingsReportsPage />} />
      </Route>
    <Route path="/dashboard" element={<OnboardingRoute><DashboardPage /></OnboardingRoute>} />
    <Route path="/analytics" element={<OnboardingRoute><AnalyticsPage /></OnboardingRoute>} />
      <Route path="/sadhana" element={<OnboardingRoute><SadhanaPage /></OnboardingRoute>} />
      <Route path="/saadhanas" element={<OnboardingRoute><SaadhanasPage /></OnboardingRoute>} />
  <Route path="/community" element={<OnboardingRoute><CommunityFeedPage /></OnboardingRoute>} />
  <Route path="/community/:id" element={<OnboardingRoute><SharedSadhanaDetailPage /></OnboardingRoute>} />
      <Route path="/library" element={<OnboardingRoute><LibraryPage /></OnboardingRoute>} />
      <Route path="/settings" element={<OnboardingRoute><SettingsPage /></OnboardingRoute>} />
      <Route path="/profile" element={<OnboardingRoute><ProfilePage /></OnboardingRoute>} />
      <Route path="/psychological-levers" element={<OnboardingRoute><PsychologicalLeversPage /></OnboardingRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const { settings, isLoading } = useSettings();
  
  // Show a loading spinner while settings are loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Determine the theme for background animation
  const backgroundTheme = settings?.appearance?.colorScheme && 
    ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mahakali'].includes(settings.appearance.colorScheme) 
    ? settings.appearance.colorScheme as 'default' | 'earth' | 'water' | 'fire' | 'shiva' | 'bhairava' | 'serenity' | 'ganesha' | 'mahakali'
    : 'default';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="relative">
            <ThemedBackground theme={backgroundTheme} />
            
            {/* Ambient floating mantras */}
            {hinduMantras.map((mantra, index) => (
              <div 
                key={index}
                className="ambient-mantra"
                style={{
                  left: `${10 + (index * 8) % 80}%`,
                  animationDelay: `${index * 5}s`,
                  animationDuration: `${40 + (index % 3) * 20}s`
                }}
              >
                {mantra}
              </div>
            ))}
            
            {/* Floating yantra patterns */}
            {[...Array(4)].map((_, index) => (
              <div 
                key={index}
                className="floating-yantra"
                style={{
                  left: `${20 + (index * 15) % 70}%`,
                  fontSize: `${2 + (index % 3)}rem`,
                  animationDelay: `${index * 8}s`,
                  animationDuration: `${60 + (index % 2) * 30}s`
                }}
              >
                ▲▼▲
              </div>
            ))}
            
            {/* Floating lotus petals */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-float-petal"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 3}s`,
                    animationDuration: `${25 + Math.random() * 15}s`,
                    opacity: 0.2 + Math.random() * 0.3
                  }}
                >
                  <Leaf className="h-6 w-6 text-pink-300/50" />
                </div>
              ))}
            </div>
            
            <div className="relative z-10">
              <FocusVisible />
              <SmoothScroll />
              <Toaster />
              <Sonner />
              <CustomCursor />
              <BrowserRouter>
                {/* Only render ThemeProvider when settings are loaded */}
                <PageTransition>
                  {settings ? (
                    <ThemeProvider settings={settings}>
                      <AppRoutes />
                    </ThemeProvider>
                  ) : (
                    <AppRoutes />
                  )}
                </PageTransition>
              </BrowserRouter>
            </div>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;