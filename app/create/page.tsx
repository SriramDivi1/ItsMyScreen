'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { Sparkles, Plus, Trash2, Loader2, Eye } from 'lucide-react';

export default function CreatePoll() {
    const router = useRouter();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);

    const MAX_QUESTION_LENGTH = 200;
    const validOptions = options.filter(o => o.trim() !== '');

    const createPoll = async () => {
        if (!question.trim() || validOptions.length < 2) return;
        setLoading(true);
        const { data: poll, error } = await supabase
            .from('polls')
            .insert({ question: question.trim() })
            .select()
            .single();
        if (error || !poll) { setLoading(false); return; }
        await supabase.from('options').insert(
            validOptions.map(text => ({ poll_id: poll.id, text: text.trim() }))
        );
        router.push(`/poll/${poll.id}`);
    };

    const charPercent = (question.length / MAX_QUESTION_LENGTH) * 100;

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="animate-fade-in-up text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="gradient-text">Create Your Poll</span>
                        <Sparkles className="w-6 h-6 text-violet-400 inline-block ml-2 -mt-1" />
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Ask anything. Get instant results.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Form */}
                    <div className="animate-fade-in-up stagger-1 flex-1 glass-card p-6 sm:p-8">
                        {/* Question */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Question</label>
                            <textarea
                                className="input-field resize-none min-h-[100px]"
                                placeholder="What would you like to ask?"
                                value={question}
                                onChange={e => {
                                    if (e.target.value.length <= MAX_QUESTION_LENGTH) setQuestion(e.target.value);
                                }}
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <span className={`text-xs font-medium transition-colors ${charPercent > 90 ? 'text-red-400' :
                                        charPercent > 70 ? 'text-amber-400' :
                                            'text-[var(--color-text-muted)]'
                                    }`}>
                                    {question.length}/{MAX_QUESTION_LENGTH}
                                </span>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">Options</label>
                            <div className="space-y-3">
                                {options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-violet-400">
                                            {i + 1}
                                        </div>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={e => {
                                                const n = [...options];
                                                n[i] = e.target.value;
                                                setOptions(n);
                                            }}
                                        />
                                        {options.length > 2 && (
                                            <button
                                                onClick={() => setOptions(options.filter((_, j) => j !== i))}
                                                className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Option */}
                        {options.length < 10 && (
                            <button
                                onClick={() => setOptions([...options, ''])}
                                className="w-full py-3 border border-dashed border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-muted)] hover:text-violet-400 hover:border-violet-500/30 transition-all flex items-center justify-center gap-2 mb-6"
                            >
                                <Plus className="w-4 h-4" />
                                Add another option
                            </button>
                        )}

                        {/* Submit */}
                        <button
                            onClick={createPoll}
                            disabled={loading || !question.trim() || validOptions.length < 2}
                            className="btn-gradient w-full !py-3.5 text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Create Poll</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Live Preview */}
                    <div className="animate-fade-in-up stagger-2 lg:w-[380px] flex-shrink-0">
                        <div className="gradient-border-card p-6 sticky top-28">
                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-5">
                                <Eye className="w-4 h-4 text-violet-400" />
                                Live Preview
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-5 min-h-[28px]">
                                {question.trim() || <span className="text-[var(--color-text-muted)] italic font-normal">Your question here...</span>}
                            </h3>

                            <div className="space-y-3">
                                {options.map((opt, i) => (
                                    opt.trim() && (
                                        <div key={i} className="glass-card !rounded-xl p-3.5 flex items-center justify-between">
                                            <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
                                            <span className="text-xs text-[var(--color-text-muted)] ml-3">0%</span>
                                        </div>
                                    )
                                ))}
                                {validOptions.length === 0 && (
                                    <div className="text-center py-6 text-sm text-[var(--color-text-muted)]">
                                        Add options to see preview
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
