
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Download,
  Palette,
  Fingerprint,
  ShieldCheck,
  Eye,
  Clock,
  Languages,
  BookMarked,
  Share2,
  SlidersHorizontal,
  Paintbrush
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  // State for settings
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'english',
    startPage: 'dashboard',
    notifications: {
      enabled: true,
      ritualReminders: true,
      goalProgress: true,
      motivationalMessages: true
    },
    reminders: {
      morning: '06:00',
      midday: '12:00',
      evening: '18:00'
    },
    appearance: {
      fontSize: 16,
      animationsEnabled: true,
      highContrastMode: false,
      colorScheme: 'default'
    },
    privacy: {
      storeDataLocally: true,
      analyticsConsent: false,
      biometricLogin: false
    },
    meditation: {
      backgroundSounds: true,
      timerDuration: 15,
      intervalBell: true
    },
    accessibility: {
      screenReader: false,
      largeText: false,
      reducedMotion: false
    }
  });

  // Update settings handlers
  const updateSettings = (path: string[], value: any) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      let current = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = () => {
    // In a real app, we would save to backend/localStorage here
    localStorage.setItem('sadhanaSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };
  
  const handleReset = () => {
    // Reset to default values
    setSettings({
      theme: 'light',
      language: 'english',
      startPage: 'dashboard',
      notifications: {
        enabled: true,
        ritualReminders: true,
        goalProgress: true,
        motivationalMessages: true
      },
      reminders: {
        morning: '06:00',
        midday: '12:00',
        evening: '18:00'
      },
      appearance: {
        fontSize: 16,
        animationsEnabled: true,
        highContrastMode: false,
        colorScheme: 'default'
      },
      privacy: {
        storeDataLocally: true,
        analyticsConsent: false,
        biometricLogin: false
      },
      meditation: {
        backgroundSounds: true,
        timerDuration: 15,
        intervalBell: true
      },
      accessibility: {
        screenReader: false,
        largeText: false,
        reducedMotion: false
      }
    });
    
    toast({
      title: "Settings reset",
      description: "Your preferences have been reset to defaults."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-7 w-7 text-primary" />
          <span>Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Customize your Saadhana Board experience.
        </p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Customize your app appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch 
                      id="theme-mode" 
                      checked={settings.theme === 'dark'} 
                      onCheckedChange={(checked) => updateSettings(['theme'], checked ? 'dark' : 'light')}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.language}
                    onValueChange={(value) => updateSettings(['language'], value)}
                  >
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="sanskrit">Sanskrit</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language for the app interface
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="start-page">Default Start Page</Label>
                  <Select 
                    value={settings.startPage}
                    onValueChange={(value) => updateSettings(['startPage'], value)}
                  >
                    <SelectTrigger id="start-page" className="w-full">
                      <SelectValue placeholder="Select start page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="sadhana">Saadhana Board</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                      <SelectItem value="library">Spiritual Library</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose which page to show when you open the app
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for your practices and tasks
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.enabled} 
                    onCheckedChange={(checked) => updateSettings(['notifications', 'enabled'], checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Daily Ritual Reminders</Label>
                    <Switch 
                      disabled={!settings.notifications.enabled}
                      checked={settings.notifications.ritualReminders} 
                      onCheckedChange={(checked) => updateSettings(['notifications', 'ritualReminders'], checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified about your daily spiritual practices
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Goal Progress Updates</Label>
                    <Switch 
                      disabled={!settings.notifications.enabled}
                      checked={settings.notifications.goalProgress} 
                      onCheckedChange={(checked) => updateSettings(['notifications', 'goalProgress'], checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive updates on your spiritual journey progress
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Motivational Messages</Label>
                    <Switch 
                      disabled={!settings.notifications.enabled}
                      checked={settings.notifications.motivationalMessages} 
                      onCheckedChange={(checked) => updateSettings(['notifications', 'motivationalMessages'], checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive inspirational quotes and messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Reminder Times</span>
              </CardTitle>
              <CardDescription>Set times for your practice reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="morning-reminder">Morning Reminder</Label>
                <Input 
                  type="time" 
                  id="morning-reminder" 
                  value={settings.reminders.morning}
                  onChange={(e) => updateSettings(['reminders', 'morning'], e.target.value)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="midday-reminder">Midday Reminder</Label>
                <Input 
                  type="time" 
                  id="midday-reminder" 
                  value={settings.reminders.midday}
                  onChange={(e) => updateSettings(['reminders', 'midday'], e.target.value)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evening-reminder">Evening Reminder</Label>
                <Input 
                  type="time" 
                  id="evening-reminder" 
                  value={settings.reminders.evening}
                  onChange={(e) => updateSettings(['reminders', 'evening'], e.target.value)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>Visual Preferences</span>
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <RadioGroup 
                    value={settings.appearance.colorScheme} 
                    onValueChange={(value) => updateSettings(['appearance', 'colorScheme'], value)}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="default" id="scheme-default" className="sr-only" />
                      <Label
                        htmlFor="scheme-default"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="rounded-full w-8 h-8 bg-gradient-to-r from-primary to-purple-600"></div>
                        <span className="mt-2">Default</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="earth" id="scheme-earth" className="sr-only" />
                      <Label
                        htmlFor="scheme-earth"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="rounded-full w-8 h-8 bg-gradient-to-r from-amber-700 to-green-700"></div>
                        <span className="mt-2">Earth</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="water" id="scheme-water" className="sr-only" />
                      <Label
                        htmlFor="scheme-water"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="rounded-full w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                        <span className="mt-2">Water</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="fire" id="scheme-fire" className="sr-only" />
                      <Label
                        htmlFor="scheme-fire"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="rounded-full w-8 h-8 bg-gradient-to-r from-red-600 to-yellow-500"></div>
                        <span className="mt-2">Fire</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />
                
                <div className="space-y-3">
                  <Label>Font Size</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">A</span>
                    <Slider 
                      value={[settings.appearance.fontSize]}
                      min={12} 
                      max={24} 
                      step={1}
                      onValueChange={(value) => updateSettings(['appearance', 'fontSize'], value[0])}
                      className="w-full"
                    />
                    <span className="text-lg">A</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current font size: {settings.appearance.fontSize}px
                  </p>
                </div>
                
                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable visual animations throughout the app
                      </p>
                    </div>
                    <Switch 
                      checked={settings.appearance.animationsEnabled} 
                      onCheckedChange={(checked) => updateSettings(['appearance', 'animationsEnabled'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase visual contrast for better readability
                      </p>
                    </div>
                    <Switch 
                      checked={settings.appearance.highContrastMode} 
                      onCheckedChange={(checked) => updateSettings(['appearance', 'highContrastMode'], checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Privacy & Data</span>
              </CardTitle>
              <CardDescription>Control how your data is stored and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Store Data Locally</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep all your spiritual journey data stored on your device
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.storeDataLocally} 
                      onCheckedChange={(checked) => updateSettings(['privacy', 'storeDataLocally'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anonymous Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data to improve the app
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.analyticsConsent} 
                      onCheckedChange={(checked) => updateSettings(['privacy', 'analyticsConsent'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition to protect your spiritual data
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.biometricLogin} 
                      onCheckedChange={(checked) => updateSettings(['privacy', 'biometricLogin'], checked)}
                    />
                  </div>
                </div>

                <div className="bg-secondary/40 p-4 rounded-lg space-y-2 mt-4">
                  <p className="text-sm">
                    Your spiritual journey data is stored securely.
                  </p>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Your Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meditation Tab */}
        <TabsContent value="meditation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Meditation Settings</span>
              </CardTitle>
              <CardDescription>Customize your meditation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Background Sounds</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable ambient sounds during meditation sessions
                      </p>
                    </div>
                    <Switch 
                      checked={settings.meditation.backgroundSounds} 
                      onCheckedChange={(checked) => updateSettings(['meditation', 'backgroundSounds'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Default Timer Duration</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[settings.meditation.timerDuration]}
                      min={5} 
                      max={60} 
                      step={5}
                      onValueChange={(value) => updateSettings(['meditation', 'timerDuration'], value[0])}
                      className="w-full"
                    />
                    <span className="w-12 text-right">{settings.meditation.timerDuration} min</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Interval Bell</Label>
                      <p className="text-sm text-muted-foreground">
                        Play a mindfulness bell at regular intervals
                      </p>
                    </div>
                    <Switch 
                      checked={settings.meditation.intervalBell} 
                      onCheckedChange={(checked) => updateSettings(['meditation', 'intervalBell'], checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Accessibility Settings</span>
              </CardTitle>
              <CardDescription>Make the app more accessible for your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Screen Reader Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize the app for screen readers
                      </p>
                    </div>
                    <Switch 
                      checked={settings.accessibility.screenReader} 
                      onCheckedChange={(checked) => updateSettings(['accessibility', 'screenReader'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Larger Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Use larger text throughout the application
                      </p>
                    </div>
                    <Switch 
                      checked={settings.accessibility.largeText} 
                      onCheckedChange={(checked) => updateSettings(['accessibility', 'largeText'], checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and motion effects
                      </p>
                    </div>
                    <Switch 
                      checked={settings.accessibility.reducedMotion} 
                      onCheckedChange={(checked) => updateSettings(['accessibility', 'reducedMotion'], checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <span>Advanced Settings</span>
              </CardTitle>
              <CardDescription>Configure advanced features and developer options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-secondary/40 p-4 rounded-lg">
                  <p className="text-sm text-yellow-500 font-medium">
                    Warning: These settings are for advanced users. Changes here may affect your app experience.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Cache Settings</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">Clear Cache</Button>
                    <Button variant="outline" className="flex-1">Rebuild Index</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last cache purge: Never
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Data Management</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">Backup Data</Button>
                    <Button variant="outline">Restore Backup</Button>
                    <Button variant="outline">Sync Now</Button>
                    <Button variant="outline">Check Updates</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-red-500">Danger Zone</Label>
                  <div className="grid gap-2">
                    <Button variant="destructive" size="sm">Delete All User Data</Button>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    These actions cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
