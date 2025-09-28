const db = require('../config/db');

class Admin {
  constructor({ id, username, email, password_hash, role, active, last_login, login_attempts, locked_until, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.active = active;
    this.last_login = last_login;
    this.login_attempts = login_attempts || 0;
    this.locked_until = locked_until || null;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async findById(id) {
    const res = await db.query('SELECT * FROM admin_details WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return new Admin(res.rows[0]);
  }

  static async findByUsername(username) {
    const res = await db.query('SELECT * FROM admin_details WHERE username = $1', [username]);
    if (res.rows.length === 0) return null;
    return new Admin(res.rows[0]);
  }

  static async findByEmail(email) {
    const res = await db.query('SELECT * FROM admin_details WHERE email = $1', [email]);
    if (res.rows.length === 0) return null;
    return new Admin(res.rows[0]);
  }

  static async create({ username, email, password_hash, role = 'admin', active = true, created_by = null }) {
    const res = await db.query(
      `INSERT INTO admin_details (username, email, password_hash, role, active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, email, password_hash, role, active, created_by]
    );
    return new Admin(res.rows[0]);
  }

  static async updateLastLogin(id) {
    await db.query('UPDATE admin_details SET last_login = now(), login_attempts = 0 WHERE id = $1', [id]);
  }

  static async incrementLoginAttempts(id) {
    await db.query('UPDATE admin_details SET login_attempts = login_attempts + 1 WHERE id = $1', [id]);
  }

  static async lockUntil(id, until) {
    await db.query('UPDATE admin_details SET locked_until = $2 WHERE id = $1', [id, until]);
  }
}

module.exports = Admin;
