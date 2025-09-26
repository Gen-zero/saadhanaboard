import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Settings as SettingsIcon, BarChart3, FileText } from 'lucide-react';

interface Settings {
  features: {
    biometric: boolean;
    music: boolean;
    notifications: boolean;
    darkMode: boolean;
    autoSave: boolean;
  };
  timers: {
    meditation: number;
    mantra: number;
    reflection: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
  };
  application: {
    maintenanceMode: boolean;
    newUserRegistration: boolean;
    emailVerification: boolean;
  };
}

const AdminSettingsReportsPage = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statsReport, setStatsReport] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, statsData] = await Promise.all([
          adminApi.getSettings(),
          adminApi.getStatsReport()
        ]);
        setSettings(settingsData.settings);
        setStatsReport(statsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await adminApi.saveSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Features */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Application Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Biometric Login</label>
                <p className="text-xs text-muted-foreground">Enable fingerprint/face authentication</p>
              </div>
              <Switch 
                checked={settings?.features?.biometric || false}
                onCheckedChange={(checked) => updateSetting('features', 'biometric', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Background Music</label>
                <p className="text-xs text-muted-foreground">Allow ambient sounds during practices</p>
              </div>
              <Switch 
                checked={settings?.features?.music || false}
                onCheckedChange={(checked) => updateSetting('features', 'music', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Push Notifications</label>
                <p className="text-xs text-muted-foreground">Send reminders and updates</p>
              </div>
              <Switch 
                checked={settings?.features?.notifications || false}
                onCheckedChange={(checked) => updateSetting('features', 'notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Save</label>
                <p className="text-xs text-muted-foreground">Automatically save user progress</p>
              </div>
              <Switch 
                checked={settings?.features?.autoSave || false}
                onCheckedChange={(checked) => updateSetting('features', 'autoSave', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer Settings */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>Default Timer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Meditation Timer (minutes)</label>
              <Input 
                type="number"
                value={settings?.timers?.meditation || 20}
                onChange={(e) => updateSetting('timers', 'meditation', Number(e.target.value) || 20)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mantra Rounds</label>
              <Input 
                type="number"
                value={settings?.timers?.mantra || 108}
                onChange={(e) => updateSetting('timers', 'mantra', Number(e.target.value) || 108)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Reflection Time (minutes)</label>
              <Input 
                type="number"
                value={settings?.timers?.reflection || 10}
                onChange={(e) => updateSetting('timers', 'reflection', Number(e.target.value) || 10)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Session Timeout (seconds)</label>
              <Input 
                type="number"
                value={settings?.security?.sessionTimeout || 3600}
                onChange={(e) => updateSetting('security', 'sessionTimeout', Number(e.target.value) || 3600)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Login Attempts</label>
              <Input 
                type="number"
                value={settings?.security?.maxLoginAttempts || 5}
                onChange={(e) => updateSetting('security', 'maxLoginAttempts', Number(e.target.value) || 5)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Password Length</label>
              <Input 
                type="number"
                value={settings?.security?.passwordMinLength || 8}
                onChange={(e) => updateSetting('security', 'passwordMinLength', Number(e.target.value) || 8)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Control */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>Application Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Maintenance Mode</label>
                <p className="text-xs text-muted-foreground">Disable app for maintenance</p>
              </div>
              <Switch 
                checked={settings?.application?.maintenanceMode || false}
                onCheckedChange={(checked) => updateSetting('application', 'maintenanceMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">New User Registration</label>
                <p className="text-xs text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch 
                checked={settings?.application?.newUserRegistration || false}
                onCheckedChange={(checked) => updateSetting('application', 'newUserRegistration', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Verification</label>
                <p className="text-xs text-muted-foreground">Require email verification for new users</p>
              </div>
              <Switch 
                checked={settings?.application?.emailVerification || false}
                onCheckedChange={(checked) => updateSetting('application', 'emailVerification', checked)}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button onClick={save} disabled={saving} className="w-full md:w-auto">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Reports */}
            <div>
              <h3 className="font-medium mb-3">Data Export</h3>
              <div className="space-y-2">
                <a 
                  href={adminApi.reportUsersCsvUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background/70 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download Users CSV</span>
                </a>
                <a 
                  href={adminApi.reportSadhanasCsvUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background/70 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download Sadhanas CSV</span>
                </a>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div>
              <h3 className="font-medium mb-3">System Statistics</h3>
              {statsReport ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Users:</span>
                    <Badge variant="secondary">{statsReport.users?.total || 0}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Users:</span>
                    <Badge variant="secondary">{statsReport.users?.active || 0}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Sadhanas:</span>
                    <Badge variant="secondary">{statsReport.sadhanas?.total || 0}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed Sadhanas:</span>
                    <Badge variant="secondary">{statsReport.sadhanas?.completed || 0}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Books Uploaded:</span>
                    <Badge variant="secondary">{statsReport.books?.total || 0}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {statsReport.timestamp ? new Date(statsReport.timestamp).toLocaleString() : 'Unknown'}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Loading statistics...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsReportsPage;


