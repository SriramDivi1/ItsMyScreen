'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, User } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = firstName.trim().slice(0, 50);
    const ln = lastName.trim().slice(0, 50);
    const em = email.trim();
    if (!fn || !ln || !em) return;

    setLoading(true);
    setError(null);

    const { data: authData, error: authErr } = await supabase.auth.signInAnonymously();

    if (authErr || !authData.user) {
      setError(authErr?.message || 'Could not sign in. Please try again.');
      setLoading(false);
      return;
    }

    const { error: insertErr } = await supabase.from('profiles').insert({
      id: authData.user.id,
      first_name: fn,
      last_name: ln,
      email: em,
    });

    if (insertErr) {
      await supabase.auth.signOut();
      setError(insertErr.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
            Get started
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Enter your name and email to continue.
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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
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
