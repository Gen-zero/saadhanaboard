import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Download } from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const { toast } = useToast();

  // Guard against undefined settings or settings still loading
  if (!settings || !settings.privacy) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  const handleExportData = () => {
    // In a real implementation, this would export the user's data
    toast({
      title: "Data Export",
      description: "Your data export will begin shortly.",
    });
  };

  return (
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
                checked={settings.privacy?.storeDataLocally ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'storeDataLocally'], checked)
                }
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
                checked={settings.privacy?.analyticsConsent ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'analyticsConsent'], checked)
                }
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
                checked={settings.privacy?.biometricLogin ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'biometricLogin'], checked)
                }
              />
            </div>
          </div>

          <div className="bg-secondary/40 p-4 rounded-lg space-y-2 mt-4">
            <p className="text-sm">Your spiritual journey data is stored securely.</p>
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Export Your Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;