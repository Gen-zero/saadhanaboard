import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeeklyEntry } from '@/types/admin-dashboard';

type Row = { day?: string; date: string; logins?: number; completions?: number };

export default function SpiritualProgressChart({ data }: { data?: Row[] }) {
  const [showCompletions, setShowCompletions] = useState(true);
  const [showLogins, setShowLogins] = useState(true);

  const merged = useMemo(() => (data || []).map((d, i) => ({ day: d.day ?? `D${i + 1}`, date: d.date, logins: d.logins ?? 0, completions: d.completions ?? 0 } as Row)), [data]);

  return (
    <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Spiritual Progress</CardTitle>
          <div className="flex items-center space-x-4">
            <label className="text-sm flex items-center space-x-2"><input type="checkbox" checked={showLogins} onChange={() => setShowLogins(v => !v)} /> <span>Logins</span></label>
            <label className="text-sm flex items-center space-x-2"><input type="checkbox" checked={showCompletions} onChange={() => setShowCompletions(v => !v)} /> <span>Completions</span></label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {showLogins && <Line dataKey="logins" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />}
              {showCompletions && <Line dataKey="completions" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
