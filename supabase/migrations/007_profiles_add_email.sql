-- Add email to profiles for simplified auth (no OTP for now)
alter table public.profiles add column if not exists email text;
