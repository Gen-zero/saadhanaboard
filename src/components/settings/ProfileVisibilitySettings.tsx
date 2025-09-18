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
import { User, Eye } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface ProfileVisibilitySettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const ProfileVisibilitySettings: React.FC<ProfileVisibilitySettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.profile) {
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
          <span>Profile Visibility</span>
        </CardTitle>
        <CardDescription>Control what information is visible on your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Name</Label>
                <p className="text-sm text-muted-foreground">
                  Show your name on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showName ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showName'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Varna</Label>
                <p className="text-sm text-muted-foreground">
                  Show your varna (social class) on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showVarna ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showVarna'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Deity</Label>
                <p className="text-sm text-muted-foreground">
                  Show your favorite deity on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showDeity ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showDeity'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Gotra</Label>
                <p className="text-sm text-muted-foreground">
                  Show your ancestral lineage on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showGotra ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showGotra'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dikshit Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show your initiation status on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showDikshitStatus ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showDikshitStatus'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Date of Birth</Label>
                <p className="text-sm text-muted-foreground">
                  Show your date of birth on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showDOB ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showDOB'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Growth Level</Label>
                <p className="text-sm text-muted-foreground">
                  Show your spiritual growth level on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showGrowthLevel ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showGrowthLevel'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pet</Label>
                <p className="text-sm text-muted-foreground">
                  Show your personal pet on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showPet ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showPet'], checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Location</Label>
                <p className="text-sm text-muted-foreground">
                  Show your location on your profile
                </p>
              </div>
              <Switch
                checked={settings.profile?.showLocation ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['profile', 'showLocation'], checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileVisibilitySettings;