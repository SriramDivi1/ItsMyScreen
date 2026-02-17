/** Trims and limits length before DB insert. */
export function sanitizeText(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}
