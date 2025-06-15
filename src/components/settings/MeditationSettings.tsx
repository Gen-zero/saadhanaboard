
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
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface MeditationSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const MeditationSettings: React.FC<MeditationSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  return (
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
                onCheckedChange={(checked) =>
                  updateSettings(['meditation', 'backgroundSounds'], checked)
                }
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
                onValueChange={(value) =>
                  updateSettings(['meditation', 'timerDuration'], value[0])
                }
                className="w-full"
              />
              <span className="w-12 text-right">
                {settings.meditation.timerDuration} min
              </span>
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
                onCheckedChange={(checked) =>
                  updateSettings(['meditation', 'intervalBell'], checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSettings;
