/**
 * lib/storage.ts
 * Centralized utility for resolving asset URLs.
 * Points to Supabase Storage CDN for heavy media (downloads, videos, images),
 * with fallback to local assets.
 */

const SUPABASE_STORAGE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ||
  'https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/public/assets'

/**
 * Transforms an asset path into a high-speed CDN URL hosted on Supabase Storage.
 * Example:
 *   getAssetUrl('/downloads/Google DSA.pdf')
 *   -> "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/public/assets/downloads/Google%20DSA.pdf"
 */
export function getAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Strip leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Keep essential root icons local
  if (
    cleanPath.startsWith('favicon') ||
    cleanPath.startsWith('android-chrome') ||
    cleanPath.startsWith('apple-touch-icon') ||
    cleanPath === 'site.webmanifest'
  ) {
    return `/${cleanPath}`
  }

  // Encode URI components safely while preserving slashes
  const encodedPath = cleanPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${SUPABASE_STORAGE_URL}/${encodedPath}`
}
