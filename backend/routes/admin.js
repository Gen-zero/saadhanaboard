const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { adminAuthenticate, setAdminCookie, ADMIN_COOKIE, logAdminAction } = require('../middleware/adminAuth');
const { setupAdminTables } = require('../utils/adminSetup');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Initialize admin tables on first load
setupAdminTables().catch(console.error);

// Admin login: hardcoded fallback + DB is_admin=true
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Hardcoded admin
    const hardcodedOk = username === 'KaliVaibhav' && password === 'Subham@98';
    let dbAdmin = null;
    if (!hardcodedOk) {
      const q = await db.query('SELECT id, email, display_name, is_admin, password FROM users WHERE (email=$1 OR display_name=$1) AND is_admin = true', [username]);
      if (q.rows.length) {
        dbAdmin = q.rows[0];
        // For simplicity now, accept plain password equality if present in DB, else fallback disabled.
        // In real setup, compare bcrypt hash.
        if (!dbAdmin.password || dbAdmin.password === password) {
          // ok
        } else {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      }
    }
    if (!hardcodedOk && !dbAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'admin', username, userId: dbAdmin ? dbAdmin.id : 0 }, JWT_SECRET, { expiresIn: '1h' });
    setAdminCookie(res, token);
    
    // Log successful login
    await logAdminAction(dbAdmin ? dbAdmin.id : 0, 'LOGIN', 'admin', dbAdmin ? dbAdmin.id : 0, { username, ip: req.ip });
    
    return res.json({ message: 'Login successful' });
  } catch (e) {
    console.error('Admin login error:', e);
    return res.status(500).json({ message: 'Login error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // Log logout action
    if (req.user) {
      await logAdminAction(req.user.id, 'LOGOUT', 'admin', req.user.id, { username: req.user.username });
    }
    res.clearCookie ? res.clearCookie(ADMIN_COOKIE) : null;
    return res.json({ message: 'Logged out' });
  } catch (e) {
    console.error('Logout error:', e);
    return res.status(500).json({ message: 'Logout error' });
  }
});

router.get('/me', adminAuthenticate, (req, res) => {
  return res.json({ user: req.user });
});

// Enhanced stats for dashboard
router.get('/stats', adminAuthenticate, async (req, res) => {
  try {
    const users = await db.query('SELECT COUNT(*)::int AS c FROM users');
    const activeUsers = await db.query('SELECT COUNT(*)::int AS c FROM users WHERE active = true');
    const activeSadhanas = await db.query('SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = $1', ['active']).catch(() => ({ rows:[{ c:0 }] }));
    const completedSadhanas = await db.query("SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = 'completed'").catch(() => ({ rows:[{ c:0 }] }));
    const books = await db.query('SELECT COUNT(*)::int AS c FROM books').catch(() => ({ rows:[{ c:0 }] }));
    const themes = await db.query('SELECT COUNT(*)::int AS c FROM themes').catch(() => ({ rows:[{ c:0 }] }));
    
    // Recent activity stats
    const recentLogins = await db.query(
      'SELECT COUNT(*)::int AS c FROM users WHERE last_login > NOW() - INTERVAL \'24 hours\''
    ).catch(() => ({ rows:[{ c:0 }] }));
    
    const todaysSadhanas = await db.query(
      'SELECT COUNT(*)::int AS c FROM sadhanas WHERE created_at > CURRENT_DATE'
    ).catch(() => ({ rows:[{ c:0 }] }));
    
    // Weekly activity data for charts
    const weeklyLogins = await db.query(`
      SELECT 
        DATE_TRUNC('day', last_login) as date,
        COUNT(*)::int as logins
      FROM users 
      WHERE last_login > NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', last_login)
      ORDER BY date
    `).catch(() => ({ rows: [] }));
    
    const weeklySadhanaCompletions = await db.query(`
      SELECT 
        DATE_TRUNC('day', updated_at) as date,
        COUNT(*)::int as completions
      FROM sadhanas 
      WHERE status = 'completed' AND updated_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', updated_at)
      ORDER BY date
    `).catch(() => ({ rows: [] }));
    
    return res.json({
      totalUsers: users.rows[0].c,
      activeUsers: activeUsers.rows[0].c,
      activeSadhanas: activeSadhanas.rows[0].c,
      completedSadhanas: completedSadhanas.rows[0].c,
      uploadedBooks: books.rows[0].c,
      currentThemes: themes.rows[0].c,
      recentLogins: recentLogins.rows[0].c,
      todaysSadhanas: todaysSadhanas.rows[0].c,
      weeklyLogins: weeklyLogins.rows,
      weeklySadhanaCompletions: weeklySadhanaCompletions.rows
    });
  } catch (e) {
    console.error('Stats error:', e);
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Users list + basic admin actions
router.get('/users', adminAuthenticate, async (req, res) => {
  const { q = '', limit = 20, offset = 0, status = 'all' } = req.query;
  const like = `%${q}%`;
  
  let whereClause = 'WHERE (email ILIKE $1 OR display_name ILIKE $1)';
  let params = [like, Number(limit), Number(offset)];
  
  if (status === 'active') {
    whereClause += ' AND active = true';
  } else if (status === 'inactive') {
    whereClause += ' AND active = false';
  } else if (status === 'admin') {
    whereClause += ' AND is_admin = true';
  }
  
  const r = await db.query(
    `SELECT id, email, display_name, is_admin, active, created_at, last_login, login_attempts FROM users ${whereClause} ORDER BY id DESC LIMIT $2 OFFSET $3`,
    params
  ).catch(() => ({ rows: [] }));
  
  // Get total count for pagination
  const countQuery = `SELECT COUNT(*)::int AS total FROM users ${whereClause.replace('LIMIT $2 OFFSET $3', '')}`;
  const countResult = await db.query(countQuery, [like]).catch(() => ({ rows: [{ total: 0 }] }));
  
  res.json({ 
    users: r.rows,
    total: countResult.rows[0].total,
    limit: Number(limit),
    offset: Number(offset)
  });
});

router.patch('/users/:id', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { display_name, email, active, is_admin } = req.body;
  try {
    await db.query('UPDATE users SET display_name=COALESCE($1, display_name), email=COALESCE($2, email), active=COALESCE($3, active), is_admin=COALESCE($4, is_admin) WHERE id=$5', [display_name, email, active, is_admin, id]);
    
    // Log user update action
    await req.logAdminAction(req.user.id, 'UPDATE_USER', 'user', id, { 
      updated_fields: { display_name, email, active, is_admin },
      admin: req.user.username 
    });
    
    res.json({ message: 'Updated' });
  } catch (e) {
    console.error('User update error:', e);
    res.status(400).json({ message: 'Update failed' });
  }
});

// Delete user (soft delete by setting inactive)
router.delete('/users/:id', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await db.query('UPDATE users SET active = false WHERE id = $1', [id]);
    
    // Log user deletion
    await req.logAdminAction(req.user.id, 'DELETE_USER', 'user', id, { 
      admin: req.user.username,
      action: 'soft_delete'
    });
    
    res.json({ message: 'User deactivated' });
  } catch (e) {
    console.error('User deletion error:', e);
    res.status(400).json({ message: 'Deletion failed' });
  }
});

// Get user details
router.get('/users/:id', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const userQuery = await db.query(
      'SELECT id, email, display_name, is_admin, active, created_at, last_login, login_attempts FROM users WHERE id = $1',
      [id]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's sadhanas
    const sadhanaQuery = await db.query(
      'SELECT id, title, status, created_at FROM sadhanas WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    ).catch(() => ({ rows: [] }));
    
    res.json({ 
      user: userQuery.rows[0],
      sadhanas: sadhanaQuery.rows
    });
  } catch (e) {
    console.error('User details error:', e);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Admin logs with filtering
router.get('/logs', adminAuthenticate, async (req, res) => {
  const { limit = 50, offset = 0, action = '', admin_id = '' } = req.query;
  
  let whereClause = '';
  let params = [];
  let paramIndex = 1;
  
  if (action) {
    whereClause = `WHERE action ILIKE $${paramIndex}`;
    params.push(`%${action}%`);
    paramIndex++;
  }
  
  if (admin_id) {
    whereClause += whereClause ? ` AND admin_id = $${paramIndex}` : `WHERE admin_id = $${paramIndex}`;
    params.push(Number(admin_id));
    paramIndex++;
  }
  
  params.push(Number(limit), Number(offset));
  
  const r = await db.query(
    `SELECT al.*, u.display_name as admin_name FROM admin_logs al 
     LEFT JOIN users u ON al.admin_id = u.id 
     ${whereClause} 
     ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    params
  ).catch(() => ({ rows: [] }));
  
  res.json({ logs: r.rows });
});

module.exports = router;


