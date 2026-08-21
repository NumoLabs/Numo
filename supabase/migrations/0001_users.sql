-- Numo — base schema.
--
-- Reconstructed from the application code (apps/webapp/lib/supabase/users.ts and
-- apps/webapp/app/api/**), because the original Supabase project is not under
-- this account. Run it once against a fresh project.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id             uuid primary key default gen_random_uuid(),
  wallet_address text        not null,
  wallet_network text        not null default 'mainnet',
  username       text,
  avatar_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint users_wallet_network_check
    check (wallet_network in ('mainnet', 'sepolia', 'goerli', 'devnet')),

  -- Addresses are stored canonical: lowercase, 0x + 64 hex chars. The server
  -- normalises before writing (lib/auth/session.ts), so this rejects anything
  -- that skipped that path — otherwise `0x3Fe…` and `0x03fe…` become two users.
  constraint users_wallet_address_format
    check (wallet_address ~ '^0x[0-9a-f]{64}$')
);

-- getOrCreateUserByWallet() relies on this: it inserts optimistically and
-- handles the 23505 unique violation as "someone else won the race".
create unique index if not exists users_wallet_address_network_key
  on public.users (wallet_address, wallet_network);

-- Keep updated_at honest even for writes that forget to set it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Row level security -------------------------------------------------------
--
-- Every read and write goes through the Next.js route handlers using the
-- service-role key, which bypasses RLS. Enabling RLS with no policies is
-- therefore deliberate: it means the anon/publishable key — which ships in the
-- browser bundle — cannot read this table at all.
--
-- Do NOT add a permissive policy "so the client can read profiles". Wallet
-- addresses plus usernames is exactly the data you do not want enumerable.
alter table public.users enable row level security;

revoke all on public.users from anon, authenticated;
