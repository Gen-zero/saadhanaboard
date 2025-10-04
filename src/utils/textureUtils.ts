import * as THREE from 'three';

// Module-level cache as requested
const textureCache: Map<string, THREE.Texture> = new Map();

/** Basic small fallback texture when loads fail */
export function createFallbackTexture(color: string = '#7f7f7f'): THREE.Texture {
  const size = 2;
  const data = new Uint8Array(size * size * 4);
  const c = new THREE.Color(color);
  for (let i = 0; i < size * size; i++) {
    data[i * 4 + 0] = Math.floor(c.r * 255);
    data[i * 4 + 1] = Math.floor(c.g * 255);
    data[i * 4 + 2] = Math.floor(c.b * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Create a procedural glow texture via canvas */
export function createGlowTexture(baseColor: string = '#ff6b6b', size = 128): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(0.6, baseColor + '88');
  gradient.addColorStop(1, baseColor + '00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Preprocess a texture for yantra usage per the requested fields */
export function preprocessYantraImage(tex: THREE.Texture): THREE.Texture {
  // As requested in the verification comments
  // Note: colorSpace vs encoding differences across three versions; use the field suggested
  // Set both if available for compatibility
  try {
    // three r152+ uses colorSpace
    (tex as any).colorSpace = (THREE as any).SRGBColorSpace ?? undefined;
  } catch (e) {
    // ignore
  }
  // Backward compatible: assign to any to avoid TS property mismatch across versions
  (tex as any).encoding = (THREE as any).sRGBEncoding ?? (THREE as any).SRGBColorSpace ?? (tex as any).encoding;
  tex.flipY = false;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  // anisotropy needs a renderer to query; set a reasonable default if not available
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer: any = (globalThis as any).__THREE_RENDERER__;
    const max = renderer?.capabilities?.getMaxAnisotropy?.() ?? 8;
    tex.anisotropy = Math.min(16, max);
  } catch (e) {
    tex.anisotropy = Math.min(16, (tex as any).anisotropy || 1);
  }
  tex.needsUpdate = true;
  return tex;
}

/** Validate that a texture loaded correctly */
export function validateTextureLoading(tex?: THREE.Texture): boolean {
  if (!tex) return false;
  const img: any = (tex as any).image;
  if (!img) return false;
  const w = img.width ?? img.videoWidth ?? 0;
  const h = img.height ?? img.videoHeight ?? 0;
  return isFinite(w) && isFinite(h) && w > 1 && h > 1;
}

/** Dispose helper */
export function disposeTexture(tex?: THREE.Texture) {
  if (tex) {
    try {
      tex.dispose?.();
    } catch (e) {
      // ignore
    }
  }
}

/** Load an HTMLImageElement with CORS handling */
function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (ev) => reject(new Error('Image failed to load: ' + url));
    img.src = url;
  });
}

/** Load a centered square cropped texture client-side */
export async function loadCroppedTexture(url: string, size = 1024): Promise<THREE.Texture> {
  const img = await loadImageElement(url);
  const minSide = Math.min(img.width, img.height);
  const sx = Math.floor((img.width - minSide) / 2);
  const sy = Math.floor((img.height - minSide) / 2);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // draw centered square scaled to size
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  preprocessYantraImage(tex);
  return tex;
}

/** Wrap THREE.TextureLoader.loadAsync if available, otherwise fallback */
async function loadTextureAsync(url: string): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader();
  // three's loader has loadAsync in modern versions
  // @ts-ignore
  if (typeof (loader as any).loadAsync === 'function') {
    // @ts-ignore
    return (loader as any).loadAsync(url);
  }
  // fallback to manual Promise
  return new Promise((resolve, reject) => {
    loader.load(url, (t) => resolve(t), undefined, (err) => reject(err));
  });
}

/** Load yantra texture with cache, loadAsync, preprocess, and fallback */
export async function loadYantraTexture(path: string): Promise<THREE.Texture> {
  const key = path;
  if (textureCache.has(key)) return textureCache.get(key)!;
  try {
    const tex = await loadTextureAsync(path);
    preprocessYantraImage(tex);
    if (!validateTextureLoading(tex)) throw new Error('validation failed');
    textureCache.set(key, tex);
    return tex;
  } catch (e) {
    console.warn('loadYantraTexture failed for', path, e);
    const fb = createFallbackTexture('#222222');
    textureCache.set(key, fb);
    return fb;
  }
}

/** Specific loader for Mahakali yantra (uses cropped texture) */
export async function createMahakaliYantraTexture(): Promise<THREE.Texture> {
  const path = '/icons/mahakali-yantra.png';
  try {
    // try to load the cropped texture first
    const tex = await loadCroppedTexture(path, 1024);
    return tex;
  } catch (err) {
    console.warn('Failed to load cropped Mahakali yantra, trying direct load:', err);
    try {
      // fallback to direct load
      const tex = await loadYantraTexture(path);
      return tex;
    } catch (err2) {
      console.warn('Failed to load Mahakali yantra texture, using fallback:', err2);
      // create a procedural fallback texture
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Create a yantra-like pattern
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 256, 256);
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(128, 40);
      ctx.lineTo(210, 210);
      ctx.lineTo(46, 210);
      ctx.closePath();
      ctx.fill();
      
      const tex = new THREE.CanvasTexture(canvas);
      preprocessYantraImage(tex);
      textureCache.set(path, tex);
      return tex;
    }
  }
}

// export cache for debugging
export { textureCache };

/**
 * Backwards-compatible parchment fallback and displacement creators left out
 * to keep this file focused on yantra texture utilities. Use createFallbackTexture
 * above for fallback UI.
 */

/**
 * Create a procedural grayscale displacement map using a canvas.
 * Returns a THREE.Texture suitable for use as a displacementMap.
 */
export function createDisplacementMap(size = 256, intensity = 1): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imageData = ctx.createImageData(size, size);
  // Simple noise-based displacement
  for (let i = 0; i < size * size; i++) {
    // value between 0..255, use a softened random noise for gentle displacement
    const v = Math.floor((Math.random() * 0.5 + 0.25) * 255 * intensity);
    imageData.data[i * 4 + 0] = v;
    imageData.data[i * 4 + 1] = v;
    imageData.data[i * 4 + 2] = v;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
