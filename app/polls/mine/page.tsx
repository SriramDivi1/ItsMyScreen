'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowRight, Users, Clock, BarChart3 } from 'lucide-react';
import { timeAgo } from '../../../utils/timeAgo';

type Poll = {
  id: string;
  question: string;
  created_at: string;
  options: { vote_count: number }[];
};

export default function MyPollsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('polls')
        .select('id, question, created_at, options(vote_count)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      setPolls((data as Poll[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalVotes = (poll: Poll) =>
    poll.options?.reduce((s, o) => s + o.vote_count, 0) ?? 0;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            <span className="gradient-text">My polls</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Polls you&apos;ve created
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
        ) : polls.length === 0 ? (
          <div className="card p-12 text-center">
            <BarChart3 className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No polls yet
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Create your first poll to see it here.
            </p>
            <Link href="/create" className="btn-primary inline-flex gap-2">
              <span>Create poll</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {polls.map((poll) => (
              <Link key={poll.id} href={`/poll/${poll.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-xl">
                <div className="card p-6 h-full hover:border-[var(--color-accent)]/30 transition-colors cursor-pointer">
                  <h3 className="font-medium text-[var(--color-text-primary)] line-clamp-2 mb-4">
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
    </div>
  );
}
