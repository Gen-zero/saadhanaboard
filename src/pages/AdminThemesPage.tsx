import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminThemesPage = () => {
  const [themes, setThemes] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [available, setAvailable] = useState(true);
  // extra colors required by backend validation
  const [primary, setPrimary] = useState('#8B2A94');
  const [secondary, setSecondary] = useState('#4A1547');
  const [accent, setAccent] = useState('#E91E63');
  const [border, setBorder] = useState('#e5e7eb');
  const [success, setSuccess] = useState('#16a34a');
  const [warning, setWarning] = useState('#f59e0b');
  const [error, setError] = useState('#ef4444');
  const [info, setInfo] = useState('#3b82f6');

  const load = async () => {
    const r = await adminApi.listThemes();
    setThemes(r.items || r);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await adminApi.createTheme({ name, deity, available, colors: { primary, secondary, accent, border, success, warning, error, info } });
    setName(''); setDeity('');
    load();
  };
  const remove = async (id: number) => { await adminApi.deleteTheme(id); load(); };

  return (
    <div className="space-y-6">
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Create Theme</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-3">
          <Input placeholder="Theme name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Deity" value={deity} onChange={(e) => setDeity(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">Primary <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} /></label>
            <label className="text-xs">Secondary <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} /></label>
            <label className="text-xs">Accent <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} /></label>
            <label className="text-xs">Border <input type="color" value={border} onChange={(e) => setBorder(e.target.value)} /></label>
            <label className="text-xs">Success <input type="color" value={success} onChange={(e) => setSuccess(e.target.value)} /></label>
            <label className="text-xs">Warning <input type="color" value={warning} onChange={(e) => setWarning(e.target.value)} /></label>
            <label className="text-xs">Error <input type="color" value={error} onChange={(e) => setError(e.target.value)} /></label>
            <label className="text-xs">Info <input type="color" value={info} onChange={(e) => setInfo(e.target.value)} /></label>
          </div>
          <select className="border rounded px-2 py-2 bg-transparent" value={available ? 'yes' : 'no'} onChange={(e) => setAvailable(e.target.value === 'yes')}>
            <option value="yes">Available</option>
            <option value="no">Unavailable</option>
          </select>
          <Button onClick={add} disabled={!name}>Create</Button>
        </CardContent>
      </Card>
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Themes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {themes.map(t => (
              <div key={t.id} className="flex items-center justify-between border border-border/30 rounded-md p-2">
                <div className="text-sm"><span className="font-medium">{t.name}</span> • {t.deity} • {t.available ? 'Available' : 'Unavailable'}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(`/admin/theme-preview?themeId=${t.id}`, '_blank')}>Preview</Button>
                  <Button variant="outline" size="sm" onClick={() => remove(t.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {!themes.length && <div className="text-sm text-muted-foreground">No themes</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminThemesPage;


