const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { adminAuthenticate, setAdminCookie, ADMIN_COOKIE } = require('../middleware/adminAuth');
const { adminLog } = require('../utils/adminLogger');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Admin login: hardcoded fallback + DB is_admin=true
router.post('/login', async (req, res) => {
  try {
    const rawUser = (req.body?.username || '').trim();
    const rawPass = (req.body?.password || '').trim();
    // Hardcoded admin (case-insensitive username, exact password)
    const hardcodedUsernames = ['KaliVaibhav', 'admin'];
    const hardcodedOk = hardcodedUsernames.some(u => u.toLowerCase() === rawUser.toLowerCase()) && rawPass === 'Subham@98';
    let dbAdmin = null;
    if (!hardcodedOk) {
      const q = await db.query('SELECT id, email, display_name, is_admin, password FROM users WHERE (email=$1 OR display_name=$1) AND is_admin = true', [rawUser]);
      if (q.rows.length) {
        dbAdmin = q.rows[0];
        if (!dbAdmin.password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const ok = await bcrypt.compare(rawPass, dbAdmin.password).catch(() => false);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      }
    }
    if (!hardcodedOk && !dbAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'admin', username: rawUser, userId: dbAdmin ? dbAdmin.id : 0 }, JWT_SECRET, { expiresIn: '1h' });
    setAdminCookie(res, token);
    adminLog({ admin_id: dbAdmin ? dbAdmin.id : null, action: 'ADMIN_LOGIN', target_type: 'admin', target_id: dbAdmin ? dbAdmin.id : null, details: { username: rawUser, mode: hardcodedOk ? 'hardcoded' : 'db' } });
    return res.json({ message: 'Login successful' });
  } catch (e) {
    return res.status(500).json({ message: 'Login error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie ? res.clearCookie(ADMIN_COOKIE) : null;
  return res.json({ message: 'Logged out' });
});

router.get('/me', adminAuthenticate, (req, res) => {
  return res.json({ user: req.user });
});

// Stats for dashboard
router.get('/stats', adminAuthenticate, async (req, res) => {
  try {
    const users = await db.query('SELECT COUNT(*)::int AS c FROM users');
    const activeSadhanas = await db.query('SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = $1', ['active']).catch(() => ({ rows:[{ c:0 }] }));
    const completedSadhanas = await db.query("SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = 'completed'").catch(() => ({ rows:[{ c:0 }] }));
    const books = await db.query('SELECT COUNT(*)::int AS c FROM books').catch(() => ({ rows:[{ c:0 }] }));
    const themes = await db.query('SELECT COUNT(*)::int AS c FROM themes').catch(() => ({ rows:[{ c:0 }] }));
    return res.json({
      totalUsers: users.rows[0].c,
      activeSadhanas: activeSadhanas.rows[0].c,
      completedSadhanas: completedSadhanas.rows[0].c,
      uploadedBooks: books.rows[0].c,
      currentThemes: themes.rows[0].c
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Users list + basic admin actions
router.get('/users', adminAuthenticate, async (req, res) => {
  const { q = '', limit = 20, offset = 0 } = req.query;
  const like = `%${q}%`;
  const r = await db.query(
    'SELECT id, email, display_name, is_admin, active FROM users WHERE email ILIKE $1 OR display_name ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
    [like, Number(limit), Number(offset)]
  ).catch(() => ({ rows: [] }));
  res.json({ users: r.rows });
});

router.patch('/users/:id', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { display_name, email, active, is_admin } = req.body;
  try {
    await db.query('UPDATE users SET display_name=COALESCE($1, display_name), email=COALESCE($2, email), active=COALESCE($3, active), is_admin=COALESCE($4, is_admin) WHERE id=$5', [display_name, email, active, is_admin, id]);
    adminLog({ admin_id: req.user?.id || null, action: 'UPDATE_USER', target_type: 'user', target_id: id, details: { display_name, email, active, is_admin } });
    res.json({ message: 'Updated' });
  } catch (e) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// Admin logs
router.get('/logs', adminAuthenticate, async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const r = await db.query('SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2').catch(() => ({ rows: [] }));
  res.json({ logs: r.rows });
});

module.exports = router;


