import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminAssetsPage = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');

  const load = async () => {
    const r = await adminApi.listAssets();
    setAssets(r.assets);
  };

  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file) return;
    await adminApi.uploadAsset(file, { title, type });
    setFile(null); setTitle('');
    load();
  };

  const remove = async (id: number) => { await adminApi.deleteAsset(id); load(); };

  return (
    <div className="space-y-6">
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Upload Asset</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Type (image, audio, icon)" value={type} onChange={(e) => setType(e.target.value)} />
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={upload} disabled={!file}>Upload</Button>
        </CardContent>
      </Card>
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Assets</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assets.map(a => (
              <div key={a.id} className="border border-border/30 rounded-md p-2">
                <div className="text-sm font-medium mb-1">{a.title || a.type}</div>
                {a.filePath && a.type.startsWith('image') ? (
                  <img src={a.filePath} alt={a.title} className="w-full h-32 object-cover rounded" />
                ) : a.type.startsWith('audio') ? (
                  <audio src={a.filePath} controls className="w-full" />
                ) : (
                  <div className="text-xs text-muted-foreground">{a.filePath}</div>
                )}
                <div className="mt-2 flex justify-between text-xs">
                  <span>{a.type}</span>
                  <Button size="sm" variant="outline" onClick={() => remove(a.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssetsPage;


