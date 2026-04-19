# Copywriter P10-C2 — Shannon ecosystem + fill

**Date:** 2026-04-19
**Agent:** P10-C2 (Opus)
**Scope:** Days 02, 15, 16, 17, 18 — 5 posts × 4 files = 20 deliverables
**Output path:** `/Users/nick/Desktop/blog-series/withagents-site/src/content/posts/`

---

## Deliverables (20 files, all present)

| Day | MDX | LinkedIn | X thread | README patch |
|---|---|---|---|---|
| 02 Multi-Agent Consensus (light-edit) | day-02-multi-agent-consensus.mdx | .linkedin.md | .x.md | .readme-patch.md |
| 15 Shannon Framework (light-edit of post-07 framing) | day-15-shannon-framework.mdx | .linkedin.md | .x.md | .readme-patch.md |
| 16 Shannon CLI (net-new ~1,020w) | day-16-shannon-cli.mdx | .linkedin.md | .x.md | .readme-patch.md |
| 17 Shannon MCP (net-new ~1,080w, lifecycle-retrospective frame) | day-17-shannon-mcp.mdx | .linkedin.md | .x.md | .readme-patch.md |
| 18 Shannon CC (net-new ~1,040w, "repo that isn't there yet" frame) | day-18-shannon-cc.mdx | .linkedin.md | .x.md | .readme-patch.md |

---

## Repo verification (Day -7 gate for Shannon ecosystem)

All four candidate Shannon repos checked via `gh api repos/krzemienski/...` on 2026-04-19 09:01:

| Repo | Status | Last push | Stars | Size | Open issues | Framing decision |
|---|---|---|---|---|---|---|
| shannon-framework | LIVE | 2026-03-10 | 2⭐ | 9.7MB | 7 | Tier 1 active — light-edit of post-07 with Shannon-first framing |
| shannon-cli | LIVE (branch: master) | 2026-03-25 | 1⭐ | 4.3MB | 3 | Tier 1 active — net-new, headless pipeline narrative |
| shannon-mcp | STALE | **2025-11-14** | 2⭐ | 27.7MB | 2 | Tier 2 reference — reframed as lifecycle retrospective per brief |
| shannon-cc | **DOES NOT EXIST** | — | — | — | — | Reframed as "repo that isn't there yet" — honest gap inventory |

The brief said: "If Shannon-MCP repo is abandoned, state in report and draft the post as a 'what we learned from this repo's life cycle' frame instead of fabricating." Same principle extended to shannon-cc for Day 18 since the repo does not exist at all — post now explicitly labels the gap, states the forcing-event contract, and sets a 3-month retirement check-in instead of inventing demo output.

---

## Voice gate (per voice-spec.md + H-audit.md)

Em-dash density (≤5 per 1,000 prose words cap):

| Day | Prose word count | Em-dashes | Density/1k | Verdict |
|---|---|---|---|---|
| 02 | ~1,680 | 8 | 4.8 | PASS |
| 15 | ~1,980 | 7 | 3.5 | PASS |
| 16 | ~1,020 | 5 | 4.9 | PASS |
| 17 | ~1,080 | 0 | 0.0 | PASS (post-trim pass 2) |
| 18 | ~1,040 | 0 | 0.0 | PASS (post-trim pass 2) |

Day 17 and Day 18 required a second em-dash-trim pass (first drafts included em-dashes in tier-map lists like `- shannon-framework — Tier 1`; all converted to commas or colons). Day 18 subtitle also had a cosmetic em-dash that got converted. Final counts re-verified via `grep -o '—' | wc -l` at 09:13.

Banlist scan (clean bash grep of post body, excluding voice-self-check comment blocks that list removed phrases):

| Phrase | 02 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|
| "Think about that for a second" | 0 | 0 | 0 | 0 | 0 |
| "Sound familiar" | 0 | 0 | 0 | 0 | 0 |
| "Here's the thing" | 0 | 0 | 0 | 0 | 0 |
| "fundamentally different" | 0 | 0 | 0 | 0 | 0 |
| "That's wild" / "Wild, right" | 0 | 0 | 0 | 0 | 0 |
| "It's not X, it's Y" | 0 | 0 | 0 | 0 | 0 |
| "Big difference." (closer) | 0 | 0 | 0 | 0 | 0 |
| "Ever tried [X]" | 0 | 0 | 0 | 0 | 0 |

Total banlist hits across 5 MDX files: **0**.

Day 02 light-edit specifically deleted:
- "Think about that for a second" (L56 of source)
- "Ever had a code review where the reviewer just... agreed with everything?" (L50)
- "Here's the thing." (L397)

Day 15 light-edit specifically deleted:
- "Here's the thing." (L18 of post-07)
- "Same energy." (L36)
- "Ever tried to remember your grocery list..." (L36)
- "Think about that for a second" (L283)
- "That's wild." (L283)
- "That's the whole game." (L229)

Each replacement checked for voice continuity — replaced with either sentence fragments or plain prose that preserves the rhythm.

Opener formula compliance (specific detail → one-sentence paragraph → failure stated before success):

| Day | Opener | Verdict |
|---|---|---|
| 02 | "One agent reviewed my streaming code and said looks correct. Three agents found a P2 bug on line 926 that had been hiding for three days." | PASS |
| 15 | "I had 14 rules in my CLAUDE.md. The agent followed 11 consistently. The other three... failed at rates that made them decorative." | PASS |
| 16 | "The Shannon framework ran inside Claude Code... Then the job became 'run Shannon outside the session.'" | PASS |
| 17 | "[shannon-mcp] has not had a push since November 14, 2025. Two open issues, neither responded to. 27.7MB of Python..." | PASS |
| 18 | "The Shannon ecosystem was supposed to be four surfaces... The fourth surface... `gh repo view krzemienski/shannon-cc` returns... 404." | PASS |

Warmth beat per post (exactly one, tied to artifact):

| Day | Warmth beat | Tied to |
|---|---|---|
| 02 | "three agents disagreed well. That is the thing worth keeping: not the framework, the disagreement." | `examples/streaming-audit/` + repo |
| 15 | "I was not expecting a single hook to shift the reading behavior that dramatically, but here we are." | the 4:1 → 9.6:1 read-to-write metric |
| 16 | "The repo is honest about that." | the three open issues on shannon-cli |
| 17 | "The repos that rest say something about the live ones." | shannon-mcp's idle `pushed_at` |
| 18 | "The repo will exist when the need does." | the forcing-event issue mechanism |

Self-deprecating admission (post 6 L355 / post 14 L434 template):

| Day | Admission |
|---|---|
| 02 | "I do not have a good answer for that yet. Maybe a novelty detector... Still thinking about it." |
| 15 | "After hundreds of sessions, something interesting happened. The agent stopped acknowledging the reminder in its output but still changed its behavior. Learned compliance. I am still not sure why that happens." |
| 16 | "I do not have clean answers for any of the three." (re: the 3 open issues) |
| 17 | "I am writing the post this way because pretending otherwise would break the only rule this series is here to defend." |
| 18 | "I do not love any of those either. The name being wrong is a sign that the concept is not crisp enough to ship." |

Aphorism discipline (≤1 per post):

| Day | Aphorism |
|---|---|
| 02 | "disagreement is the thing worth keeping" |
| 15 | "Shannon is not a document. It is a system. Treat it like one." |
| 16 | "The constitution is the contract; the runtime is the negotiable part." |
| 17 | "The repos that rest say something about the live ones." |
| 18 | "Shipping a portfolio honestly means labeling the holes." |

All 1 per post. PASS.

Rhetorical asides count (≤1 per post cap from H-audit): 0 across all 5 posts. Zero occurrences of "Imagine that," "Think about it," "you know that feeling when," or equivalent.

---

## Evidence citation integrity

Every quantitative claim traces to either:
- A real session JSONL via the existing post-02 / post-07 evidence base (already in the 23,479-session canon)
- A live `gh api` call on 2026-04-19 (Shannon repo states)
- The canonical voice-spec / insight-library / product-inventory documents

No fabricated metrics. Specific checks:
- post-02 line 926 `+=` vs `=` bug → traceable to existing post-02 source, the examples/streaming-audit/ directory is real
- 23,479 sessions, 1,370 skill invocations, 111 ExitPlanMode, 87,152 Read, 9.6:1 ratio → all from post-07 source
- 8 em-dashes / 4.8 per 1k on Day 02 → measured, not claimed
- shannon-mcp `pushed_at = 2025-11-14` → raw `gh api` output captured in session
- shannon-cc 404 → raw `gh repo view` error captured in session

No claims about shannon-mcp features that are not in its README. No claims about shannon-cc functionality beyond the voice-note ideation stage.

---

## File ownership compliance

Only touched:
- `withagents-site/src/content/posts/day-02-multi-agent-consensus.{mdx,linkedin.md,x.md,readme-patch.md}`
- `withagents-site/src/content/posts/day-15-shannon-framework.{mdx,linkedin.md,x.md,readme-patch.md}`
- `withagents-site/src/content/posts/day-16-shannon-cli.{mdx,linkedin.md,x.md,readme-patch.md}`
- `withagents-site/src/content/posts/day-17-shannon-mcp.{mdx,linkedin.md,x.md,readme-patch.md}`
- `withagents-site/src/content/posts/day-18-shannon-cc.{mdx,linkedin.md,x.md,readme-patch.md}`
- `plans/reports/copywriter-260419-P10-C2.md` (this report)

Did NOT touch: day-01, day-03..14, day-19..60, synthesis/*, research/*, phase-*-output/*, templates, layouts, astro.config, keystatic.config, content.config.ts, the seed posts (agent-workflows-operating-systems.mdx, real-product-work-in-the-layer.mdx).

---

## Schema compliance (Keystatic posts collection)

Every MDX frontmatter conforms to `src/content.config.ts` posts schema:
- `title`, `subtitle`, `slug`, `date`, `author`, `kind`, `tags`, `relatedProjectSlugs`, `readTime`, `excerpt` — all present
- `kind` is one of `essay | field-note | production-analysis`:
  - Day 02 → `production-analysis` (post-mortem of a real bug)
  - Day 15 → `essay` (system exposition)
  - Day 16 → `field-note` (observation on a small repo)
  - Day 17 → `field-note` (lifecycle observation on a stalled repo)
  - Day 18 → `essay` (portfolio-level argument about labeling gaps)
- `excerpt` ≤ 240 chars on all 5 (Day 17 was auto-trimmed by linter to fit the cap — intentional, retained)

---

## Unresolved Questions

1. **`relatedProjectSlugs` collision:** the content.config.ts projects collection does not yet contain `agent-contracts`, `runbooks`, `operator-ui` as populated content files (the seed posts also reference them). If those project MDX files do not land before publish, Astro will warn but not fail. Flagging for P10 lead to confirm which wave is responsible for scaffolding the projects collection.
2. **Day 18 LinkedIn/X naming of the fleet-runtime concept:** I kept "shannon-cc" as the working name throughout the companion files so search matches the existing voice-note reference, even though the post itself acknowledges the name is wrong. When the forcing event lands and a better name ships, all 4 Day-18 files need an alias update.
3. **Day 17 README patch lives on `shannon-mcp/README.md`** but that repo has been idle for 5 months and 2 open issues — is there a PR discipline question about pushing a new README commit to an otherwise-dormant repo? The patch itself is honest (labels the status), but mechanically it revives activity on a repo this post explicitly labels Tier 2.
4. **Day 18 README patch lives on `shannon-framework/README.md`** since shannon-cc does not exist. That means the `Shannon surface map` footer gets added to an active repo. Reviewer should sanity-check the footer tone against shannon-framework's existing README voice.
5. **Voice-self-check HTML comments are MDX-JSX `{/* ... */}` style** rather than HTML `<!-- ... -->` because MDX does not preserve raw HTML comments cleanly through the Astro renderer. If the brief required HTML comments specifically, these need conversion — but they remain visible in source and invisible in render either way.
6. **No Sonnet reviewer pass has run yet.** Wave 1b review per phase-10-agent-assignments.md is reviewer = Sonnet, model-different from writer (Opus). Report logs expected at `reports/voice-review-day-02-multi-agent-consensus.md` etc. I did not produce those; that's Wave 1b's lane.

---

## Summary

5 posts, 20 files, all voice-gate metrics under cap, 0 banlist hits, all Shannon repo states verified on 2026-04-19. Day 17 and Day 18 reframed honestly per brief when repo state demanded it (stale for MCP, nonexistent for CC). Every warmth beat tied to an artifact. One aphorism per post, none repeat across the five.

**Status:** DONE
**Summary:** All 20 deliverables written, voice-gated, evidence-cited. Day 17 and Day 18 explicitly reframed around repo-state truth (stale / 404) rather than fabricated. Em-dash density ≤4.9/1k on all posts after two-pass trim. Zero banlist hits.
**Concerns/Blockers:**
- `relatedProjectSlugs` entries reference projects not yet scaffolded (cross-wave dependency).
- Day 17 README patch commits to a dormant repo; Day 18 patch lands on the active framework repo instead of the nonexistent shannon-cc.
- No Sonnet review pass yet — that is Wave 1b's responsibility, flagged here for continuity.
