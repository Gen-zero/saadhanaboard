
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  WandSparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Saadhana Yantra', icon: BookHeart, path: '/sadhana' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
              <WandSparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-sidebar-foreground">Saadhana Yantra</h1>
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
            <div className="text-xs text-sidebar-foreground/70 text-center">
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
          <h1 className="ml-4 text-lg font-semibold">Saadhana Yantra</h1>
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
