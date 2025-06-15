
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal } from 'lucide-react';

const AdvancedSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span>Advanced Settings</span>
        </CardTitle>
        <CardDescription>
          Configure advanced features and developer options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-secondary/40 p-4 rounded-lg">
            <p className="text-sm text-yellow-500 font-medium">
              Warning: These settings are for advanced users. Changes here may affect your
              app experience.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cache Settings</Label>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                Clear Cache
              </Button>
              <Button variant="outline" className="flex-1">
                Rebuild Index
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last cache purge: Never</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Data Management</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">Backup Data</Button>
              <Button variant="outline">Restore Backup</Button>
              <Button variant="outline">Sync Now</Button>
              <Button variant="outline">Check Updates</Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-red-500">Danger Zone</Label>
            <div className="grid gap-2">
              <Button variant="destructive" size="sm">
                Delete All User Data
              </Button>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              These actions cannot be undone.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSettings;
