import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';

export default function SpiritualLibraryManager() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await adminApi.listBooks({ limit: 50 });
        setBooks(r.items || r);
      } catch (e) {
        console.error('list books', e);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spiritual Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button>Add resource</Button>
        </div>
        <div>
          {loading ? <div>Loading...</div> : (
            <ul className="space-y-2">
              {books.map(b => (
                <li key={b.id} className="p-2 border rounded">{b.title || b.name || b.file_name}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
