#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.resolve(__dirname, '../src/themes');
const OUT_PATH = path.resolve(__dirname, '../backend/data/theme-registry.json');

function readIndex() {
  const idxPath = path.join(THEMES_DIR, 'index.ts');
  const src = fs.readFileSync(idxPath, 'utf8');
  // find imports like: import defaultTheme from './default';
  const importRegex = /import\s+(\w+)\s+from\s+'\.\/([\w-]+)';/g;
  const themes = [];
  let m;
  while ((m = importRegex.exec(src)) !== null) {
    themes.push(m[2]);
  }
  return themes;
}

function extractMetadataFromFile(themeName) {
  const candidates = [
    path.join(THEMES_DIR, `${themeName}.ts`),
    path.join(THEMES_DIR, themeName, 'index.ts'),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    // attempt to locate `metadata: { ... }` block
    const metaMatch = src.match(/metadata\s*:\s*\{([\s\S]*?)\}\s*,?/m);
    if (metaMatch) {
      const body = metaMatch[1];
      // crude transform to JSON: wrap keys in double quotes, convert single quotes to double, remove trailing commas
      let jsonish = '{' + body + '}';
      // remove newlines for easier processing
      jsonish = jsonish.replace(/\n/g, ' ');
      // replace single quotes with double
      jsonish = jsonish.replace(/'/g, '"');
      // quote unquoted keys
      jsonish = jsonish.replace(/([,{\s])(\w+)\s*:/g, '$1"$2":');
      // remove trailing commas before closing braces
      jsonish = jsonish.replace(/,\s*}/g, '}');
      try {
        const obj = JSON.parse(jsonish);
        return obj;
      } catch (e) {
        console.warn(`Failed to parse metadata for ${themeName}: ${e.message}`);
      }
    }
  }
  return null;
}

function buildManifest() {
  const themeNames = readIndex();
  const items = [];
  for (const name of themeNames) {
    const metadata = extractMetadataFromFile(name);
    if (metadata) {
      // include id and available if present
      items.push({ id: metadata.id || name, metadata });
    } else {
      console.warn('No metadata for', name);
    }
  }
  return items;
}

function ensureOutDir() {
  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const manifest = buildManifest();
  ensureOutDir();
  fs.writeFileSync(OUT_PATH, JSON.stringify({ themes: manifest }, null, 2), 'utf8');
  console.log('Wrote theme registry manifest to', OUT_PATH);
}

main();
