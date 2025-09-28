const db = require('../config/db');
const notificationService = require('./notificationService');
const logAnalytics = require('./logAnalyticsService');

// In-memory suppression cache (simple placeholder)
const recentAlerts = new Map();

module.exports = {
  async evaluateAlertRules(logEntry) {
    try {
      const res = await db.query(`SELECT * FROM log_alert_rules WHERE enabled = true`);
      const rules = res.rows || [];
      const triggered = [];
      for (const rule of rules) {
        const cond = rule.conditions || {};
        // simple example matching: if rule.conditions.matchAction and logEntry.action contains it
        if (cond.matchAction && logEntry.action && String(logEntry.action).includes(cond.matchAction)) {
          triggered.push({ rule, logEntry });
        }
        // TODO: evaluate more complex conditions
      }
      // trigger alerts for each unique rule
      for (const t of triggered) {
        try {
          // use t.rule (the matched rule) for severity threshold
          const sev = (t.rule && t.rule.severity_threshold) || 'warn';
          await this.triggerAlert(t.rule.id, logEntry, sev);
        } catch (e) { console.error('triggerAlert error', e); }
      }
      return triggered.length > 0;
    } catch (e) {
      console.error('evaluateAlertRules error', e);
      return false;
    }
  },

  async triggerAlert(ruleId, logEntry, severity = 'warn') {
    try {
      // suppression key
      const key = `${ruleId}:${logEntry.correlation_id || logEntry.ip_address || 'global'}`;
      const last = recentAlerts.get(key) || 0;
      const now = Date.now();
      if (now - last < (60 * 1000)) return; // suppress duplicates within 60s
      recentAlerts.set(key, now);

      // create security event
      const sev = await logAnalytics.createSecurityEvent({ logId: logEntry.id, eventType: 'alert_trigger', threatLevel: severity, detectionRule: String(ruleId) });

      // notify channels: for now broadcast via Socket.IO if server attaches global io
      if (global.__ADMIN_IO__) {
        try { global.__ADMIN_IO__.to('admins').emit('security:alert', { event: sev, log: logEntry }); } catch (e) { console.error('socket emit failed', e); }
      }

      // send notifications via configured channels (placeholder)
      // load rule channels
      const r = await db.query('SELECT notification_channels FROM log_alert_rules WHERE id = $1', [ruleId]).catch(() => null);
      const channels = (r && r.rows && r.rows[0] && r.rows[0].notification_channels) || [];
      for (const ch of channels) {
        try {
          if (ch.type === 'email') {
            await notificationService.sendEmailAlert(ch.recipients || [], { ruleId, logEntry, severity });
          } else if (ch.type === 'webhook') {
            await notificationService.sendWebhookAlert(ch.url, { ruleId, logEntry, severity });
          }
        } catch (e) { console.error('notify channel failed', e); }
      }

    } catch (e) {
      console.error('triggerAlert error', e);
    }
  },

  async createAlertRule(ruleName, conditions, channels = [], createdBy = null) {
    try {
      const res = await db.query(`INSERT INTO log_alert_rules(rule_name, conditions, notification_channels, created_by) VALUES($1,$2,$3,$4) RETURNING *`, [ruleName, conditions, channels, createdBy]);
      return res.rows[0];
    } catch (e) {
      console.error('createAlertRule error', e);
      return null;
    }
  },

  async listAlertRules() {
    try {
      const res = await db.query('SELECT * FROM log_alert_rules ORDER BY id DESC');
      return res.rows;
    } catch (e) {
      console.error('listAlertRules error', e);
      return [];
    }
  }
};
