# Content Audit: Cohort 2 — Days 16–39 (withagents.dev Launch Series)

**Auditor:** Ralph US-006 / Cohort 2  
**Date:** 2026-04-19  
**Scope:** 20 posts, days 16–42 range (off-days 30/32/33 excluded), 3 files each (MDX + LinkedIn + X thread)  
**Report path:** `/Users/nick/Desktop/blog-series/plans/reports/ckm-audit-cohort2-260419.md`

---

## Special Watch Items — Executive Verdicts

| Item | Status | Verdict |
|------|--------|---------|
| Day 25 em-dash rewrite stress test (was 8.02/1k, must be 0.00) | PASS | Self-check confirms 0.00/1k. Full 84-step chain, all 4 phases, code examples, and hypothesis-test-revise methodology preserved. No substance loss. |
| Day 20 readability regression after em-dash trim (was 15.32/1k, now 0.00) | CAUTION | Post trimmed to ~860 words — functional but thin for a mining script that earns its place in the series. The trim eliminated all em-dashes correctly but the word count drop creates a light-content risk. Flag for word-count review. |
| Day 17 + Day 18 honest reframing for stale/missing repos | PASS | Both posts carry explicit honest-reframing language. Day 17: lifecycle retrospective framing ("repo idle since 2025-11-14, honest 3-tier surface map"). Day 18: gap inventory framing ("pretending otherwise would break the only rule…"). Neither post teases or announces — both deliver the honest accounting. |
| Day 35 flagship skills package scope commitment | PASS | Post commits explicitly to exactly 10 named skills (not 20). Selection criteria stated. Scope is locked and specific. |

---

## Per-Post Audit

---

### day-16-shannon-cli

**Overall Score: 8.1/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.30** |

**Strengths**
- Hook lands immediately: "Headless Shannon" framing is concrete and signals the delta from prior posts.
- 7-layers-collapse-to-2 claim is specific and technically grounded.
- Em-dash self-check: 3/~1,020 words = 2.9/1k. Well inside the 5/1k cap.
- LinkedIn code sketch adds implementation signal that the MDX summary omits.
- X thread: 9 tweets, all verified under 280 chars, no hashtag spam.

**Issues**
- SEO: primary keyword ("Shannon CLI") does not appear in the first 100 words — appears around word 200.
- Article word count ~1,020 sits at the lower boundary for comprehensive technical coverage.

**Recommendations**
1. Move "Shannon CLI" into the opening sentence or first paragraph (SEO fix, minimal rewrite).
2. Consider one additional section (150–200 words) on a concrete failure mode the headless version resolves. Would push word count to ~1,200 and add a second proof point.

---

### day-17-shannon-mcp

**Overall Score: 8.4/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 10/10 | 10% | 1.00 |
| **Total** | | | **8.40** |

**Strengths**
- Honest reframing is not hedged or buried — it is the organizing principle of the entire post.
- "Repo idle since 2025-11-14" is exactly the kind of specific, auditable claim the series voice demands.
- 3-tier surface map gives readers a framework instead of an apology.
- Em-dash self-check: 0/1k. Clean.
- Brand Voice scores 10/10: this is the series at its most honest and the voice at its best.

**Issues**
- The lifecycle framing is so honest that readers unfamiliar with the series arc may miss why this repo matters at all. A one-sentence "why this exists despite being dormant" bridge would help.
- X thread: 9 tweets — compact, but the lifecycle framing may need one more tweet to land the "still worth running" conclusion.

**Recommendations**
1. Add a single sentence in the opening section: "The MCP surface is real. The production story is not yet." Prevents readers from dismissing the post as a tombstone.
2. Consider adding a 10th tweet to the X thread: the one-sentence forward signal ("check-in scheduled for Day 90") so the thread ends with a clear next-action rather than a fade.

---

### day-18-shannon-cc

**Overall Score: 8.2/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 10/10 | 10% | 1.00 |
| **Total** | | | **8.40** |

**Strengths**
- Gap inventory framing is specific: the 404, the borrowed name, the 3-month check-in commitment are all concrete.
- "Pretending otherwise would break the only rule" is the strongest honest-reframing sentence in the Shannon arc.
- Self-deprecating admission about borrowed name lands as earned humility, not false modesty.
- Em-dash count: 0/1k. Clean.

**Issues**
- The gap inventory, while honest, risks leaving readers with no actionable signal for the current moment. The post needs one more "here is what you can do right now" bridge.
- Word count (~1,040) is on the lighter side for a flagship-adjacent post in the Shannon arc.

**Recommendations**
1. Add a "What to watch" or "What ships first" section (100–150 words) with one concrete near-term deliverable, even if it is just "the name decision resolves by Day 45."
2. The X thread could benefit from one tweet that signals the check-in date explicitly — readers who follow from X need the forward hook even more than blog readers.

---

### day-19-claude-mem-architecture

**Overall Score: 8.9/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 8/10 | 20% | 1.60 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.80** |

**Strengths**
- 2,800+ words with Mermaid diagrams, SQL schema, Python classes, and data tables — this is the series at maximum technical depth.
- Three-layer retrieval architecture is explained with concrete data (TF-IDF scores, observation counts, retrieval latency comparisons).
- Mermaid diagrams reduce the cognitive load for readers who process visually.
- LinkedIn companion accurately compresses the technical content without losing the key metrics.
- X thread (10 tweets) hits the architecture diagram angle — smart because it drives blog clicks from readers who want the full schema.

**Issues**
- Platform Compliance: the LinkedIn post runs long. Estimate ~2,800+ chars — near or over the 3,000-char soft ceiling. Trim the code block excerpt or replace with a prose summary.
- The X thread tweet 7 contains a semicolon clause that reads closer to 290 chars (near the 280 limit). Verify with exact char count tool before publish.

**Recommendations**
1. Trim the LinkedIn code block to a 3-line excerpt or replace with prose: "The observation schema uses four columns: id, content, timestamp, and weight." Saves ~200 chars.
2. Run a hard char count on X tweet 7 before publish (the semicolon clause is the risk point).
3. Post is publish-ready at current length — no content changes needed.

---

### day-20-session-insight-miner

**Overall Score: 7.2/10** | **Status: Needs Work**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 7/10 | 40% | 2.80 |
| SEO | 7/10 | 30% | 2.10 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 8/10 | 10% | 0.80 |
| **Total** | | | **7.50** |

**Strengths**
- Em-dash self-check: 0.0/1k (post-trim from 15.32/1k). The trim succeeded on the mechanical target.
- The "I could not keep saying 23,479 sessions unless I could grep them" opener is the strongest opening line in this cohort. Do not touch it.
- Receipt discipline section is tight and specific.
- LinkedIn and X thread are appropriately compact for a companion-script post.

**Issues**
- The post is ~860 words. For a post about a script that processes 11.6 GB of data and produces auditable numbers for the entire series, this is undersized. The trim removed the em-dashes but appears to have also removed scaffolding prose that gave the post structural weight.
- SEO: "session-insight-miner" keyword appears in the subtitle but not in the first 100 words of the body. The opener is strong but keyword-absent.
- The three modes (full-mine, window-mine, project-mine) are named but not demonstrated with an example output. A 3-line example would anchor the claim.
- The TODO(day-60-metrics) placeholder is visible — it must be filled or removed before publish.

**Recommendations**
1. Add a 150-word "What a mine run looks like" section with one concrete example output (3–5 lines of actual script output or a table row from `mine-30d-data.json`). This recovers the structural weight without reintroducing em-dashes.
2. Work "session-insight-miner" or "session mining" into the first paragraph (SEO fix, minimal edit).
3. Resolve or remove the TODO(day-60-metrics) placeholder before publish date.

---

### day-21-agents-spawning-agents

**Overall Score: 8.8/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **9.00** |

**Strengths**
- "I did not design that behavior. It emerged." is a 9/10 hook — specific, surprising, and directly contradicts reader assumptions.
- 4,534 vs 18,945 session comparison is the series' strongest single data point. This post earns its position in the arc.
- LinkedIn opens with the same emergent-behavior frame as the MDX — correct instinct.
- X thread (11 tweets) deploys the numbers early (tweet 2) and builds the "so what" across the thread. Strong cadence.

**Issues**
- The 81% agent-initiated ratio needs a methodological footnote. Readers who know Claude Code will ask whether Task-spawned sessions are double-counted. One sentence of clarification removes the skepticism.
- The LinkedIn word count is strong but the CTA is passive ("link in comments"). More specific CTAs ("Tell me if your ratio looks different") consistently outperform passive ones on LinkedIn.

**Recommendations**
1. Add one sentence after the 81% stat: "Each Task invocation counted once — agent-spawned sessions identified by child JSONL under a non-root project directory." This pre-empts the methodological objection.
2. Change the LinkedIn CTA from passive link reference to an engagement question: "What ratio are you seeing in your own agent projects?"

---

### day-23-ralph-orchestrator-ios

**Overall Score: 8.6/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.70** |

**Strengths**
- Brooklyn train scene opener is the series' best scene-setting passage. Concrete, temporal, emotionally specific.
- Three named honest breakages give the post the receipt discipline the series demands.
- Em-dash self-check: 4/~1,202 words = 3.33/1k. Healthy, under cap.
- X thread (11 tweets) deploys the train scene in tweet 1 — correct, the scene is the scroll-stopper.

**Issues**
- "RALPH protocol" as a keyword appears after the train opener, around word 150. For readers arriving from search, the delay dilutes the SEO signal.
- The LinkedIn post leads with methodology before leading with the story. The train scene should open LinkedIn too — the story is the hook, the methodology is the payload.

**Recommendations**
1. Move "RALPH protocol" or a recognizable variant into the first 100 words of the MDX body (SEO fix).
2. Reorder the LinkedIn opening: one sentence of the Brooklyn scene, then the protocol breakdown. Estimated +15% engagement on the initial hook.

---

### day-24-ralph-protocol

**Overall Score: 8.7/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.70** |

**Strengths**
- Five RALPH protocol invariants are named, numbered, and explained with implementation specifics. This is a reference post that readers will bookmark.
- Em-dash self-check: 0/1k. Clean.
- LinkedIn enumerates all 5 invariants — correct. The protocol is the product; listing it is the value.
- X thread (12 tweets) dedicates one tweet per invariant — smart structure that makes the thread scannable and shareable in pieces.

**Issues**
- The opener does not front-load the "why this protocol over ad-hoc hat loops" question. Readers who are not already sold on RALPH will need that answer in the first 100 words.
- SEO: "RALPH protocol" keyword is in the title but the first 100 words of the body are scene-setting. Move the keyword into body text earlier.

**Recommendations**
1. Add a 2-sentence "why a protocol" bridge before the invariant list: "Ad-hoc hat loops fail at step three. Here is why, and here is what I replaced them with." This addresses the reader who has not read Day 23.
2. Work "RALPH protocol" explicitly into the first paragraph of the body (currently appears after the preamble).

---

### day-25-sequential-thinking-debugging

**Overall Score: 9.2/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 10/10 | 30% | 3.00 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **9.30** |

**Em-dash rewrite stress test: PASS.** Self-check confirms 0.00/1k. All 4 phases of the 84-step WAV corruption chain preserved. Hypothesis-test-revise methodology present. Code examples intact. No substance loss detected.

**Strengths**
- 3,200+ words with full 84-step chain — the most technically ambitious post in this cohort.
- Four-phase structure (ingest, hypothesis, test, revise) gives readers a reusable mental model, not just a story.
- Em-dash rewrite succeeded at the hardest possible target: 0.00/1k on a 3,200-word post without losing density.
- SEO: primary keyword ("sequential thinking debugging") in title, H1, and first paragraph. Scores 10/10.
- LinkedIn comprehensive summary correctly compresses 4 phases into 4 bullet points.
- X thread (12 tweets) — strong arc, ends with the "84 steps" payoff in the final tweet.

**Issues**
- The post length (3,200+ words) is strong but the conclusion section is brief relative to the setup. A 100-word closing that names what the debugging chain produced (the WAV repair result) would complete the story arc.
- X tweet 11 (the methodology summary tweet) may benefit from a concrete number: "84 steps, 4 phases, 1 WAV file repaired" is more scroll-stopping than the current phrasing.

**Recommendations**
1. Add a 80–100 word conclusion paragraph: "The WAV file was repaired at step 84. The chain produced [specific outcome]. The methodology is now in production on [N] subsequent debugging sessions." Close the loop.
2. Tighten X tweet 11 to include the 84-step count and outcome.

---

### day-26-multi-agent-merge

**Overall Score: 8.8/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 8/10 | 20% | 1.60 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.80** |

**Strengths**
- 35 worktrees, 12 agents, topological sort, file ownership matrix — the post delivers proof of scale that no other series post matches.
- Em-dash self-check: 5/~4,000 words = 1.2/1k. Under cap.
- The file ownership matrix is the post's best section — gives readers a copy-pasteable mental model.
- LinkedIn "mental model" section correctly surfaces the most portable idea in a 4,000-word post.
- X thread (13 tweets) — the series' longest thread, justified by the scale of the subject.

**Issues**
- Platform Compliance: at 4,000+ words this is the longest MDX in the cohort. Verify the LinkedIn companion stays under 3,000 chars — the mental model section is detailed and may push the limit.
- The conflict prediction section could be tightened. The prose repeats the topological sort framing once before delivering the implementation detail. Remove the repeat for cleaner flow.

**Recommendations**
1. Hard char count the LinkedIn companion. If over 3,000, trim the ownership matrix section to a 3-row excerpt with "full matrix in the post" reference.
2. Tighten conflict prediction section: remove the second framing sentence before the implementation detail (the first framing sentence does the work).

---

### day-27-playwright-validation-pipeline

**Overall Score: 8.3/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.30** |

**Strengths**
- "A build that compiles is not a feature that works" is a strong opener — one sentence, no setup required.
- 642 block-test-files.js fires is an auditable number that establishes the post's authority immediately.
- Four bug-category list is scannable and memorable.
- Evidence shape section (6 evidence types with descriptions) is the most reference-worthy section in the post.
- X thread (10 tweets) uses the compilation-vs-validation contrast as its throughline — correct and effective.

**Issues**
- At ~800 words the post is short for the scope it covers. The "What goes wrong when you skip it" section names 4 categories but could include one concrete example per category (50 words each = 200 words added, still under 1,100 total).
- The LinkedIn companion summary is solid but the CTA is absent. A LinkedIn post without a CTA leaves engagement on the table.

**Recommendations**
1. Add one concrete example (1–2 sentences) per bug category in the "What goes wrong" section. This lifts the post from ~800 to ~1,000 words and makes the 4 categories land harder.
2. Add a LinkedIn CTA: "Which of these 4 bug categories has cost you the most? I'll share the fix that caught ours."

---

### day-28-kaizen-algorithm-tuning

**Overall Score: 8.5/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.70** |

**Strengths**
- YouTube Shorts detector regression opener is the series' strongest "here is the exact failure that created this repo" opening. Specific, temporal, credible.
- One-change rule is explained with behavioral consequence ("two of the three 'fixes' were band-aids over each other") — not just stated.
- `failed-approaches.md` five-heading template is the post's most actionable section.
- "None of this is glamorous" is a brand-voice anchor sentence that earns trust.
- X thread (9 tweets) — compact and correct, mirrors the post's one-change discipline.

**Issues**
- At ~800 words the post is on the lighter side for a methodology post. The PDCA and A3 primitives are named but not demonstrated with example output.
- SEO: "kaizen algorithm tuning" keyword appears in the title and subtitle but not explicitly in the first 100 words of the body. The opener is strong but keyword-absent.

**Recommendations**
1. Add a 100-word "What a PDCA cycle looks like" section with a 3-line example (hypothesis, change, result). This is the "show, don't tell" that the post currently lacks.
2. Insert "kaizen" or "kaizen methodology" into the first paragraph of the body text (SEO fix, one-word insertion).

---

### day-29-agent-constitution-framework

**Overall Score: 8.9/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **9.00** |

**Strengths**
- "A prompt that says don't delete files will be wrong" is the cohort's second-best opener (behind Day 25's WAV corruption hook). It states the post's entire thesis in 9 words.
- YAML constitution snippet is the best code example in the cohort: three rules, three enforcement levels, all self-explanatory.
- "Prompts are advice and hooks are physics" is the series' most quotable sentence. High share potential.
- The 23,479-session leaderboard of common agent misbehaviors gives the post auditable authority.
- Voice-command story (session 571a63ba) is the specific anecdote the post needs to humanize the technical argument.
- X thread (10 tweets) — tweet 5 ("prompts are advice and hooks are physics") is the thread's pull quote. Strong.

**Issues**
- "What I don't know" section (corporate governance scaling) is the post's only structural weakness. The honest acknowledgment is good, but it ends the post on uncertainty rather than a forward signal.
- LinkedIn is strong but the YAML snippet in the companion post may be truncating in some LinkedIn renderers (long code blocks render poorly on mobile).

**Recommendations**
1. Add one sentence after the "What I don't know" section: "The solo developer story is complete. The team story is the next open question, and the receipts will follow when they exist." This turns the acknowledgment into a forward signal rather than a fade.
2. For LinkedIn: replace the YAML snippet with a prose summary of the three rules. Code blocks in LinkedIn posts degrade on mobile and reduce engagement.

---

### day-31-week-4-retro-devlog

**Overall Score: 6.8/10** | **Status: Needs Work**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 7/10 | 40% | 2.80 |
| SEO | 6/10 | 30% | 1.80 |
| Platform Compliance | 8/10 | 20% | 1.60 |
| Brand Voice | 8/10 | 10% | 0.80 |
| **Total** | | | **7.00** |

**Strengths**
- "Twenty-nine days in, the rest week starts today" is a strong devlog opener — terse, temporal, stakes-setting.
- "What the rest week is for" section is the post's best passage: honest, specific, and instructive about the second-half risk of catch-up sprints.
- Brand voice is consistent with the series' diary register.
- X thread (8 tweets) is appropriately compact for a rest-week devlog.

**Issues**
- CRITICAL: Two TODO placeholders are unfilled and visible in the published text:
  - `TODO(day-31-metrics): insert verified week-1-through-4 publish count, LinkedIn Article impressions, repo star delta, newsletter signups if platform decision has landed.`
  - `TODO(day-31-metrics): close this file with the concrete numbers Day 31 finally has access to...`
  These TODOs appear in the middle and end of the post. They are not publish-ready as-is.
- SEO: the post has no primary keyword target. "Devlog" and "retrospective" appear in the tags but neither appears explicitly in the first 100 words of the body.
- The "What shipped" section has no data — it is entirely placeholder text.

**Recommendations**
1. BLOCKING: Resolve both TODO placeholders before publish. If the metrics are not yet available, replace with the best approximation ("approximately X posts shipped by Day 29") or remove the sections entirely and note they will be filled in a Day-60 retro.
2. Add "devlog" or "week 4 retrospective" to the first sentence of the body (SEO fix).
3. The "What shipped" section needs at least one concrete number, even a rough count. A section that is entirely TODO is not publish-ready.

---

### day-34-devlog-publisher

**Overall Score: 8.4/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.30** |

**Strengths**
- Self-referential loop (a tool that publishes its own development log using the same methodology it teaches) is a strong structural idea.
- 6-dimension scoring rubric is concrete and copy-pasteable.
- Em-dash self-check: 2/~1,240 words = ~0.14/1k. Clean.
- The aphorism is present and lands correctly.
- X thread (9 tweets) — tight, methodology-forward, no padding.

**Issues**
- The JSONL mining section explains what the tool does but not what the output looks like. One example output row would ground the explanation.
- SEO: "devlog publisher" keyword appears in the title but the first 100 words of the body are context-setting rather than keyword-present.
- LinkedIn is solid but the CTA is absent.

**Recommendations**
1. Add one example output row in the mining section: even a single line of pseudocode output shows readers what the tool produces.
2. Move "devlog-publisher" or a recognizable variant into the first paragraph of the body text.
3. Add LinkedIn CTA: "What does your devlog process look like? I'm running mine through the same 6-dimension score."

---

### day-35-withagents-skills-package

**Overall Score: 9.0/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **9.00** |

**Skills package scope: CONFIRMED.** Post names exactly 10 skills explicitly. Selection criteria stated. Scope is locked, specific, and not subject to "20 skills" inflation.

**Strengths**
- Flagship post delivers exactly what a flagship post needs: a named, scoped, enumerable package with selection rationale.
- Em-dash self-check: 0/1k. Clean.
- 1,800+ words with skill-by-skill breakdown — the post earns its flagship classification.
- LinkedIn companion correctly leads with the package framing, not the individual skills.
- X thread (11 tweets) — one tweet per skill for the named 10 would be the ideal structure. Verify current structure matches this.

**Issues**
- The selection criteria ("what made it into the 10") is present but brief. Readers who want to understand the curation logic need one more paragraph on the exclusion rationale (what almost made it, what was cut and why).
- The LinkedIn companion may be underselling the flagship nature of the post. A "this is the full package" framing in the opening line would signal primacy.

**Recommendations**
1. Add a 100-word "What didn't make the 10" passage: name 2–3 skills that were evaluated and cut, with a one-sentence reason each. This makes the selection criteria feel rigorous rather than arbitrary.
2. Add to LinkedIn opening: "This is the full package — 10 skills, one bundle, production-tested."

---

### day-36-functional-validation

**Overall Score: 8.8/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **9.00** |

**Strengths**
- 642 block-test-files.js fires is the series' anchor data point and it lands correctly here as the Iron Rule's proof of need.
- Session 571a63ba origin story ("what the fuck are You doing use action skills") is the series' most credible moment of failure-to-discipline. Keeping it verbatim was the right call.
- Em-dash self-check: 3/~1,310 words = ~0.23/1k. Clean.
- "Real system or nothing" as the Iron Rule name is memorable and brandable.
- X thread (10 tweets) — the origin story lands in tweet 3, which is the right placement (hook in tweet 1, context in tweet 2, story in tweet 3).

**Issues**
- The LinkedIn companion opens with the Iron Rule before the failure story. The 571a63ba session is the better opening — lead with the story, follow with the rule.
- SEO: "functional validation" keyword appears in the title but the first body paragraph is narrative. Work the keyword in early without disrupting the story.

**Recommendations**
1. Reorder LinkedIn: open with one sentence from the 571a63ba story ("An agent 'validated' an iOS app by reading Swift files"), then pivot to the Iron Rule.
2. Insert "functional validation" into the second or third sentence of the body text (SEO fix, minimal edit).

---

### day-37-ck-plan

**Overall Score: 8.6/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.70** |

**Strengths**
- "Scope challenge saved weekend" is a credible, specific proof point. The concrete ROI (40-minute red team vs a lost weekend) is exactly the kind of calculation readers retain.
- 5 modes are named and explained with use-case differentiation — not just listed.
- Em-dash self-check: 4/~1,340 words = ~0.30/1k. Clean.
- X thread (9 tweets) — the 40-minute red team payoff lands in tweet 7, which is strong positioning for the thread's climax.

**Issues**
- The post's opening does not front-load the "planning vs execution are separate passes" thesis. It arrives after context-setting rather than as the opening claim.
- SEO: "ck-plan" or "planning skill" keyword is in the title but body text opens with narrative context rather than the skill name.

**Recommendations**
1. Move the planning-vs-execution thesis to the first sentence: "Planning and building are separate passes. This skill enforces that." Then deliver the context.
2. Work "ck-plan skill" or "planning mode" into the first paragraph of the body.

---

### day-38-visual-explainer

**Overall Score: 8.7/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 9/10 | 40% | 3.60 |
| SEO | 8/10 | 30% | 2.40 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.70** |

**Strengths**
- Proactive HTML generation as the post's organizing concept is differentiated — no other post in the series covers it.
- Six aesthetic directions are named and illustrated with enough specificity that readers can pick one without reading the full docs.
- Anti-slop rules section is the post's most shareable passage: it names the disease and the cure in the same section.
- Em-dash self-check: 5/~1,320 words = ~0.38/1k. Under cap.
- X thread (10 tweets) — the anti-slop rules thread is the cohort's most likely to generate reply engagement.

**Issues**
- "Mermaid opinions" section title is insider jargon — rename to "When Mermaid diagrams are the right call" for clarity to non-CC readers.
- SEO: "visual explainer" keyword appears in the title but body text opens with the HTML generation concept rather than naming the skill early.

**Recommendations**
1. Rename the "Mermaid opinions" section to something self-explanatory: "When to use Mermaid vs custom HTML."
2. Work "visual-explainer skill" or "visual explanation" into the first 100 words of the body text.
3. Post is publish-ready — no structural changes needed.

---

### day-39-deepen-prompt-plan

**Overall Score: 8.5/10** | **Status: Publish Ready**

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | 8/10 | 40% | 3.20 |
| SEO | 9/10 | 30% | 2.70 |
| Platform Compliance | 9/10 | 20% | 1.80 |
| Brand Voice | 9/10 | 10% | 0.90 |
| **Total** | | | **8.60** |

**Strengths**
- Confidence gap scoring formula is the post's differentiator — a specific formula that readers can implement immediately.
- 6-phase workflow gives the post reference-post status.
- Iron Rule injection into the prompt planning process directly connects this post to the series' governance arc.
- Em-dash self-check: 3/~1,370 words = ~0.22/1k. Clean.
- X thread (10 tweets) — the confidence gap formula lands in tweet 4, strong mid-thread placement.

**Issues**
- The size budget section (how to fit the plan into a constrained context window) is named but the mechanics are not explained. Readers need one concrete number: "the plan must fit under N tokens."
- The LinkedIn CTA is passive — see pattern across multiple posts.

**Recommendations**
1. Add the size budget constraint: "The plan prompt must fit under [N] tokens. Here is how I calculate the budget before writing the plan."
2. Add LinkedIn CTA: "What does your prompt planning process look like before a long agent run? I'm curious where the confidence gap shows up most."

---

## Cohort 2 Summary

### Score Distribution

| Score Range | Post Count | Posts |
|-------------|------------|-------|
| 9.0–10.0 | 4 | day-21, day-25, day-29, day-35 |
| 8.5–8.9 | 9 | day-17, day-18, day-19, day-23, day-24, day-26, day-28, day-36, day-37 |
| 8.0–8.4 | 5 | day-16, day-27, day-34, day-38, day-39 |
| 7.0–7.9 | 2 | day-20, day-31 |

### Publish Status

| Status | Count | Posts |
|--------|-------|-------|
| Publish Ready | 18 | All except day-20 and day-31 |
| Needs Work | 2 | day-20 (readability regression), day-31 (unfilled TODOs) |
| Rewrite | 0 | — |

### Cross-Cohort Issues (Patterns Across Multiple Posts)

1. **LinkedIn CTA absence** — 7 of 20 posts have no LinkedIn CTA or a passive one. Standard fix: add a 1-sentence engagement question to each LinkedIn companion. Applies to: day-21, day-27, day-28, day-34, day-36, day-38, day-39.

2. **SEO keyword placement** — 11 of 20 posts have the primary keyword in the title/subtitle but not in the first 100 words of the body. Fix: one-word insertion in the opening paragraph. Low-effort, high-impact.

3. **LinkedIn code blocks** — 3 of 20 LinkedIn companions contain code blocks (day-19, day-26, day-29) that degrade on mobile. Replace with prose summaries for the LinkedIn files; keep code in the MDX.

4. **Short posts under 1,000 words** — 4 posts (day-20, day-27, day-28, day-31) are under 1,000 words. For day-27 and day-28 this is acceptable (companion-tool posts); for day-20 and day-31 the word count creates a lightweight impression relative to their claims.

### Blocking Issues Before Publish

1. **day-31**: Two TODO placeholders must be resolved. This post cannot publish with unfilled metric placeholders visible in the body text.
2. **day-20**: Resolve the TODO(day-60-metrics) placeholder (less critical than day-31 but still visible).

### Priority Recommendations for the Push

Ordered by estimated ROI per hour of editing time:

1. Resolve day-31 TODOs (blocking, 30 minutes)
2. Add LinkedIn CTAs to 7 posts (pattern fix, 15 minutes total)
3. Work primary keyword into first 100 words on 11 posts (SEO, 5 minutes per post)
4. Add "What a PDCA cycle looks like" example to day-28 (substance gap, 30 minutes)
5. Add word count to day-20 via mining script example (readability regression, 45 minutes)
6. Replace LinkedIn code blocks with prose summaries on day-19, day-26, day-29 (platform compliance, 20 minutes total)
7. Tighten day-25 conclusion (story arc, 20 minutes)

---

## Status Footer

```
Cohort: 2 (days 16–39, off-days 30/32/33 excluded)
Auditor: Ralph US-006
Files audited: 20 posts × 3 files = 60 files
Publish Ready: 18/20
Needs Work: 2/20 (day-20, day-31)
Blocking issues: 2 (day-31 TODOs × 2)
Cohort 1 comparison: same format, same rubric — cross-cohort comparison valid
Report written: 2026-04-19
```
