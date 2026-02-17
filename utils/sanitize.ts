/**
 * Escapes HTML special characters to prevent XSS when rendering user content.
 * React escapes by default in JSX, but use this for any non-JSX contexts.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Trims and limits length. Use before inserting into DB for consistent validation.
 */
export function sanitizeText(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}
