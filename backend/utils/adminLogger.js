const db = require('../config/db');

async function adminLog({ admin_id, action, target_type, target_id, details }) {
  try {
    await db.query(
      'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details) VALUES ($1,$2,$3,$4,$5)',
      [admin_id, action, target_type, target_id, details || null]
    );
  } catch (e) {
    // swallow to not break request path
  }
}

module.exports = { adminLog };


