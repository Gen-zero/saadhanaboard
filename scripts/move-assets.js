import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This helper script moves and renames the Mahakali yantra image
// from the repository root icons/ to public/icons/ with kebab-case name.
// It will also attempt to create an optimized WebP alongside the PNG if
// the `sharp` library is available.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const srcPath = path.join(repoRoot, 'icons', 'Mahakali yantra.png');
const destDir = path.join(repoRoot, 'public', 'icons');
const destPath = path.join(destDir, 'mahakali-yantra.png');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function moveAndOptimize() {
  if (!fs.existsSync(srcPath)) {
    console.error('Source file not found:', srcPath);
    process.exitCode = 2;
    return;
  }

  ensureDir(destDir);

  try {
    // Move (rename) the file into public/icons
    fs.renameSync(srcPath, destPath);
    console.log('Moved', srcPath, '->', destPath);
  } catch (err) {
    // If rename fails (cross-device), fallback to copy + unlink
    fs.copyFileSync(srcPath, destPath);
    fs.unlinkSync(srcPath);
    console.log('Copied then removed', srcPath, '->', destPath);
  }

  // Optionally create a WebP using sharp if installed
  try {
    const { default: sharp } = await import('sharp').catch(() => ({ default: null }));
    if (sharp) {
      const webpPath = path.join(destDir, 'mahakali-yantra.webp');
      await sharp(destPath).webp({ quality: 85 }).toFile(webpPath);
      console.log('Generated WebP:', webpPath);
    } else {
      console.log('sharp not installed; skipping WebP generation');
    }
  } catch (e) {
    console.warn('WebP generation failed:', e && e.message ? e.message : e);
  }

  // If a duplicate JPEG exists at repo root, move it to an archive folder
  const jpegSrc = path.join(repoRoot, 'Mahakali_yantra.jpeg');
  if (fs.existsSync(jpegSrc)) {
    const archiveDir = path.join(repoRoot, 'public', 'icons', 'archive');
    ensureDir(archiveDir);
    const archived = path.join(archiveDir, 'Mahakali_yantra.jpeg');
    try {
      fs.renameSync(jpegSrc, archived);
      console.log('Archived JPEG:', archived);
    } catch (e) {
      console.warn('Failed to archive JPEG:', e && e.message ? e.message : e);
    }
  }
}

moveAndOptimize().catch((err) => {
  console.error('move-assets failed:', err);
  process.exitCode = 1;
});
