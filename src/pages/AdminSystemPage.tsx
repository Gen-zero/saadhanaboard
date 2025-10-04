import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';
import useSystemMonitoring from '@/hooks/useSystemMonitoring';
import { SystemMetrics, SystemAlert } from '@/types/system';

const AdminSystemPage = () => {
  const {
    metrics,
    alerts,
    deployment,
    health,
    loading,
    error,
    refresh,
    resolveAlert
  } = useSystemMonitoring();

  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    await resolveAlert(alertId);
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <Button onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className={`w-3 h-3 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.status || 'Unknown'}</div>
            <p className="text-xs text-muted-foreground">
              {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && typeof metrics.cpu_usage_percent !== 'undefined' && metrics.cpu_usage_percent !== null && isFinite(Number(metrics.cpu_usage_percent)) ? `${Number(metrics.cpu_usage_percent).toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.extra?.cpu_count ? `${metrics.extra.cpu_count} cores` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && typeof metrics.memory_usage_percent !== 'undefined' && metrics.memory_usage_percent !== null && isFinite(Number(metrics.memory_usage_percent)) ? `${Number(metrics.memory_usage_percent).toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Load average: {(metrics && metrics.load_average && isFinite(Number(metrics.load_average.one))) ? Number(metrics.load_average.one).toFixed(2) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.disk_usage_percent ? `${metrics.disk_usage_percent.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {metrics?.uptime_seconds ? `${Math.floor(metrics.uptime_seconds / 3600)}h` : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>No active alerts</span>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${alert.resolved ? 'bg-muted' : 'bg-background'} cursor-pointer hover:bg-accent`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getAlertSeverityColor(alert.severity)}`}></div>
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.resolved ? (
                        <Badge variant="secondary">Resolved</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveAlert(alert.id);
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'N/A'}
                    </span>
                    <span className="capitalize">{alert.alert_type}</span>
                    <span className="capitalize">{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Deployment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
              <p className="font-medium">{deployment?.version || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Git Commit</h3>
              <p className="font-medium">{deployment?.git_commit || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Deployed At</h3>
              <p className="font-medium">
                {deployment?.deployed_at ? new Date(deployment.deployed_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detailed Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Database Connections</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active:</span>
                  <span className="font-medium">{metrics?.active_connections || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Idle:</span>
                  <span className="font-medium">{metrics?.idle_connections || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{metrics?.total_connections || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Load Average</h3>
              <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>1 min:</span>
                    <span className="font-medium">{(metrics && metrics.load_average && isFinite(Number(metrics.load_average.one))) ? Number(metrics.load_average.one).toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 min:</span>
                    <span className="font-medium">{(metrics && metrics.load_average && isFinite(Number(metrics.load_average.five))) ? Number(metrics.load_average.five).toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>15 min:</span>
                    <span className="font-medium">{(metrics && metrics.load_average && isFinite(Number(metrics.load_average.fifteen))) ? Number(metrics.load_average.fifteen).toFixed(2) : 'N/A'}</span>
                  </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Alert Details</h2>
                <Button variant="ghost" onClick={() => setSelectedAlert(null)}>×</Button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <p className="font-medium">{selectedAlert.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                    <p className="capitalize">{selectedAlert.alert_type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Severity</h3>
                    <p className="capitalize">{selectedAlert.severity}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p>{selectedAlert.created_at ? new Date(selectedAlert.created_at).toLocaleString() : 'N/A'}</p>
                </div>
                
                {selectedAlert.resolved_at && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Resolved At</h3>
                    <p>{new Date(selectedAlert.resolved_at).toLocaleString()}</p>
                  </div>
                )}
                
                {selectedAlert.resolved_by && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Resolved By</h3>
                    <p>{selectedAlert.resolved_by}</p>
                  </div>
                )}
                
                {selectedAlert.metric_data && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Metric Data</h3>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(selectedAlert.metric_data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {!selectedAlert.resolved && (
                  <div className="flex justify-end">
                    <Button onClick={() => handleResolveAlert(selectedAlert.id)}>
                      Mark as Resolved
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemPage;