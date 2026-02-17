'use client';

import Link from 'next/link';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-24">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent-muted)]/50 flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-[var(--color-accent)]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
        Page not found
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Go home
        </Link>
        <button
          type="button"
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    </div>
  );
}
