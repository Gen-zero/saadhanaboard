import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface AccessibilitySettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.accessibility) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
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
                checked={settings.accessibility?.screenReader ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'screenReader'], checked)
                }
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
                checked={settings.accessibility?.largeText ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'largeText'], checked)
                }
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
                checked={settings.accessibility?.reducedMotion ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'reducedMotion'], checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;