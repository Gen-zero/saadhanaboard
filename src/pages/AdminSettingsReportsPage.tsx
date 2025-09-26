import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminSettingsReportsPage = () => {
  const [settings, setSettings] = useState<any>({ features: {}, timers: {} });

  useEffect(() => {
    adminApi.getSettings().then(r => setSettings(r.settings));
  }, []);

  const save = async () => {
    await adminApi.saveSettings(settings);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm mr-2">Biometric login</label>
            <input type="checkbox" checked={!!settings.features?.biometric} onChange={(e) => setSettings((s: any) => ({ ...s, features: { ...s.features, biometric: e.target.checked } }))} />
          </div>
          <div>
            <label className="text-sm mr-2">Background music</label>
            <input type="checkbox" checked={!!settings.features?.music} onChange={(e) => setSettings((s: any) => ({ ...s, features: { ...s.features, music: e.target.checked } }))} />
          </div>
          <div>
            <label className="text-sm mr-2">Meditation timer (min)</label>
            <input className="border rounded px-2 py-1 bg-transparent" value={settings.timers?.meditation || 10} onChange={(e) => setSettings((s: any) => ({ ...s, timers: { ...s.timers, meditation: Number(e.target.value) || 10 } }))} />
          </div>
          <Button onClick={save}>Save</Button>
        </CardContent>
      </Card>

      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
        <CardContent>
          <a className="underline" href={adminApi.reportUsersCsvUrl()} target="_blank" rel="noreferrer">Download Users CSV</a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsReportsPage;


