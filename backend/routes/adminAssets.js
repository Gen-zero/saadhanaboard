const express = require('express');
const path = require('path');
const multer = require('multer');
const { adminAuthenticate } = require('../middleware/adminAuth');
const { ensureDir, readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'assets.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'admin');
ensureDir(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  res.json({ assets: list });
});

router.post('/', adminAuthenticate, upload.single('file'), (req, res) => {
  const list = readJson(STORE, []);
  const id = Date.now();
  const { title = '', type = 'image' } = req.body;
  const filePath = req.file ? `/uploads/admin/${req.file.filename}` : null;
  const item = { id, title, type, filePath, created_at: new Date().toISOString() };
  list.unshift(item);
  writeJson(STORE, list);
  res.json({ asset: item });
});

router.patch('/:id', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const id = Number(req.params.id);
  const idx = list.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  list[idx] = { ...list[idx], ...req.body, id };
  writeJson(STORE, list);
  res.json({ asset: list[idx] });
});

router.delete('/:id', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const id = Number(req.params.id);
  const filtered = list.filter(a => a.id !== id);
  writeJson(STORE, filtered);
  res.json({ message: 'Deleted' });
});

module.exports = router;


