export type PollTemplate = {
  id: string;
  label: string;
  question: string;
  description?: string;
  options: string[];
};

export const POLL_TEMPLATES: PollTemplate[] = [
  { id: 'yes-no', label: 'Yes / No', question: 'Do you agree?', options: ['Yes', 'No'] },
  { id: 'scale-5', label: '1–5 Scale', question: 'How would you rate this?', options: ['1', '2', '3', '4', '5'] },
  { id: 'simple-choice', label: 'Simple Choice', question: 'Which do you prefer?', options: ['Option A', 'Option B', 'Option C'] },
  { id: 'feedback', label: 'Feedback', question: 'How can we improve?', options: ['More features', 'Better UX', 'Faster performance', 'Other'] },
  { id: 'meeting-time', label: 'Meeting Time', question: 'When works best for our meeting?', options: ['Morning', 'Afternoon', 'Evening', 'Flexible'] },
  { id: 'topic-vote', label: 'Topic Vote', question: 'What should we discuss next?', options: ['Project update', 'New ideas', 'Q&A', 'Feedback session'] },
];

export function getTemplateById(id: string): PollTemplate | undefined {
  return POLL_TEMPLATES.find((t) => t.id === id);
}
