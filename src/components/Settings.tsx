
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  ShieldCheck,
  Clock,
  Eye,
  SlidersHorizontal,
  Settings2,
} from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import GeneralSettings from './settings/GeneralSettings';
import NotificationsSettings from './settings/NotificationsSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import PrivacySettings from './settings/PrivacySettings';
import MeditationSettings from './settings/MeditationSettings';
import AccessibilitySettings from './settings/AccessibilitySettings';
import AdvancedSettings from './settings/AdvancedSettings';
import { type SettingsType } from './settings/SettingsTypes';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const [settings, setSettings] = useState<SettingsType>({
    theme: 'light',
    language: 'english',
    startPage: 'dashboard',
    notifications: {
      enabled: true,
      ritualReminders: true,
      goalProgress: true,
      motivationalMessages: true,
    },
    reminders: {
      morning: '06:00',
      midday: '12:00',
      evening: '18:00',
    },
    appearance: {
      fontSize: 16,
      animationsEnabled: true,
      highContrastMode: false,
      colorScheme: 'default',
    },
    privacy: {
      storeDataLocally: true,
      analyticsConsent: false,
      biometricLogin: false,
    },
    meditation: {
      backgroundSounds: true,
      timerDuration: 15,
      intervalBell: true,
    },
    accessibility: {
      screenReader: false,
      largeText: false,
      reducedMotion: false,
    },
  });

  const updateSettings = (path: (string | number)[], value: any) => {
    setSettings((prevSettings) => {
      const newSettings = JSON.parse(JSON.stringify(prevSettings));
      let current: any = newSettings;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = () => {
    localStorage.setItem('sadhanaSettings', JSON.stringify(settings));

    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleReset = () => {
    setSettings({
      theme: 'light',
      language: 'english',
      startPage: 'dashboard',
      notifications: {
        enabled: true,
        ritualReminders: true,
        goalProgress: true,
        motivationalMessages: true,
      },
      reminders: {
        morning: '06:00',
        midday: '12:00',
        evening: '18:00',
      },
      appearance: {
        fontSize: 16,
        animationsEnabled: true,
        highContrastMode: false,
        colorScheme: 'default',
      },
      privacy: {
        storeDataLocally: true,
        analyticsConsent: false,
        biometricLogin: false,
      },
      meditation: {
        backgroundSounds: true,
        timerDuration: 15,
        intervalBell: true,
      },
      accessibility: {
        screenReader: false,
        largeText: false,
        reducedMotion: false,
      },
    });

    toast({
      title: 'Settings reset',
      description: 'Your preferences have been reset to defaults.',
    });
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'meditation', label: 'Meditation', icon: Clock },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal },
  ];

  return (
    <div className="space-y-6 animate-fade-in cosmic-nebula-bg relative">
      <div className="backdrop-blur-sm bg-background/70 p-6 rounded-lg border border-purple-500/20">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          <SettingsIcon className="h-7 w-7 text-purple-500" />
          <span>Settings</span>
        </h1>
        <p className="text-muted-foreground">Customize your Saadhana Board experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="lg:col-span-1">
          <div className="backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
            <ul className="space-y-1">
              {settingsTabs.map((tab) => (
                <li key={tab.id}>
                  <Button
                    variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full justify-start cosmic-highlight transition-all duration-300",
                      activeTab === tab.id && "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <div className="backdrop-blur-sm bg-background/70 p-6 rounded-lg border border-purple-500/20">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'general' && (
              <GeneralSettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'notifications' && (
              <NotificationsSettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceSettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'privacy' && (
              <PrivacySettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'meditation' && (
              <MeditationSettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'accessibility' && (
              <AccessibilitySettings settings={settings} updateSettings={updateSettings} />
            )}
            {activeTab === 'advanced' && <AdvancedSettings />}
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
        <div className="flex justify-end gap-4 pt-6 border-t border-purple-500/20">
          <Button variant="outline" onClick={handleReset} className="cosmic-button">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
