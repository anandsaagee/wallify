/**
 * Cloudinary Image URL Utility
 * 
 * Transforms local image paths (e.g. "/assets/anime/anime-001.webp")
 * into Cloudinary CDN URLs with automatic optimization.
 * 
 * UPDATE: Set your Cloudinary cloud name below after signup.
 */

// ⚠️ REPLACE THIS with your actual Cloudinary cloud name from https://cloudinary.com/console
const CLOUDINARY_CLOUD_NAME = 'dkwx4bacj';

const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Folder prefix used during upload (matches the upload script)
const UPLOAD_FOLDER = 'wallify';

interface ImageOptions {
  /** Desired display width in pixels — Cloudinary will resize server-side */
  width?: number;
  /** Quality: 'auto' (recommended), or a number 1-100 */
  quality?: number | 'auto';
  /** Format: 'auto' serves AVIF/WebP based on browser support */
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Convert a local asset path to a Cloudinary delivery URL.
 *
 * @example
 *   getImageUrl('/assets/anime/anime-001.webp')
 *   // → "https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/wallify/assets/anime/anime-001.webp"
 *
 *   getImageUrl('/assets/anime/anime-001.webp', { width: 400 })
 *   // → "https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_400/wallify/assets/anime/anime-001.webp"
 */
export function getImageUrl(localPath: string, options?: ImageOptions): string {
  // If the path is already a full URL (http/https), return as-is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath;
  }

  // If it's a data URI (fallback images), return as-is
  if (localPath.startsWith('data:')) {
    return localPath;
  }

  // Build transformation string
  const format = options?.format ?? 'auto';
  const quality = options?.quality ?? 'auto';
  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (options?.width) {
    transforms.push(`w_${options.width}`);
  }

  const transformString = transforms.join(',');

  // Strip leading slash from the local path
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;

  return `${CLOUDINARY_BASE}/${transformString}/${UPLOAD_FOLDER}/${cleanPath}`;
}

/**
 * Get a thumbnail URL (400px wide, auto quality)
 * Use for product grid cards
 */
export function getThumbnailUrl(localPath: string): string {
  return getImageUrl(localPath, { width: 400 });
}

/**
 * Get a preview URL (800px wide, auto quality)
 * Use for product preview / bottom sheet
 */
export function getPreviewUrl(localPath: string): string {
  return getImageUrl(localPath, { width: 800 });
}

/**
 * Get a hero URL (1200px wide, high quality)
 * Use for hero section / featured banners
 */
export function getHeroUrl(localPath: string): string {
  return getImageUrl(localPath, { width: 1200 });
}
