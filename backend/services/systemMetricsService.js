const os = require('os');
const db = require('../config/db');
const { exec } = require('child_process');
const si = require('systeminformation');

async function collectSystemMetrics() {
  try {
    const cpus = os.cpus();
    const load = os.loadavg();
    const memTotal = os.totalmem();
    const memFree = os.freemem();
    const uptime = os.uptime();

    // Basic CPU percent calc (approximate)
    const cpuUsage = Math.round((1 - (os.freemem() / os.totalmem())) * 100 * 100) / 100;
    const memUsage = Math.round(((memTotal - memFree) / memTotal) * 100 * 100) / 100;

    // Get disk usage using systeminformation
    let diskUsage = 0;
    try {
      const fsSize = await si.fsSize();
      if (fsSize && fsSize.length > 0) {
        const mainDisk = fsSize[0];
        diskUsage = Math.round((mainDisk.used / mainDisk.size) * 100 * 100) / 100;
      }
    } catch (diskError) {
      console.error('Failed to get disk usage:', diskError);
    }

    // Postgres pool stats (best-effort)
    let active = null, idle = null, total = null;
    try {
      const r = await db.query("SELECT COUNT(*)::int FILTER (WHERE state='active') as active, COUNT(*)::int FILTER (WHERE state='idle') as idle, COUNT(*)::int as total FROM pg_stat_activity;", []);
      if (r && r.rows && r.rows[0]) {
        active = r.rows[0].active;
        idle = r.rows[0].idle;
        total = r.rows[0].total;
      }
    } catch (e) { /* ignore DB stat failures */ }

    const metrics = {
      cpu_usage_percent: cpuUsage,
      memory_usage_percent: memUsage,
      disk_usage_percent: diskUsage,
      load_average: { one: load[0], five: load[1], fifteen: load[2] },
      active_connections: active,
      idle_connections: idle,
      total_connections: total,
      uptime_seconds: Math.floor(uptime),
      extra: { cpu_count: cpus.length }
    };

    // persist and return the inserted row where possible
    try {
      const r = await db.query('INSERT INTO system_metrics (cpu_usage_percent,memory_usage_percent,disk_usage_percent,load_average,active_connections,idle_connections,total_connections,uptime_seconds,extra) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [metrics.cpu_usage_percent, metrics.memory_usage_percent, metrics.disk_usage_percent, JSON.stringify(metrics.load_average), metrics.active_connections, metrics.idle_connections, metrics.total_connections, metrics.uptime_seconds, JSON.stringify(metrics.extra)]);
      if (r && r.rows && r.rows[0]) {
        return r.rows[0];
      }
    } catch (e) { console.error('Failed to persist system metrics', e); }

    return metrics;
  } catch (e) {
    console.error('collectSystemMetrics error', e);
    throw e;
  }
}

async function getMetricsHistory(timeframe = '24h') {
  // timeframe: '1h'|'6h'|'24h'|'7d'|'30d'
  const now = new Date();
  let since = new Date(now.getTime() - 24 * 3600 * 1000);
  if (timeframe === '1h') since = new Date(now.getTime() - 3600 * 1000);
  if (timeframe === '6h') since = new Date(now.getTime() - 6 * 3600 * 1000);
  if (timeframe === '7d') since = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  if (timeframe === '30d') since = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  const r = await db.query('SELECT * FROM system_metrics WHERE created_at >= $1 ORDER BY created_at ASC LIMIT 10000', [since.toISOString()]);
  return r.rows || [];
}

async function storeApiMetric(rec) {
  try {
    await db.query('INSERT INTO api_metrics (endpoint,method,status_code,response_time_ms,requests_count,error_count,meta) VALUES ($1,$2,$3,$4,$5,$6,$7)', [rec.endpoint, rec.method, rec.status_code, rec.response_time_ms, rec.requests_count || 1, rec.error_count || 0, JSON.stringify(rec.meta || {})]);
  } catch (e) { console.error('storeApiMetric failed', e); }
}

async function getApiMetrics(timeframe = '24h') {
  // Get API analytics with proper aggregation
  const now = new Date();
  let since = new Date(now.getTime() - 24 * 3600 * 1000);
  if (timeframe === '1h') since = new Date(now.getTime() - 3600 * 1000);
  if (timeframe === '6h') since = new Date(now.getTime() - 6 * 3600 * 1000);
  if (timeframe === '7d') since = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  if (timeframe === '30d') since = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  // Get overview data
  const overviewResult = await db.query(`
    SELECT 
      COUNT(*) as total_requests,
      AVG(response_time_ms) as avg_response_time,
      SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
      ROUND(SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as error_rate
    FROM api_metrics 
    WHERE created_at >= $1
  `, [since.toISOString()]);

  // Get endpoint data
  const endpointsResult = await db.query(`
    SELECT 
      endpoint,
      method,
      COUNT(*) as requests_count,
      AVG(response_time_ms) as avg_response_time,
      SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
      ROUND(SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as error_rate
    FROM api_metrics 
    WHERE created_at >= $1
    GROUP BY endpoint, method
    ORDER BY requests_count DESC
    LIMIT 50
  `, [since.toISOString()]);

  // Get trends data (hourly for last 24h, daily for longer periods)
  let trendQuery, trendParams;
  if (timeframe === '1h' || timeframe === '6h' || timeframe === '24h') {
    trendQuery = `
      SELECT 
        DATE_TRUNC('hour', created_at) as time_bucket,
        COUNT(*) as requests_count,
        AVG(response_time_ms) as avg_response_time,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
      FROM api_metrics 
      WHERE created_at >= $1
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY time_bucket
    `;
    trendParams = [since.toISOString()];
  } else {
    trendQuery = `
      SELECT 
        DATE_TRUNC('day', created_at) as time_bucket,
        COUNT(*) as requests_count,
        AVG(response_time_ms) as avg_response_time,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
      FROM api_metrics 
      WHERE created_at >= $1
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY time_bucket
    `;
    trendParams = [since.toISOString()];
  }

  const trendsResult = await db.query(trendQuery, trendParams);

  return {
    overview: overviewResult.rows[0] || {},
    endpoints: endpointsResult.rows || [],
    trends: trendsResult.rows || []
  };
}

async function detectAnomalies(currentMetrics, historicalBaseline) {
  // Very naive anomaly detection: threshold exceed
  const alerts = [];
  if (currentMetrics.cpu_usage_percent > 90) alerts.push({ type: 'cpu', severity: 'high', message: 'CPU usage > 90%' });
  if (currentMetrics.memory_usage_percent > 90) alerts.push({ type: 'memory', severity: 'high', message: 'Memory usage > 90%' });
  if (currentMetrics.disk_usage_percent > 90) alerts.push({ type: 'disk', severity: 'high', message: 'Disk usage > 90%' });
  return alerts;
}

module.exports = {
  collectSystemMetrics,
  getMetricsHistory,
  storeApiMetric,
  getApiMetrics,
  detectAnomalies,
};