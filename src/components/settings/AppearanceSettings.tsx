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
import { Palette, Sparkles, Check } from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { listThemes, themeUtils, getThemeHealth } from '@/themes';

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
    <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600">
          <Palette className="h-5 w-5" />
          <span>Visual Preferences</span>
        </CardTitle>
        <CardDescription>Customize how the app looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Theme Selection
            </Label>
            <RadioGroup
              value={settings.appearance?.colorScheme || 'default'}
              onValueChange={(value) => {
                try {
                  updateSettings(['appearance', 'colorScheme'], value);
                } catch (error) {
                  console.warn('Failed to update color scheme', error);
                  // Optionally revert to previous value or show error message
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            >
              {listThemes({ category: undefined, available: true }).filter(t => 
                t.metadata.category === 'color-scheme' || 
                t.metadata.category === 'hybrid' || 
                t.metadata.isLandingPage
              ).map((theme) => {
                const id = (theme as any).metadata.id;
                const label = (theme as any).metadata.name || id;
                const health = getThemeHealth(theme as any);
                const isHealthy = health.status === 'healthy';
                const isSelected = settings.appearance?.colorScheme === id;
                
                return (
                  <div key={id} className="relative">
                    <RadioGroupItem value={id} id={`scheme-${id}`} className="sr-only" />
                    <Label
                      htmlFor={`scheme-${id}`}
                      className={`flex flex-col items-center justify-between rounded-xl border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 shadow-lg shadow-purple-500/20' 
                          : 'border-muted hover:border-purple-300'
                      } ${
                        !isHealthy ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="relative mb-3">
                        <div className="rounded-full w-12 h-12 flex items-center justify-center">
                          {themeUtils.renderThemeIcon(theme as any, 'w-8 h-8 rounded-full')}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {!isHealthy && (
                          <div 
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"
                            title={`Theme health: ${health.status}. Issues: ${health.issues.join(', ')}`}
                          />
                        )}
                      </div>
                      <span className="mt-2 text-sm font-medium text-center">{label}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Label className="text-lg font-semibold">Font Size</Label>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">A</span>
              <Slider
                value={[settings.appearance?.fontSize || 16]}
                min={12}
                max={24}
                step={1}
                onValueChange={(value) => updateSettings(['appearance', 'fontSize'], value[0])}
                className="w-full"
              />
              <span className="text-xl font-medium">A</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Current font size: {settings.appearance?.fontSize || 16}px
            </p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20">
              <div className="space-y-1">
                <Label className="font-medium">Animations</Label>
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

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20">
              <div className="space-y-1">
                <Label className="font-medium">High Contrast Mode</Label>
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