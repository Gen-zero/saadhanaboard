const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const cmsService = {
  async createAsset({ title, description, type, file_path, file_size, mime_type, metadata = {}, tags = [], category_id = null, created_by = null }) {
    const q = await db.query(
      `INSERT INTO cms_assets (title, description, type, file_path, file_size, mime_type, metadata, tags, category_id, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, description, type, file_path, file_size, mime_type, metadata, tags, category_id, created_by]
    );
    return q.rows[0];
  },

  async getAsset(id) {
    const q = await db.query('SELECT * FROM cms_assets WHERE id = $1', [id]);
    return q.rows[0] || null;
  },

  async listAssets({ q = '', limit = 20, offset = 0, tags = [] } = {}) {
    // basic search: title/description
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: count.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async createTheme(theme) {
    const q = await db.query('INSERT INTO cms_themes (name, deity, description, color_palette, css_variables, preview_image, status, version, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [theme.name, theme.deity, theme.description, theme.color_palette || {}, theme.css_variables || {}, theme.preview_image || null, theme.status || 'draft', theme.version || 1, theme.created_by || null]
    );
    return q.rows[0];
  },

  async listThemes({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async createTemplate(template) {
    const q = await db.query('INSERT INTO cms_templates (title, description, type, difficulty_level, duration_minutes, instructions, components, tags, category_id, status, version, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
      [template.title, template.description, template.type, template.difficulty_level, template.duration_minutes || null, template.instructions || [], template.components || [], template.tags || [], template.category_id || null, template.status || 'draft', template.version || 1, template.created_by || null]
    );
    return q.rows[0];
  },

  async listTemplates({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async insertVariants(assetId, variants = []) {
    if (!variants || !variants.length) return [];
    const values = [];
    const params = [];
    let idx = 1;
    for (const v of variants) {
      values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(assetId, v.variant_type, v.file_path, v.file_size || null);
    }
    const sql = `INSERT INTO cms_asset_variants (asset_id, variant_type, file_path, file_size) VALUES ${values.join(',')} RETURNING *`;
    const r = await db.query(sql, params);
    return r.rows;
  },

  async getVariantsForAsset(assetId) {
    const r = await db.query('SELECT * FROM cms_asset_variants WHERE asset_id = $1 ORDER BY id ASC', [assetId]);
    return r.rows || [];
  },

  // TODO: add update, publish, versioning, search, tag helpers, and migration helpers
};

module.exports = cmsService;
