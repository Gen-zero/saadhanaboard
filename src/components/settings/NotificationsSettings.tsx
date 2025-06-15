
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
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface NotificationsSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  return (
    <div className="space-y-6">
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
                onCheckedChange={(checked) =>
                  updateSettings(['notifications', 'enabled'], checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Daily Ritual Reminders</Label>
                <Switch
                  disabled={!settings.notifications.enabled}
                  checked={settings.notifications.ritualReminders}
                  onCheckedChange={(checked) =>
                    updateSettings(['notifications', 'ritualReminders'], checked)
                  }
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
                  onCheckedChange={(checked) =>
                    updateSettings(['notifications', 'goalProgress'], checked)
                  }
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
                  onCheckedChange={(checked) =>
                    updateSettings(['notifications', 'motivationalMessages'], checked)
                  }
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
    </div>
  );
};

export default NotificationsSettings;
