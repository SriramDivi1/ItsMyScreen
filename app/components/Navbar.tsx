'use client';

import Link from 'next/link';
import { BarChart2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-base)]/95 backdrop-blur-md border-b border-[var(--color-border)] pt-[env(safe-area-inset-top,0)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            aria-label="ItsMyScreen home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              <span className="gradient-text">ItsMyScreen</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
