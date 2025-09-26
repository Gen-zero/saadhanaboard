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

  const load = async () => {
    const r = await adminApi.listThemes();
    setThemes(r.themes);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await adminApi.createTheme({ name, deity, available });
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
                <Button variant="outline" size="sm" onClick={() => remove(t.id)}>Delete</Button>
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


