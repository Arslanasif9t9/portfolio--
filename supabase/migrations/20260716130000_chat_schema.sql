-- AI chat schema for the portfolio assistant.
-- SECURITY MODEL: all chat access goes through the `chat` Edge Function
-- (service role). RLS is enabled with NO anon policies, so the anon key
-- cannot read or write these tables directly (tighter than the original
-- arslanai9t9 schema, which allowed public reads of all messages).

-- Admin profile (singleton) — persona used to build the AI system prompt
create table if not exists public.admin_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Arslan Ahmad',
  brand_name text not null default 'arslan9t9',
  profession text default 'Full-Stack Web Developer',
  skills jsonb not null default '["React","Next.js","TypeScript","Node.js","PHP","Laravel","Tailwind CSS"]'::jsonb,
  bio text default '',
  location text default 'Lahore, Punjab, Pakistan',
  email text default 'arslanahmadt58@gmail.com',
  website text default 'https://arslanasif9t9.github.io/portfolio--/',
  github text default 'https://github.com/Arslanasif9t9',
  linkedin text default 'https://www.linkedin.com/in/arslan-ahmad-983834343/',
  profile_picture_url text default '',
  updated_at timestamptz not null default now()
);
alter table public.admin_profile enable row level security;

insert into public.admin_profile (bio)
values ('Full-stack web developer from Lahore building modern web experiences with React, Next.js, TypeScript, Node.js, PHP and Laravel. This assistant lives on his portfolio site and can tell visitors about his skills, projects, blog posts and how to get in touch.');

-- AI provider registry (keys live here, read only by the edge function)
create table if not exists public.api_providers (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  provider_type text not null,
  api_key text not null,
  model_name text not null,
  endpoint_url text not null,
  priority_order int not null default 100,
  is_active boolean not null default true,
  last_used_at timestamptz,
  last_status text,
  created_at timestamptz not null default now()
);
alter table public.api_providers enable row level security;

-- Chat sessions (anonymous guests, identified by localStorage guest_id)
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  guest_id text not null unique,
  is_blocked boolean not null default false,
  ai_enabled boolean not null default true,
  first_seen timestamptz not null default now(),
  last_active timestamptz not null default now(),
  total_messages int not null default 0
);
alter table public.chat_sessions enable row level security;

-- Messages
create type public.message_role as enum ('user','assistant','admin');
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role public.message_role not null,
  content text not null,
  provider_used text,
  created_at timestamptz not null default now()
);
create index if not exists messages_session_created_idx on public.messages(session_id, created_at);
alter table public.messages enable row level security;
