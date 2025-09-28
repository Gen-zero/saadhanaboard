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
    // respond legacy-compatible
    console.log('[ADMIN LOGIN] success:', { id: admin.id, username: admin.username });
    return res.json({ message: 'Login successful', admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
  } catch (err) {
    console.warn('[ADMIN LOGIN] failure:', err && err.message ? err.message : err);
    if (['invalid_credentials', 'account_inactive', 'account_locked'].includes(err.message)) {
      return res.status(401).json({ error: err.message });
    }
    res.status(500).json({ error: 'server_error', details: err.message });
  }
};

module.exports = {
  register,
  login,
};
