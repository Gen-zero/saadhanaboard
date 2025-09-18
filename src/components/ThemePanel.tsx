import { useState, useEffect } from 'react';
import { Sparkles, Flame, Skull, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
  isLandingPage?: boolean;
  path?: string;
}

const ThemePanel = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Define theme options
  const themeOptions: ThemeOption[] = [
    {
      id: 'default',
      name: 'Default Theme',
      description: 'Cosmic purple landing page',
      icon: <Sparkles className="h-4 w-4" />,
      color: 'from-purple-500 to-fuchsia-500',
      isLandingPage: true,
      path: '/landingpage'
    },
    {
      id: 'mahakali',
      name: 'Mahakali Theme',
      description: '🔥 Cremation ground landing page',
      icon: <Flame className="h-4 w-4" />,
      color: 'from-red-700 to-black',
      isLandingPage: true,
      path: '/MahakaliLandingpage'
    },
    {
      id: 'mystery',
      name: 'Mystery Theme',
      description: '🔮 Cosmic mystery landing page',
      icon: <Skull className="h-4 w-4" />,
      color: 'from-blue-900 to-indigo-900',
      isLandingPage: true,
      path: '/MysteryLandingpage'
    }
  ];

  // Apply theme to body when currentTheme changes
  useEffect(() => {
    // Remove any existing theme classes
    document.body.classList.remove(
      'theme-default',
      'theme-mahakali',
      'theme-mystery'
    );
    
    // Add the current theme class
    document.body.classList.add(`theme-${currentTheme}`);
    
    // Apply theme-specific styles
    switch (currentTheme) {
      case 'mahakali':
        document.documentElement.style.setProperty('--theme-primary', '348 83% 47%');
        document.documentElement.style.setProperty('--theme-secondary', '0 0% 0%');
        document.documentElement.style.setProperty('--theme-accent', '0 100% 50%');
        break;
      case 'mystery':
        document.documentElement.style.setProperty('--theme-primary', '240 100% 70%');
        document.documentElement.style.setProperty('--theme-secondary', '240 50% 20%');
        document.documentElement.style.setProperty('--theme-accent', '270 100% 60%');
        break;
      default:
        // Reset to default theme values
        document.documentElement.style.setProperty('--theme-primary', '348 83% 47%');
        document.documentElement.style.setProperty('--theme-secondary', '348 22% 25%');
        document.documentElement.style.setProperty('--theme-accent', '348 73% 38%');
        break;
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: string) => {
    const selectedTheme = themeOptions.find(theme => theme.id === themeId);
    
    if (selectedTheme && selectedTheme.isLandingPage && selectedTheme.path) {
      // Navigate to the landing page for this theme
      navigate(selectedTheme.path);
    } else {
      // Apply the theme normally
      setCurrentTheme(themeId);
    }
    
    setIsOpen(false);
  };

  const getCurrentTheme = () => {
    return themeOptions.find(theme => theme.id === currentTheme) || themeOptions[0];
  };

  // Determine button style based on current theme
  const getButtonClass = () => {
    switch (currentTheme) {
      case 'mahakali':
        return 'flex items-center gap-2 bg-background/80 backdrop-blur-lg border border-red-500/20 hover:bg-background/90';
      case 'mystery':
        return 'flex items-center gap-2 bg-background/80 backdrop-blur-lg border border-indigo-500/20 hover:bg-background/90';
      default:
        return 'flex items-center gap-2 bg-background/80 backdrop-blur-lg border border-purple-500/20 hover:bg-background/90';
    }
  };

  // Determine icon color based on current theme
  const getIconColor = () => {
    switch (currentTheme) {
      case 'mahakali':
        return 'text-red-400';
      case 'mystery':
        return 'text-indigo-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <div className="relative z-[60]">
      <Button
        variant="outline"
        className={getButtonClass()}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentTheme === 'mahakali' ? (
          <Flame className={`h-4 w-4 ${getIconColor()}`} />
        ) : currentTheme === 'mystery' ? (
          <Skull className={`h-4 w-4 ${getIconColor()}`} />
        ) : (
          <Sparkles className={`h-4 w-4 ${getIconColor()}`} />
        )}
        <span className="text-sm">Themes</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background/90 backdrop-blur-xl rounded-xl border border-purple-500/20 shadow-2xl z-[60]">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Select Theme
            </div>
            <div className="space-y-1">
              {themeOptions.map((theme) => (
                <Button
                  key={theme.id}
                  variant={currentTheme === theme.id ? "default" : "ghost"}
                  className={`w-full justify-start h-auto py-3 px-3 rounded-lg transition-all duration-300 ${
                    currentTheme === theme.id 
                      ? `bg-gradient-to-r ${theme.color} text-white border-0` 
                      : 'justify-start hover:bg-background/50'
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <div className="flex items-center w-full">
                    <div className={`p-2 rounded-lg ${
                      currentTheme === theme.id 
                        ? 'bg-white/20' 
                        : theme.id === 'mahakali' 
                          ? 'bg-red-500/10 text-red-400'
                          : theme.id === 'mystery'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {theme.icon}
                    </div>
                    <div className="ml-3 text-left">
                      <div className={`font-medium ${
                        currentTheme === theme.id ? 'text-white' : 'text-foreground'
                      }`}>
                        {theme.name}
                      </div>
                      <div className={`text-xs ${
                        currentTheme === theme.id ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {theme.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePanel;