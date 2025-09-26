const express = require('express');
const path = require('path');
const { adminAuthenticate } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'templates.json');

router.get('/', adminAuthenticate, (req, res) => {
  res.json({ templates: readJson(STORE, []) });
});

router.post('/', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const item = { id: Date.now(), ...req.body };
  list.unshift(item);
  writeJson(STORE, list);
  res.json({ template: item });
});

router.patch('/:id', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const id = Number(req.params.id);
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  list[idx] = { ...list[idx], ...req.body, id };
  writeJson(STORE, list);
  res.json({ template: list[idx] });
});

router.delete('/:id', adminAuthenticate, (req, res) => {
  const filtered = readJson(STORE, []).filter(t => t.id !== Number(req.params.id));
  writeJson(STORE, filtered);
  res.json({ message: 'Deleted' });
});

module.exports = router;


