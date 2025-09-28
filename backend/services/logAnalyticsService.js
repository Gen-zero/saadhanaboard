const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Log analytics & threat detection service (rule-based, extendable)
 */
module.exports = {
  async getLogStatistics(filters = {}) {
    // simple stats implementation: counts by severity
    try {
      const res = await db.query(`SELECT severity, COUNT(*)::int as cnt FROM admin_logs GROUP BY severity`);
      const map = {};
      res.rows.forEach(r => { map[r.severity || 'info'] = r.cnt; });
      return { bySeverity: map };
    } catch (e) {
      console.error('getLogStatistics error', e);
      return { bySeverity: {} };
    }
  },

  async detectSecurityThreats(logEntry) {
    // basic rule-based detection
    // returns { detected: boolean, rule: string, threatLevel }
    try {
      if (!logEntry) return { detected: false };
      const msg = JSON.stringify(logEntry.details || logEntry.metadata || {});
      // rule: multiple failed login attempts
      if (logEntry.action && String(logEntry.action).toLowerCase().includes('login_failed')) {
        return { detected: true, rule: 'failed_login', threatLevel: 'medium' };
      }
      // rule: privilege escalation
      if (logEntry.action && /promote|grant|set_role|make_admin/i.test(logEntry.action)) {
        return { detected: true, rule: 'privilege_escalation', threatLevel: 'high' };
      }
      // rule: suspicious IP (private placeholder list)
      if (logEntry.ip_address && (String(logEntry.ip_address).startsWith('192.') || String(logEntry.ip_address).startsWith('10.'))) {
        // local networks are not necessarily suspicious; placeholder
      }
      return { detected: false };
    } catch (e) {
      console.error('detectSecurityThreats error', e);
      return { detected: false };
    }
  },

  async createSecurityEvent({ logId, eventType, threatLevel, detectionRule, notes = null, correlation_id = null }) {
    try {
      const res = await db.query(`INSERT INTO security_events(log_id, event_type, threat_level, detection_rule, notes, correlation_id, created_at) VALUES($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`, [logId, eventType, threatLevel, detectionRule, notes, correlation_id]);
      return res.rows[0];
    } catch (e) {
      console.error('createSecurityEvent error', e);
      return null;
    }
  },

  async getActiveSecurityEvents() {
    try {
      const res = await db.query(`SELECT * FROM security_events WHERE false_positive = false AND (resolved_at IS NULL)`);
      return res.rows;
    } catch (e) {
      console.error('getActiveSecurityEvents error', e);
      return [];
    }
  },

  async getTimelineByCorrelation(correlationId) {
    try {
      const logs = await db.query('SELECT * FROM admin_logs WHERE correlation_id = $1 ORDER BY created_at ASC', [correlationId]);
      const events = await db.query('SELECT * FROM security_events WHERE correlation_id = $1 ORDER BY created_at ASC', [correlationId]);
      // merge timeline sorted by created_at
      const combined = [
        ...logs.rows.map(r => ({ type: 'log', payload: r, ts: new Date(r.created_at).getTime() })),
        ...events.rows.map(e => ({ type: 'event', payload: e, ts: new Date(e.created_at).getTime() }))
      ].sort((a, b) => a.ts - b.ts);
      return combined;
    } catch (e) {
      console.error('getTimelineByCorrelation error', e);
      return [];
    }
  },

  async getTrends({ from, to, bucket = 'day' } = {}) {
    try {
      // default to last 30 days if not specified
      const now = new Date();
      const toDate = to ? new Date(to) : now;
      const fromDate = from ? new Date(from) : new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      // bucket by day or hour
      const timeBucket = bucket === 'hour' ? `date_trunc('hour', created_at)` : `date_trunc('day', created_at)`;
      const logs = await db.query(`SELECT ${timeBucket} as period, severity, COUNT(*)::int as cnt FROM admin_logs WHERE created_at BETWEEN $1 AND $2 GROUP BY period, severity ORDER BY period ASC`, [fromDate.toISOString(), toDate.toISOString()]);
      // transform to series
      const map = {};
      logs.rows.forEach(r => {
        const k = r.period.toISOString();
        map[k] = map[k] || { period: k, bySeverity: {} };
        map[k].bySeverity[r.severity || 'info'] = r.cnt;
      });
      const items = Object.keys(map).sort().map(k => map[k]);
      return items;
    } catch (e) {
      console.error('getTrends error', e);
      return [];
    }
  },

  async resolveSecurityEvent(eventId, notes, resolverId) {
    try {
      const res = await db.query(`UPDATE security_events SET false_positive = FALSE, resolved_at = NOW(), resolved_by = $2, notes = COALESCE(notes || '\n', '') || $3 WHERE id = $1 RETURNING *`, [eventId, resolverId || null, notes || '']);
      return res.rows[0];
    } catch (e) {
      console.error('resolveSecurityEvent error', e);
      return null;
    }
  },

  async archiveOldLogs(retentionDays = 90) {
    try {
      await db.query(`SELECT admin_archive_old_logs($1)`, [retentionDays]);
    } catch (e) {
      console.error('archiveOldLogs error', e);
    }
  },

  async insertEnrichedLog(entry) {
    try {
      const correlation = entry.correlation_id || uuidv4();
      const res = await db.query(`INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, severity, category, ip_address, user_agent, session_id, correlation_id, risk_score, geo_location, metadata, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW()) RETURNING *`, [entry.admin_id || null, entry.action || null, entry.target_type || null, entry.target_id || null, entry.details ? JSON.stringify(entry.details) : null, entry.severity || 'info', entry.category || null, entry.ip_address || null, entry.user_agent || null, entry.session_id || null, correlation, entry.risk_score || 0, entry.geo_location || null, entry.metadata || null]);
      const row = res.rows[0];
      // emit to Socket.IO if present
      try {
        if (global.__ADMIN_IO__) {
          global.__ADMIN_IO__.to('logs-stream').emit('logs:new', row);
        }
      } catch (e) { console.error('emit logs:new failed', e); }
      // also notify SSE subscribers via server-side EventEmitter
      try {
        if (!global.logBus) {
          const { EventEmitter } = require('events');
          global.logBus = new EventEmitter();
        }
        global.logBus.emit('logs:new', row);
      } catch (e) { /* best-effort */ }
      return row;
    } catch (e) {
      console.error('insertEnrichedLog error', e);
      return null;
    }
  }
};
