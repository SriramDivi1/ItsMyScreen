import { BarChart2, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom,0)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <BarChart2 className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Built with ❤️ By Sriram using Next.js & Supabase</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a
              href="https://github.com/SriramDivi1/ItsMyScreen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors duration-200"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-[var(--color-text-muted)]" aria-hidden="true">·</span>
            <span>© 2026 ItsMyScreen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
