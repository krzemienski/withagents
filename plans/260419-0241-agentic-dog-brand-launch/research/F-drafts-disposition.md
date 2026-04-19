# Workstream F — Draft Content Disposition

## Summary

Total drafts audited: **76** (18 posts × 4 social formats = 72 + 3 REVIEW docs + PUBLISHING-ROADMAP + TASKS + promptforge_prd + dashboard.html). Publish-ready as-is: **0**. Light edit needed: **67** (all 18 LinkedIn articles, all 18 LinkedIn short posts, all 18 X threads, plus 13 newsletters that are on-topic but have template cruft). Merge/rework: **3** (REVIEW-POSTS docs into a single audit archive). Retire outright: **6** (5 badly-topic-mismatched newsletters from Posts 1, 5, 16, 17, + the one from 9; plus promptforge_prd.md). Legacy-language hits: **0 exact matches** for "open to full-time" / "Agentic League" in any actual draft — those phrases only appear in the plan.md and the critic's red-team review. Biggest risks are **stale canonical URL** (`site-rho-pied.vercel.app` in every LinkedIn article footer and `withagents.dev` in every newsletter — neither is the withagents.dev domain), **pre-consolidation numbers** (Post 1 newsletter still says "61 Lessons from 4,500 Sessions"), and **topic drift** where newsletter blurbs for Posts 5/14/16/17 describe the wrong posts entirely.

## Triage Table

### Publish-as-is: 0
None. Every draft has at least a domain URL that needs to change before shipping under withagents.dev.

### Light-edit: 67

**Pattern: all 18 LinkedIn articles** (`posts/post-XX-*/social/linkedin-article.md`)
- title: individual per post (e.g., "23,479 Sessions: What Actually Works in Agentic Development")
- platform: LinkedIn article (long-form)
- thesis: flagship deep-dive, mirrors the blog post body
- CTA: soft — footer links to `site-rho-pied.vercel.app` + companion repo
- brand-fit: on-brand (voice, structure, data all consistent with Midnight Observatory + 23,479 narrative)
- legacy-language-flags: none — no "open to full-time" / "Agentic League" / "looking for a role" matches
- disposition: **light-edit**
- reason: Replace `site-rho-pied.vercel.app` with `withagents.dev` in the "Originally published at:" footer across all 18 files. Otherwise body copy is publishable.

**Pattern: all 18 LinkedIn short posts** (`posts/post-XX-*/social/linkedin.md`)
- title: "LinkedIn — Post N"
- platform: LinkedIn short
- thesis: one-screen hook pulling the strongest stat/story from each post
- CTA: soft ("Full post + code in the comments")
- brand-fit: on-brand
- legacy-language-flags: none
- disposition: **light-edit**
- reason: Needs the canonical link dropped in the comment; no URL is hard-coded so this is a publish-time action, not a file edit. Content is clean.

**Pattern: all 18 X threads** (`posts/post-XX-*/social/twitter.md`)
- title: "X Thread — Post N"
- platform: X thread
- thesis: 10-tweet distillation per post
- CTA: soft — every thread ends with `**Reply 1 (post link, UTM-tagged at publish):** Full post + code: {{POST_URL}} / Companion repo: {{REPO_URL}}`
- brand-fit: on-brand
- legacy-language-flags: none
- disposition: **light-edit**
- reason: `{{POST_URL}}` and `{{REPO_URL}}` are intentional templating tokens for the scheduler — fine for file-storage but must be resolved to `withagents.dev/...` at publish time.

**Pattern: 13 newsletters that are on-topic but templated**
- files: Posts 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 15, 18 newsletters
- platform: newsletter (Substack / Buttondown TBD)
- thesis: matches the correct post
- CTA: soft — `withagents.dev/posts/...` (WRONG DOMAIN)
- brand-fit: on-brand content, off-brand URL
- legacy-language-flags: none
- disposition: **light-edit**
- reason: Replace every `withagents.dev` occurrence with `withagents.dev`. Post 11 URL also has a stale slug (`post-11-ai-dev-operating-system` → should be `post-11-spec-driven-development`). Post 14's newsletter uses `[link to blog post]` placeholder plus wrong repo (`spec-driven-implementation` → `multi-agent-merge-orchestrator`); fix both.

### Merge: 3

**`posts/REVIEW-POSTS-01-04.md` + `posts/REVIEW-POSTS-05-08.md` + `posts/REVIEW-POSTS-09-11-AND-STRATEGY.md`**
- title: Pre-consolidation editorial reviews
- platform: internal
- thesis: reviewer notes + strategy recommendations from March pre-launch pass
- CTA: none
- brand-fit: internal-only
- legacy-language-flags: none detected in headings
- disposition: **merge-into-archive** — fold into a single `docs/archive/pre-launch-editorial-review.md` (or drop under `plans/archive/`). They were the source material for the 61→18 consolidation and still reference the old 61-post structure, so they should not be discoverable in the live site or linked from any launch artifact.
- reason: Reference material, not publishable content.

### Retire: 6

**`posts/post-01-series-launch/social/newsletter.md`**
- title: "Agentic Development: 61 Lessons from 4,500 AI Coding Sessions"
- platform: newsletter
- thesis: announces the series
- CTA: soft, broken URL
- brand-fit: **legacy** — subject line, body count, and body claim ("61 Lessons from 4,500 sessions") all predate the 2026-03-06 consolidation
- legacy-language-flags: "**Subject:** Agentic Development: 61 Lessons from 4,500 AI Coding Sessions"; "withagents.dev/posts/post-01-series-launch"
- disposition: **retire**
- reason: Subject + body numbers are wrong by >5x. Cheaper to regenerate from the LinkedIn article hook than to rewrite in place.

**`posts/post-05-ios-patterns/social/newsletter.md`**
- title: "The SDK Bridge: 4 Failed Approaches, 1 That Worked"
- platform: newsletter
- thesis: describes a DIFFERENT post (Post 4, iOS Streaming Bridge)
- CTA: broken (`github.com/krzemienski/claude-sdk-bridge` + `withagents.dev/posts/post-05-sdk-bridge`)
- brand-fit: **off-brand** (wrong post entirely — Post 5 is the iOS Patterns Compendium, not the SDK Bridge)
- legacy-language-flags: URL slug `post-05-sdk-bridge` reveals pre-consolidation post numbering
- disposition: **retire**
- reason: Entire blurb is for the wrong post. Shipping this would link readers to Post 5 with copy about Post 4.

**`posts/post-16-claude-code-plugins/social/newsletter.md`**
- title: "35 worktrees, 12 agents, zero merge conflicts — the choreography"
- platform: newsletter
- thesis: describes Post 14 (Multi-Agent Merge), not Post 16 (Plugins)
- CTA: soft with `[link to blog post]` placeholder + wrong repo (`multi-agent-merge-orchestrator`)
- brand-fit: **off-brand** (wrong post)
- legacy-language-flags: none, but the topic is Post 14's
- disposition: **retire**
- reason: Mirror of Post 14. Regenerate from Post 16's actual thesis (hooks + plugins + closed enforcement loop).

**`posts/post-17-ccb-evolution/social/newsletter.md`**
- title: "The one-line fix that took 84 thinking steps to find"
- platform: newsletter
- thesis: describes Post 13 (Sequential Thinking Debugging), not Post 17 (CCB Evolution)
- CTA: soft with `[link to blog post]` placeholder + wrong repo (`sequential-thinking-debugging`)
- brand-fit: **off-brand** (wrong post)
- legacy-language-flags: none, but topic is Post 13's
- disposition: **retire**
- reason: Mirror of Post 13. Regenerate from Post 17's actual thesis (bash-to-SDK orchestrator evolution).

**`posts/post-09-code-tales/social/newsletter.md`**
- title: "Code Tales: From GitHub to Audio Stories"
- platform: newsletter
- thesis: pre-consolidation "Code Tales" framing (audio stories from GitHub repos)
- CTA: broken URL
- brand-fit: **legacy** — Post 9's final title is "Mining 23,479 Sessions: What 3.4 Million Lines of AI Logs Actually Reveal"; the audio/story angle was dropped in consolidation
- legacy-language-flags: "Code Tales: From GitHub to Audio Stories" — does not match current Post 9 thesis
- disposition: **retire**
- reason: Blurb describes an abandoned product framing. Regenerate around the 4,500→23,479 miscount reveal (the actual Post 9 hook per its LinkedIn article).

**`/Users/nick/Desktop/blog-series/promptforge_prd.md`**
- title: "PromptForge — Project Requirements Document (PRD), Version 1.0, April 30, 2025"
- platform: internal
- thesis: 2025-dated PRD for a Clerk + OpenAI GPT-4o SaaS code-generator product (unrelated to withagents.dev)
- CTA: none
- brand-fit: **legacy** — predates everything; references CodeGuide.dev clone, Clerk auth, OpenAI Agents SDK — none of which align with the current Claude/Anthropic-centric brand
- legacy-language-flags: none of the specific prohibited phrases, but the entire document is a legacy artifact from a pre-withagents.dev initiative
- disposition: **retire** (move to `docs/archive/` or delete)
- reason: Wrong product, wrong tech stack, wrong year. Should not survive any audit grep for "PromptForge" landing on live content.

### Internal/non-content: 1 (informational)

**`/Users/nick/Desktop/blog-series/dashboard.html`**
- title: "Productivity" (browser title)
- platform: internal dashboard (orange #D97757 theme — Claude.ai default, NOT Midnight Observatory)
- thesis: local productivity dashboard, not marketing copy
- disposition: out-of-scope for content triage. Flag only: it uses the Claude.ai orange accent, not the Midnight Observatory navy/indigo — off-brand if ever shared publicly. No legacy phrase hits.

## Legacy Language Audit

**Zero hits** in actual draft content for:
- `"open to full-time"` — not present in any social draft, newsletter, LinkedIn article, or X thread
- `"Agentic League"` — not present anywhere
- `"looking for a role"` / `"hire me"` / `"seeking.*role"` — not present

The only occurrences of "full-time" or "not job-seeking" in the entire repo are in the brand launch plan itself (`plans/260419-0241-agentic-dog-brand-launch/plan.md:96` and the critic review `critic-260419-0241-red-team-review.md:55`) — i.e., they describe the positioning strategy, not legacy content needing removal. **No draft-level cleanup required for legacy phrasing.**

### Stale-brand phrases found (different risk, flagged for cleanup):

| Path | Exact phrase | Replacement |
|---|---|---|
| `posts/post-01-series-launch/social/newsletter.md:3` | `61 Lessons from 4,500 AI Coding Sessions` | `18 Lessons from 23,479 AI Coding Sessions` |
| `posts/post-01-series-launch/social/newsletter.md:20` | `withagents.dev/posts/post-01-series-launch` | `withagents.dev/posts/post-01-series-launch` |
| `posts/post-05-ios-patterns/social/newsletter.md:20` | `withagents.dev/posts/post-05-sdk-bridge` | `withagents.dev/posts/post-05-ios-patterns` (and rewrite the blurb for Post 5's topic) |
| `posts/post-10-stitch-design-to-code/social/newsletter.md:20` | `withagents.dev/posts/post-10-stitch-design-to-code` | `withagents.dev/posts/post-10-stitch-design-to-code` |
| `posts/post-11-spec-driven-development/social/newsletter.md:20` | `withagents.dev/posts/post-11-ai-dev-operating-system` | `withagents.dev/posts/post-11-spec-driven-development` |
| `posts/post-09-code-tales/social/linkedin-article.md:7` | `The series subtitle said "4,500 AI Coding Sessions."` | keep — this is intentional callback inside Post 9's narrative (the miscount reveal). Do NOT edit. |
| 18× LinkedIn articles | `*Originally published at: https://site-rho-pied.vercel.app/posts/post-XX-*` | `*Originally published at: https://withagents.dev/posts/post-XX-*` |
| 14× newsletters | `withagents.dev/posts/...` | `withagents.dev/posts/...` |

## High-Value Candidates for Day 1-5 of 30-Day Push

1. **Post 1 LinkedIn article** (`posts/post-01-series-launch/social/linkedin-article.md`, 197 lines, ~1,500 words) — flagship series launch essay, fully written, quality voice, aligned to consolidated 23,479 narrative. **Day 1 hero post** after domain swap.
2. **Post 1 X thread** (`posts/post-01-series-launch/social/twitter.md`, 10 tweets) — strong hook (9.6:1 read-to-write ratio as the thesis). **Day 1, same hour as LinkedIn article.**
3. **Post 1 LinkedIn short** (`posts/post-01-series-launch/social/linkedin.md`) — good standalone teaser; **schedule Day 2** as reinforcement.
4. **Post 3 LinkedIn article** (`posts/post-03-functional-validation/social/linkedin-article.md`) — "I Banned Unit Tests and Shipped Faster" is a natural flagship for validationforge positioning. **Day 3-4**, teases the validationforge product.
5. **Post 2 LinkedIn article** ("Multi-Agent Consensus") — second strongest hook after Post 1 for a technical audience; **Day 5**.
6. **Post 9 LinkedIn article** — the miscount-reveal angle ("subtitle said 4,500, real number was 5x higher") is a strong transparency story and the best candidate for a manifesto-adjacent reflection piece.

Do NOT ship any newsletter on Day 1-5. All 18 need either retiring (5 cases) or a domain/URL edit (13 cases), and the newsletter platform decision is still open (TASKS.md: "Waiting On").

## Unresolved Questions

1. **Domain swap cascade:** every LinkedIn article footer hard-codes `site-rho-pied.vercel.app` and every newsletter hard-codes `withagents.dev`. Is withagents.dev live with SSL and the post routes deployed, or do we wait until Workstream G delivers the domain? Cannot edit 32 files if the target URL is still in flux.
2. **Newsletter platform:** TASKS.md still lists "Newsletter platform decision — Substack vs Buttondown vs ConvertKit" as a Waiting On item since 2026-03-21. The 5 retired newsletters shouldn't be regenerated until that's decided (format and CTA differ by platform).
3. **Post 11 slug:** newsletter references `post-11-ai-dev-operating-system` but INDEX.md lists the final slug as `post-11-spec-driven-development`. Confirm canonical slug before fixing URL.
4. **REVIEW-POSTS-* archival location:** confirm preferred archive path (`docs/archive/` vs `plans/archive/`) — they're currently in `posts/` where they could collide with site-generation globs.
5. **promptforge_prd.md deletion vs archive:** safer to move to `docs/archive/legacy-initiatives/promptforge-v1-april-2025.md` than delete, in case anything in plans/ still back-references it. Confirm with workstream lead.
6. **Post 14 newsletter repo mismatch:** blurb points to `github.com/krzemienski/spec-driven-implementation` but the canonical Post 14 repo per INDEX.md is `multi-agent-merge-orchestrator`. Blurb topic is correct; only the repo URL is wrong. (Treated as light-edit above, but noting as possible stale content suggesting further mismatches.)
7. **No manifesto / Code Stories / validationforge draft exists yet** in `posts/` or `docs/`. The brief asks to flag drafts aligned with those launches; the answer is **none** — drafting those three pieces is itself a net-new task, not a triage item.
