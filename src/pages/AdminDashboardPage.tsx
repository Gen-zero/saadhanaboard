import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Users, Activity, BookOpen, Palette, UserCheck, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeSadhanas: number;
  completedSadhanas: number;
  uploadedBooks: number;
  currentThemes: number;
  recentLogins: number;
  todaysSadhanas: number;
  weeklyLogins: Array<{ date: string; logins: number }>;
  weeklySadhanaCompletions: Array<{ date: string; completions: number }>;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminApi.stats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          activeSadhanas: 0,
          completedSadhanas: 0,
          uploadedBooks: 0,
          currentThemes: 0,
          recentLogins: 0,
          todaysSadhanas: 0,
          weeklyLogins: [],
          weeklySadhanaCompletions: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const formatChartData = (data: Array<{ date: string; logins?: number; completions?: number }>, key: string) => {
    return data.map((item, index) => ({
      day: `D${index + 1}`,
      [key]: item[key as keyof typeof item] || 0,
      date: new Date(item.date).toLocaleDateString()
    }));
  };

  const loginData = stats ? formatChartData(stats.weeklyLogins, 'logins') : [];
  const completionData = stats ? formatChartData(stats.weeklySadhanaCompletions, 'completions') : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-background/60 backdrop-blur-md border-purple-500/20 animate-pulse">
              <CardHeader><div className="h-4 bg-gray-300 rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-8 bg-gray-300 rounded w-1/2"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers ?? '—'}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers ?? '—'}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sadhanas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSadhanas ?? '—'}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedSadhanas ?? '—'}</div>
            <p className="text-xs text-muted-foreground">Finished sadhanas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uploadedBooks ?? '—'}</div>
            <p className="text-xs text-muted-foreground">Total uploaded</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentThemes ?? '—'}</div>
            <p className="text-xs text-muted-foreground">Available themes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader>
            <CardTitle>Weekly Logins</CardTitle>
            <p className="text-sm text-muted-foreground">User login activity over the past 7 days</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ logins: { label: 'Logins', color: 'hsl(262,83%,58%)' } }}>
              <BarChart data={loginData}>
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
          <CardHeader>
            <CardTitle>Sadhana Completions</CardTitle>
            <p className="text-sm text-muted-foreground">Completed sadhanas over the past 7 days</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ completions: { label: 'Completions', color: 'hsl(292,83%,58%)' } }}>
              <LineChart data={completionData}>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recent Logins (24h)</span>
              <span className="text-lg font-semibold">{stats?.recentLogins ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Sadhanas Today</span>
              <span className="text-lg font-semibold">{stats?.todaysSadhanas ?? 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              View Recent Users
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              Export Data
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              System Health
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


