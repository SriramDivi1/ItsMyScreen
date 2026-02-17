'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-24">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-error-muted)] flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-[var(--color-error)]" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
        Something went wrong
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <Link href="/" className="btn-secondary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
