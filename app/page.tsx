'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { ArrowRight, Sparkles, Share2, BarChart3, Users, Clock, Zap } from 'lucide-react';

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

  const timeAgo = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen text-white selection:bg-violet-500/30">
      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
        <div className="orb orb-violet w-[500px] h-[500px] -top-40 -left-40 animate-float-slow" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-1/3 -right-32 animate-float" style={{ animationDelay: '3s' }} />
        <div className="orb orb-purple w-[350px] h-[350px] -bottom-20 left-1/3 animate-float-slow" style={{ animationDelay: '6s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-[var(--color-text-secondary)] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Free & Open Source — No sign-up needed</span>
          </div>
        </div>

        <h1 className="animate-fade-in-up stagger-1 text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6">
          <span className="gradient-text">Instant Polls.</span>
          <br />
          <span className="text-white">Real-time Results.</span>
        </h1>

        <p className="animate-fade-in-up stagger-2 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
          Create a poll in seconds, share the link, and watch votes
          roll in live. It&apos;s that simple.
        </p>

        <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/create" className="btn-gradient text-base !px-8 !py-3.5">
            <span>Create a Poll</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/polls" className="btn-secondary text-base !border-white/15 hover:!border-violet-400/50">
            Browse Polls
          </Link>
          <a
            href="https://github.com/SriramDivi1/ItsMyScreen"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base !border-white/15 hover:!border-violet-400/50"
            aria-label="View source code on GitHub"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Create polls in under 10 seconds. No accounts, no friction.' },
            { icon: BarChart3, title: 'Live Results', desc: 'Watch votes appear in real-time. Powered by Supabase Realtime.' },
            { icon: Users, title: 'Share Anywhere', desc: 'Copy the link and share it. Anyone can vote instantly.' },
          ].map((f, i) => (
            <div key={i} className={`animate-fade-in-up stagger-${i + 3} glass-card p-6 group`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                <f.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="animate-fade-in-up text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
          <p className="animate-fade-in-up stagger-1 text-[var(--color-text-secondary)]">Three steps to real-time feedback</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Sparkles, title: 'Create', desc: 'Type your question, add options, and hit create.' },
            { step: '02', icon: Share2, title: 'Share', desc: 'Copy the unique link and send it to your audience.' },
            { step: '03', icon: BarChart3, title: 'Watch', desc: 'See votes appear in real-time as people respond.' },
          ].map((s, i) => (
            <div key={i} className={`animate-fade-in-up stagger-${i + 2} relative gradient-border-card p-6 text-center`}>
              <div className="text-xs font-bold text-violet-400 tracking-widest mb-4">{s.step}</div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Polls */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="animate-fade-in-up text-3xl sm:text-4xl font-bold mb-3">Recent Polls</h2>
          <p className="animate-fade-in-up stagger-1 text-[var(--color-text-secondary)] mb-4">Join the conversation — vote on community polls</p>
          <Link href="/polls" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Browse all polls →
          </Link>
        </div>

        {loadingPolls ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-5 h-full animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-3 w-full" />
                <div className="h-4 bg-white/10 rounded mb-4 w-3/4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-white/10 rounded w-16" />
                  <div className="h-3 bg-white/10 rounded w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : recentPolls.length === 0 ? (
          <div className="text-center py-16 glass-card max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No polls yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Be the first to create a poll and get instant feedback.</p>
            <Link href="/create" className="btn-gradient inline-flex items-center gap-2 !py-3 !px-6">
              <span>Create Poll</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPolls.map((poll, i) => (
              <Link key={poll.id} href={`/poll/${poll.id}`}>
                <div className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)} glass-card p-5 group cursor-pointer h-full`}>
                  <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors line-clamp-2 mb-4">
                    {poll.question}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      {totalVotes(poll)} {totalVotes(poll) === 1 ? 'vote' : 'votes'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {timeAgo(poll.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
