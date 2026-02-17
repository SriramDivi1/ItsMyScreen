'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { timeAgo } from '../utils/timeAgo';
import { ArrowRight, BarChart3, Zap, Users, Clock } from 'lucide-react';

type RecentPoll = {
  id: string;
  question: string;
  created_at: string;
  options: { vote_count: number }[];
};

export default function Home() {
  const [recentPolls, setRecentPolls] = useState<RecentPoll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const fetchRecentPolls = async () => {
    setLoadingPolls(true);
    const { data } = await supabase
      .from('polls')
      .select('id, question, created_at, options(vote_count)')
      .order('created_at', { ascending: false })
      .limit(6);
    if (data) setRecentPolls(data);
    setLoadingPolls(false);
  };

  useEffect(() => {
    const t = setTimeout(() => fetchRecentPolls(), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const totalVotes = (poll: RecentPoll) =>
    poll.options?.reduce((s, o) => s + o.vote_count, 0) ?? 0;

  return (
    <div className="min-h-screen text-[var(--color-text-primary)]">
      {/* Hero */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-muted)]/50 text-[var(--color-text-secondary)] text-sm mb-8">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Free · No sign-up · Real-time</span>
          </div>

          <h1 className="animate-fade-in-up stagger-1 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="gradient-text">Instant polls.</span>
            <br />
            <span className="text-[var(--color-text-primary)]">Live results.</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10">
            Create a poll in seconds, share the link, and watch votes roll in.
          </p>

          <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create" className="btn-primary text-[1rem] w-full sm:w-auto">
              <span>Create a poll</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/polls"
              className="btn-secondary text-[1rem] w-full sm:w-auto"
            >
              Browse polls
            </Link>
            <a
              href="https://github.com/SriramDivi1/ItsMyScreen"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-[1rem] w-full sm:w-auto"
              aria-label="View on GitHub"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning fast',
                desc: 'Create polls in under 10 seconds. No accounts or friction.',
              },
              {
                icon: BarChart3,
                title: 'Live results',
                desc: 'Votes appear in real-time. Powered by Supabase.',
              },
              {
                icon: Users,
                title: 'Share anywhere',
                desc: 'Copy the link and share. Anyone can vote instantly.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`animate-fade-in-up stagger-${i + 4} p-6 rounded-2xl bg-[var(--color-base)] border border-[var(--color-border)]`}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-muted)]/50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            How it works
          </h2>
          <p className="text-[var(--color-text-secondary)]">Three steps to real-time feedback</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create', desc: 'Type your question, add options, hit create.' },
            { step: '02', title: 'Share', desc: 'Copy the link and send it to your audience.' },
            { step: '03', title: 'Watch', desc: 'See votes appear in real-time.' },
          ].map((s, i) => (
            <div
              key={i}
              className={`animate-fade-in-up stagger-${i + 5} card p-6 text-center`}
            >
              <span className="text-xs font-bold text-[var(--color-accent)] tracking-wider mb-4 block">
                {s.step}
              </span>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent polls */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Recent polls
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Vote on community polls
            </p>
            <Link
              href="/polls"
              className="text-sm font-medium text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded"
            >
              Browse all polls →
            </Link>
          </div>

          {loadingPolls ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-[var(--color-border)] rounded mb-3 w-full" />
                  <div className="h-4 bg-[var(--color-border)] rounded mb-6 w-3/4" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-[var(--color-border)] rounded w-16" />
                    <div className="h-3 bg-[var(--color-border)] rounded w-14" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPolls.length === 0 ? (
            <div className="card p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-muted)]/50 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                No polls yet
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Be the first to create a poll and get instant feedback.
              </p>
              <Link href="/create" className="btn-primary inline-flex gap-2">
                <span>Create a poll</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPolls.map((poll, i) => (
                <Link key={poll.id} href={`/poll/${poll.id}`} className="group block">
                  <div
                    className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)} card p-6 h-full hover:border-[var(--color-accent)]/30 transition-colors cursor-pointer group-hover:border-[var(--color-accent)]/30`}
                  >
                    <h3 className="font-medium text-[var(--color-text-primary)] line-clamp-2 mb-4 group-hover:text-[var(--color-accent)] transition-colors">
                      {poll.question}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {totalVotes(poll)} {totalVotes(poll) === 1 ? 'vote' : 'votes'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {timeAgo(poll.created_at, now)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
