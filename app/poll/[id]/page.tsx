
'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { Share2, CheckCircle2, Loader2, AlertCircle, Copy, Users, Zap } from 'lucide-react';
import Link from 'next/link';

type Option = {
    id: string;
    text: string;
    vote_count: number;
};

type Poll = {
    id: string;
    question: string;
    created_at: string;
};

const CONFETTI_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#7c3aed', '#8b5cf6'];

function ConfettiPiece({ index }: { index: number }) {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const size = 6 + Math.random() * 6;

    return (
        <div
            className="confetti-piece"
            style={{
                left: `${left}%`,
                top: '-10px',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                animationDelay: `${delay}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
        />
    );
}

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPollData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: pollData, error: pollError } = await supabase
                .from('polls')
                .select('*')
                .eq('id', id)
                .single();

            if (pollError) throw pollError;
            setPoll(pollData);

            const { data: optionsData, error: optionsError } = await supabase
                .from('options')
                .select('*')
                .eq('poll_id', id)
                .order('id', { ascending: true });

            if (optionsError) throw optionsError;
            setOptions(optionsData || []);
        } catch (err: any) {
            console.error('Error fetching poll:', err);
            setError(err.message || 'Failed to load poll');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const storedVote = localStorage.getItem(`poll_${id}_vote`);
        if (storedVote) {
            setVotedOptionId(storedVote);
        }

        fetchPollData();

        const channel = supabase
            .channel(`poll_${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'options',
                    filter: `poll_id=eq.${id}`,
                },
                (payload) => {
                    handleRealtimeUpdate(payload.new as Option);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, fetchPollData]);

    const handleRealtimeUpdate = (updatedOption: Option) => {
        setOptions((currentOptions) =>
            currentOptions.map((opt) =>
                opt.id === updatedOption.id ? { ...opt, vote_count: updatedOption.vote_count } : opt
            )
        );
    };

    const handleVote = async (optionId: string) => {
        if (votedOptionId || isVoting) return;

        setIsVoting(true);

        let voterToken = localStorage.getItem('voter_token');
        if (!voterToken) {
            voterToken = crypto.randomUUID();
            localStorage.setItem('voter_token', voterToken);
        }

        try {
            const { error } = await supabase.rpc('vote', {
                p_poll_id: id,
                p_option_id: optionId,
                p_voter_token: voterToken,
            });

            if (error) {
                if (error.message.includes('unique constraint') || error.code === '23505') {
                    showToast('You have already voted in this poll.');
                    setVotedOptionId(optionId);
                    localStorage.setItem(`poll_${id}_vote`, optionId);
                } else {
                    throw error;
                }
            } else {
                setVotedOptionId(optionId);
                localStorage.setItem(`poll_${id}_vote`, optionId);
                setShowConfetti(true);
                showToast('Vote submitted! 🎉');
                setTimeout(() => setShowConfetti(false), 2000);
            }
        } catch (err: any) {
            console.error('Error voting:', err);
            showToast('Failed to submit vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const getVotedOptionText = () => {
        if (!votedOptionId) return null;
        const option = options.find(o => o.id === votedOptionId);
        return option?.text || null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-neutral-400">Loading poll...</p>
            </div>
        );
    }

    if (error || !poll) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Poll not found</h1>
                <p className="text-neutral-400 mb-6">{error || "This poll doesn't exist or has been deleted."}</p>
                <Link href="/" className="px-6 py-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition">
                    Go Home
                </Link>
            </div>
        );
    }

    const totalVotes = options.reduce((sum, opt) => sum + opt.vote_count, 0);
    const maxVotes = Math.max(...options.map(o => o.vote_count), 1);
    const votedText = getVotedOptionText();

    return (
        <div className="min-h-screen text-white p-4 sm:p-8 flex flex-col items-center relative overflow-hidden">
            {/* Confetti */}
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <ConfettiPiece key={i} index={i} />
                    ))}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
                    <div className="px-5 py-3 bg-neutral-800 border border-neutral-700 rounded-full text-sm font-medium text-white shadow-2xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {toast}
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="animate-fade-in flex justify-between items-center mb-8">
                    <Link href="/" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-500/60" />
                        ItsMyScreen Polls
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchPollData}
                            className="p-2 rounded-full hover:bg-neutral-900 text-neutral-500 hover:text-white transition"
                            title="Refresh"
                        >
                            <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link href="/create" className="px-4 py-2 bg-neutral-900 rounded-full text-sm font-medium hover:bg-neutral-800 transition">
                            New Poll
                        </Link>
                    </div>
                </div>

                {/* Poll Card */}
                <div className="animate-fade-in-up bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{poll.question}</h1>

                    {/* Voters badge */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/80 text-xs font-medium text-neutral-400">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full animate-ping opacity-60"></span>
                                <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                            </span>
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} • Live
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {options.map((option, index) => {
                            const percent = totalVotes === 0 ? 0 : Math.round((option.vote_count / totalVotes) * 100);
                            const isVoted = votedOptionId === option.id;
                            const showResults = !!votedOptionId;
                            const isLeader = showResults && option.vote_count === maxVotes && totalVotes > 0;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleVote(option.id)}
                                    disabled={showResults || isVoting}
                                    className={`relative w-full text-left p-4 rounded-xl border transition-all overflow-hidden group
                                    ${showResults
                                            ? 'cursor-default border-transparent bg-neutral-800/50'
                                            : 'hover:border-indigo-500/50 hover:bg-neutral-800 cursor-pointer border-neutral-800 bg-neutral-900'
                                        }
                                    ${isVoted ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
                                `}
                                >
                                    {/* Progress Bar */}
                                    {showResults && (
                                        <div
                                            className={`absolute top-0 bottom-0 left-0 animate-bar-fill ${isVoted
                                                ? 'bg-indigo-900/40'
                                                : isLeader
                                                    ? 'bg-indigo-800/20'
                                                    : 'bg-neutral-700/30'
                                                }`}
                                            style={{
                                                width: `${percent}%`,
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                        />
                                    )}

                                    <div className="relative flex justify-between items-center z-10">
                                        <div className="flex items-center gap-3">
                                            {!showResults && (
                                                <span className="w-6 h-6 rounded-full border-2 border-neutral-700 group-hover:border-indigo-500 transition-colors flex items-center justify-center text-xs">
                                                    {isVoting ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : null}
                                                </span>
                                            )}
                                            <span className={`font-medium text-lg ${isVoted ? 'text-indigo-400' : 'text-neutral-200'}`}>
                                                {option.text}
                                            </span>
                                        </div>
                                        {showResults && (
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${isLeader ? 'text-indigo-400' : 'text-neutral-400'}`}>
                                                    {percent}%
                                                </span>
                                                <span className="text-xs text-neutral-500">({option.vote_count})</span>
                                                {isVoted && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Voted message */}
                    {votedText && (
                        <div className="animate-fade-in-up mt-4 text-sm text-neutral-500 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500/60" />
                            You voted for <span className="text-indigo-400 font-medium">&quot;{votedText}&quot;</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-neutral-500 text-sm">
                            <Users className="w-4 h-4" />
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} • Real-time updates active
                        </div>

                        <button
                            onClick={copyLink}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all active:scale-95"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            <span>{copied ? 'Copied!' : 'Share Poll'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
