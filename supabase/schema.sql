-- Create tables
create table if not exists public.polls (
  id uuid default gen_random_uuid() primary key,
  question text not null,
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

-- Realtime
alter publication supabase_realtime add table public.polls;
alter publication supabase_realtime add table public.options;
alter publication supabase_realtime add table public.votes;

-- RPC for atomic voting
create or replace function vote(p_poll_id uuid, p_option_id uuid, p_voter_token text)
returns void as $$
begin
  -- Insert vote (will fail if unique constraint violated)
  insert into public.votes (poll_id, option_id, voter_token)
  values (p_poll_id, p_option_id, p_voter_token);
  
  -- Increment vote count
  update public.options
  set vote_count = vote_count + 1
  where id = p_option_id;
end;
$$ language plpgsql;
