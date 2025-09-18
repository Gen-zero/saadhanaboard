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
    className={`transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 spiritual-card backdrop-blur-sm ${className}`}
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
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-2">
          {t('settings')}
        </h1>
        <p className="text-muted-foreground">
          {t('customize_experience')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SpiritualCard>
            <CardHeader>
              <CardTitle>{t('settings_menu')}</CardTitle>
              <CardDescription>
                {t('navigate_settings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <Button
                  variant={activeSection === 'general' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('general')}
                >
                  {t('general')}
                </Button>
                <Button
                  variant={activeSection === 'appearance' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('appearance')}
                >
                  {t('appearance')}
                </Button>
                <Button
                  variant={activeSection === 'meditation' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('meditation')}
                >
                  {t('meditation')}
                </Button>
                <Button
                  variant={activeSection === 'privacy' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('privacy')}
                >
                  {t('privacy')}
                </Button>
                <Button
                  variant={activeSection === 'notifications' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('notifications')}
                >
                  {t('notifications')}
                </Button>
                <Button
                  variant={activeSection === 'accessibility' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('accessibility')}
                >
                  {t('accessibility')}
                </Button>
                <Button
                  variant={activeSection === 'profile' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('profile')}
                >
                  {t('profile')}
                </Button>
                <Button
                  variant={activeSection === 'advanced' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('advanced')}
                >
                  {t('advanced')}
                </Button>
              </nav>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? t('saving') : t('save_settings')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
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
                      className="w-full cursor-pointer"
                      asChild
                    >
                      <span>{t('import_settings')}</span>
                    </Button>
                  </label>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
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