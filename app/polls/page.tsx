'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';
import { ArrowRight, Search, Users, Clock, BarChart3 } from 'lucide-react';

type Poll = {
  id: string;
  question: string;
  created_at: string;
  options: { vote_count: number }[];
};

export default function BrowsePolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'votes'>('recent');
  const [now, setNow] = useState(() => Date.now());

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    const query = supabase.from('polls').select('id, question, created_at, options(vote_count)');

    if (search.trim()) {
      query.ilike('question', `%${search.trim()}%`);
    }

    query.order('created_at', { ascending: false });

    const { data } = await query.limit(50);
    let results = data ?? [];

    if (sort === 'votes') {
      results = [...results].sort((a, b) => {
        const votesA = a.options?.reduce((s, o) => s + o.vote_count, 0) ?? 0;
        const votesB = b.options?.reduce((s, o) => s + o.vote_count, 0) ?? 0;
        return votesB - votesA;
      });
    }

    setPolls(results);
    setLoading(false);
  }, [search, sort]);

  useEffect(() => {
    const id = setTimeout(() => fetchPolls(), 300);
    return () => clearTimeout(id);
  }, [fetchPolls]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const totalVotes = (poll: Poll) =>
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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            <span className="gradient-text">Browse polls</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Discover and vote on community polls
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search polls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
              aria-label="Search polls"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'recent' | 'votes')}
            className="input-field w-full sm:w-44"
            aria-label="Sort by"
          >
            <option value="recent">Most recent</option>
            <option value="votes">Most votes</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        ) : polls.length === 0 ? (
          <div className="card p-12 text-center">
            <BarChart3 className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              No polls found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {search ? 'Try a different search.' : 'Be the first to create a poll.'}
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
                      {timeAgo(poll.created_at)}
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
