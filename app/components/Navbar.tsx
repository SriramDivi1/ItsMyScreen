'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BarChart2, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

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

          <div className="flex items-center gap-2">
              {!loading && (
                user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen((o) => !o)}
                      className="flex items-center gap-2 btn-secondary text-sm !py-2 !px-4"
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                      aria-label="Account menu"
                    >
                      <span className="truncate max-w-[100px]">
                        {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-1 py-1 w-48 card shadow-lg">
                        <button
                          onClick={() => {
                            signOut();
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-base)] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="btn-primary text-sm !py-2 !px-5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in / Sign up</span>
                  </Link>
                )
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}
