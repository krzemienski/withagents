---
phase: 02
name: synthesis
status: pending
blockedBy: [phase-01-audit-workstreams]
---

# Phase 02 — Pattern & Narrative Synthesis

## Purpose

Turn Phase 01's seven audit reports into three synthesis documents that become the source of truth for every subsequent phase.

## Outputs (in `synthesis/`)

### `synthesis/narrative-spine.md` (1-2 pages max)
- The single throughline connecting every product, session, and framework
- "Why custom frameworks, why SDK-first, why iOS, why voice/narration, why session tooling, why validation discipline — what collective pattern emerges"
- Named the **author's thesis** in one paragraph, the **evidence arc** in three (origin → pattern → stake)
- Every flagship product mapped to a chapter of the thesis

### `synthesis/insight-library.md`
- 10-20 reusable, portable claims drawn from the 30-day mine + flagship sessions
- Format per insight: `{claim}` + `{evidence pointer}` + `{best format: post/thread/article/talk}` + `{tied to products}`
- Examples to look for: "functional validation over test mocks", "3-agent unanimous consensus beats single-agent certainty", "SDK-first then GUI-second for power-user tooling", "hat-based loops converge faster than prompt-only orchestration"

### `synthesis/product-inventory.md`
- Unified table — **single source of truth** for every downstream phase
- Columns: real product name, GitHub repo, local path, origin date, last activity, motivation (why built), current state (done / near / in-progress / abandoned), launch-readiness (ready / 1-week / 1-month / 3-month), associated drafted content, planned calendar slot
- Mark **validationforge** as flagship (257 30d agent spawns), candidates for early-launch based on readiness evidence

## Method

- Read all 7 research reports (not subsets — full read, one pass)
- Write single-author voice, not committee prose
- Extract quotes from actual session transcripts where possible
- Every claim in the library cites a specific evidence pointer

## Acceptance Criteria

- [ ] Narrative spine fits in 2 pages, has one-paragraph thesis, does not list products (that's the inventory)
- [ ] Insight library has ≥10, ≤20 items, each with evidence + format + product tags
- [ ] Product inventory covers every flagship + every 30d-active project (59) with honest current-state
- [ ] No insight or product field marked "TBD" without a follow-up question in plan.md "Unresolved Questions"

## Risks

- **Synthesis drift** — without a strong thesis the content pipeline becomes generic. Mitigation: thesis written first, everything else gated on it being signed-off.
- **Over-inclusive inventory** — tempting to list all 300 GitHub repos. Mitigation: inventory only covers products with narrative weight, not every skill/template/fork.
