-- Admin sign-in by PIN.
-- The PIN hash and the attempt log are only reachable with the secret key (no RLS policies).

create table public.admin_secrets (
  id smallint primary key default 1 check (id = 1),
  pin_hash text not null,
  updated_at timestamptz not null default now()
);

create trigger admin_secrets_set_updated_at
  before update on public.admin_secrets
  for each row execute function public.set_updated_at();

alter table public.admin_secrets enable row level security;

create table public.admin_login_attempts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ip text not null default '' check (char_length(ip) <= 100),
  succeeded boolean not null default false
);

create index admin_login_attempts_created_at_idx on public.admin_login_attempts (created_at desc);
create index admin_login_attempts_ip_idx on public.admin_login_attempts (ip, created_at desc);

alter table public.admin_login_attempts enable row level security;

revoke all on public.admin_secrets, public.admin_login_attempts from anon, authenticated;
grant all on public.admin_secrets, public.admin_login_attempts to service_role;

-- The PIN hash itself is inserted separately so it never lives in source control.
