-- Admin system for the portfolio (ported from arslanai9t9).
-- Model: admin authenticates with Supabase email/password; RLS policies keyed on
-- has_role(auth.uid(),'admin') let the admin operate directly via supabase-js.
-- Bootstrap + provider testing (raw api_key) go through the `admin` edge function.

-- ===== Roles =====
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- ===== Extend existing tables =====
alter table public.admin_profile
  add column if not exists elevenlabs_api_key text,
  add column if not exists formatting_config jsonb not null default
    '{"enabled":true,"bold":true,"italic":true,"code":true,"inline_code":true,"headings":true,"bullets":true,"numbered":true,"copy_button":true,"enable_run_button":false}'::jsonb;

-- ===== New tables =====
create table public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  icon text not null default '📣',
  style text not null default 'glass',
  delay_seconds int not null default 2,
  frequency text not null default 'every_visit',
  target_guest text,
  auto_dismiss boolean not null default false,
  auto_dismiss_seconds int not null default 5,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.app_notifications enable row level security;

create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  guest_id text not null unique,
  name text,
  bio text,
  avatar_url text,
  age text,
  location text,
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_profiles enable row level security;

create table public.admin_gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  size_bytes int,
  created_at timestamptz not null default now()
);
alter table public.admin_gallery enable row level security;

create table public.message_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  guest_id text not null,
  is_positive boolean not null,
  created_at timestamptz not null default now(),
  unique (message_id, guest_id)
);
alter table public.message_feedback enable row level security;

-- ===== Grants for authenticated (RLS still gates everything) =====
grant select, insert, update, delete on public.api_providers to authenticated;
grant select, update on public.admin_profile to authenticated;
grant select, insert, update, delete on public.chat_sessions to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant select, insert, update, delete on public.app_notifications to authenticated;
grant select on public.user_profiles to authenticated;
grant select, insert, delete on public.admin_gallery to authenticated;
grant select on public.message_feedback to authenticated;

-- Public (widget) grants
grant select on public.app_notifications to anon;
grant select, insert, update on public.user_profiles to anon;
grant select on public.admin_gallery to anon;
grant select, insert, update on public.message_feedback to anon;

-- ===== Admin policies =====
create policy "admin manage providers" on public.api_providers
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin read profile" on public.admin_profile
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update profile" on public.admin_profile
  for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin all sessions" on public.chat_sessions
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin all messages" on public.messages
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin read contact messages" on public.contact_messages
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update contact messages" on public.contact_messages
  for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete contact messages" on public.contact_messages
  for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin manage notifications" on public.app_notifications
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin read user profiles" on public.user_profiles
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin manage gallery" on public.admin_gallery
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin read feedback" on public.message_feedback
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- ===== Public (widget) policies =====
create policy "public read active notifications" on public.app_notifications
  for select to anon using (is_active = true);
create policy "public read own profile" on public.user_profiles
  for select to anon using (true);
create policy "public insert profile" on public.user_profiles
  for insert to anon with check (true);
create policy "public update profile" on public.user_profiles
  for update to anon using (true) with check (true);
create policy "public read gallery" on public.admin_gallery
  for select to anon using (true);
create policy "public insert feedback" on public.message_feedback
  for insert to anon with check (true);
create policy "public update feedback" on public.message_feedback
  for update to anon using (true) with check (true);
create policy "public read feedback" on public.message_feedback
  for select to anon using (true);

-- ===== Storage: public bucket for profile pics / gallery =====
insert into storage.buckets (id, name, public)
values ('profile-pictures', 'profile-pictures', true)
on conflict (id) do nothing;

create policy "public read profile-pictures" on storage.objects
  for select using (bucket_id = 'profile-pictures');
create policy "admin insert profile-pictures" on storage.objects
  for insert to authenticated with check (bucket_id = 'profile-pictures' and public.has_role(auth.uid(),'admin'));
create policy "admin update profile-pictures" on storage.objects
  for update to authenticated using (bucket_id = 'profile-pictures' and public.has_role(auth.uid(),'admin'));
create policy "admin delete profile-pictures" on storage.objects
  for delete to authenticated using (bucket_id = 'profile-pictures' and public.has_role(auth.uid(),'admin'));

-- ===== Realtime (admin takeover live updates) =====
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.chat_sessions;
