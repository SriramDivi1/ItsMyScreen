-- RPC to change vote: delete old vote, insert new one
create or replace function change_vote(p_poll_id uuid, p_old_option_id uuid, p_new_option_id uuid, p_voter_token text)
returns void as $$
begin
  -- Delete existing vote and decrement old option
  delete from public.votes
  where poll_id = p_poll_id and voter_token = p_voter_token;

  update public.options
  set vote_count = vote_count - 1
  where id = p_old_option_id and vote_count > 0;

  -- Insert new vote and increment new option
  insert into public.votes (poll_id, option_id, voter_token)
  values (p_poll_id, p_new_option_id, p_voter_token);

  update public.options
  set vote_count = vote_count + 1
  where id = p_new_option_id;
end;
$$ language plpgsql;
