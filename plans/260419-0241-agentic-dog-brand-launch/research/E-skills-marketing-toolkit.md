# Workstream E — Skills Matrix (NOT a catalog)

## Summary

The global skills catalog (206 skills + plugin subcommands) covers **8 of 10** Mode 2 needs with strong primary+fallback coverage. The two genuine gaps are (1) **Plausible analytics install for Astro** — no Astro-specific analytics skill exists, only generic `ckm:analytics` for reporting, and (2) **Supabase-backed CTA capture form** — no skill wires a form → Supabase with UTM logging; `ckm-storage` is S3-only, `better-auth` doesn't capture leads. Content/social/voice buckets are over-served: `ck:ckm:write:*` family plus `devlog-publisher` provide a full pipeline. For social cards and OG images, `web-artifacts-builder` + `stitch` + existing per-post HTML templates in `posts/post-*/assets/` are the path — no Satori-specific skill. Recommend `ck:ckm:play` as the orchestration entry point for multi-step content campaigns, with `devlog-publisher` for session-derived long-form posts. Two new thin skills needed: `astro-plausible-install` and `supabase-lead-form`.

## Matrix: Mode 2 Needs → Skills

| Need | Primary skill | Fallback | Gap? | Notes |
|------|--------------|----------|------|-------|
| 1. Blog post (long-form) | `devlog-publisher` | `ck:ckm:write:blog` | No | devlog-publisher mines real sessions (on-brand for withagents.dev); `write:blog` for SEO-optimized generic posts |
| 2. LinkedIn article (long-form) | `ck:ckm:write:publish` | `ck:ckm:write:good` → manual paste | No | `write:publish` outputs publish-ready; LinkedIn has no API in skill set, manual paste is accepted |
| 3. LinkedIn short post | `ck:ckm:social` | `copywriting` + `brand` voice | No | `ckm:social` handles multi-platform generation |
| 4. X/Twitter thread (7-12) | `ck:ckm:social` | `ck:ckm:write:fast` | No | `ckm:social` generates platform-specific; `write:fast` for quick variants |
| 5. Repo README "Featured in:" patch | `git` + manual Edit | `ck:ckm:write:fast` for copy | No | Trivial edit; no skill needed — just templated block + `git` skill for commit |
| 6. OG image rendering (Satori/themed) | `web-artifacts-builder` | `stitch` + `banner-design` | **Partial gap** | No Satori skill; `web-artifacts-builder` can bundle React→HTML, but Satori/@vercel/og integration is not skill-covered. Recommend per-post HTML template (existing pattern at `posts/post-*/assets/hero-card.html`) rendered via headless Chrome |
| 7. Social card rendering (hero+Twitter+LinkedIn HTML) | `banner-design` | `stitch` + `web-artifacts-builder` | No | Existing repo already has per-post HTML templates; `banner-design` for new variants; `stitch` for design exploration |
| 8. Voice spec + review (tone, banlist) | `brand` (define) + `humanizer` (review) | `ck:ckm:write:audit` | No | `brand` writes voice guide; `humanizer` strips AI tells; `write:audit` checks against voice |
| 9. Analytics install (Plausible on Astro) | — | `ckm:analytics` (measurement only) | **GAP** | No skill installs Plausible or any analytics on Astro. Manual script-tag insert in `Layout.astro`. Create thin `astro-plausible-install` skill or accept manual |
| 10. CTA capture form → Supabase, UTM-tagged | — | `form-cro` (optimize, not wire) + `better-auth` (auth only) | **GAP** | `ckm-storage` is S3, not Postgres. `form-cro` optimizes conversion but doesn't wire backends. Need new `supabase-lead-form` skill OR use Supabase MCP directly (server available in this session) |

## Gap List

| Gap | Severity | Recommended action |
|-----|----------|--------------------|
| **Plausible on Astro installer** | Low | Accept manual — single `<script defer data-domain="withagents.dev" src="https://plausible.io/js/script.js">` in `src/layouts/Layout.astro`. Don't build a skill for a one-liner. |
| **Supabase lead-form skill** | Medium | Use **Supabase MCP** (already available in this session: `mcp__claude_ai_Supabase__*`) to provision table + RLS policy + API endpoint. No new skill needed; pattern is: Astro API route POSTs form → Supabase client inserts row with UTM params. Document the pattern in plan phase, not as a skill. |
| **Satori/@vercel/og renderer** | Low | Use existing per-post HTML template pattern (`posts/post-01-series-launch/assets/hero-card.html` etc.) + headless Chrome/Puppeteer screenshot. `chrome-devtools` skill is available for this. No Satori skill needed. |

## Skill-of-Skills Orchestration Note

**Entry point for multi-step content pipelines:** `ck:ckm:play` (Marketing playbook orchestrator with dependency tracking) — this is the meta-orchestrator for running a full content campaign across blog + social + email. It calls into `ck:ckm:write:*`, `ck:ckm:social`, `ck:ckm:email:*`, and `ck:ckm:campaign:*` as sub-steps.

**For session-derived content specifically:** `devlog-publisher` is the single-shot pipeline — it already orchestrates teammate spawning for blog + social + engagement content from real JSONL sessions. It's the right primary for withagents.dev posts tied to Nick's actual Claude Code history.

**Decision rule:**
- Session-derived, technical depth → `devlog-publisher`
- Generic marketing campaign (launch announcement, feature promo) → `ck:ckm:play`
- Single artifact (one post, one thread) → `ck:ckm:write:*` or `ck:ckm:social` directly

**Brand voice enforcement across all three paths:** always invoke `brand` first to establish voice spec, then `humanizer` on output to strip AI tells. `ck:ckm:write:audit` for final QA against voice guide.

## Unresolved Questions

1. Does withagents.dev want Plausible self-hosted or Plausible Cloud? Skill gap only matters if self-hosted (requires deploy config).
2. CTA form UTM schema — should it capture `utm_source/medium/campaign/content/term` all 5 or just `source/campaign`? Affects Supabase schema design.
3. Per-post OG card generation — one-off per post (manual) or auto-generated at build time (requires Astro integration)? Latter would justify a real skill; former does not.
4. Is `devlog-publisher` configured to publish to withagents.dev specifically, or does it need a target-site config update?
5. LinkedIn article publishing is manual-paste today. Is a browser-automation path (via `agent-browser` skill) desired, or accept manual?
