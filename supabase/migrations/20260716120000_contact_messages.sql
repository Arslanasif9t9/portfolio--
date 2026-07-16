-- Contact form submissions from the portfolio site.
-- Anonymous visitors may INSERT only; nobody can read/update/delete via the
-- anon key (view rows in the Supabase dashboard or a future admin panel).

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) <= 255),
  message     text not null check (char_length(message) between 10 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anon can insert contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- No SELECT/UPDATE/DELETE policies for anon: submissions are write-only
-- from the public site.
