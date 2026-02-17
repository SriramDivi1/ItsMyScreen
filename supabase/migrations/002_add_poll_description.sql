-- Add optional description to polls
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS description text;
