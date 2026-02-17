-- Create tables
create table if not exists public.polls (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.options (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  text text not null,
  vote_count bigint default 0 not null
);

create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  option_id uuid references public.options(id) on delete cascade not null,
  voter_token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(poll_id, voter_token)
);

-- Realtime (ignore if tables already in publication)
do $$
begin
  alter publication supabase_realtime add table public.polls;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.options;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.votes;
exception when duplicate_object then null;
end $$;

-- RPC for atomic voting (validates option belongs to poll)
create or replace function vote(p_poll_id uuid, p_option_id uuid, p_voter_token text)
returns void as $$
begin
  if not exists (
    select 1 from public.options
    where id = p_option_id and poll_id = p_poll_id
  ) then
    raise exception 'option does not belong to poll';
  end if;

  insert into public.votes (poll_id, option_id, voter_token)
  values (p_poll_id, p_option_id, p_voter_token);

  update public.options
  set vote_count = vote_count + 1
  where id = p_option_id;
end;
$$ language plpgsql;

-- RPC to change vote (validates options belong to poll)
create or replace function change_vote(p_poll_id uuid, p_old_option_id uuid, p_new_option_id uuid, p_voter_token text)
returns void as $$
begin
  if not exists (
    select 1 from public.options
    where id = p_old_option_id and poll_id = p_poll_id
  ) or not exists (
    select 1 from public.options
    where id = p_new_option_id and poll_id = p_poll_id
  ) then
    raise exception 'option does not belong to poll';
  end if;

  delete from public.votes
  where poll_id = p_poll_id and voter_token = p_voter_token;

  update public.options
  set vote_count = vote_count - 1
  where id = p_old_option_id and vote_count > 0;

  insert into public.votes (poll_id, option_id, voter_token)
  values (p_poll_id, p_new_option_id, p_voter_token);

  update public.options
  set vote_count = vote_count + 1
  where id = p_new_option_id;
end;
$$ language plpgsql;

-- Row Level Security
alter table public.polls enable row level security;
alter table public.options enable row level security;
alter table public.votes enable row level security;

drop policy if exists "polls_select_all" on public.polls;
create policy "polls_select_all" on public.polls for select using (true);

drop policy if exists "polls_insert_all" on public.polls;
create policy "polls_insert_all" on public.polls for insert with check (true);

drop policy if exists "options_select_all" on public.options;
create policy "options_select_all" on public.options for select using (true);

drop policy if exists "options_insert_all" on public.options;
create policy "options_insert_all" on public.options for insert with check (true);

drop policy if exists "votes_select_all" on public.votes;
create policy "votes_select_all" on public.votes for select using (true);

drop policy if exists "votes_insert_all" on public.votes;
create policy "votes_insert_all" on public.votes for insert with check (true);
