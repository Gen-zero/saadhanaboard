
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface GeneralSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, updateSettings }) => {
  return (
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
                onCheckedChange={(checked) =>
                  updateSettings(['theme'], checked ? 'dark' : 'light')
                }
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
  );
};

export default GeneralSettings;
