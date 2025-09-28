import React, { useState } from 'react';
import { useEnhancedUserManagement } from '@/hooks/useEnhancedUserManagement';
import UserSegmentationFilters from '@/components/admin/UserSegmentationFilters';
import UserProfileCard from '@/components/admin/UserProfileCard';
import UserProgressChart from '@/components/admin/UserProgressChart';
import UserJourneyTimeline from '@/components/admin/UserJourneyTimeline';
import UserCommunicationPanel from '@/components/admin/UserCommunicationPanel';
import UserBehavioralAnalytics from '@/components/admin/UserBehavioralAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, UserCheck, UserX } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AdminUsersPage: React.FC = () => {
  const { users, loading, filters, setFilters, getUser, pagination, nextPage, prevPage } = useEnhancedUserManagement();
  const [detail, setDetail] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const openUser = async (id: number) => {
    try {
      const d = await getUser(id);
      // store full payload as requested
      setDetail(d);
      setShowDialog(true);
    } catch (e) {
      console.error('open user error', e);
    }
  };

  return (
    <div className="space-y-6">
      <UserSegmentationFilters value={filters} onChange={setFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border/30">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Profile</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Last Login</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/20 hover:bg-background/30">
                      <td className="py-3 px-2 font-mono">{u.id}</td>
                      <td className="py-3 px-2">{u.email}</td>
                      <td className="py-3 px-2">{u.display_name}</td>
                      <td className="py-3 px-2">
                        {/* compact profile indicators */}
                        <div className="flex gap-1 items-center">
                          {u.profile?.experience_level && (<Badge>{u.profile.experience_level}</Badge>)}
                          {u.profile?.onboarding_completed ? (<Badge variant="secondary">Onboarded</Badge>) : null}
                          {u.profile?.traditions?.slice?.(0,2)?.map((t: string) => (<Badge key={t} variant="outline">{t}</Badge>))}
                        </div>
                      </td>
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
                      <td className="py-3 px-2 text-muted-foreground">{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openUser(u.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevPage} disabled={pagination.offset === 0}>Previous</Button>
              <Button variant="outline" size="sm" onClick={nextPage} disabled={pagination.offset + pagination.limit >= pagination.total}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details pane as Tabs */}
      {detail && (
        <div className="mt-4">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="journey">Journey</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <UserProfileCard user={detail.user} profile={detail.profile} />
            </TabsContent>
            <TabsContent value="progress">
              <UserProgressChart data={(detail.progress?.recentPracticeDays ? [{ date: detail.user.created_at, value: detail.progress.recentPracticeDays }] : (detail.analytics?.recentSessions || []).map((s: any) => ({ date: s.day, value: s.sessions })))} />
            </TabsContent>
            <TabsContent value="journey">
              <UserJourneyTimeline events={[{ date: detail.user.created_at, title: 'Account Created' }]} />
            </TabsContent>
            <TabsContent value="analytics">
              <UserBehavioralAnalytics analytics={detail.analytics} />
            </TabsContent>
            <TabsContent value="messages">
              <UserCommunicationPanel userId={detail.user.id} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
