
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { ArrowRight, BarChart3, Share2, Unlock, Zap, Users, MousePointerClick } from 'lucide-react';

type RecentPoll = {
  id: string;
  question: string;
  created_at: string;
  options: { vote_count: number }[];
};

export default function Home() {
  const [recentPolls, setRecentPolls] = useState<RecentPoll[]>([]);

  useEffect(() => {
    fetchRecentPolls();
  }, []);

  const fetchRecentPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('id, question, created_at, options(vote_count)')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setRecentPolls(data as RecentPoll[]);
      }
    } catch (err) {
      console.error('Error fetching recent polls:', err);
    }
  };

  const getTotalVotes = (poll: RecentPoll) =>
    poll.options?.reduce((sum, opt) => sum + opt.vote_count, 0) || 0;

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/15 rounded-full blur-[120px] animate-float stagger-3" />
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-violet-600/10 rounded-full blur-[100px] animate-float stagger-5" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <div className="animate-fade-in-up inline-flex items-center px-3 py-1 mb-8 text-sm font-medium text-indigo-300 border border-indigo-500/30 rounded-full bg-indigo-900/20 backdrop-blur-sm">
          <span className="relative flex w-2 h-2 mr-2">
            <span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full animate-ping opacity-75"></span>
            <span className="relative inline-flex w-2 h-2 bg-indigo-500 rounded-full"></span>
          </span>
          Live Real-time Polling
        </div>

        <h1 className="animate-fade-in-up stagger-1 text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-400 mb-6">
          Instant Polls. <br />
          <span className="text-indigo-500">Real-time Results.</span>
        </h1>

        <p className="animate-fade-in-up stagger-2 max-w-2xl mb-10 text-lg text-neutral-400 sm:text-xl leading-relaxed">
          Create a poll in seconds, share the link, and watch votes roll in live.
          No sign-up required. Fast, fair, and futuristic.
        </p>

        <div className="animate-fade-in-up stagger-3 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/create"
            className="group flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-indigo-600 rounded-full hover:bg-indigo-500 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] active:scale-95"
          >
            Create Poll
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com/sriramnaidu/poll-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all border border-neutral-700 rounded-full hover:bg-neutral-800 hover:border-neutral-600 active:scale-95"
          >
            View Code
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Unlock className="w-6 h-6 text-indigo-400" />}
            title="No Sign-up"
            description="Create polls instantly without accounts. Just create and share."
            delay="stagger-1"
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6 text-indigo-400" />}
            title="Instant Sharing"
            description="Get a unique link immediately. Share it anywhere to start collecting votes."
            delay="stagger-2"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
            title="Live Updates"
            description="Watch the results update in real-time as people vote. No refreshing."
            delay="stagger-3"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <h2 className="animate-fade-in-up text-3xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="animate-fade-in-up stagger-1 text-neutral-400 text-center mb-16 max-w-xl mx-auto">
          Three simple steps to get real-time feedback from anyone, anywhere.
        </p>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Connecting line (desktop) */}
          <div className="hidden sm:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-indigo-500/30 via-indigo-500/60 to-indigo-500/30" />

          <StepCard
            step={1}
            icon={<MousePointerClick className="w-6 h-6 text-indigo-400" />}
            title="Create"
            description="Type your question, add options, and hit create. It takes 10 seconds."
            delay="stagger-2"
          />
          <StepCard
            step={2}
            icon={<Share2 className="w-6 h-6 text-indigo-400" />}
            title="Share"
            description="Copy the unique poll link and share it with your audience."
            delay="stagger-3"
          />
          <StepCard
            step={3}
            icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
            title="Watch"
            description="See votes appear in real-time. Results update live for everyone."
            delay="stagger-4"
          />
        </div>
      </section>

      {/* Recent Polls */}
      {recentPolls.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
          <h2 className="animate-fade-in-up text-3xl font-bold text-center mb-4">
            Recent Polls
          </h2>
          <p className="animate-fade-in-up stagger-1 text-neutral-400 text-center mb-12 max-w-xl mx-auto">
            Join the conversation — vote on polls created by the community.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPolls.map((poll, i) => (
              <Link
                key={poll.id}
                href={`/poll/${poll.id}`}
                className={`animate-fade-in-up stagger-${Math.min(i + 2, 7)} card-hover group block p-5 border border-neutral-800 rounded-2xl bg-neutral-900/50 backdrop-blur-sm`}
              >
                <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {poll.question}
                </h3>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{getTotalVotes(poll)} votes</span>
                  </div>
                  <span>{getTimeAgo(poll.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div className={`animate-fade-in-up ${delay} card-hover p-6 border border-neutral-800 rounded-2xl bg-neutral-900/50 backdrop-blur-sm`}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  );
}

function StepCard({ step, icon, title, description, delay }: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div className={`animate-fade-in-up ${delay} text-center relative`}>
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 mx-auto">
        <div className="absolute inset-0 rounded-2xl bg-indigo-900/20 border border-indigo-500/20" />
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border-2 border-neutral-950">
          {step}
        </div>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
