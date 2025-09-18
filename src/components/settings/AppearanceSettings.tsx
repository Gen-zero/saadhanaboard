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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Palette } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface AppearanceSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.appearance) {
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
              value={settings.appearance?.colorScheme || 'default'}
              onValueChange={(value) => updateSettings(['appearance', 'colorScheme'], value)}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2"
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
                  <span className="mt-2">Krishna</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="water" id="scheme-water" className="sr-only" />
                <Label
                  htmlFor="scheme-water"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                  <span className="mt-2">Vishnu</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="fire" id="scheme-fire" className="sr-only" />
                <Label
                  htmlFor="scheme-fire"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-red-600 to-yellow-500"></div>
                  <span className="mt-2">Maa Durga</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="shiva" id="scheme-shiva" className="sr-only" />
                <Label
                  htmlFor="scheme-shiva"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
                  <span className="mt-2">Shiva</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="bhairava" id="scheme-bhairava" className="sr-only" />
                <Label
                  htmlFor="scheme-bhairava"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-red-900 to-red-700"></div>
                  <span className="mt-2">Bhairava</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="serenity" id="scheme-serenity" className="sr-only" />
                <Label
                  htmlFor="scheme-serenity"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-blue-300 to-teal-300"></div>
                  <span className="mt-2">Serenity</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="ganesha" id="scheme-ganesha" className="sr-only" />
                <Label
                  htmlFor="scheme-ganesha"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="rounded-full w-8 h-8 bg-gradient-to-r from-purple-600 to-amber-500"></div>
                  <span className="mt-2">Ganesha</span>
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
                value={[settings.appearance?.fontSize || 16]}
                min={12}
                max={24}
                step={1}
                onValueChange={(value) => updateSettings(['appearance', 'fontSize'], value[0])}
                className="w-full"
              />
              <span className="text-lg">A</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Current font size: {settings.appearance?.fontSize || 16}px
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
                checked={settings.appearance?.animationsEnabled ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['appearance', 'animationsEnabled'], checked)
                }
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
                checked={settings.appearance?.highContrastMode ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['appearance', 'highContrastMode'], checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;