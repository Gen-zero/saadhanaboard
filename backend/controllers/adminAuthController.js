const adminAuthService = require('../services/adminAuthService');
const { setAdminCookie } = require('../middleware/adminAuth');
const os = require('os');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const admin = await adminAuthService.register({ username, email, password, created_by: req.user ? req.user.id : null });
    res.status(201).json({ admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
  } catch (err) {
    if (err.message === 'username_taken') return res.status(409).json({ error: 'username_taken' });
    res.status(500).json({ error: 'server_error', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    // support legacy payloads: { username, password } or { usernameOrEmail, password }
    const usernameOrEmail = req.body.usernameOrEmail || req.body.username || req.body.email || '';
    const password = req.body.password;
    const debug = { ip: req.ip || req.headers['x-forwarded-for'] || req.connection && req.connection.remoteAddress, ua: req.headers['user-agent'] || null, ts: new Date().toISOString() };
    console.log('[ADMIN LOGIN] attempt:', { usernameOrEmail, ...debug });
    const { token, admin } = await adminAuthService.login({ usernameOrEmail, password });
    // set cookie for legacy admin cookie-based auth
    try { setAdminCookie(res, token); } catch (e) { /* best-effort */ }
    // respond with token and admin info
    console.log('[ADMIN LOGIN] success:', { id: admin.id, username: admin.username });
    return res.json({ message: 'Login successful', token, admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
  } catch (err) {
    console.warn('[ADMIN LOGIN] failure:', err && err.message ? err.message : err);
    if (['invalid_credentials', 'account_inactive', 'account_locked'].includes(err.message)) {
      // if account_locked include details about remaining time if available
      if (err.message === 'account_locked' && err.details) {
        return res.status(401).json({ error: err.message, details: err.details });
      }
      return res.status(401).json({ error: err.message });
    }
    res.status(500).json({ error: 'server_error' });
  }
};

// authenticated route to check account status for a username/email
const accountStatus = async (req, res) => {
  try {
    const identifier = req.query.username || req.query.email || (req.body && req.body.username) || null;
    if (!identifier) return res.status(400).json({ error: 'missing_identifier' });
    const info = await adminAuthService.getAccountStatus(identifier);
    if (!info) return res.status(404).json({ error: 'not_found' });
    return res.json({ account: info });
  } catch (e) {
    console.error('accountStatus error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
};

module.exports = {
  register,
  login,
  accountStatus,
};
