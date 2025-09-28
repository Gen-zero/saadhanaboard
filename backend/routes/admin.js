const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { adminAuthenticate, setAdminCookie, ADMIN_COOKIE, logAdminAction } = require('../middleware/adminAuth');
const { setupAdminTables } = require('../utils/adminSetup');

const router = express.Router();
// authentication handled by adminAuthController and admin_details table

// Initialize admin tables on first load
setupAdminTables().catch(console.error);

// Admin login: delegate to new adminAuthController to use admin_details table exclusively
const adminAuthController = require('../controllers/adminAuthController');
// Mount the admin auth controller login handler directly so it uses admin_details
router.post('/login', adminAuthController.login);

router.post('/logout', async (req, res) => {
  try {
    // Log logout action
    if (req.user) {
      if (typeof req.secureLog === 'function') {
        await req.secureLog('LOGOUT', 'admin', req.user.id, { username: req.user.username });
      } else {
        await logAdminAction(req.user.id, 'LOGOUT', 'admin', req.user.id, { username: req.user.username });
      }
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

// Enhanced stats for dashboard (legacy endpoint preserved)
const dashboardStatsService = require('../services/dashboardStatsService');
const userAnalyticsService = require('../services/userAnalyticsService');
const messageService = require('../services/messageService');

router.get('/stats', adminAuthenticate, async (req, res) => {
  try {
    const stats = await dashboardStatsService.getAllDashboardStats();
    // Provide legacy-compatible fields as before
    const legacy = {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      activeSadhanas: stats.activeSadhanas,
      completedSadhanas: stats.completedSadhanas,
      uploadedBooks: stats.uploadedBooks,
      currentThemes: stats.currentThemes,
      recentLogins: stats.weeklyLogins && stats.weeklyLogins.length ? stats.weeklyLogins.reduce((s, r) => s + (r.logins || 0), 0) : 0,
      todaysSadhanas: 0,
      weeklyLogins: stats.weeklyLogins || [],
      weeklySadhanaCompletions: stats.weeklySadhanaCompletions || []
    };
    return res.json(legacy);
  } catch (e) {
    console.error('Stats error:', e);
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Spiritual progress analytics
router.get('/stats/progress', adminAuthenticate, async (req, res) => {
  try {
    const trends = await dashboardStatsService.getWeeklyTrends();
    const engagement = await dashboardStatsService.getUserEngagement();
    res.json({ ...trends, ...engagement });
  } catch (e) {
    console.error('Progress stats error:', e);
    res.status(500).json({ message: 'Failed to fetch progress stats' });
  }
});

// System health metrics
router.get('/stats/health', adminAuthenticate, async (req, res) => {
  try {
    const health = await dashboardStatsService.getSystemHealth();
    res.json({ systemHealth: health });
  } catch (e) {
    console.error('Health stats error:', e);
    res.status(500).json({ message: 'Failed to fetch health stats' });
  }
});

// Realtime feed endpoint (HTTP fallback) - returns latest snapshot
router.get('/stats/realtime', adminAuthenticate, async (req, res) => {
  try {
    const snapshot = await dashboardStatsService.getAllDashboardStats();
    res.json({ snapshot });
  } catch (e) {
    console.error('Realtime stats error:', e);
    res.status(500).json({ message: 'Failed to fetch realtime stats' });
  }
});

// Users list + basic admin actions
router.get('/users', adminAuthenticate, async (req, res) => {
  try {
    const {
      q = '',
      limit = 20,
      offset = 0,
      status = 'all',
      experience_level,
      traditions,
      favorite_deity,
      onboarding_completed,
    } = req.query;

    // Build parameterized WHERE clauses to avoid SQL injection and JOIN profiles
    const params = [];
    let idx = 1;
  const where = [];

    if (q && String(q).trim().length > 0) {
      params.push(`%${String(q).trim()}%`);
      where.push(`(u.email ILIKE $${idx} OR u.display_name ILIKE $${idx})`);
      idx++;
    }

    if (status === 'active') {
      where.push('u.active = true');
    } else if (status === 'inactive') {
      where.push('u.active = false');
    } else if (status === 'admin') {
      where.push('u.is_admin = true');
    }

    // segmentation filters on profiles (profiles table joined as p)
    if (experience_level) {
      params.push(String(experience_level));
      where.push(`p.experience_level = $${idx}`);
      idx++;
    }

    if (traditions) {
      // traditions can be comma separated values
      const tArr = Array.isArray(traditions) ? traditions : String(traditions).split(',').map(s => s.trim()).filter(Boolean);
      if (tArr.length) {
        // We'll check overlap using ANY OR array containment via && with PG array
        // Pass as text[] using ARRAY[...] construct
          params.push(tArr);
          // Use WHERE traditions && $n::text[] (requires profiles.traditions to be a text[] in Postgres)
          where.push(`p.traditions && $${idx}::text[]`);
        idx++;
      }
    }

    if (favorite_deity) {
      params.push(String(favorite_deity));
      where.push(`p.favorite_deity = $${idx}`);
      idx++;
    }

    if (typeof onboarding_completed !== 'undefined') {
      const val = onboarding_completed === 'true' || onboarding_completed === true || onboarding_completed === '1';
      params.push(val);
      where.push(`p.onboarding_completed IS NOT DISTINCT FROM $${idx}`);
      idx++;
    }

    // Pagination params
    params.push(Number(limit));
    params.push(Number(offset));

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Select users with a LEFT JOIN to profiles and build a nested `profile` JSON object
    const selectSql = `SELECT u.id, u.email, u.display_name, u.is_admin, u.active, u.created_at, u.last_login, u.login_attempts,
      json_build_object(
        'experience_level', p.experience_level,
        'traditions', p.traditions,
        'onboarding_completed', p.onboarding_completed,
        'favorite_deity', p.favorite_deity
      ) AS profile
      FROM users u LEFT JOIN profiles p ON p.user_id = u.id ${whereSql} ORDER BY u.id DESC LIMIT $${idx} OFFSET $${idx + 1}`;

    // For count, use same where clause but count distinct users
    const countSql = `SELECT COUNT(DISTINCT u.id)::int AS total FROM users u LEFT JOIN profiles p ON p.user_id = u.id ${whereSql}`;

    const r = await db.query(selectSql, params).catch(() => ({ rows: [] }));
    const countResult = await db.query(countSql, params.slice(0, params.length - 2)).catch(() => ({ rows: [{ total: 0 }] }));

    return res.json({
      users: r.rows,
      total: countResult.rows[0].total || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (e) {
    console.error('Users list error:', e);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Mark a message as read
router.patch('/users/:id/messages/:messageId/read', adminAuthenticate, async (req, res) => {
  try {
    const messageId = Number(req.params.messageId);
    await messageService.markAsRead(messageId);
    return res.json({ message: 'Marked as read' });
  } catch (e) {
    console.error('Mark message as read error', e);
    return res.status(500).json({ message: 'Failed to mark message as read' });
  }
});

// Segmentation quick endpoint
router.get('/users/segment', adminAuthenticate, async (req, res) => {
  try {
    const filters = req.query || {};
    const rows = await userAnalyticsService.segmentUsers(filters);
    res.json({ users: rows });
  } catch (e) {
    console.error('User segment error', e);
    res.status(500).json({ message: 'Failed to segment users' });
  }
});

router.patch('/users/:id', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { display_name, email, active, is_admin } = req.body;
  try {
    await db.query('UPDATE users SET display_name=COALESCE($1, display_name), email=COALESCE($2, email), active=COALESCE($3, active), is_admin=COALESCE($4, is_admin) WHERE id=$5', [display_name, email, active, is_admin, id]);
    
    // Log user update action (use secureLog to auto-enrich)
    if (typeof req.secureLog === 'function') {
      await req.secureLog('UPDATE_USER', 'user', id, { 
        updated_fields: { display_name, email, active, is_admin },
        admin: req.user.username 
      }, { severity: is_admin ? 'warn' : 'info', category: is_admin ? 'security' : 'admin' });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'UPDATE_USER', 'user', id, { 
        updated_fields: { display_name, email, active, is_admin },
        admin: req.user.username 
      });
    }
    
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
    
    // Log user deletion (sensitive)
    if (typeof req.secureLog === 'function') {
      await req.secureLog('DELETE_USER', 'user', id, { 
        admin: req.user.username,
        action: 'soft_delete'
      }, { severity: 'warn', category: 'security' });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'DELETE_USER', 'user', id, { 
        admin: req.user.username,
        action: 'soft_delete'
      });
    }
    
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

    // get profile
    const profileQ = await db.query('SELECT * FROM profiles WHERE user_id = $1', [id]).catch(() => ({ rows: [] }));

    // analytics
    const progress = await userAnalyticsService.getUserProgress(id).catch(() => null);
    const analytics = await userAnalyticsService.getUserAnalytics(id).catch(() => null);

    // messages count
    const unread = await messageService.unreadCount(id).catch(() => 0);

    res.json({ 
      user: userQuery.rows[0],
      sadhanas: sadhanaQuery.rows,
      profile: profileQ.rows[0] || null,
      progress,
      analytics,
      unreadMessages: unread
    });
  } catch (e) {
    console.error('User details error:', e);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// user analytics endpoint
router.get('/users/:id/analytics', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const analytics = await userAnalyticsService.getUserAnalytics(id);
    res.json({ analytics });
  } catch (e) {
    console.error('User analytics error', e);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// user progress endpoint
router.get('/users/:id/progress', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const progress = await userAnalyticsService.getUserProgress(id);
    res.json({ progress });
  } catch (e) {
    console.error('User progress error', e);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// messages endpoints
router.get('/users/:id/messages', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  const { limit = 50, offset = 0 } = req.query;
  try {
    const msgs = await messageService.getMessagesForUser(id, Number(limit), Number(offset));
    res.json({ messages: msgs });
  } catch (e) {
    console.error('Get messages error', e);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

router.post('/users/:id/message', adminAuthenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const adminId = req.user && req.user.id ? req.user.id : 0;
    const { content } = req.body;
    const sent = await messageService.sendMessage(adminId, id, content);
    // Log action (use secureLog)
    if (typeof req.secureLog === 'function') {
      await req.secureLog('SEND_MESSAGE', 'message', id, { content: String(content).slice(0, 200) });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(adminId, 'SEND_MESSAGE', 'message', id, { content: String(content).slice(0, 200) });
    }
    res.json({ message: 'Sent', id: sent.id, created_at: sent.created_at });
  } catch (e) {
    console.error('Send message error', e);
    res.status(500).json({ message: 'Failed to send message' });
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


