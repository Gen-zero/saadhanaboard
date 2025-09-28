const path = require('path');
const fs = require('fs');
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  // sharp is a native dependency and may fail to install on some environments.
  // Fall back to null and make image functions no-ops so the server can start.
  console.warn('Optional dependency `sharp` is not available — image processing will be disabled.');
  sharp = null;
}
const { spawn } = require('child_process');

const mediaProcessingService = {
  async generateImageVariants(assetId, srcPath, outDir) {
    // srcPath: local path to source image
    // outDir: folder to write variants
    try {
      if (!sharp) {
        // No-op fallback: return an empty variant list so callers can continue.
        console.warn('generateImageVariants called but `sharp` is not available — returning empty variants.');
        return [];
      }

      const variants = [];
      const sizes = [{ name: 'thumb', width: 320 }, { name: 'small', width: 640 }, { name: 'large', width: 1200 }];
      for (const s of sizes) {
        const outFile = path.join(outDir, `${assetId}-${s.name}.jpg`);
        await sharp(srcPath).resize(s.width).jpeg({ quality: 75 }).toFile(outFile);
        const stat = fs.statSync(outFile);
        variants.push({ variant_type: s.name, file_path: outFile, file_size: stat.size });
      }
      return variants;
    } catch (e) {
      console.error('generateImageVariants error', e);
      throw e;
    }
  },

  async extractVideoThumbnail(srcPath, outPath, atSecond = 1) {
    // Placeholder: use ffmpeg via child_process or fluent-ffmpeg
    // For now, return a promise that rejects if ffmpeg not available
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-ss', String(atSecond), '-i', srcPath, '-frames:v', '1', '-q:v', '2', outPath]);
      ffmpeg.on('close', (code) => {
        if (code === 0) return resolve(outPath);
        reject(new Error(`ffmpeg exited ${code}`));
      });
      ffmpeg.on('error', (err) => reject(err));
    });
  },

  async processAudio(srcPath, outPath) {
    // TODO: implement audio conversion and metadata extraction
    return { path: outPath };
  },

  // TODO: queue integration, virus scanning, cloud storage adapters, error handling
};

module.exports = mediaProcessingService;
