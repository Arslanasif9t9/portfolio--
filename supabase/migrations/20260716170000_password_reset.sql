-- OTP codes for admin forgot-password flow.
-- Service-role only (RLS enabled, no policies): all access via the admin edge function.
create table public.password_reset_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  used boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.password_reset_codes enable row level security;
