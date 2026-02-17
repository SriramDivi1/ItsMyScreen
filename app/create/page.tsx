'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { Sparkles, Plus, Trash2, Loader2, Eye } from 'lucide-react';

const MAX_QUESTION_LENGTH = 200;
const MAX_OPTION_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

const POLL_TEMPLATES = [
  { label: 'Yes / No', question: 'Do you agree?', options: ['Yes', 'No'] },
  { label: '1–5 Scale', question: 'How would you rate this?', options: ['1', '2', '3', '4', '5'] },
  { label: 'Simple Choice', question: 'Which do you prefer?', options: ['Option A', 'Option B', 'Option C'] },
  { label: 'Feedback', question: 'How can we improve?', options: ['More features', 'Better UX', 'Faster performance', 'Other'] },
];

export default function CreatePoll() {
    const router = useRouter();
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);

    const validOptions = options.filter(o => o.trim() !== '');
    const hasDuplicates = validOptions.length !== new Set(validOptions.map(o => o.trim().toLowerCase())).size;

    const createPoll = async () => {
        if (!question.trim() || validOptions.length < 2 || hasDuplicates) return;
        setLoading(true);
        setDuplicateError(false);
        const { data: poll, error } = await supabase
            .from('polls')
            .insert({ question: question.trim(), description: description.trim() || null })
            .select()
            .single();
        if (error || !poll) { setLoading(false); return; }
        await supabase.from('options').insert(
            validOptions.map(text => ({ poll_id: poll.id, text: text.trim() }))
        );
        router.push(`/poll/${poll.id}`);
    };

    const charPercent = (question.length / MAX_QUESTION_LENGTH) * 100;
    const handleCreate = () => {
        if (hasDuplicates) setDuplicateError(true);
        else createPoll();
    };

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
                        {/* Templates */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Start from template</label>
                            <div className="flex flex-wrap gap-2">
                                {POLL_TEMPLATES.map((t) => (
                                    <button
                                        key={t.label}
                                        type="button"
                                        onClick={() => {
                                            setQuestion(t.question);
                                            setOptions([...t.options, '']);
                                            setDescription('');
                                        }}
                                        className="px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.05] border border-[var(--color-border)] hover:border-violet-500/30 hover:bg-violet-500/10 transition-all"
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

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

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Description (optional)</label>
                            <textarea
                                className="input-field resize-none min-h-[60px]"
                                placeholder="Add context or instructions..."
                                value={description}
                                onChange={e => {
                                    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) setDescription(e.target.value);
                                }}
                                rows={2}
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-xs text-[var(--color-text-muted)]">{description.length}/{MAX_DESCRIPTION_LENGTH}</span>
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
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                className={`input-field w-full ${hasDuplicates && opt.trim() && validOptions.filter(o => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1 ? 'border-red-500/50' : ''}`}
                                                placeholder={`Option ${i + 1}`}
                                                value={opt}
                                                onChange={e => {
                                                    const val = e.target.value.slice(0, MAX_OPTION_LENGTH);
                                                    const n = [...options];
                                                    n[i] = val;
                                                    setOptions(n);
                                                    setDuplicateError(false);
                                                }}
                                            />
                                            <div className="flex justify-between mt-0.5">
                                                <span className={`text-xs ${hasDuplicates && opt.trim() && validOptions.filter(o => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1 ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}>
                                                    {hasDuplicates && opt.trim() && validOptions.filter(o => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1 ? 'Duplicate option' : ''}
                                                </span>
                                                <span className="text-xs text-[var(--color-text-muted)]">{opt.length}/{MAX_OPTION_LENGTH}</span>
                                            </div>
                                        </div>
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

                        {duplicateError && (
                            <p className="text-sm text-red-400 mb-4">Please remove duplicate options before creating.</p>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleCreate}
                            disabled={loading || !question.trim() || validOptions.length < 2 || hasDuplicates}
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

                            <h3 className="text-lg font-semibold text-white mb-2 min-h-[28px]">
                                {question.trim() || <span className="text-[var(--color-text-muted)] italic font-normal">Your question here...</span>}
                            </h3>
                            {description.trim() && (
                                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{description.trim()}</p>
                            )}

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
