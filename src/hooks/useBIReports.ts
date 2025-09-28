import { useEffect, useState, useRef, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import type { KPISnapshot, ReportTemplate, ScheduledReport, SpiritualInsight } from '@/types/bi-reports';

export function useBIReports() {
  const [kpi, setKpi] = useState<KPISnapshot | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [insights, setInsights] = useState<SpiritualInsight[]>([]);
  const socketRef = useRef<any>(null);

  const loadAll = useCallback(async () => {
    try {
      const snap = await adminApi.getBIKPISnapshot();
      setKpi(snap);
    } catch (e) { console.error('load KPIs', e); }
    try {
      const t = await adminApi.getBIReportTemplates();
      setTemplates(t.items || []);
    } catch (e) { console.error('load templates', e); }
    try {
      const s = await adminApi.getScheduledReports();
      setSchedules(s.items || []);
    } catch (e) { console.error('load schedules', e); }
    try {
      const ins = await adminApi.getCommunityInsights();
      setInsights(ins.items || []);
    } catch (e) { console.error('load insights', e); }
  }, []);

  useEffect(() => {
    loadAll();
    // connect socket
    try {
      const socket = adminApi.connectBIStream(
        (d:any) => { if (d) setKpi(prev => ({ ...(prev as any), ...(d.kpi || d) } as KPISnapshot)); },
        (d:any) => {
          // execution status updates could be used to refresh executions/schedules
          // for now we trigger a schedules refresh when executions change
          loadAll();
        },
        (d:any) => {
          // insights pushed
          if (d && d.items) setInsights(prev => [...(d.items || []), ...prev]);
        },
        (err:any) => console.error('BI socket error', err)
      );
      socketRef.current = socket;
      // join rooms so server-side will send updates; emit subscribe if available
      try { socket.emit('bi:subscribe', { rooms: ['bi-kpis','bi-executions','bi-insights'] }); } catch (e) {}
    } catch (e) {
      console.error('Failed to connect BI socket', e);
    }

    return () => {
      try { if (socketRef.current) socketRef.current.disconnect(); } catch (e) {}
    };
  }, [loadAll]);

  const refreshAll = useCallback(() => { loadAll(); }, [loadAll]);

  const createTemplate = useCallback(async (payload: Partial<ReportTemplate>) => {
    const res = await adminApi.createBIReportTemplate(payload as any);
    await loadAll();
    return res;
  }, [loadAll]);

  const createSchedule = useCallback(async (payload: Partial<ScheduledReport>) => {
    const res = await adminApi.createScheduledReport(payload as any);
    await loadAll();
    return res;
  }, [loadAll]);

  const generateInsights = useCallback(async (type: any, params = {}) => {
    const res = await adminApi.generateInsights(type, params);
    await loadAll();
    return res;
  }, [loadAll]);

  return {
    kpi,
    templates,
    schedules,
    insights,
    refreshAll,
    createTemplate,
    createSchedule,
    generateInsights,
  };
}

export default useBIReports;
