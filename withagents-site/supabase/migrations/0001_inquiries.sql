-- Phase 13: Consultant funnel inquiries table
-- Captures form submissions from /work with UTM attribution.
-- Companion docs: docs/consultant-funnel.md

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  company         text,
  problem         text not null,
  budget          text,
  timeline        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  referrer        text,
  ip_hash         text,          -- sha256(ip + server secret); used for rate limiting + dedupe
  user_agent      text,
  status          text not null default 'new',  -- new | triaged | scheduled | closed | spam
  notes           text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);
create index if not exists inquiries_utm_source_idx on public.inquiries (utm_source);
create index if not exists inquiries_ip_hash_idx    on public.inquiries (ip_hash, created_at);

-- Row Level Security: service_role bypasses RLS; anon/authenticated blocked.
alter table public.inquiries enable row level security;

-- No anon SELECT/INSERT policies on purpose. The API route uses the service_role key.
-- If we ever expose a read-only dashboard, add a scoped policy then.

comment on table public.inquiries is
  'Consultant funnel inquiries from /work. Written by src/pages/api/inquiry.ts. UTM captured client-side.';
