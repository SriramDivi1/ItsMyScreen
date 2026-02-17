-- Add created_by to link polls to authenticated users
alter table public.polls add column if not exists created_by uuid references auth.users(id) on delete set null;

-- Allow creators to delete their own polls (for orphan cleanup on create failure)
drop policy if exists "polls_delete_own" on public.polls;
create policy "polls_delete_own" on public.polls for delete using (auth.uid() = created_by);
