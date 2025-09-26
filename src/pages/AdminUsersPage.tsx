import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminUsersPage = () => {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<Array<{ id: number; email: string; display_name: string; is_admin: boolean; active: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await adminApi.listUsers(q, 20, 0);
      setUsers(r.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // initial
    // eslint-disable-next-line
  }, []);

  const toggleAdmin = async (id: number, current: boolean) => {
    await adminApi.updateUser(id, { is_admin: !current });
    load();
  };
  const toggleActive = async (id: number, current: boolean) => {
    await adminApi.updateUser(id, { active: !current });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={load}>Search</Button>
      </div>
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? 'Loading...' : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Admin</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t border-border/30">
                      <td className="py-2">{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.display_name}</td>
                      <td>{u.is_admin ? 'Yes' : 'No'}</td>
                      <td>{u.active ? 'Yes' : 'No'}</td>
                      <td className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => toggleAdmin(u.id, u.is_admin)}>{u.is_admin ? 'Revoke' : 'Make'} Admin</Button>
                        <Button variant="outline" size="sm" onClick={() => toggleActive(u.id, u.active)}>{u.active ? 'Deactivate' : 'Activate'}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;


