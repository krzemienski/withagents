# Red-Team Review — Unified Launch Remediation

**Reviewer:** Critic (adversarial)
**Subject:** `/Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/` (17 files)
**Date:** 2026-04-19

## Verdict: **REVISE**

Track A (A1/A2/A3) is genuinely well-structured with falsifiable evidence gates. Track C and operator-sustainability assumptions contain structural flaws that compound across 45+ days. This is a 275–315h plan masquerading as solo-executable.

---

## Per-Criterion Scoring

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Evidence quality in acceptance | **3** | Track A excellent (falsifiable, scripted). Track C drifts into vanity metrics. |
| 2 | Scope creep / YAGNI | **2** | C5 is 15h for work described as flop-acceptable. Carousels need non-existent Stitch pipeline. A/B testing <100-sub list is statistically invalid. |
| 3 | Fragile external systems | **2** | Single chain: Vercel edge → Satori fonts → <1MB bundle. Beehiiv 6h poll vs 9:20am runner is un-acknowledged race. |
| 4 | Missing dependency fan-out | **2** | `article-prep.ts` (B3:73, never created), `BEEHIIV_API_KEY` (B5:96 absent from B2.2), DKIM/SPF DNS missing. |
| 5 | Effort estimates | **2** | Track B 45–68h is the load-bearing lie. Realistic = 70–90h. |
| 6 | Operator sustainability | **1** | 45 days × 2.5–4h/day after 30–45h prep = burnout. Retros are theater. Solo Nick also runs VF customer discovery. |
| 7 | Solo-executable 45–60d? | **2** | ~35h synchronous real-time attention stacked on posting ops. Implicit team assumption. |
| 8 | ≥12 inquiries attribution | **2** | 50k–100k LI impressions → 500–1000 clicks → 5–15 inquiries. Upper edge of plausible, not robust. |
| 9 | Content-readiness testing | **1** | Biggest gap. Zero phases test content resonance with real readers. MEMORY.md records prior Wave-1 voice-drift restart — no pre-Day-1 evidence check. |
| 10 | B3/C1/C2/C3 synchronization | **2** | Time-zone collision: B3 PT, C1/C3/C4 ET (3h apart). Day 1 ~8h orchestration span. |

---

## Critical Issues (blocker)

1. **Beehiiv env vars missing from B2 but required by B5.2.** `BEEHIIV_API_KEY`/`BEEHIIV_PUBLICATION_ID` not in B2.2 Vercel env list. Metrics silently null from Day 1.

2. **`scripts/syndication/linkedin/article-prep.ts` referenced in B3:73 but never created.** B3.4 LinkedIn publish cannot execute Day 1.

3. **Launch date anchor inconsistency.** A5.5:74 hardcodes `ARC_START_MS = Date.parse('2026-04-19T00:00:00Z')`. 2026-04-19 is a **Sunday** — violates B1.1's Tue/Wed constraint.

4. **Two separate arc-date formulas.** A2.2 reads `LAUNCH_DATE + (day_n - 1)` from `.launch-date`. A5.5 hardcodes 2026-04-19. These diverge as soon as `.launch-date` ≠ 2026-04-19.

5. **No pre-publish content resonance gate.** Zero phases validate whether 45 pre-written posts work with real readers before launch. Contradicts MEMORY.md Wave-1 restart precedent.

---

## High-Severity Concerns

6. B3 runbook assumes deterministic calendar; C1.2 makes Article-vs-feed a daily judgment call.
7. Keystatic KISS gate (A1.3) silently removes the CMS editing story.
8. X channel removal creates data-integrity hole in B5.
9. B4.4 (X rate-limit trigger) is dead code post-A1.1.
10. 275–315h ÷ 45–60 days = 4.6–7h/day every day. Nick also runs VF customer discovery.
11. Reddit (C5) is 15h for 2–3 posts the plan admits may flop.
12. Subject-line A/B (C6.5) is statistically invalid but mandatory.

---

## Medium-Severity Concerns

13. A3 Playwright preview vs B2.8 prod alias has env divergence.
14. Reserve-post swap mutates `.syndication-state.json` via jq without lock protocol.
15. PH Launch #2 depends on `/consulting/` page with no builder.
16. C1.9 Company page Day-30 trigger doubles LI ops mid-run.
17. Beehiiv RSS 6h polling = 60h setup for output manually writable in 30min/week.
18. HN Day 22 "LI reactions ≥ threshold" has no numeric value.
19. Plan's "Open questions" contains deferred decisions masquerading as questions.
20. `.launch-date` created in B1.1 but A5.5 hardcoded violates B1.1 constraints.
21. A5.2/A5.4 reference `scripts/audit/keyword-position.ts` and `readability.ts` — creation not tasked.

---

## Kill-Darlings List (reduce 275h → ~180h)

1. **C5 Reddit strategic (full phase)** — save **~15h**.
2. **C1.8 Weekly Document carousels** — save **~30h**.
3. **C6.5 Subject-line A/B testing** — save **~4h**.
4. **C6.7 Beehiiv Boosts** — save **~3h**.
5. **C4.8 Day 35 skills-package HN backstop** — save **~3h**.
6. **C2.9 X Spaces** — save **~2h** decision overhead.
7. **C2.7 Thread-of-thread arc mapping** — save **~4h**.
8. **B3.7 manual Supabase UPDATE → nightly batch script** — save **~2h net**.
9. **C1.9 Company page (defer post-Day-60)** — save **~6h**.
10. **C1.7 Flagship connection-request sprint** — save **~6h**.
11. **C2.4 X authority-account reply sprint** — save **~8h**.
12. **C6.4 Segmentation triple** — save **~4h**.

**Add back ~8h:** Expand A5.6 `ckm:write` spot-verify to all 21 posts + pre-publish 5-reader sample for 3 flagships.

**Net: ~180h over 45 days = 4h/day avg.**

---

## Confidence: **2.85 / 5.0**

## Unresolved Questions

1. Is `.launch-date` ever reconciled with A5.5's hardcoded `ARC_START_MS`?
2. Who owns creation of `scripts/syndication/linkedin/article-prep.ts`?
3. Does A5.2/A5.4 depend on audit scripts from a prior phase?
4. What is the numeric Day 22 HN reactions-threshold (B1.4)?
5. Is the `/consulting/` landing page scope item in some phase?
6. How does plan reconcile Nick's concurrent VF customer-discovery obligations with 4–7h/day?

**Status:** REVISE — content delivered, critical issues surfaced, verdict clear.
