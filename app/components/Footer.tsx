import { BarChart2, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <BarChart2 className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Built with Next.js & Supabase</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <a
              href="https://github.com/SriramDivi1/ItsMyScreen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-[var(--color-border)]">·</span>
            <span>© 2026 ItsMyScreen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
