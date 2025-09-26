const express = require('express');
const path = require('path');
const { adminAuthenticate } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const SETTINGS = path.join(__dirname, '..', 'data', 'settings.json');

router.get('/settings', adminAuthenticate, (req, res) => {
  res.json({ settings: readJson(SETTINGS, { features: {}, timers: {} }) });
});

router.put('/settings', adminAuthenticate, (req, res) => {
  writeJson(SETTINGS, req.body);
  res.json({ message: 'Saved' });
});

// Simple CSV report
router.get('/reports/users.csv', adminAuthenticate, async (req, res) => {
  try {
    const db = require('../config/db');
    const q = await db.query('SELECT id, email, display_name, is_admin, created_at FROM users ORDER BY id DESC');
    const header = 'id,email,display_name,is_admin,created_at\n';
    const rows = q.rows.map(r => `${r.id},${r.email},${r.display_name},${r.is_admin},${r.created_at?.toISOString?.() || ''}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(header + rows);
  } catch (e) {
    res.status(500).send('id,email,display_name,is_admin,created_at');
  }
});

module.exports = router;


