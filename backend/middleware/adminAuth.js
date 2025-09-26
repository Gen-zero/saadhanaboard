const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ADMIN_COOKIE = 'admin_token';

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function setAdminCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 60 * 60 * 1000
  });
}

// Admin logging function
async function logAdminAction(userId, action, targetType = null, targetId = null, details = null) {
  try {
    await db.query(
      'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, action, targetType, targetId, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

const adminAuthenticate = (req, res, next) => {
  try {
    const cookies = req.cookies || parseCookie(req.headers.cookie || '');
    const token = cookies[ADMIN_COOKIE];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = { id: decoded.userId || 0, role: decoded.role, username: decoded.username };
    req.logAdminAction = logAdminAction; // Add logging function to request
    
    // Refresh inactivity window by re-issuing cookie with new expiry
    const refreshed = jwt.sign({ username: decoded.username, role: 'admin', userId: decoded.userId || 0 }, JWT_SECRET, { expiresIn: '1h' });
    if (typeof res.cookie === 'function') {
      setAdminCookie(res, refreshed);
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { adminAuthenticate, setAdminCookie, ADMIN_COOKIE, logAdminAction };


