'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import Link from 'next/link';
import { User, Loader2 } from 'lucide-react';

export default function AuthCompletePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      if (profile) {
        router.push('/');
        return;
      }
      setChecking(false);
    };
    check();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) return;
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Session expired. Please sign in again.');
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from('profiles').insert({
      id: user.id,
      first_name: fn.slice(0, 50),
      last_name: ln.slice(0, 50),
    });

    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    router.push('/');
    router.refresh();
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-8"
        >
          ← Back
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Complete your profile
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Tell us your name so we can personalize your experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                First name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.slice(0, 50))}
                  placeholder="First name"
                  className="input-field pl-12"
                  required
                  autoComplete="given-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Last name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.slice(0, 50))}
                  placeholder="Last name"
                  className="input-field pl-12"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !firstName.trim() || !lastName.trim()}
              className="btn-primary w-full"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
