# Phase C7 — Deferred Items (kill-darlings registry)

**Owner:** n/a — documentation-only register
**Effort:** 0h (tracking only)
**Status:** deferred (post-Day-60 reconsideration)

## Context

Red-team critic kill-darlings list + architect single-operator capacity finding: the original plan budgeted ~200h of Track C against a 45-day window for a single operator also running VF customer discovery. Net-of-kills target: **~130h Track C, ~205–245h total plan**. This phase inventories what was cut, with the trigger for reconsidering each.

All items remain tracked here so Day-60 retro can revisit with actual-data decision criteria, not imagined ones.

## Deferred items

### D1. Reddit strategic drops (was C5)

- **Deferred from:** C5 entire phase (~15h)
- **Rationale:** plan admits 2–3 posts "may flop"; r/programming LLM-ban already removed the highest-value sub. 15h for flop-expected work fails YAGNI.
- **Reconsider when:** Day 45 retro shows <400 Plausible sessions/week AND Nick has a specific sub (not r/programming) with established karma.
- **Replacement:** organic inbound only if someone else posts to Reddit; Nick responds in comments.

### D2. Weekly Document carousels (was C1.8)

- **Deferred from:** C1.8 (~30h across 6 weeks)
- **Rationale:** Stitch pipeline for PDF carousels non-existent. 30h builds a new content format rather than amplifying the 18 existing Articles.
- **Reconsider when:** any flagship Article breaks 50k impressions — then a carousel recap of that week is worth 5h.

### D3. Subject-line A/B testing (was C6.5)

- **Deferred from:** C6.5 (~4h)
- **Rationale:** Beehiiv free tier doesn't support A/B; upgrade cost + list <100 for first 14 days = statistically invalid. Single-subject ships.
- **Reconsider when:** list ≥1000 subscribers (probably post-Day-60).

### D4. Beehiiv Boosts paid acquisition (was C6.7)

- **Deferred from:** C6.7 (~3h decision overhead + $ spend)
- **Rationale:** paid acquisition before product-market fit with organic is backwards. Zero inquiries in B4.2 trigger means we haven't validated the offer.
- **Reconsider when:** ≥12 inquiries landed (hit consulting target) AND organic sub rate is flat.

### D5. Day-35 skills-package HN backstop (was C4.8)

- **Deferred from:** C4.8 (~3h)
- **Rationale:** 3 HN submissions in 50 days is already heavy; 4 burns account karma if Day 22 or Day 50 falters. HN Day 50 manifesto is the backstop for Day 22 skip.
- **Reconsider when:** Day 22 skipped AND Day 30 retro shows HN referrals <200 sessions. Explicit Day 30 decision gate.

### D6. X Spaces (was C2.9)

- **Deferred from:** C2.9 decision (~2h)
- **Rationale:** live audio requires synchronous 1h commitments incompatible with daily publish cadence. Post-Day-60 activity if inquiries warrant.

### D7. Thread-of-thread arc mapping (was C2.7)

- **Deferred from:** C2.7 (~4h)
- **Rationale:** meta-threads linking prior threads are second-order content that only works if the first-order threads land. Validate first-order first.
- **Reconsider when:** Day 30 retro shows 3+ X threads >5k impressions.

### D8. Nightly batch script for B3.7 Supabase UPDATE (was B3.7 alt)

- **Deferred from:** B3.7 manual UPDATE replaced by nightly cron (~2h net)
- **Rationale:** manual UPDATE in B3.7 takes 30s/day × 45 days = 22 min total. A nightly script costs 2h to build + debug. YAGNI until manual proves annoying.
- **Reconsider when:** Nick logs "this 30s step is annoying" 3+ times in daily retro.

### D9. Company page Day-30 trigger (was C1.9)

- **Deferred from:** C1.9 (~6h)
- **Rationale:** personal profile outperforms Company page on LinkedIn for individuals (R2 §1.8). Creating a Company page mid-launch doubles LI ops surface.
- **Reconsider when:** Day-60 retro; if continuing past 60 days, create then.

### D10. Flagship connection-request sprint (was C1.7)

- **Deferred from:** C1.7 (~6h)
- **Rationale:** 60 personalized connection requests across 6 flagships = 6h + LinkedIn rate-limit risk. Higher ROI from replying to every comment (C1.5 kept).
- **Reconsider when:** Day-45 retro if LI followers delta <+200.

### D11. X authority-account reply sprint → opportunistic only (was C2.4 daily)

- **Scope-reduced from:** daily C2.4 sprint to opportunistic replies only (~8h saved)
- **Rationale:** daily authority-account engagement is a full-time PR job. Opportunistic replies (when an authority engages with Nick's thread) preserve the network benefit at 1/10th cost.
- **Operating rule:** if an authority account replies to Nick, reply within 4h. Don't proactively seek.

### D12. Segmentation triple for Beehiiv (was C6.4)

- **Deferred from:** C6.4 (~4h)
- **Rationale:** 3-segment newsletter with <300 subs = 100/segment, statistically meaningless. Single list ships.
- **Reconsider when:** list ≥1500 subscribers.

## Cumulative savings

| Item | Effort saved |
|---|---|
| D1 Reddit | 15h |
| D2 Carousels | 30h |
| D3 Subject A/B | 4h |
| D4 Boosts | 3h |
| D5 HN backstop | 3h |
| D6 Spaces | 2h |
| D7 Thread-of-thread | 4h |
| D8 Nightly batch | 2h |
| D9 Company page | 6h |
| D10 Connection sprint | 6h |
| D11 X authority sprint | 8h |
| D12 Segmentation | 4h |
| **Total** | **~87h** |

Track C drops from ~200h → ~113h (net after A7 add-back of 8h for resonance = **~121h**). Total plan: 275–315h → **205–245h**.

## Add-backs

- **+8h A7 content resonance gate** — 5 readers × 3 flagships + Opus synthesis + full-arc `/ckm:write:audit` (4.1 upgrade from 5-sample to 45-sample).

## Operating rule

Any re-activation from C7 MUST:
1. Document the metric trigger that justifies re-adding the work.
2. Re-enter as a proper phase file (phase-C5.1-*.md etc.) with its own risk table.
3. Update plan.md acceptance criteria explicitly.

No silent re-adds — that's how the plan bloated to 275h in the first place.
