'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', background: '#f8f6f2', color: '#1c1917', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: '#57534e', marginBottom: 24 }}>An unexpected error occurred.</p>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #c2410c, #ea580c)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
