import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<{ totalUsers: number; activeSadhanas: number; completedSadhanas: number; uploadedBooks: number; currentThemes: number } | null>(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => setStats({ totalUsers: 0, activeSadhanas: 0, completedSadhanas: 0, uploadedBooks: 0, currentThemes: 0 }));
  }, []);

  const data = Array.from({ length: 7 }).map((_, i) => ({ day: `D${i+1}`, logins: Math.round(20 + Math.random()*50), completions: Math.round(5 + Math.random()*20) }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20"><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats?.totalUsers ?? '—'}</CardContent></Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20"><CardHeader><CardTitle>Active Sadhanas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats?.activeSadhanas ?? '—'}</CardContent></Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20"><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats?.completedSadhanas ?? '—'}</CardContent></Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20"><CardHeader><CardTitle>Books</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats?.uploadedBooks ?? '—'}</CardContent></Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20"><CardHeader><CardTitle>Themes</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{stats?.currentThemes ?? '—'}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader><CardTitle>Daily Logins</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ logins: { label: 'Logins', color: 'hsl(262,83%,58%)' } }}>
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Bar dataKey="logins" fill="var(--color-logins)" radius={6} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader><CardTitle>Sadhana Completions</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ completions: { label: 'Completions', color: 'hsl(292,83%,58%)' } }}>
              <LineChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Line dataKey="completions" stroke="var(--color-completions)" strokeWidth={2} dot={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


