
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Home, 
  CheckSquare, 
  User, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  AlarmClock,
  BookHeart,
  WandSparkles,
  Library,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Saadhana Board', icon: BookHeart, path: '/sadhana' },
    { name: 'Spiritual Library', icon: BookOpen, path: '/library' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Profile', icon: User, path: '/deity' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out."
    });
    navigate('/login');
  };

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-pattern">
      {/* Sidebar - now fixed with 100vh height */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/baf52c18-e1e7-47de-bd88-8e29c7025df8.png" 
                alt="Saadhana Board Logo" 
                className="h-10 w-10" 
              />
              <h1 className="text-xl font-semibold text-sidebar-foreground">Saadhana Board</h1>
            </div>
            <button 
              className="p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group ${
                  isActive(item.path)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex flex-col space-y-2">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-sm text-sidebar-foreground/90">
                    <User size={16} className="text-primary" />
                    <span className="truncate">{user.displayName || user.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-sidebar-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-sidebar-foreground"
                  onClick={handleLoginNavigation}
                >
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </Button>
              )}
            </div>
            <div className="mt-4 text-xs text-sidebar-foreground/70 text-center">
              <p>Manifest your spiritual journey into reality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - adjusted to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Mobile Header */}
        <header className="bg-background border-b border-border p-4 flex items-center md:hidden sticky top-0 z-40">
          <button
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <img 
              src="/lovable-uploads/baf52c18-e1e7-47de-bd88-8e29c7025df8.png" 
              alt="Saadhana Board Logo" 
              className="h-8 w-8" 
            />
            <h1 className="text-lg font-semibold">Saadhana Board</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
