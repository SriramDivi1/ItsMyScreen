'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, User } from 'lucide-react';

type Mode = 'signin' | 'signup';
type Step = 'form' | 'otp';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (cooldownUntil <= 0) return;
    const t = setInterval(() => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownUntil(0);
      }
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownUntil]);

  const resetForm = () => {
    setStep('form');
    setOtp('');
    setError(null);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (mode === 'signup' && (!firstName.trim() || !lastName.trim())) return;

    setLoading(true);
    setError(null);
    setCooldownUntil(Date.now() + 60000);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: mode === 'signup' },
    });
    setLoading(false);

    if (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes('rate limit') || msg.includes('limit exceeded')) {
        setError('Too many requests. Please wait about a minute before requesting another code.');
      } else {
        setError(err.message);
      }
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

    if (!data.user) return;

    if (mode === 'signup') {
      const { error: insertErr } = await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName.trim().slice(0, 50),
        last_name: lastName.trim().slice(0, 50),
      });
      if (insertErr) {
        setError(insertErr.message);
        return;
      }
      router.push('/');
      router.refresh();
      return;
    }

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
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    resetForm();
    setFirstName('');
    setLastName('');
    setEmail('');
    setOtp('');
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
          <div className="flex rounded-lg bg-[var(--color-base)] p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signin'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Sign up
            </button>
          </div>

          {step === 'form' ? (
            <>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                {mode === 'signin' ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                {mode === 'signin'
                  ? 'Enter your email to receive a one-time code.'
                  : 'Enter your name and email to get started.'}
              </p>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                {mode === 'signup' && (
                  <>
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
                  </>
                )}
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
                  <p className="text-sm text-[var(--color-error)]">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || cooldownUntil > Date.now()}
                  className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : cooldownUntil > Date.now() ? (
                    `Request again in ${Math.ceil((cooldownUntil - Date.now()) / 1000)}s`
                  ) : (
                    'Send code'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                Verify your email
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                    `Verify & ${mode === 'signin' ? 'Sign in' : 'Sign up'}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] w-full"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
