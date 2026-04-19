-- syndication_log schema
-- Part of: scripts/syndication/supabase/
--
-- Run order: apply AFTER the base supabase-schema.sql (social_auth_tokens,
-- scheduled_posts, post_publish_log already exist).
--
-- To apply:
--   psql "$DATABASE_URL" -f scripts/syndication/supabase/schema.sql
-- Or via Supabase dashboard SQL editor (paste contents, run).
--
-- This table records every syndication runner attempt — one row per
-- (slug, channel) combination per attempt. It is distinct from
-- post_publish_log (which tracks the scheduler queue) and coexists
-- alongside it. When retry_count reaches the policy limit the status
-- flips to 'exhausted' and the webhook fires an alert email.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS syndication_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        NOT NULL,   -- post dir slug, e.g. 'post-01-series-launch'
  channel       text        NOT NULL    -- matches Channel union in shared/types.ts
                            CHECK (channel IN (
                              'linkedin_short',
                              'linkedin_article',
                              'x_thread',
                              'readme_patch'
                            )),
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN (
                              'pending',
                              'in_progress',
                              'posted',
                              'failed',
                              'exhausted',
                              'skipped'
                            )),
  posted_at     timestamptz,            -- set on first successful post
  response_url  text,                   -- public URL of created post/thread/commit
  error_message text,                   -- last error string on failure
  retry_count   int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Primary lookup: all attempts for a given post
CREATE INDEX IF NOT EXISTS idx_syndication_log_slug
  ON syndication_log (slug);

-- Channel filter (e.g. "all linkedin_short failures")
CREATE INDEX IF NOT EXISTS idx_syndication_log_channel
  ON syndication_log (channel);

-- Status filter — used by retry queue fetch and dashboard queries
CREATE INDEX IF NOT EXISTS idx_syndication_log_status
  ON syndication_log (status)
  WHERE status IN ('pending', 'failed', 'in_progress');

-- Composite: slug + channel — uniqueness validation and per-post-per-channel history
CREATE INDEX IF NOT EXISTS idx_syndication_log_slug_channel
  ON syndication_log (slug, channel);

-- ---------------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------------

COMMENT ON TABLE syndication_log IS
  'Audit log for all syndication runner attempts. One row per attempt per (slug, channel).';
COMMENT ON COLUMN syndication_log.slug IS
  'Post directory slug matching posts/ directory name.';
COMMENT ON COLUMN syndication_log.channel IS
  'Syndication channel: linkedin_short | linkedin_article | x_thread | readme_patch.';
COMMENT ON COLUMN syndication_log.status IS
  'pending → in_progress → posted | failed → exhausted.';
COMMENT ON COLUMN syndication_log.retry_count IS
  'Number of attempts made so far. 0 = not yet attempted.';
COMMENT ON COLUMN syndication_log.posted_at IS
  'Timestamp of first successful post. NULL until status = posted.';
COMMENT ON COLUMN syndication_log.response_url IS
  'Public URL returned by the platform API or gh CLI on success.';
COMMENT ON COLUMN syndication_log.error_message IS
  'Last failure reason; overwritten on each retry.';
