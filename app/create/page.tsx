'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';
import { sanitizeText } from '../../utils/sanitize';
import { useAuth } from '../contexts/AuthContext';
import { PenLine, Plus, Trash2, Loader2, Eye } from 'lucide-react';

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
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const validOptions = options.filter((o) => o.trim() !== '');
  const hasDuplicates =
    validOptions.length !== new Set(validOptions.map((o) => o.trim().toLowerCase())).size;

  const createPoll = async () => {
    if (!question.trim() || validOptions.length < 2 || hasDuplicates) return;
    setLoading(true);
    setDuplicateError(false);
    setCreateError(null);
    const sanitizedQuestion = sanitizeText(question, MAX_QUESTION_LENGTH);
    const sanitizedDescription = sanitizeText(description, MAX_DESCRIPTION_LENGTH);
    const sanitizedOptions = validOptions.map((t) => sanitizeText(t, MAX_OPTION_LENGTH));

    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        question: sanitizedQuestion,
        description: sanitizedDescription || null,
        created_by: user?.id ?? null,
      })
      .select()
      .single();

    if (error || !poll) {
      setCreateError('Could not create poll. Please try again.');
      setLoading(false);
      return;
    }

    const { error: optionsError } = await supabase.from('options').insert(
      sanitizedOptions.map((text) => ({ poll_id: poll.id, text }))
    );

    if (optionsError) {
      if (user) await supabase.from('polls').delete().eq('id', poll.id);
      setCreateError('Could not save options. Please try again.');
      setLoading(false);
      return;
    }

    router.push(`/poll/${poll.id}`);
  };

  const charPercent = (question.length / MAX_QUESTION_LENGTH) * 100;
  const handleCreate = () => {
    if (hasDuplicates) setDuplicateError(true);
    else createPoll();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            <span className="gradient-text">Create your poll</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">Ask anything. Get instant results.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1 card p-6 sm:p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Start from template
              </label>
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
                    className="px-3 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent-muted)]/30 transition-colors text-[var(--color-text-primary)]"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Question
              </label>
              <textarea
                className="input-field resize-none min-h-[100px]"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_QUESTION_LENGTH) setQuestion(e.target.value);
                }}
                rows={3}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${
                    charPercent > 90 ? 'text-[var(--color-error)]' : charPercent > 70 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {question.length}/{MAX_QUESTION_LENGTH}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Description (optional)
              </label>
              <textarea
                className="input-field resize-none min-h-[60px]"
                placeholder="Add context or instructions..."
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) setDescription(e.target.value);
                }}
                rows={2}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Options
              </label>
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-muted)]/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--color-accent)]">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        className={`input-field ${
                          hasDuplicates &&
                          opt.trim() &&
                          validOptions.filter((o) => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1
                            ? '!border-[var(--color-error)]'
                            : ''
                        }`}
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, MAX_OPTION_LENGTH);
                          const n = [...options];
                          n[i] = val;
                          setOptions(n);
                          setDuplicateError(false);
                        }}
                      />
                      <div className="flex justify-between mt-0.5">
                        <span
                          className={`text-xs ${
                            hasDuplicates &&
                            opt.trim() &&
                            validOptions.filter((o) => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1
                              ? 'text-[var(--color-error)]'
                              : 'text-[var(--color-text-muted)]'
                          }`}
                        >
                          {hasDuplicates &&
                          opt.trim() &&
                          validOptions.filter((o) => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1
                            ? 'Duplicate option'
                            : ''}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {opt.length}/{MAX_OPTION_LENGTH}
                        </span>
                      </div>
                    </div>
                    {options.length > 2 && (
                      <button
                        onClick={() => setOptions(options.filter((_, j) => j !== i))}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-muted)] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {options.length < 10 && (
              <button
                onClick={() => setOptions([...options, ''])}
                className="w-full py-3 border border-dashed border-[var(--color-border-hover)] rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="w-4 h-4" />
                Add option
              </button>
            )}

            {duplicateError && (
              <p className="text-sm text-[var(--color-error)] mb-4">Please remove duplicate options.</p>
            )}

            {createError && (
              <p className="text-sm text-[var(--color-error)] mb-4">{createError}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={loading || !question.trim() || validOptions.length < 2 || hasDuplicates}
              className="btn-primary w-full !py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <PenLine className="w-4 h-4" />
                  <span>Create poll</span>
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="lg:w-[360px] flex-shrink-0">
            <div className="card-elevated p-6 sticky top-28">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-5">
                <Eye className="w-4 h-4 text-[var(--color-accent)]" />
                Live preview
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 min-h-[28px]">
                {question.trim() || (
                  <span className="text-[var(--color-text-muted)] font-normal italic">
                    Your question here...
                  </span>
                )}
              </h3>
              {description.trim() && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{description.trim()}</p>
              )}
              <div className="space-y-3">
                {options.map(
                  (opt, i) =>
                    opt.trim() && (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-base)] border border-[var(--color-border)]"
                      >
                        <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">0%</span>
                      </div>
                    )
                )}
                {validOptions.length === 0 && (
                  <div className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
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
