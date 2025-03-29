
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, Moon, Sun, Globe, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
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
                    <Switch id="theme-mode" />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="english">
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
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
                  <Select defaultValue="dashboard">
                    <SelectTrigger id="start-page" className="w-full">
                      <SelectValue placeholder="Select start page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="sadhana">Saadhana Board</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose which page to show when you open the app
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Daily Ritual Reminders</Label>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified about your daily spiritual practices
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Goal Progress Updates</Label>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive updates on your spiritual journey progress
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Motivational Messages</Label>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive inspirational quotes and messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                <Input type="time" id="morning-reminder" defaultValue="06:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="midday-reminder">Midday Reminder</Label>
                <Input type="time" id="midday-reminder" defaultValue="12:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evening-reminder">Evening Reminder</Label>
                <Input type="time" id="evening-reminder" defaultValue="18:00" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Data & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/40 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  Your spiritual journey data is stored locally on your device.
                </p>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Your Data
                </Button>
              </div>
              <div className="pt-2">
                <Button variant="destructive" size="sm" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings;
