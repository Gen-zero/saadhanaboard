const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const TOKEN_EXPIRES_IN = process.env.ADMIN_TOKEN_EXPIRES_IN || '7d';

const adminAuthService = {
  async register({ username, email, password, role, created_by = null }) {
    const existing = await Admin.findByUsername(username);
    if (existing) throw new Error('username_taken');
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, email, password_hash: hash, role, created_by });
    return admin;
  },

  async login({ usernameOrEmail, password }) {
    let admin = null;
    if (usernameOrEmail.includes('@')) {
      admin = await Admin.findByEmail(usernameOrEmail.toLowerCase());
    } else {
      admin = await Admin.findByUsername(usernameOrEmail);
    }
    if (!admin) throw new Error('invalid_credentials');
    if (!admin.active) throw new Error('account_inactive');
    // check locked_until
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      throw new Error('account_locked');
    }
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      await Admin.incrementLoginAttempts(admin.id);
      throw new Error('invalid_credentials');
    }
    await Admin.updateLastLogin(admin.id);
    const token = jwt.sign({ sub: admin.id, admin: true, role: admin.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    return { token, admin };
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.admin) throw new Error('invalid_token');
      return decoded;
    } catch (err) {
      throw new Error('invalid_token');
    }
  },

  async getAdminById(id) {
    return Admin.findById(id);
  }
};

module.exports = adminAuthService;
