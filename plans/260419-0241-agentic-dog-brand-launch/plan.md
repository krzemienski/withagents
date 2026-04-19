---
title: "agentic.dog brand launch — audit, build, 30-day multi-channel push"
created: 2026-04-19
status: proposed (Mode 1 / pending user approval)
mode: two-mode (exploratory + functional validation → build + launch)
blockedBy: []
blocks: []
---

# agentic.dog Brand Launch — Plan

## TL;DR

Three net-new domains (**agentic.dog** umbrella, **codestories.platform** product, **hack.ski** personal) fed by a consolidation of real products and a 30-day multi-channel publication push. Current blog-series repo IS the existing static site and the launch-content source. All three domains are unregistered / undeployed today.

## Mode Structure

- **Mode 1 (this plan)** — Audit all real assets, synthesize narrative spine, propose visual + site + pipeline + calendar. **Halt for user approval.**
- **Mode 2 (after approval)** — Build visual system, stand up agentic.dog CMS, generate content, wire automation, execute 30-day calendar.

Do not start Mode 2 before explicit sign-off.

## Corrections Applied to Original Brief

| Brief said | Reality |
|---|---|
| agentic.develop / theagentic.develop | **codestories.platform** |
| hack.steve | **hack.ski** |
| ILS | `ils-ios` (+ family: `ils`, `ils-ILSBackend`) |
| Session Forward | `sessionforge` (+ `sessionforge-apps-dashboard`) |
| Code Stories | `code-tales` / `code-story-platform` / `code-tales-ios` / `code-story-rn` |
| Validation project | `validationforge` |
| Serena MCP | `knowledge-graph-memory` + `wiki` + project files |
| Skitch MCP | `tldraw` + `excalidraw` + Stitch skill (existing) |
| Claude Mem MCP | `context7` for library docs, `episodic-memory` for history |

## Real Product Inventory (from 2026-03-06 mine + GitHub 300 repos)

**Flagship / near-complete launch candidates:**
- `validationforge` (MDX, deployed beta, 1⭐, PRD v2.0.0 ready) — no-mock functional validation platform
- `sessionforge` (TypeScript, 5⭐) — Claude Code session tooling
- `ils-ios` (Swift, 1⭐) — iOS/macOS Claude Code client
- `code-tales` + `code-tales-platform` — narrated audio stories from repos (codestories.platform target)
- `auto-claude-worktrees` (Python CLI) — parallel worktree factory
- `claude-code-skills-factory` (Python) — evidence-based skill builder
- `multi-agent-consensus` (Python) — 3-agent unanimous-gate voting
- `shannon-framework` (Python, 2⭐) — 4-layer enforcement plugin
- `ralph-loop-patterns` (Python) — self-referential loop patterns
- `claude-prompt-stack` — 7-layer prompt engineering template
- `claude-ios-streaming-bridge` (Swift) — SSE bridge pattern
- `claude-sdk-bridge` — polyglot SDK bridge
- `stitch-design-to-code` — design-to-code workflow template

**Existing blog launch:** `agentic-development-guide` (1⭐, 11 deployed posts at site-rho-pied.vercel.app) + 61 companion repos pushed 2026-03-06.

**Existing mining infrastructure** (DO NOT rebuild): `scripts/deep-mine.py`, `scripts/output/full-mine-data.json` (stale 2026-03-06, 23,479 files, 27 projects), `~/.claude/skills/devlog-publisher/` (teammate pipeline skill).

**Fresh 30-day mine running now** at `scripts/output/mine-30d-data.json` (2,891 JSONL files in window) — background job `beno1m1vk`.

## Phase Index

### Mode 1 — Audit, Synthesize, Propose

| # | File | Status | Purpose |
|---|---|---|---|
| **00** | [phase-00-baseline-capture.md](phase-00-baseline-capture.md) | **pending (blocks 01)** | Zero-day snapshot of followers, stars, traffic, inquiries — measurement reference |
| 01 | [phase-01-audit-workstreams.md](phase-01-audit-workstreams.md) | pending | 7-8 parallel audit agents → reports in `research/` |
| 02 | [phase-02-synthesis.md](phase-02-synthesis.md) | pending | Narrative spine + insight library + unified product table + **voice-spec.md** |
| 03 | [phase-03-visual-system-proposal.md](phase-03-visual-system-proposal.md) | pending | Hyper-terminal theme, component library, diagram styles (tldraw + excalidraw) |
| 04 | [phase-04-cms-site-architecture.md](phase-04-cms-site-architecture.md) | pending | Stack selection (Astro+Keystatic), content model, IA, OG pipeline |
| 05 | [phase-05-publication-pipeline.md](phase-05-publication-pipeline.md) | pending | Canonical flow → LinkedIn (manual articles + scripted shorts), X, repo READMEs |
| 06 | [phase-06-30-day-calendar.md](phase-06-30-day-calendar.md) | pending | Day-by-day draft + streaming-publish rhythm |
| 07 | [phase-07-approval-package.md](phase-07-approval-package.md) | pending | Consolidate Phases 0-6 into sign-off document. **Halt here.** |

### Mode 2 — Build & Launch (requires approval) — reordered per strengthening package

| # | File | Status | Purpose | Est. hours |
|---|---|---|---|---|
| 08 | phase-08-visual-system-production.md | blocked (awaits P07) | Final logo/wordmark/component library exports | 16-24h |
| 09 | phase-09-cms-site-build.md | blocked | Stand up stack, implement models, templates, OG auto-gen | 40-56h |
| 09b | phase-09b-hack-ski-variant.md | conditional (if Option A) | Only if hack.ski = differentiated site | +16-24h |
| **13** | phase-13-consultant-pipeline.md | blocked | **Must complete BEFORE 12** — CTA must exist day 1 | 16-24h |
| 10 | phase-10-content-generation.md | blocked | Per-product: blog + LinkedIn long (manual) + short + X thread + README | 60-90h |
| 11 | phase-11-automation-infra.md | blocked | Syndication flows (62h breakdown), scheduler, credentials | 60-80h |
| 12 | phase-12-launch-execution.md | blocked | 30-day scheduled run + monitoring | 30-45h |
| 14 | phase-14-measurement-iteration.md | blocked | Post-30-day analytics, post-mortem, next-30-day plan | 16-24h |

**Mode 2 total:** 258-343 hours ≈ 9-12 weeks solo. 30-day push window is Phase 12 only; Phases 08-11 + 13 must complete BEFORE day 1.

## Brand Architecture (Authoritative)

- **agentic.dog** — umbrella: canonical blog, project index, work-with-me CTA. Where long-form originates.
- **codestories.platform** — Code Stories product site (audio narration of repos from `code-tales*` family).
- **hack.ski** — personal brand surface (distinct from the commercial umbrella).

Consistent positioning everywhere: full-time at agentic.dog, consulting available, collaboration open, **explicitly not job-seeking**.

## Acceptance Criteria (Mode 1 Delivery)

Mode 1 is "done" when:
- [ ] `reports/baseline-2026-04-19.yaml` captured and signed off (Phase 00)
- [ ] `research/` contains 7-8 audit reports (workstreams A-G, +H for existing content voice QA) with non-empty, sourced findings
- [ ] `synthesis/narrative-spine.md` names the throughline in one paragraph + maps every flagship product to ≥1 piece
- [ ] `synthesis/insight-library.md` lists 10-20 reusable claims with evidence pointers
- [ ] `synthesis/product-inventory.md` is the unified table (real names, motivations, launch-readiness grades)
- [ ] `synthesis/voice-spec.md` exists with 3 tone examples from Nick's actual past posts + banlist
- [ ] Phases 03-06 proposals exist with acceptance criteria
- [ ] Mode 2 effort estimates committed per phase (see Phase Index hours column)
- [ ] Phase 07 approval package renders a single decision document
- [ ] User approves metrics + kill-switch + all 9 remaining blockers before any Mode 2 work begins

## Decisions Locked In (user sign-off 2026-04-19)

1. **Domains:** agentic.dog, hack.ski, codestories.platform — **all three already purchased**. Mode 2 skips purchase; does DNS + Vercel domain-attach only.
2. **codestories.platform is NOT a website.** It's the repo/application storage location for Code Stories code. Actual Code Stories product domain (codetails.app or similar) TBD — filled in later. **Out of scope for this plan.**
3. **Stack:** **Astro + Keystatic + Tailwind v4 + Satori OG + Vercel** (agentic.dog AND hack.ski).
4. **hack.ski = clone of agentic.dog** — same brand, same visual system, same template, same pipeline. **Only copy differs** (agentic.dog AI-focused; hack.ski personal/general). One codebase → two Vercel deploys. Folded into Phase 09 (not a separate Phase 15).
5. **Voice guidelines** ("Opus 4.7 talking") live inside `/ckm:copywriting` (50 writing styles + extraction) and `/ckm:brand` (voice framework). No separate doc needed. Content pipeline invokes `ck:ckm:write:good` for voice calibration.
6. **Channels for 30-day push:** agentic.dog blog (canonical) + LinkedIn article + LinkedIn short + X thread + repo READMEs. **Substack and Medium skipped** this cycle.
7. **61 companion repos:** Re-announce **selectively** — pick 5-10 strongest, reframe under agentic.dog brand into 30-day calendar slots. Not a full re-launch, not a quiet archive.

## Pending Blockers (Round 3 Q&A — must resolve before Phase 01 spawn)

1. **hack.ski scope** — pick Option A (differentiate visually, +16-24h) / B (redirect landing, 2-4h, **recommended**) / C (drop this cycle)
2. **`260305-2119-devlog-publisher-website/` disposition** — pick Option A (complete first, +1-2wk) / B (absorb into Phase 09, **recommended**, requires user to describe 42 in-flight files) / C (retire+discard)
3. **Success metrics** — confirm 30-day floors: inquiries ≥3, LinkedIn +15%, X +10%, flagship stars +100, unique visitors 1000, time-on-page ≥3 min
4. **Kill-switch sign-off** — day-10 (inquiries=0 AND LinkedIn+5% AND stars+10) and day-20 (inquiries<2 AND flat engagement) tripwires
5. **Analytics tool** — Plausible / Vercel Analytics / PostHog (Plausible recommended)
6. **Consultant funnel mechanism** — embedded form / email direct / Calendly link (form → email → Calendly recommended, UTM per channel)
7. **Voice spec source** — derive from 3 existing Nick posts (which?) + custom banlist
8. **LinkedIn + X API credential handoff** — who/when/where (vault, env file, 1Password)
9. **X API paid tier budget** — $100/mo basic tier approved for write access?

## Non-blocking Open Items

- Code Stories product domain (codetails.app or alternative) — filled in later by user, does not block agentic.dog launch
- Which specific 5-10 of the 61 companion repos to re-announce — decided in Phase 06 after Phase 02 readiness grades

## Cross-Plan Dependencies

Scanned `plans/` (blog-series):
- `260305-2119-devlog-publisher-website/` (status: in-progress, `plan.md`, phase-02 + phase-04 modified) — **overlapping scope**: site build + new blog posts. Recommend: absorb into Phase 09 (CMS build) or complete/close before Mode 2. Flagged.
- `260306-1741-blog-consolidation/` (if present) — mining research reports referenced in MEMORY.md.

No hard `blockedBy` relationships — agentic.dog is new domain, new repo. Soft: Phase 09 should subsume or retire `260305-2119-devlog-publisher-website/` to avoid duplicate work.

## Next Action

Start Phase 01 (Wave 1 agents) after this plan is read.
