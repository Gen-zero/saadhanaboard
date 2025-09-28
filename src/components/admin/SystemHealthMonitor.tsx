import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SystemHealth } from '@/types/system';

function renderPercentOrNA(val: number | null | undefined) {
  if (val === null || val === undefined) return <span className="text-sm text-muted-foreground">N/A</span>;
  return <Progress value={Math.max(0, Math.min(100, Number(val)))} />;
}

export default function SystemHealthMonitor({ health }: { health?: SystemHealth | null }) {
  if (!health) {
    return (
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">CPU Usage</div>
            {renderPercentOrNA(health.metrics?.cpu_usage_percent ?? null)}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Memory Usage</div>
            {renderPercentOrNA(health.metrics?.memory_usage_percent ?? null)}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Disk Usage</div>
            {renderPercentOrNA(health.metrics?.disk_usage_percent ?? null)}
          </div>
          <div className="text-sm">
            Status: <span className={`font-medium ${health.status === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
              {health.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}