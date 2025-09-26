import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    adminApi.logs(50, 0).then(r => setLogs(r.logs)).catch(() => setLogs([]));
  }, []);

  return (
    <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
      <CardHeader><CardTitle>Audit Logs</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.map((l, i) => (
            <div key={i} className="text-sm border-b border-border/30 pb-2">
              <div className="font-medium">{l.action} • {l.target_type}#{l.target_id}</div>
              <div className="text-muted-foreground">{new Date(l.created_at).toLocaleString()}</div>
              {l.details ? <pre className="mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(l.details)}</pre> : null}
            </div>
          ))}
          {!logs.length && <div className="text-sm text-muted-foreground">No logs</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLogsPage;


