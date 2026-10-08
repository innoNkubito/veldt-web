/**
 * Operator logo rules, shared by the owner's Team page and the admin editor.
 * The API checks the type again; size is only checked here (presigned PUTs
 * carry no size limit).
 */

export const LOGO_TYPES = ['image/png', 'image/svg+xml', 'image/webp'] as const
export const LOGO_ACCEPT = LOGO_TYPES.join(',')
export const MAX_LOGO_BYTES = 1024 * 1024

/** Null when the file can be used as a logo, otherwise what's wrong with it. */
export function logoFileError(file: File): string | null {
  if (!LOGO_TYPES.some((t) => t === file.type)) return 'The logo must be a PNG, SVG or WebP file.'
  if (file.size > MAX_LOGO_BYTES) return 'The logo must be 1 MB or smaller.'
  return null
}
