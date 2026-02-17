'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      if (profile) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/auth/complete');
        router.refresh();
      }
    }
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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Sign in
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Enter your email to receive a one-time code.
          </p>

          {step === 'email' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
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
              {error && (
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send code'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="input-field text-center text-lg tracking-[0.5em] font-mono"
                autoFocus
                autoComplete="one-time-code"
              />
              {error && (
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError(null);
                }}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] w-full"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
