---
phase: 07
name: approval-package
status: pending
blockedBy: [phase-01, phase-02, phase-03, phase-04, phase-05, phase-06]
gate: user-approval-required
---

# Phase 07 — Mode 1 Approval Package (HALT GATE)

## Purpose

Consolidate Phases 01-06 into a single decision document the user reviews and approves (or edits) before any Mode 2 build work starts.

## Output: `approval-package.md`

Single document with these sections:

1. **One-page summary** — what agentic.dog becomes, who it's for, what the 30-day push ships
2. **Audit findings digest** — key facts from Workstreams A-G, citation-backed
3. **Narrative spine** — inlined from Phase 02
4. **Insight library** — inlined from Phase 02 (top 10 only; full list linked)
5. **Brand architecture** — agentic.dog / codestories.platform / hack.ski with positioning statement
6. **Visual system proposal** — rendered component samples from Phase 03, theme tokens summary
7. **Site architecture** — stack recommendation with alternatives table, IA diagram, content model sketch
8. **Publication pipeline** — canonical flow diagram, platform matrix, syndication runner choice
9. **30-day calendar** — day-by-day table from Phase 06
10. **Near-complete products ready for immediate completion + launch** — validationforge, sessionforge, code-tales family, ils-ios (per 30d mine evidence)
11. **Open questions** — full list copied from plan.md + any new ones surfaced
12. **Build effort estimate** — inlined table from strengthening package (Phases 08-14 totaled 258-343h, 9-12 weeks). NOT deferred to sign-off conversation — exists now.
13. **Decision asks (the user answers these to sign off — revised 2026-04-19):**
    - Success metrics: confirm 30-day floors (inquiries ≥3, LinkedIn +15%, flagship stars +100, visitors 1k)
    - Kill-switch: sign off on day-10 and day-20 tripwires
    - hack.ski scope: A (differentiate), B (redirect, recommended), C (drop)
    - `260305-2119-devlog-publisher-website/` disposition: A (complete first), B (absorb into 09, recommended), C (retire)
    - Analytics tool: Plausible / Vercel Analytics / PostHog (Plausible recommended)
    - Consultant funnel mechanism: embedded form / email direct / Calendly link (recommended: form → email → Calendly, UTM per channel)
    - Voice spec source: which 3 existing Nick posts to derive from + custom banlist
    - LinkedIn + X credential handoff location + timing
    - X API paid tier budget ($100/mo basic tier) approved?
    - Calendar: approved as-is, reorder, or trim?
    - Decisions already locked (no re-litigation): stack = Astro+Keystatic; domains = purchased; channels = blog+LinkedIn×2+X+repo (Substack/Medium skipped); 61 companion repos = selective 5-10 re-announce.

## Presentation

- Delivered as a single markdown file + an HTML export via `show-off` skill for a visual review
- Critical diagrams (publication flow, site IA) pre-rendered to PNG
- Length target: 15-25 pages when rendered

## Acceptance Criteria

- [ ] Document self-contained — a reader who never opened Phases 01-06 can make an informed decision
- [ ] Every recommendation has an explicit alternative + tradeoff
- [ ] Every open question is a yes/no or pick-one (no "what do you want?")
- [ ] User approves, edits, or redirects — **no Mode 2 work starts until explicit "yes" is recorded**
- [ ] Decision and direction captured in `synthesis/approval-record.md`

## Risks

- **Too long to read** — if the approval package exceeds 25 pages rendered, user defers decision. Mitigation: brutal summary discipline; details linked not inlined.
- **Decisions not actionable** — asking "what do you think?" kills momentum. Mitigation: every decision in section 13 is yes/no or pick-one with a recommendation.

## Next

Only after signed approval captured in `synthesis/approval-record.md`, Phase 08 (Mode 2 kickoff) unblocks.
