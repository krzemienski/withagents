-- blog-series-social Supabase schema
-- Run after creating the Supabase project.
--
-- Tables:
--   social_auth_tokens : OAuth credentials for X / LinkedIn
--   scheduled_posts    : queue of content to publish
--   post_publish_log   : audit trail of publish attempts

CREATE TABLE IF NOT EXISTS social_auth_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('x', 'linkedin')),
  account_label text NOT NULL,                 -- e.g. 'nick-personal'
  access_token text NOT NULL,
  refresh_token text,
  access_token_secret text,                    -- X OAuth 1.0a only
  author_urn text,                             -- LinkedIn only, e.g. 'urn:li:person:...'
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (platform, account_label)
);

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,                     -- e.g. 'post-01-series-launch'
  platform text NOT NULL CHECK (platform IN ('x', 'linkedin', 'linkedin-article')),
  account_label text NOT NULL DEFAULT 'nick-personal',
  content_ref text NOT NULL,                   -- absolute or repo-relative path to source md
  image_ref text,                              -- path OR public URL to card PNG
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'posting', 'posted', 'failed')),
  posted_url text,
  error_message text,
  attempt_count int DEFAULT 0,
  max_attempts int DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  posted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_queue
  ON scheduled_posts (status, scheduled_for)
  WHERE status IN ('pending', 'failed');

CREATE TABLE IF NOT EXISTS post_publish_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_post_id uuid REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  attempt int NOT NULL,
  success bool NOT NULL,
  response jsonb,
  error jsonb,
  logged_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_publish_log_by_scheduled
  ON post_publish_log (scheduled_post_id, logged_at DESC);

-- Updated-at trigger for auth tokens
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auth_tokens_updated_at ON social_auth_tokens;
CREATE TRIGGER trg_auth_tokens_updated_at
  BEFORE UPDATE ON social_auth_tokens
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
