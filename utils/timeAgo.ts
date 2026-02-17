/**
 * Returns a human-readable relative time string (e.g. "5m ago", "2h ago").
 * Uses `now` to allow for consistent rendering (pass Date.now() from state that updates periodically).
 */
export function timeAgo(dateStr: string, now: number = Date.now()): string {
  const ts = new Date(dateStr).getTime();
  if (Number.isNaN(ts)) return '';
  const diff = now - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
