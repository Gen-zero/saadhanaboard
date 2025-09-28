import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EngagementStats } from '@/types/admin-dashboard';

export default function UserEngagementAnalytics({ data }: { data?: EngagementStats | undefined }) {
  const items = useMemo(() => (data?.topSessions ?? []), [data]) as EngagementStats['topSessions'];

  return (
    <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="user_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
