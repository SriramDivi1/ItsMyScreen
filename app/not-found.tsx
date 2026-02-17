'use client';

import Link from 'next/link';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-violet-400" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">
        <span className="gradient-text">Page not found</span>
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="btn-gradient inline-flex items-center gap-2 !py-3 !px-6"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <button
          type="button"
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="btn-secondary inline-flex items-center gap-2 !py-3 !px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
