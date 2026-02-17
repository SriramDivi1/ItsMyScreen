'use client';

import { use, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../../utils/supabase';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  RefreshCw,
  Check,
  Share2,
  Users,
  AlertCircle,
  ChevronLeft,
  Download,
  Printer,
  QrCode,
} from 'lucide-react';

const Confetti = dynamic(() => import('../../components/Confetti'), { ssr: false });

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [poll, setPoll] = useState<{
    id: string;
    question: string;
    description?: string | null;
  } | null>(null);
  const [options, setOptions] = useState<{ id: string; text: string; vote_count: number }[]>([]);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pollUrl, setPollUrl] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== 'undefined') setPollUrl(window.location.href);
    }, 0);
    return () => clearTimeout(t);
  }, [id]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const getVoterToken = () => {
    let token = localStorage.getItem('voter_token');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('voter_token', token);
    }
    return token;
  };

  const fetchPollData = useCallback(async () => {
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .single();

    if (pollError || !pollData) {
      setError(pollError?.message || 'Poll not found');
      setLoading(false);
      return;
    }
    setPoll(pollData);

    const { data: optionsData } = await supabase
      .from('options')
      .select('*')
      .eq('poll_id', id)
      .order('id');
    if (optionsData) setOptions(optionsData);

    const token = getVoterToken();
    const { data: existingVote } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', id)
      .eq('voter_token', token)
      .maybeSingle();
    if (existingVote) setVotedOptionId(existingVote.option_id);

    setLoading(false);
  }, [id]);

  useEffect(() => {
    const t = setTimeout(() => fetchPollData(), 0);
    const channel = supabase
      .channel(`poll-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'options', filter: `poll_id=eq.${id}` },
        () => fetchPollData()
      )
      .subscribe();

    return () => {
      clearTimeout(t);
      supabase.removeChannel(channel);
    };
  }, [id, fetchPollData]);

  const handleVote = async (optionId: string) => {
    if (voting) return;
    if (votedOptionId === optionId) return;
    setVoting(true);
    const token = getVoterToken();

    if (votedOptionId) {
      const { error } = await supabase.rpc('change_vote', {
        p_poll_id: id,
        p_old_option_id: votedOptionId,
        p_new_option_id: optionId,
        p_voter_token: token,
      });
      if (!error) {
        setVotedOptionId(optionId);
        showToast('Vote updated!');
        fetchPollData();
      } else {
        showToast('Could not change vote. Try again.');
      }
    } else {
      const { error } = await supabase.rpc('vote', {
        p_poll_id: id,
        p_option_id: optionId,
        p_voter_token: token,
      });
      if (!error) {
        setVotedOptionId(optionId);
        setShowConfetti(true);
        showToast('Vote submitted!');
        setTimeout(() => setShowConfetti(false), 2500);
        fetchPollData();
      } else {
        showToast('Could not submit vote. Try again.');
      }
    }
    setVoting(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const header = ['Option', 'Votes', 'Percentage'];
    const rows = options.map((o) => [
      o.text,
      o.vote_count,
      totalVotes > 0 ? `${Math.round((o.vote_count / totalVotes) * 100)}%` : '0%',
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll-${id}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported!');
  };

  const totalVotes = options.reduce((s, o) => s + o.vote_count, 0);
  const maxVotes = Math.max(...options.map((o) => o.vote_count), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-24">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-error-muted)] flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Poll not found</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm">{error}</p>
        <Link href="/" className="btn-secondary">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center print:pt-4 print:pb-4">
      {showConfetti && <Confetti />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
          <div className="card px-5 py-3 flex items-center gap-2 text-sm font-medium shadow-lg">
            <Check className="w-4 h-4 text-[var(--color-success)]" />
            {toast}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPollData()}
              className="p-2 rounded-lg hover:bg-[var(--color-base)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              title="Refresh"
              aria-label="Refresh poll"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link href="/create" className="btn-secondary text-sm !py-2 !px-4">
              New poll
            </Link>
          </div>
        </div>

        <div className="gradient-border-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-3 print:text-black">
              {poll.question}
            </h1>
            {poll.description && (
              <p className="text-[var(--color-text-secondary)] mb-3 print:text-gray-600">
                {poll.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-success-muted)] text-[var(--color-success)] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} · Live
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {options.map((option) => {
              const percent = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
              const isVoted = votedOptionId === option.id;
              const isLeader = option.vote_count === maxVotes && option.vote_count > 0;
              const hasVoted = !!votedOptionId;

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={voting}
                  className={`w-full text-left rounded-xl p-4 transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                    isVoted
                      ? 'bg-[var(--color-accent-muted)]/30 border-[var(--color-accent)]/40'
                      : 'bg-[var(--color-base)] border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-muted)]/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!hasVoted ? (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                            voting ? 'border-[var(--color-border)]' : 'border-[var(--color-text-muted)]'
                          }`}
                        />
                      ) : isVoted ? (
                        <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--color-border)] flex-shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          isVoted
                            ? 'text-[var(--color-text-primary)]'
                            : isLeader && hasVoted
                              ? 'text-[var(--color-accent)]'
                              : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                    {hasVoted && (
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`font-semibold ${
                            isLeader ? 'gradient-text' : 'text-[var(--color-text-secondary)]'
                          }`}
                        >
                          {percent}%
                        </span>
                        <span className="text-[var(--color-text-muted)] text-xs">
                          ({option.vote_count})
                        </span>
                      </div>
                    )}
                  </div>
                  {hasVoted && (
                    <div className="mt-3 gradient-bar-track">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out animate-bar-fill ${
                          isLeader ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]' : 'bg-[var(--color-accent)]/40'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {votedOptionId && (
            <div className="text-sm text-[var(--color-accent)] flex items-center gap-2 mb-6">
              <Check className="w-4 h-4" />
              You voted for &ldquo;
              <span className="font-medium">
                {options.find((o) => o.id === votedOptionId)?.text}
              </span>
              &rdquo;
            </div>
          )}

          <div className="h-px bg-[var(--color-border)] mb-6" />

          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Users className="w-3.5 h-3.5" />
              {totalVotes} votes · Real-time
            </div>
            <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className={`btn-secondary !py-2 !px-4 text-sm ${showQr ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]/20' : ''}`}
            >
                <QrCode className="w-3.5 h-3.5" />
                QR
              </button>
              <button onClick={exportCsv} className="btn-secondary !py-2 !px-4 text-sm">
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button onClick={() => window.print()} className="btn-secondary !py-2 !px-4 text-sm">
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button onClick={copyLink} className="btn-secondary !py-2 !px-4 text-sm">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>

          {showQr && (
            <div className="mt-6 p-6 rounded-xl bg-[var(--color-base)] border border-[var(--color-border)] flex flex-col items-center gap-3">
              <p className="text-sm text-[var(--color-text-secondary)]">Scan to open</p>
              <div className="p-3 bg-white rounded-lg">
                <QRCodeSVG
                  value={pollUrl || `https://itsmyscreen-by-sriram.vercel.app/poll/${id}`}
                  size={140}
                  level="M"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
