
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Plus, Trash2, Loader2, Eye, Sparkles } from 'lucide-react';

export default function CreatePoll() {
    const router = useRouter();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const MAX_QUESTION_LENGTH = 200;

    const handleAddOption = () => {
        if (options.length >= 10) return;
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const validOptions = options.filter(o => o.trim() !== '');

    const createPoll = async () => {
        setError('');

        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }
        if (question.length > MAX_QUESTION_LENGTH) {
            setError(`Question must be ${MAX_QUESTION_LENGTH} characters or less`);
            return;
        }
        if (validOptions.length < 2) {
            setError('Please provide at least 2 valid options');
            return;
        }

        setLoading(true);

        try {
            const { data: poll, error: pollError } = await supabase
                .from('polls')
                .insert({ question })
                .select()
                .single();

            if (pollError) throw pollError;

            const optionsData = validOptions.map(text => ({
                poll_id: poll.id,
                text
            }));

            const { error: optionsError } = await supabase
                .from('options')
                .insert(optionsData);

            if (optionsError) throw optionsError;

            router.push(`/poll/${poll.id}`);
        } catch (err: any) {
            console.error('Error creating poll:', err);
            setError(err.message || 'Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                {/* Form Card */}
                <div className="animate-fade-in-up bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-bold">Create a Poll</h1>
                    </div>
                    <p className="text-neutral-400 mb-8 ml-[52px]">Ask a question and let the people decide.</p>

                    {error && (
                        <div className="animate-scale-in bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Question */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-neutral-400">Question</label>
                                <span className={`text-xs transition-colors ${question.length > MAX_QUESTION_LENGTH
                                    ? 'text-red-400'
                                    : question.length > MAX_QUESTION_LENGTH * 0.8
                                        ? 'text-amber-400'
                                        : 'text-neutral-600'
                                    }`}>
                                    {question.length}/{MAX_QUESTION_LENGTH}
                                </span>
                            </div>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., What's the best programming language?"
                                className="input-field text-lg"
                                autoFocus
                                maxLength={MAX_QUESTION_LENGTH + 10}
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-neutral-400">Options</label>
                                <span className="text-xs text-neutral-600">{validOptions.length} of {options.length} filled</span>
                            </div>
                            {options.map((option, index) => (
                                <div key={index} className="animate-fade-in-up flex gap-2 group">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-600 pointer-events-none">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                    {options.length > 2 && (
                                        <button
                                            onClick={() => handleRemoveOption(index)}
                                            className="p-3 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {options.length < 10 && (
                            <button
                                onClick={handleAddOption}
                                className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add another option
                            </button>
                        )}

                        <div className="pt-6 border-t border-neutral-800">
                            <button
                                onClick={createPoll}
                                disabled={loading || !question.trim() || validOptions.length < 2}
                                className="btn-primary w-full flex items-center justify-center font-bold text-lg rounded-xl py-4 hover:shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] transition-shadow"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Create Poll
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                {(question.trim() || validOptions.length > 0) && (
                    <div className="animate-fade-in-up mt-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4 text-neutral-500 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            Live Preview
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-white">
                            {question || <span className="text-neutral-600 italic">Your question will appear here…</span>}
                        </h3>
                        <div className="space-y-2.5">
                            {options.map((option, index) => (
                                option.trim() && (
                                    <div
                                        key={index}
                                        className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 text-sm"
                                    >
                                        <span className="text-xs font-bold text-neutral-600 mr-2">{String.fromCharCode(65 + index)}</span>
                                        {option}
                                    </div>
                                )
                            ))}
                        </div>
                        {validOptions.length > 0 && (
                            <p className="text-xs text-neutral-600 mt-4">0 votes • Real-time updates active</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
