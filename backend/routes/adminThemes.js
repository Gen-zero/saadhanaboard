const express = require('express');
const path = require('path');
const { adminAuthenticate, logAdminAction } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'themes.json');

// Get themes with filtering
router.get('/', adminAuthenticate, (req, res) => {
  const { available = 'all' } = req.query;
  let themes = readJson(STORE, []);
  
  if (available === 'true') {
    themes = themes.filter(t => t.available === true);
  } else if (available === 'false') {
    themes = themes.filter(t => t.available === false);
  }
  
  res.json({ themes });
});

// Create theme with validation
router.post('/', adminAuthenticate, async (req, res) => {
  try {
    const { name, deity, available = true, colors = {} } = req.body;
    
    if (!name || !deity) {
      return res.status(400).json({ error: 'Name and deity are required' });
    }
    
    const list = readJson(STORE, []);
    
    // Check for duplicate name
    if (list.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ error: 'Theme with this name already exists' });
    }
    
    const item = { 
      id: Date.now(), 
      name, 
      deity, 
      available,
      colors: {
        primary: colors.primary || '#8B2A94',
        secondary: colors.secondary || '#4A1547',
        accent: colors.accent || '#E91E63'
      },
      created_at: new Date().toISOString(),
      created_by: req.user.id
    };
    
    list.unshift(item);
    writeJson(STORE, list);
    
    // Log theme creation
    await req.logAdminAction(req.user.id, 'CREATE_THEME', 'theme', item.id, {
      name: item.name,
      deity: item.deity
    });
    
    res.json({ theme: item });
  } catch (error) {
    console.error('Theme creation error:', error);
    res.status(500).json({ error: 'Failed to create theme' });
  }
});

// Update theme
router.patch('/:id', adminAuthenticate, async (req, res) => {
  try {
    const list = readJson(STORE, []);
    const id = Number(req.params.id);
    const idx = list.findIndex(t => t.id === id);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    const originalTheme = { ...list[idx] };
    list[idx] = { ...list[idx], ...req.body, id };
    
    writeJson(STORE, list);
    
    // Log theme update
    await req.logAdminAction(req.user.id, 'UPDATE_THEME', 'theme', id, {
      changes: req.body,
      original: originalTheme
    });
    
    res.json({ theme: list[idx] });
  } catch (error) {
    console.error('Theme update error:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

// Delete theme
router.delete('/:id', adminAuthenticate, async (req, res) => {
  try {
    const list = readJson(STORE, []);
    const id = Number(req.params.id);
    const theme = list.find(t => t.id === id);
    
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    const filtered = list.filter(t => t.id !== id);
    writeJson(STORE, filtered);
    
    // Log theme deletion
    await req.logAdminAction(req.user.id, 'DELETE_THEME', 'theme', id, {
      name: theme.name,
      deity: theme.deity
    });
    
    res.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Theme deletion error:', error);
    res.status(500).json({ error: 'Failed to delete theme' });
  }
});

// Preview theme
router.get('/:id/preview', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const theme = list.find(t => t.id === Number(req.params.id));
  
  if (!theme) {
    return res.status(404).json({ error: 'Theme not found' });
  }
  
  res.json({ 
    theme,
    preview: {
      css: `
        :root {
          --primary: ${theme.colors.primary};
          --secondary: ${theme.colors.secondary};
          --accent: ${theme.colors.accent};
        }
      `
    }
  });
});

module.exports = router;


