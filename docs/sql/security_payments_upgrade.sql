-- Manual SQL upgrade for multilingual + funnel + payment hardening support
-- Run in Supabase SQL editor after reviewing.

create extension if not exists pgcrypto;

-- 1) Qualifier fields in contact submissions
alter table public.contact_submissions add column if not exists business_type text;
alter table public.contact_submissions add column if not exists biggest_problem text;
alter table public.contact_submissions add column if not exists team_size text;
alter table public.contact_submissions add column if not exists consent boolean;

create index if not exists idx_contact_submissions_source_created
  on public.contact_submissions (source, created_at desc);

-- 2) Payment requests / intents log
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  provider text not null check (provider in ('stripe', 'razorpay')),
  amount integer not null,
  currency text not null,
  description text not null,
  customer_name text,
  customer_email text,
  provider_reference text,
  status text not null default 'created',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_payment_requests_created_at
  on public.payment_requests (created_at desc);

create index if not exists idx_payment_requests_provider_status
  on public.payment_requests (provider, status);

alter table public.payment_requests enable row level security;

drop policy if exists payment_requests_insert_policy on public.payment_requests;
create policy payment_requests_insert_policy
on public.payment_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists payment_requests_select_policy on public.payment_requests;
create policy payment_requests_select_policy
on public.payment_requests
for select
to authenticated
using (true);

grant insert on public.payment_requests to anon, authenticated;
grant select on public.payment_requests to authenticated;

-- 3) Direct payment verification queue
create table if not exists public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  amount integer not null,
  payment_method text not null check (payment_method in ('bank_transfer', 'upi')),
  transaction_ref text not null,
  notes text not null default '',
  status text not null default 'pending_review' check (status in ('pending_review', 'verified', 'rejected')),
  client_started_at timestamptz not null,
  verification_method text not null default 'manual_bank_reconciliation',
  source text not null default 'contact_page',
  ip_address text,
  user_agent text
);

create unique index if not exists idx_payment_submissions_transaction_ref_unique
  on public.payment_submissions (transaction_ref);

create index if not exists idx_payment_submissions_status_created
  on public.payment_submissions (status, created_at desc);

alter table public.payment_submissions enable row level security;

drop policy if exists payment_submissions_insert_policy on public.payment_submissions;
create policy payment_submissions_insert_policy
on public.payment_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists payment_submissions_select_policy on public.payment_submissions;
create policy payment_submissions_select_policy
on public.payment_submissions
for select
to authenticated
using (true);

grant insert on public.payment_submissions to anon, authenticated;
grant select on public.payment_submissions to authenticated;

-- 3) Basic data quality constraints
alter table public.contact_submissions
  add constraint contact_submissions_email_format_chk
  check (position('@' in email) > 1) not valid;

alter table public.contact_submissions
  validate constraint contact_submissions_email_format_chk;
