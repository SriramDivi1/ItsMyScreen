'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Plus, Compass } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isCreatePage = pathname === '/create';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-base)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            aria-label="ItsMyScreen home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              <span className="gradient-text">ItsMyScreen</span>
            </span>
          </Link>

          {!isCreatePage && (
            <div className="flex items-center gap-2">
              <Link
                href="/polls"
                className="btn-secondary text-sm !py-2 !px-4"
              >
                <Compass className="w-4 h-4" />
                <span>Browse</span>
              </Link>
              <Link
                href="/create"
                className="btn-primary text-sm !py-2 !px-5"
              >
                <Plus className="w-4 h-4" />
                <span>Create poll</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
