const db = require('../config/db');

// NOTE: Scheduling/execution of reminders should use a background job queue (Redis/Bull or similar).
// Here we only provide CRUD for reminder templates and a simple in-memory scheduler placeholder.

let inMemoryTimers = {};

module.exports = {
  async listTemplates({ limit = 50, offset = 0 } = {}) {
    const res = await db.query(`SELECT * FROM admin_reminder_templates ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getTemplate(id) {
    const res = await db.query(`SELECT * FROM admin_reminder_templates WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },
  async createTemplate({ key, title = '', body = '', schedule_cron = null, channel_ids = [], enabled = true, metadata = {} }) {
    const res = await db.query(`INSERT INTO admin_reminder_templates(key,title,body,schedule_cron,channel_ids,enabled,metadata) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [key, title, body, schedule_cron, channel_ids, enabled, metadata]);
    // TODO: schedule the template using a job queue
    return res.rows[0];
  },
  async updateTemplate(id, patch) {
    const keys = [], values = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); values.push(patch[k]); }
    if (!keys.length) return this.getTemplate(id);
    values.push(id);
    const res = await db.query(`UPDATE admin_reminder_templates SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return res.rows[0];
  },
  async deleteTemplate(id) { await db.query(`DELETE FROM admin_reminder_templates WHERE id = $1`, [id]); return { ok: true }; }
};
