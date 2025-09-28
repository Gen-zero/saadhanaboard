import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardSnapshot } from '@/types/admin-dashboard';

export default function RealTimeMetricsCard({ stats }: { stats?: Partial<DashboardSnapshot> | null }) {
  return (
    <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle>Real-time Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">{typeof stats?.totalUsers === 'number' ? stats.totalUsers : '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold">{typeof stats?.activeUsers === 'number' ? stats.activeUsers : '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Sadhanas</div>
            <div className="text-2xl font-bold">{typeof stats?.activeSadhanas === 'number' ? stats.activeSadhanas : '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold">{typeof stats?.completedSadhanas === 'number' ? stats.completedSadhanas : '—'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
