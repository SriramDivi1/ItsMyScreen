-- Allow anonymous access to polls
CREATE POLICY "allow_anon_select_polls" ON public.polls FOR SELECT TO anon USING (true);
CREATE POLICY "allow_anon_insert_polls" ON public.polls FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous access to options
CREATE POLICY "allow_anon_select_options" ON public.options FOR SELECT TO anon USING (true);
CREATE POLICY "allow_anon_insert_options" ON public.options FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous access to votes
CREATE POLICY "allow_anon_select_votes" ON public.votes FOR SELECT TO anon USING (true);
CREATE POLICY "allow_anon_insert_votes" ON public.votes FOR INSERT TO anon WITH CHECK (true);
