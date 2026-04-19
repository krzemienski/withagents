-- consultant-pipeline/schema.sql
-- Consultant inquiry capture for withagents.dev /work funnel.
--
-- Run order:
--   1. Enable pgcrypto extension (if not already enabled):
--        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--   2. Run this file against your Supabase project:
--        psql $SUPABASE_DB_URL -f schema.sql
--      OR paste into Supabase SQL Editor.
--
-- Idempotent: uses IF NOT EXISTS / CREATE OR REPLACE throughout.

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS consultant_inquiries (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 120),
  email         text        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company       text        CHECK (company IS NULL OR char_length(company) <= 120),
  use_case      text        NOT NULL CHECK (char_length(use_case) >= 10 AND char_length(use_case) <= 2000),
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  responded_at  timestamptz          -- set when Nick replies; NULL = unresponded
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Most common query: unresponded inquiries sorted by recency
CREATE INDEX IF NOT EXISTS idx_consultant_inquiries_unresponded
  ON consultant_inquiries (created_at DESC)
  WHERE responded_at IS NULL;

-- UTM attribution reporting
CREATE INDEX IF NOT EXISTS idx_consultant_inquiries_utm
  ON consultant_inquiries (utm_source, utm_medium, utm_campaign);

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- Inserts are allowed from the service-role key (server-side only).
-- No public SELECT — inquiry data is private.

ALTER TABLE consultant_inquiries ENABLE ROW LEVEL SECURITY;

-- Service-role bypasses RLS by default in Supabase.
-- If you need an anon insert policy (not recommended — use server endpoint instead):
--   CREATE POLICY "allow_insert" ON consultant_inquiries FOR INSERT TO anon WITH CHECK (true);

-- ── Comments ──────────────────────────────────────────────────────────────────

COMMENT ON TABLE  consultant_inquiries              IS 'Inbound consulting inquiries from /work form.';
COMMENT ON COLUMN consultant_inquiries.utm_source   IS 'UTM source param from referral URL (e.g. linkedin, x, newsletter).';
COMMENT ON COLUMN consultant_inquiries.utm_medium   IS 'UTM medium param (e.g. social, email, cpc).';
COMMENT ON COLUMN consultant_inquiries.utm_campaign IS 'UTM campaign param (e.g. 30day-push, vf-launch).';
COMMENT ON COLUMN consultant_inquiries.responded_at IS 'Timestamp Nick replied. NULL = needs response.';
