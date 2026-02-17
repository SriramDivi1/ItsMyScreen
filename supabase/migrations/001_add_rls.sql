-- Row Level Security for ItsMyScreen
-- Run this after the main schema. Enables public read/write for polls (anonymous app).

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Polls: anyone can read and insert
DROP POLICY IF EXISTS "polls_select_all" ON public.polls;
CREATE POLICY "polls_select_all" ON public.polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "polls_insert_all" ON public.polls;
CREATE POLICY "polls_insert_all" ON public.polls FOR INSERT WITH CHECK (true);

-- Options: anyone can read and insert
DROP POLICY IF EXISTS "options_select_all" ON public.options;
CREATE POLICY "options_select_all" ON public.options FOR SELECT USING (true);

DROP POLICY IF EXISTS "options_insert_all" ON public.options;
CREATE POLICY "options_insert_all" ON public.options FOR INSERT WITH CHECK (true);

-- Votes: anyone can read (for checking existing vote) and insert (via RPC)
DROP POLICY IF EXISTS "votes_select_all" ON public.votes;
CREATE POLICY "votes_select_all" ON public.votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "votes_insert_all" ON public.votes;
CREATE POLICY "votes_insert_all" ON public.votes FOR INSERT WITH CHECK (true);
