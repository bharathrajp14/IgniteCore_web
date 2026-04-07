-- Supabase Setup for IgniteCore Contact + Chatbot
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ---------------------------------------------------
-- 1) Contact Form Storage
-- ---------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  email text not null,
  whatsapp text not null,
  help_type text not null,
  message text not null,
  source text not null default 'website',
  status text not null default 'new'
);

alter table public.contact_submissions add column if not exists created_at timestamptz not null default now();
alter table public.contact_submissions add column if not exists name text;
alter table public.contact_submissions add column if not exists business_name text;
alter table public.contact_submissions add column if not exists email text;
alter table public.contact_submissions add column if not exists whatsapp text;
alter table public.contact_submissions add column if not exists help_type text;
alter table public.contact_submissions add column if not exists message text;
alter table public.contact_submissions add column if not exists source text not null default 'website';
alter table public.contact_submissions add column if not exists status text not null default 'new';

-- Handles old schema where business_type existed before business_name.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_submissions'
      and column_name = 'business_type'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_submissions'
      and column_name = 'business_name'
  ) then
    alter table public.contact_submissions rename column business_type to business_name;
  end if;
end $$;

create index if not exists idx_contact_submissions_created_at
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

drop policy if exists contact_submissions_insert_policy on public.contact_submissions;
create policy contact_submissions_insert_policy
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

grant usage on schema public to anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;

-- ---------------------------------------------------
-- 2) Chatbot Message Storage
-- ---------------------------------------------------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  provider text not null default 'fallback',
  model text not null default 'rules',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_chat_messages_session_created
  on public.chat_messages (session_id, created_at);

alter table public.chat_messages enable row level security;

-- Keep chatbot transcript write-only for public roles.
drop policy if exists chat_messages_insert_policy on public.chat_messages;
create policy chat_messages_insert_policy
on public.chat_messages
for insert
to anon, authenticated
with check (true);

grant insert on public.chat_messages to anon, authenticated;

-- Optional: allow authenticated users to read their own app-managed chat data later.
-- create policy chat_messages_select_policy
-- on public.chat_messages
-- for select
-- to authenticated
-- using (false);
