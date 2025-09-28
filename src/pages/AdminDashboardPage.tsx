import { useEffect, useState } from 'react';
import type { DashboardSnapshot, ProgressStats, WeeklyEntry } from '@/types/admin-dashboard';
import type { SystemHealth } from '@/types/system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services/adminApi';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Users, Activity, BookOpen, Palette, UserCheck, TrendingUp } from 'lucide-react';
import { useRealTimeDashboard } from '@/hooks/useRealTimeDashboard';
import RealTimeMetricsCard from '@/components/admin/RealTimeMetricsCard';
import SpiritualProgressChart from '@/components/admin/SpiritualProgressChart';
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';
import UserEngagementAnalytics from '@/components/admin/UserEngagementAnalytics';


const AdminDashboardPage = () => {
  const { stats, error, connection } = useRealTimeDashboard();
  const [loading] = useState(false);
  const [usingHttpFallback, setUsingHttpFallback] = useState(false);
  const [httpStats, setHttpStats] = useState<DashboardSnapshot | null>(null);

  // if stats is null after N seconds or error set, fallback to HTTP
  useEffect(() => {
    let cancelled = false;
    const FALLBACK_MS = 6000; // N seconds
    const timer = setTimeout(async () => {
      if (cancelled) return;
      // If the socket is disconnected, or we have no stats yet, or an error occurred, attempt HTTP fallback
      if (!stats || error || connection === 'disconnected') {
        try {
          const r = await adminApi.stats();
          const progress = await adminApi.getProgressStats().catch(() => null);
          const health = await adminApi.getHealthStats().catch(() => null);
          setUsingHttpFallback(true);

          const fallbackHealth: SystemHealth = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Health unavailable',
          };

          const normalized: DashboardSnapshot = {
            totalUsers: r.totalUsers,
            activeUsers: r.activeUsers,
            activeSadhanas: r.activeSadhanas,
            completedSadhanas: r.completedSadhanas,
            uploadedBooks: r.uploadedBooks,
            currentThemes: r.currentThemes,
            recentLogins: r.recentLogins,
            todaysSadhanas: r.todaysSadhanas,
            weeklyLogins: progress?.weeklyLogins ?? r.weeklyLogins ?? [],
            weeklySadhanaCompletions: progress?.weeklySadhanaCompletions ?? r.weeklySadhanaCompletions ?? [],
            averagePracticeMinutes: (progress as any)?.averagePracticeMinutes ?? 0,
            topSessions: (progress as any)?.topSessions ?? [],
            systemHealth: (health && health.systemHealth) ? health.systemHealth : fallbackHealth,
          };

          setHttpStats(normalized);
        } catch (e) {
          // keep using socket state; show banner
          setUsingHttpFallback(true);
        }
      } else {
        // connection looks healthy — clear any HTTP fallback state
        if (usingHttpFallback) setUsingHttpFallback(false);
        if (httpStats) setHttpStats(null);
      }
    }, FALLBACK_MS);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [stats, error, connection]);

  // Prepare chart data
  const mergeWeekly = (logins: WeeklyEntry[] = [], completions: WeeklyEntry[] = []) => {
    // build a map by date to merge values
    const m = new Map<string, { date: string; logins?: number; completions?: number }>();
    (logins || []).forEach(l => {
      m.set(l.date, { date: l.date, logins: l.logins ?? 0, completions: 0 });
    });
    (completions || []).forEach(c => {
      const existing = m.get(c.date);
      if (existing) existing.completions = c.completions ?? 0;
      else m.set(c.date, { date: c.date, logins: 0, completions: c.completions ?? 0 });
    });
    // sort by date ascending
    const arr = Array.from(m.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return arr.map((it, i) => ({ day: `D${i + 1}`, date: new Date(it.date).toLocaleDateString(), logins: it.logins, completions: it.completions }));
  };

  const effective = (stats as DashboardSnapshot | null) || httpStats || null;
  const mergedChartData = effective ? mergeWeekly(effective.weeklyLogins || [], effective.weeklySadhanaCompletions || []) : [];

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
      {usingHttpFallback && (
        <div className="p-3 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-200">
          Running in HTTP fallback mode — real-time socket is unavailable. Data updates will be polled by the client.
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <RealTimeMetricsCard stats={effective} />
  <SystemHealthMonitor health={effective?.systemHealth ?? null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <SpiritualProgressChart data={mergedChartData} />
        <div className="space-y-6">
          <UserEngagementAnalytics data={effective} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recent Logins (24h)</span>
              <span className="text-lg font-semibold">{effective?.recentLogins ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Sadhanas Today</span>
              <span className="text-lg font-semibold">{effective?.todaysSadhanas ?? 0}</span>
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


