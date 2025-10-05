import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { getThemeById, themeUtils } from '@/themes';
import EnhancedDeityIcon from './EnhancedDeityIcon';
import { Leaf, Zap, User, ChevronRight, LogOut, LogIn } from 'lucide-react';
import {
  BookHeart,
  CheckSquare,
  ShoppingCart,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mantraIndex, setMantraIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings, isLoading } = useSettings();
  const { t } = useTranslation();

  // Mantras to show in the small top marquee
  const hinduMantras = [
    'ॐ तारे तुत्तारे तुरे स्वाहा',
    'ॐ सर्वे भवन्तु सुखिनः',
    'ॐ भूर्भुवः स्वः',
    'ॐ तत्सत्वितुर्वरेण्यं',
    'ॐ शांतिः शांतिः शांतिः',
    'ॐ नमो नारायणाय',
    'ॐ नमः शिवाय शंभवे च विष्णवे देवाय च ध्रुवाय च',
    'ॐ ह्रीं दुर्गायै नमः',
    'ॐ ऐं सरस्वत्यै नमः',
    'ॐ ह्रीं श्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मि',
    'ॐ गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः',
    'ॐ सह नाववतु सह नौ भुनक्तु',
    'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते',
    'ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय',
    'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
    'ॐ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    'ॐ मणिपद्मे हूं',
    'ॐ अहं ब्रह्मास्मि',
    'ॐ तत्त्वमसि',
    'ॐ सर्वं खल्विदं ब्रह्म',
    'ॐ ईशावास्यमिदं सर्वम्',
    'ॐ यतो वा इमानि भूतानि जायन्ते',
    'ॐ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
    'ॐ राम राम राम राम राम राम रामेति',
    'ॐ जय गणेश जय गणेश जय गणेश देवा',
    'ॐ भद्रं कर्णेभिः शृणुयाम देवाः'
  ];

  // Cycle through mantras
  useEffect(() => {
    const interval = setInterval(() => {
      setMantraIndex((prev) => (prev + 1) % hinduMantras.length);
    }, 10000); // Change mantra every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Don't render anything if settings are still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Map themes to deity icons and names
  const themeData: Record<string, { icon: React.ReactNode; name: string; element: string }> = {
    default: {
      icon: <Zap className="h-16 w-16 text-purple-400" />,
      name: 'Cosmic Energy',
      element: 'Ether'
    },
    earth: {
      icon: themeUtils.renderThemeIcon(getThemeById('water')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Krishna',
      element: 'Earth'
    },
    water: {
      icon: themeUtils.renderThemeIcon(getThemeById('earth')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Vishnu',
      element: 'Water'
    },
    fire: {
      icon: themeUtils.renderThemeIcon(getThemeById('fire')!, 'h-20 w-20 rounded-full'),
      name: 'Maa Durga',
      element: 'Fire'
    },
    shiva: {
      icon: themeUtils.renderThemeIcon(getThemeById('shiva')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Shiva',
      element: 'Air'
    },
    bhairava: {
      icon: themeUtils.renderThemeIcon(getThemeById('bhairava')!, 'h-16 w-16 rounded-full'),
      name: 'Lord Bhairava',
      element: 'Fire'
    },
    mahakali: {
      icon: themeUtils.renderThemeIcon(getThemeById('mahakali')!, 'h-20 w-20 rounded-full'),
      name: 'Maa Mahakali',
      element: 'Fire'
    },
    ganesha: {
      icon: themeUtils.renderThemeIcon(getThemeById('ganesha')!, 'h-24 w-24 rounded-full'),
      name: 'Lord Ganesha',
      element: 'Earth'
    }
  };

  // Updated navigation items - removed Dashboard and using translations
  const navItems = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana' },
    { name: t('library'), icon: BookHeart, path: '/library' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    { name: t('store'), icon: ShoppingCart, path: '/store' },
    { name: t('settings'), icon: Settings, path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Simplified handlers without audio functions
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  const handleBuySP = () => {
    navigate('/store');
  };

  // Get the current theme
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  const currentThemeData = themeData[currentTheme as keyof typeof themeData] || themeData.default;

  return (
    <div className="min-h-screen flex bg-transparent relative overflow-hidden">
      {/* Ambient floating lotus petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float-petal"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + Math.random() * 20}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            <Leaf className="h-8 w-8 text-pink-300/50" />
          </div>
        ))}
      </div>

      {/* Mandala background pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: '60s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '30s' }}></div>
        
        {/* Additional mandala elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-purple-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-pink-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/20 rounded-full"></div>
      </div>

      {/* Floating yantra patterns in the background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-3">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float-diagonal"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 5}s`,
              animationDuration: `${30 + Math.random() * 30}s`,
              opacity: 0.1 + Math.random() * 0.2,
              fontSize: `${2 + Math.random() * 2}rem`
            }}
          >
            ▲▼▲
          </div>
        ))}
      </div>

      {/* Fixed sidebar - always visible and fixed in place */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen sidebar-seamless border-r border-purple-500/10 flex flex-col`}
        style={{ width: '360px' }}
      >
        <div className="flex flex-col h-full">
          {/* Ambient mantra display */}
          <div className="absolute inset-x-0 top-0 h-8 overflow-hidden z-10">
            <div className="text-center text-xs text-purple-300/60 font-sans animate-pulse-slow whitespace-nowrap">
              {hinduMantras[mantraIndex]}
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-b border-purple-500/10 pt-12 sidebar-header-wide">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center bg-transparent logo-wrapper">
                  <img
                    src="/lovable-uploads/sadhanaboard_logo.png"
                    alt="Saadhana Board Logo"
                    className="h-full w-full object-contain cursor-pointer transition-all duration-500 hover:scale-110 logo-enhanced"
                    onClick={() => {
                      navigate('/');
                    }}
                  />
                </div>
                {/* Enhanced glow effect on hover without pulsing animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl scale-125 opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10 logo-glow-effect"></div>
              </div>
              <h1 
                className="text-3xl font-bold cursor-pointer transition-all duration-300 hover:text-purple-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300"
                onClick={() => {
                  navigate('/');
                }}
              >
                SadhanaBoard
              </h1>
            </div>
          </div>
          
          {/* Theme deity display */}
          <div className="flex flex-col items-center justify-center p-6 space-y-3 border-b border-purple-500/10">
            <div className="flex items-center justify-center transition-transform duration-500 hover:scale-105 cursor-pointer"
              onClick={() => {
                navigate('/settings');
              }}
            >
              {currentThemeData.icon}
            </div>
            <>
              <div className="text-center">
                <h3 className="text-lg font-medium text-sidebar-foreground">{currentThemeData.name}</h3>
                <p className="text-xs text-sidebar-foreground/70">{currentThemeData.element} Element</p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar">
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      active 
                        ? 'bg-purple-500/20 text-foreground border border-purple-500/20 shadow-lg transform scale-105' 
                        : 'text-muted-foreground hover:bg-purple-500/10 hover:text-foreground hover:scale-105'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ${
                      active ? 'bg-purple-500/20 text-purple-400 scale-110' : 'text-muted-foreground'
                    }`}>
                      <item.icon size={18} />
                    </span>
                    <span className="truncate flex-1">{item.name}</span>
                    {active && <ChevronRight size={14} className="text-purple-300 flex-shrink-0 animate-pulse" />}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="p-4 border-t border-purple-500/10">
            <div className="flex flex-col space-y-2">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-sm text-sidebar-foreground/90 px-3 py-2">
                    <User size={16} className="text-primary flex-shrink-0" />
                    <span className="truncate">{user.display_name || user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className={`flex items-center rounded-lg transition-all duration-300 px-3 py-2.5 ${
                      isActive('/profile')
                        ? 'bg-purple-500/20 text-foreground border border-purple-500/20 shadow-lg transform scale-105'
                        : 'text-muted-foreground hover:bg-purple-500/10 hover:text-foreground hover:scale-105'
                    }`}
                  >
                    <User 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        isActive('/profile') ? 'text-purple-400 scale-110' : ''
                      } flex-shrink-0`} 
                    />
                    <span className="ml-3">Profile</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-purple-500/20 hover:bg-purple-500/10 px-3 py-2.5"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2 text-destructive flex-shrink-0" />
                    <span className="text-destructive/90">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-purple-500/20 hover:bg-purple-500/10 px-3 py-2.5"
                  onClick={handleLoginNavigation}
                >
                  <LogIn size={16} className="mr-2 text-primary flex-shrink-0" />
                  <span className="text-primary/90">Sign In</span>
                </Button>
              )}
              
              {/* Buy SP Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between border-yellow-500/20 hover:bg-yellow-500/10 px-3 py-2.5"
                onClick={handleBuySP}
              >
                <div className="flex items-center">
                  <Sparkles size={16} className="mr-2 text-yellow-500 flex-shrink-0" />
                  <span className="text-yellow-500/90">Buy SP</span>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                  0
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - adjusted to account for fixed sidebar */}
      <main 
        className="flex-1 transition-all duration-300 p-6"
        style={{ marginLeft: '360px' }}
      >
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;