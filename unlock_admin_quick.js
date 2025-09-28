#!/usr/bin/env node
// Quick admin unlock tool (root-level convenience script)
// Usage: node unlock_admin_quick.js <username>
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const db = require(path.join(__dirname, 'backend', 'config', 'db'));

async function run() {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node unlock_admin_quick.js <username>');
    process.exit(2);
  }
  try {
    // find admin by username
    const q = 'SELECT id, username, login_attempts, locked_until FROM admin_details WHERE username = $1';
    const r = await db.query(q, [username]);
    if (!r || !r.rows || r.rows.length === 0) {
      console.error('Admin not found:', username);
      return process.exit(3);
    }
    const admin = r.rows[0];
    console.log('Current status -> username:', admin.username, 'locked_until:', admin.locked_until, 'login_attempts:', admin.login_attempts);
    if (!admin.locked_until || new Date(admin.locked_until) <= new Date()) {
      console.log('Account is not currently locked. No changes made.');
      return process.exit(0);
    }
    // perform unlock
    const up = await db.query('UPDATE admin_details SET locked_until = NULL, login_attempts = 0, updated_at = now() WHERE id = $1 RETURNING id, username, locked_until, login_attempts', [admin.id]);
    if (!up || !up.rows || up.rows.length === 0) {
      console.error('Failed to unlock account');
      return process.exit(4);
    }
    const updated = up.rows[0];
    console.log('Unlocked -> username:', updated.username, 'locked_until:', updated.locked_until, 'login_attempts:', updated.login_attempts);
    console.log('Done. Please attempt login or run backend/scripts/debug_admin_login.js to verify.');
    process.exit(0);
  } catch (err) {
    console.error('unlock_admin_quick error:', err && err.message ? err.message : err);
    process.exit(10);
  }
}

if (require.main === module) run();
