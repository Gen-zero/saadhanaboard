import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { SettingsType } from './settings/SettingsTypes';
import GeneralSettings from './settings/GeneralSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import MeditationSettings from './settings/MeditationSettings';
import PrivacySettings from './settings/PrivacySettings';
import NotificationsSettings from './settings/NotificationsSettings';
import AccessibilitySettings from './settings/AccessibilitySettings';
import ProfileSettings from './settings/ProfileSettings';
import AdvancedSettings from './settings/AdvancedSettings';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Palette, Clock, ShieldCheck, Bell, Eye, User, SlidersHorizontal } from 'lucide-react';

// Spiritual particle component for animations
const SpiritualParticle = ({ delay, size = "small" }: { delay: number; size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };
  
  const colors = ["bg-purple-400", "bg-fuchsia-400", "bg-blue-400", "bg-indigo-400"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div 
      className={`absolute rounded-full ${randomColor} opacity-0 spiritual-particle ${sizeClasses[size]}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite, 
                    spiritual-pulse ${Math.random() * 4 + 3}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: Math.random() * 0.6 + 0.2,
      }}
    ></div>
  );
};

// Animated card component with hover effect
const SpiritualCard = ({ 
  children, 
  className = "",
  ...props
}: { 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) => (
  <Card 
    className={`transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 spiritual-card backdrop-blur-sm bg-background/70 border-purple-500/20 ${className}`}
    {...props}
  >
    {children}
  </Card>
);

const Settings = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('general');
  const [particles, setParticles] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  
  // Generate particles for background animation
  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => i);
    setParticles(particleArray);
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Since settings are automatically saved through updateSettings, 
    // we'll trigger a manual save to ensure all settings are persisted
    try {
      localStorage.setItem('sadhanaSettings', JSON.stringify(settings));
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: t('save_settings'),
          description: t('settings_saved_success'),
        });
      }, 500);
    } catch (error) {
      setIsSaving(false);
      toast({
        title: t('save_failed'),
        description: t('settings_save_error'),
        variant: 'destructive',
      });
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: t('reset_settings'),
      description: t('settings_reset_success'),
    });
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saadhana-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('export_settings'),
      description: t('settings_export_success'),
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        // Update each setting individually to ensure proper state management
        Object.keys(importedSettings).forEach(key => {
          const typedKey = key as keyof SettingsType;
          updateSettings([typedKey], importedSettings[typedKey]);
        });
        
        toast({
          title: t('import_settings'),
          description: t('settings_import_success'),
        });
      } catch (error) {
        toast({
          title: t('import_failed'),
          description: t('settings_import_error'),
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow importing the same file again
    event.target.value = '';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings settings={settings} updateSettings={updateSettings} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} updateSettings={updateSettings} />;
      case 'meditation':
        return <MeditationSettings settings={settings} updateSettings={updateSettings} />;
      case 'privacy':
        return <PrivacySettings settings={settings} updateSettings={updateSettings} />;
      case 'notifications':
        return <NotificationsSettings settings={settings} updateSettings={updateSettings} />;
      case 'accessibility':
        return <AccessibilitySettings settings={settings} updateSettings={updateSettings} />;
      case 'profile':
        return <ProfileSettings settings={settings} updateSettings={updateSettings} />;
      case 'advanced':
        return <AdvancedSettings settings={settings} updateSettings={updateSettings} />;
      default:
        return <GeneralSettings settings={settings} updateSettings={updateSettings} />;
    }
  };

  // Show loading spinner while settings are loading
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative bg-transparent">
      {/* Spiritual particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((_, index) => (
          <SpiritualParticle key={index} delay={index * 0.2} size={index % 5 === 0 ? "large" : index % 3 === 0 ? "medium" : "small"} />
        ))}
      </div>
      
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600">
            Settings
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Customize your spiritual journey experience
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full mt-3"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SpiritualCard className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Settings Menu</CardTitle>
              <CardDescription>
                Navigate through different settings sections
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <nav className="space-y-1">
                <Button
                  variant={activeSection === 'general' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'general' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('general')}
                >
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="h-5 w-5" />
                    <span className="font-medium">{t('general')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'appearance' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'appearance' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('appearance')}
                >
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5" />
                    <span className="font-medium">{t('appearance')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'meditation' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'meditation' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('meditation')}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">{t('meditation')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'privacy' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'privacy' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('privacy')}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-medium">{t('privacy')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'notifications' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'notifications' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('notifications')}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">{t('notifications')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'accessibility' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'accessibility' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('accessibility')}
                >
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">{t('accessibility')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'profile' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'profile' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('profile')}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{t('profile')}</span>
                  </div>
                </Button>
                <Button
                  variant={activeSection === 'advanced' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 rounded-lg transition-all duration-300 ${
                    activeSection === 'advanced' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 shadow-sm' 
                      : 'hover:bg-purple-500/10'
                  }`}
                  onClick={() => setActiveSection('advanced')}
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="font-medium">{t('advanced')}</span>
                  </div>
                </Button>
              </nav>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('saving')}
                    </div>
                  ) : (
                    t('save_settings')
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300"
                  onClick={handleExportSettings}
                >
                  {t('export_settings')}
                </Button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                    id="import-settings"
                  />
                  <label htmlFor="import-settings">
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300"
                      asChild
                    >
                      <span>{t('import_settings')}</span>
                    </Button>
                  </label>
                </div>
                <Button
                  variant="destructive"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                  onClick={handleResetSettings}
                >
                  {t('reset_to_defaults')}
                </Button>
              </div>
            </CardContent>
          </SpiritualCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>
      
      {/* Add custom styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-20px) translateX(-5px); }
          75% { transform: translateY(-10px) translateX(-10px); }
        }
        
        @keyframes spiritual-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        .spiritual-particle {
          z-index: 0;
        }
        
        .spiritual-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default Settings;