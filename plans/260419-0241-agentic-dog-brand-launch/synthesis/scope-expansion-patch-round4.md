# Round 4 Scope Expansion Patch — 2026-04-19

**Author:** Synthesis Agent SY-R4
**Date:** 2026-04-19
**Trigger:** User directives dictated 05:15–05:20 on 2026-04-19
**Supersedes:** Round 1/2/3 scope parameters — see Audit Trail

---

## Summary

Plan expanded from **30-day push / 18 posts / 3 flagships / 99 content pieces** to **45-60-day push / 45 posts / 5 flagships / ~156–193 content pieces**. Central narrative axis added: **SDK vs Interactive vs Non-Interactive** — every post tags a mode-bet; each product in 23,479 sessions is a wager on one of these modes, and the series stress-tests the wagers. LinkedIn channel matrix collapsed from Article + Short → **Article-only** (no Shorts). Effort re-estimate: **531–714h ≈ 18–24 weeks solo** (up from 258–343h / 9–12 weeks in R3).

---

## 11 Directives Applied

**R4-D1 — Central narrative axis (SDK vs Interactive vs Non-Interactive).**
Every calendar row and product-inventory entry now tags a mode-bet. SDK = writing code to steer the AI (Agent SDK, TypeScript/Python SDKs). Interactive = hooks, skills, custom setup (environment shaping). Non-Interactive = headless autonomous loops, Ralph-style self-referential execution. Mixed = products that deliberately cross modes. Narrative question under every post: *which mode did this product bet on, and what did 23,479 sessions reveal about that bet?* Each post's conclusion flows into the next post's premise — no orphan launches.

**R4-D2 — CCB family is flagship-tier.**
`claude-code-builder` (21⭐, Nick's top-traction agentic product) gets Day 10 flagship slot. Narrative: "Eighteen generations of an agent builder" covering 15+ Desktop generations (ccb, ccb-0612, ccb-0614, ccb-final, ccb-m0, ccb-mem0, ccbios, ccbios-enhanced, claude-code-builder, claude-code-builder-0614, claude-code-builder-agents-sdk, autonomous-claude-code-builder, ccb-ui). Day 11 covers CCBios (iOS CCB). Canonical-CCB decision required Day −10.

**R4-D3 — Shannon ecosystem multi-post coverage.**
4 repos → 4 posts: Shannon Framework (Day 15, v5.6.0 4-layer enforcement), Shannon CLI (Day 16, command-line stand-alone), Shannon MCP (Day 17, MCP server integration), Shannon CC (Day 18, cross-Claude-Code integration). Replaces R3's single-post Shannon coverage. Shannon-mcp repo status re-verified — R3 flagged abandoned; R4 re-scopes as active pending verification.

**R4-D4 — Ralph arc gets 3 posts.**
User correction: `ralph-orchestrator` (64-day arc / 336MB / 926 files / started 2026-01-21) is **Nick's code**, not external fork. R3 product-inventory row was wrong. 3 posts: Day 22 Ralph Orchestrator origin (flagship), Day 23 Ralph Orchestrator iOS, Day 24 RALPH protocol emergence from iOS communication. Ralph repo liveness verification required Day −7.

**R4-D5 — Expanded product inventory (+~18 products).**
New posts added for: live-mermaid-editor, autonomous-coder (54 agents / 160 files / 30d), awesome-list evolution (combined awesome-list-site + v2 + awesome-site), cc-setup (47 files / 36 agents burst), opencode-mobile (OSS coding agent + mobile), ai-digest + ai-digest-apps-worker (2-day sprint), claude-mobile-expo, claude-code-prd-creator (pre-code-access pattern), claude-sdk-bridge (strengthened from R3 short-slot to full post), ClaudeCodeSDK repo integration pattern, github-to-audio-pipeline + agent-sdk-podcast-gen (combined audio-from-repo story).

**R4-D6 — Skills are a first-class content track.**
Combined strategy: (a) 6 skill-of-the-week posts (devlog-publisher, functional-validation, ck-plan, visual-explainer, deepen-prompt-plan, ai-dev-operating-system) at days 34/36/37/38/39/40, (b) meta-post on skill design patterns at Day 35, (c) open-source package launch `agentic-dog-skills` bundle at Day 35 (flagship slot combines package launch + meta-post). Replaces R3's zero-skill-track posture.

**R4-D7 — Target: ~45 posts over 45-60 day push.**
User selected ~45 posts inside 45–60 day window. Breakdown: 18 existing blog-series posts (light-edit) + 27 new Round-4 posts = 45. New posts split: CCB family (2), Shannon ecosystem (4), Ralph arc (3), Skills track (8), Additional products (10), Meta-patterns (2). Rest week (days 30–33) retained. ~1 post per 1.3 active days.

**R4-D8 — LinkedIn: Article-only, drop LinkedIn Short entirely.**
Every post now = blog + LinkedIn Article (long-form 800–1,500 words, manual UI paste) + X thread + repo README. **LinkedIn Short column removed** from calendar. Effort impact: ~45 Articles × 3h = ~135h LinkedIn alone — the biggest single-channel time sink in the push.

**R4-D9 — Flagship quintet (5 flagships, not 3).**
Revised anchor days: Day 01 ValidationForge GA (unchanged), Day 10 CCB Evolution (NEW — 21⭐ top traction), Day 22 Ralph Orchestrator origin (NEW — 64d arc), Day 35 agentic-dog-skills package + meta-post (NEW), Day 50 SessionForge milestone + Code Stories dual-SKU + closing manifesto (COMBINED multi-product finale). Replaces R3's Day 1/Day 12/Day 30 trio.

**R4-D10 — Narrative flow: each post sets up the next.**
Calendar now includes mandatory `setup_for_next` column — one-line explanation of how each post's closing primes the next day's premise. Every row filled; flagship quintet rows include multi-sentence narrative annotations. No orphan posts.

**R4-D11 — Effort re-estimate.**
Previous (R3): 258–343h / 9–12 weeks solo / 30-day push / 18 posts. New (R4): **531–714h / 18–24 weeks solo / 45–60-day push / 45 posts**. Breakdown: visual (16–24h) + CMS build (40–56h) + content (~338h for 45 posts × 7.5h avg) + automation infra (60–80h) + consultant pipeline (16–24h) + push execution (45–68h) + measurement (16–24h) + 10% buffer (~50h).

---

## Files Modified (Round 4)

| File | Status | Notes |
|---|---|---|
| `synthesis/product-inventory.md` | **MODIFIED** (surgical) | Summary revised (32→50+ products tagged), flagship trio→quintet, Shannon ecosystem + Ralph arc + CCB family + Skills track + R4-D5 products added, Mode-bet column added to master table |
| `synthesis/calendar-30day.md` | **ARCHIVED** (do not execute) | Kept on disk as audit trail; superseded |
| `synthesis/calendar-45day.md` | **NEW** | 45-row calendar (extensible to 60), `setup_for_next` mandatory column, Mode-bet column, LinkedIn Short removed, flagship quintet annotated |
| `synthesis/approval-package.md` | **MODIFIED** (surgical) | §1 summary rescoped, §9 week-view expanded 4wk→8wk, §10 near-ready list expanded, §11 effort 258–343h→531–714h, §15 new decision ask added, §13 metrics floors raised for 45-post scale |
| `synthesis/scope-expansion-patch-round4.md` | **NEW (this file)** | Patch log + audit trail |
| `synthesis/narrative-spine.md` | **UNTOUCHED** | Thesis holds at 45-post scale |
| `synthesis/voice-spec.md` | **UNTOUCHED** | Voice rules unchanged |
| `synthesis/insight-library.md` | **UNTOUCHED** | Insights hold |
| `research/*` | **UNTOUCHED** | Research base unchanged |
| `reports/*` | **UNTOUCHED** | Round-1-to-3 review history preserved |
| `plan.md` | **UNTOUCHED** | 9 locked decisions from R1-R3 preserved |

---

## Effort Delta

| Dimension | Round 3 | Round 4 | Delta |
|---|---|---|---|
| Push length | 30 days | 45–60 days | +50–100% |
| Post count | 18 | 45 | +150% |
| Flagship count | 3 | 5 | +67% |
| Content pieces | 99 | ~156–193 | +58–95% |
| LinkedIn pieces | 24 Shorts + 14 Articles = 38 | ~42–52 Articles, 0 Shorts | -0 count, +3x effort per piece |
| X threads | 22 | ~40–48 | +82–118% |
| Pre-push drafting | ~54h | ~110h | +104% |
| During-push execution | ~138h | ~285h | +107% |
| Mode 2 total (incl. runway) | 258–343h / 9–12wk | **531–714h / 18–24wk** | **+106%** |

---

## Risks (Round 4 additions)

1. **LinkedIn Article burden is the biggest time sink.** 45 Articles × 3h = 135h. If drafting slips, manual UI paste backlog compounds daily. **Mitigate:** pre-draft all flagship + Shannon + Ralph + Skills-track Articles (25 articles ≈ 75h) before Day 1.

2. **Sequential narrative flow creates dependency chains.** Miss post N → post N+1's `setup_for_next` feels orphaned. **Mitigate:** 3 reserve insight posts (up from 2) pre-drafted as emergency swap-ins; every flagship has explicit fallback in Risk Gates.

3. **45–60 day push stretches energy-collapse risk.** R3 flagged Week 2-3 collapse risk with 30-day push; R4's doubled scope amplifies this. **Mitigate:** explicit rest week (Days 30–33), 5 off-days total, kill-switch tripwires inherited from approval-package §12.

4. **User must confirm 531–714h Mode 2 burden before sign-off.** R3 approval was for ~258–343h. R4 doubles that. **Explicit decision ask added to approval-package.md §15.**

5. **Canonical-CCB and Ralph-repo verification are Day −10/−7 hard blockers** — if either slips, flagship slots (Day 10, Day 22) collapse to fallback.

6. **Shannon-MCP repo status** — R3 flagged abandoned; R4 treats as active. If GitHub state confirms abandoned, Day 17 post loses anchor. **Mitigate:** verify Day −7; if abandoned, collapse Shannon arc back to 2 posts (Framework + CLI) and redistribute Days 16–18.

7. **Skills-track package (`agentic-dog-skills`) requires building an OSS package before Day 35 launch.** Not a content deliverable — a software deliverable. Add to Mode 2 effort as separate line item (~20–30h extra not included in 531–714h range).

---

## Audit Trail

- **Round 1 (Phase 01–07):** initial plan — 30-day push, 18 posts, 3 flagships, 99 pieces.
- **Round 2:** red-team review (5 show-stoppers flagged) + deepen package (8 surgical redlines).
- **Round 3:** 9 blockers resolved (metrics, kill-switch, LinkedIn policy, voice drift guardrail, baseline decision, devlog absorption, hack.ski drop, manual-publish budget, syndication scope correction). Plan committed at commit c7c765c.
- **Round 4 (this patch):** scope expansion to 45 posts / 45–60 day push / SDK-vs-Interactive-vs-Non-Interactive thesis / LinkedIn Article-only / flagship quintet / 531–714h re-estimate.

---

## Unresolved After This Patch

1. **User acknowledgment of 531–714h Mode 2 burden.** Required before Mode 2 kickoff. See approval-package.md §15 new decision ask.
2. **Canonical-CCB decision** — Day −10 deadline. `claude-code-builder` (21⭐) is the natural pick; awaiting confirmation it's the repo that gets the Day 10 flagship anchor.
3. **Ralph-orchestrator repo liveness + ownership confirmation** — R3 product-inventory tagged it external fork. User correction says Nick's code. Verify GitHub remote state Day −7.
4. **`ralph-orchestrator-ios` separate-repo-or-subfolder** — affects Day 23 repo README slot.
5. **Shannon ecosystem repo states** — especially shannon-mcp; R3 flagged abandoned, R4 treats active. Verify Day −7.
6. **`agentic-dog-skills` package build** — 10-skill curated bundle. Skills selection pending; build effort not in 531–714h range.
7. **2 ambiguous user-dictation items** — "Departed" (meaning unresolved; treating non-blocking) and "text video access asset" (interpreted as Day 49 github-to-audio pipeline per user's proceed-on-guesses approval).
8. **Code Stories product name** — still open from R3 (Q2 in product-inventory.md). Affects Day 50 finale copy.
9. **Newsletter platform disposition in R4** — R3 had 5 retired newsletters needing regen post-platform-decision. R4 drops newsletter from channel matrix entirely. Is newsletter fully out-of-scope or Week-9+ opt-in? Silent in approval-package.
10. **60-day extension trigger** — if pre-push slips past ~110h, does calendar stay 45-day or stretch to 60? Needs sign-off pre-push.
