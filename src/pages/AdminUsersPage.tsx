import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserCheck, UserX, Shield, Eye, Trash2 } from 'lucide-react';

interface User {
  id: number;
  email: string;
  display_name: string;
  is_admin: boolean;
  active: boolean;
  created_at: string;
  last_login?: string;
  login_attempts: number;
}

interface UserDetails extends User {
  sadhanas: Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
  }>;
}

const AdminUsersPage = () => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  const load = async (offset = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        q, 
        limit: '20', 
        offset: offset.toString(),
        status 
      });
      const response = await fetch(`${adminApi.ADMIN_API_BASE || 'http://localhost:3002/api/admin'}/users?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setUsers(data.users || []);
      setPagination({ total: data.total || 0, limit: data.limit || 20, offset: data.offset || 0 });
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    load(0);
  };

  const toggleAdmin = async (id: number, current: boolean) => {
    try {
      await adminApi.updateUser(id, { is_admin: !current });
      load(pagination.offset);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await adminApi.updateUser(id, { active: !current });
      load(pagination.offset);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const viewUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`${adminApi.ADMIN_API_BASE || 'http://localhost:3002/api/admin'}/users/${userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setSelectedUser({ ...data.user, sadhanas: data.sadhanas });
      setShowUserDialog(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  const nextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      setPagination(prev => ({ ...prev, offset: newOffset }));
      load(newOffset);
    }
  };

  const prevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPagination(prev => ({ ...prev, offset: newOffset }));
    load(newOffset);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search Users</label>
              <Input 
                placeholder="Search by email or name..." 
                value={q} 
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">Filter by Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="admin">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.active).length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{users.filter(u => u.is_admin).length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>Users ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border/30">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Last Login</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-border/20 hover:bg-background/30">
                        <td className="py-3 px-2 font-mono">{u.id}</td>
                        <td className="py-3 px-2">{u.email}</td>
                        <td className="py-3 px-2">{u.display_name}</td>
                        <td className="py-3 px-2">
                          <Badge variant={u.active ? 'default' : 'destructive'}>
                            {u.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={u.is_admin ? 'secondary' : 'outline'}>
                            {u.is_admin ? 'Admin' : 'User'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => viewUserDetails(u.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleAdmin(u.id, u.is_admin)}
                              className="h-8 w-8 p-0"
                            >
                              <Shield className={`h-4 w-4 ${u.is_admin ? 'text-blue-500' : 'text-gray-400'}`} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleActive(u.id, u.active)}
                              className="h-8 w-8 p-0"
                            >
                              {u.active ? 
                                <UserX className="h-4 w-4 text-red-500" /> : 
                                <UserCheck className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevPage}
                    disabled={pagination.offset === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextPage}
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.display_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created At</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Login</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Recent Sadhanas</label>
                <div className="space-y-2">
                  {selectedUser.sadhanas.length > 0 ? (
                    selectedUser.sadhanas.map(sadhana => (
                      <div key={sadhana.id} className="flex items-center justify-between p-2 border border-border/30 rounded">
                        <div>
                          <p className="text-sm font-medium">{sadhana.title}</p>
                          <p className="text-xs text-muted-foreground">Created: {new Date(sadhana.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={sadhana.status === 'completed' ? 'default' : 'secondary'}>
                          {sadhana.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No sadhanas found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;


