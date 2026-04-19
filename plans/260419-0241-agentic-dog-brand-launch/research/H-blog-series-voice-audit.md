# Workstream H — Blog-Series Voice Audit

## Summary (≤150 words)

Eighteen posts audited, totaling ~60,000 words. **Verdict distribution: 12 PUBLISH-AS-IS, 5 LIGHT-EDIT, 1 REWRITE, 0 RETIRE.** Corpus voice is strong overall: first-person, metric-lead, anti-slop, uses direct admissions ("I was wrong," "I don't know yet"). The Opus rewrite succeeded — voice is coherent and distinct across 18 posts.

**Top 3 AI-tell patterns across corpus:**
1. **Em-dash overuse** in posts 13, 16, 17 (31, 22, 17 em-dashes respectively). Posts 1-12 average ~5/post; post 13 uses one every ~120 words.
2. **"Think about that for a second"** / **"Sound familiar?"** rhetorical asides — 11 occurrences, cluster in posts 2, 3, 4, 7, 12.
3. **"Here's the thing."** narrative reset — 5 occurrences across posts 2, 7, 10, and in post-ending paragraphs.

Minor issues: 1 "fundamentally different" (post 4×3, post 10, post 18), occasional "dramatically"/"significantly" without number backing (rare, ~4 corpus-wide). No generic empathy openers detected. No AI-slop structural scaffolding.

---

## Per-Post Scorecard

| Post | Words | EM-dashes/1k | AI-tells | Verdict | Key issue |
|------|-------|--------------|----------|---------|-----------|
| 01 series-launch | 3,246 | 1.2 | 2 | PUBLISH-AS-IS | "Think about that" L60, "Sound familiar" L140 — both earned by concrete examples |
| 02 multi-agent-consensus | 3,141 | 4.5 | 4 | PUBLISH-AS-IS | "Ever had a code review" L50, "Think about that for a second" L56, "Here's the thing" L397 — all tied to specific war stories |
| 03 functional-validation | 3,661 | 0.8 | 3 | PUBLISH-AS-IS | Two "Sound familiar?" (L46, L414), but each lands after concrete bug description; "Of course they did" L34 |
| 04 ios-streaming-bridge | 3,820 | 0.8 | 4 | PUBLISH-AS-IS | Three "fundamentally different" (L26, L56, L370) — technically justified but trending cliché; "Ever tried to be clever" L243, "Think about that for a second" L266 |
| 05 ios-patterns | 3,098 | 0.3 | 2 | PUBLISH-AS-IS | "Sound familiar?" L128 earned; "Big difference" ending hedge L434 |
| 06 parallel-worktrees | 3,413 | 0.9 | 1 | PUBLISH-AS-IS | Strong voice, specific numbers. "Nope." L27 as mid-paragraph reset works. "How cool is that?" in post 10 equivalent not here |
| 07 prompt-engineering-stack | 3,550 | 1.1 | 5 | LIGHT-EDIT | "Here's the thing" L18, "Same energy" L36, "Think about that for a second" L283, "That's wild" L283, "That's the whole game" L229 — starting to pile up |
| 08 ralph-orchestrator | 3,502 | 1.7 | 1 | PUBLISH-AS-IS | Confident voice, war stories concrete. "The boulder never stops. But it does reach the top." closing works |
| 09 code-tales | 3,239 | 0.6 | 2 | PUBLISH-AS-IS | "Wild, right?" L73 is the only soft moment; "I honestly don't know what to make of that" L225 is the strongest kind of admission |
| 10 stitch-design-to-code | 3,147 | 0.3 | 3 | PUBLISH-AS-IS | "Here's the thing. This wasn't a Stitch defect" L94 — earned; "How cool is that?" L151 — one of the only genuine-enthusiasm moments in corpus; "I'd already learned that the hard way" L302 |
| 11 spec-driven-development | 3,307 | 0.9 | 2 | PUBLISH-AS-IS | "Ever tried doing that with a meeting transcript?" L303, "Weeks. I still get annoyed thinking about it" L410, "What was I thinking?" L412 — all land |
| 12 cross-session-memory | 3,145 | 3.5 | 4 | LIGHT-EDIT | Em-dash density climbing; "Think about that scale" L303, "Think about that for a second" L320 — two uses in one post is one too many |
| 13 sequential-thinking-debugging | 3,758 | **8.2** | 3 | **REWRITE** | 31 em-dashes in 3,758 words. Densest in corpus. Otherwise strong but the punctuation rhythm is the one place where "AI wrote this" reads on the page |
| 14 multi-agent-merge | 2,882 | 4.9 | 2 | LIGHT-EDIT | 14 em-dashes; mostly load-bearing but a few ("agent-integrator — the insight that makes this work") could become sentences |
| 15 skills-anatomy | 4,003 | 3.5 | 3 | LIGHT-EDIT | "Does that feel too manual? It is. But I haven't found a better way" L530 — earned. "You know that feeling when" L181 is borderline |
| 16 claude-code-plugins | 2,869 | 7.7 | 1 | LIGHT-EDIT | 22 em-dashes. Functional voice but em-dash rhythm needs breaking up |
| 17 ccb-evolution | 2,786 | 6.1 | 1 | PUBLISH-AS-IS | 17 em-dashes but the timeline/compression structure justifies compressed syntax. "Don't be me." L348 is perfect voice |
| 18 sdk-vs-cli | 3,423 | 2.3 | 3 | PUBLISH-AS-IS | "Don't be me." L348 of 17 echoes here. "This shouldn't need to be said, and yet." L351 — excellent. "Seriously, try it. You'll give up by lunch." L232 |

---

## Voice Spec Starter Material

### Tone examples (verbatim excerpts — these are what the voice should sound like)

**Example 1 — Post 1, lines 16-20 (series launch opener):**
> I averaged 559 AI coding sessions per day for 42 days straight. Not prompts. Sessions. Each one a self-contained agent with its own context window, its own task, its own tools.
>
> 23,479 total. 3,474,754 lines of interaction data across 27 projects. This series is what I learned.
>
> Here's the short version: AI agents fail in predictable ways. They forget across sessions. They declare victory without evidence. They build features that look correct but do nothing.

This is the corpus at its best: specific number first, sentence fragments, declarative inventory of failures, zero preamble.

**Example 2 — Post 8, lines 17-22 (Ralph orchestrator opener):**
> 1:47 AM on a Wednesday. I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep. By morning, 28 of 30 tasks were complete.

Scene-specific, time-stamped, human detail ("from under the covers"), metric payoff. No "Let me tell you about the time..." scaffolding.

**Example 3 — Post 17, lines 14-17 (ccb evolution opener):**
> I woke up to a $47 bill and an infinite loop.
>
> The script had run all night. A type error in phase 7 of 12. Retry logic had no ceiling. Claude kept attempting the same fix, each retry consuming another API call.

Best opener in the corpus. Seven words. Specific dollar amount. Physical detail. Cause stated after.

**Example 4 — Post 14, lines 17-19:**
> Twelve AI agents. Thirty-five git worktrees. One codebase modified in thirty-five places at once. The merge took ninety seconds. Zero conflicts.
>
> That was the second attempt. The first? Twenty-three conflicts. Three hours of manual untangling.

Zero adjectives. Pure numbers. The reversal ("That was the second attempt") is the voice move to preserve.

**Example 5 — Post 11, lines 16-22:**
> For the first three months, I gave agents instructions the same way I'd talk to a junior engineer. Natural language. "Build me an API that handles user sessions."
>
> It was a disaster.
>
> Agent 3 would ask "what format does the user object use?" and Agent 5 would answer differently than Agent 1 had already built. Without a shared contract, agents coordinated through hope. Across 23,479 sessions, I can tell you: hope is not a coordination protocol.

One-sentence paragraph for the kicker ("It was a disaster"). "Hope is not a coordination protocol" is the aphorism move — land it once per post, never twice.

---

### Banlist (phrases to forbid in withagents.dev content)

Already-overused in this corpus:
1. **"Think about that for a second"** — used 4 times (posts 2, 7, 12×2). Ban.
2. **"Sound familiar?"** — used 3 times (3, 5, 7). Ban.
3. **"Here's the thing."** — used 5 times (2, 7, 10). Acceptable in long tech post; ban for dog brand where sentences are shorter.
4. **"Ever tried [X]?"** — used ~8 times. Cap at 1 per withagents.dev post.
5. **"fundamentally different"** — 5 uses. Hedge. Replace with specific comparison.
6. **"I honestly don't know"** / **"I'm not sure why"** as closer — used ~12 times. It's working in this corpus (humility reads as credibility) but becomes tic-like at volume. Cap at 1 per post.
7. **"It's not X, it's Y"** construction — corpus avoided this, keep it banned.
8. **"That's wild."** / **"Wild, right?"** — used 3 times. Ban.
9. **"Big difference."** as single-fragment paragraph — cliché in closing position. Ban.
10. Em-dash as primary clause separator — cap at **3 per 1,000 words**. This corpus averages 2.8/1k but posts 13/16/17 break it.

---

### Structural preferences (to preserve in withagents.dev voice)

**Opening formula:** Specific detail (time, number, scene) → one-sentence paragraph → failure stated before success. See posts 1, 8, 14, 17 openers.

**Sentence-fragment paragraphs as emphasis.** "It was a disaster." "Four minutes." "Don't be me." "Nope." These work because they punctuate longer prose — but only when the surrounding prose has actual information density.

**Verb-lead first person over "We" or passive.** "I built," "I watched," "I lost." Never "one finds" or "it can be observed."

**Admit what you don't know in the same paragraph as what you do.** Post 6 line 355: "I still don't have a great answer for that. If you've solved it, I'd genuinely love to hear how." Post 14 line 434: "I haven't found a way to catch them statically." This is the single move that separates this voice from AI-slop.

**Concrete numbers before abstractions.** "23,479 sessions" before "agent orchestration." "$47" before "cost control." "Three days" before "debugging cycle." Applies to dog brand too: weight, cost, miles, duration, count — lead with it.

**One aphorism per post, max.** "Hope is not a coordination protocol." "The boulder never stops." "The best builder is the one you don't have to build at all." Any more than one per post and the post starts sounding like a LinkedIn thread.

---

## Highest-Risk Posts Before Migration

Rank-ordered by voice-drift risk if migrated to withagents.dev CMS unchanged:

1. **Post 13 (sequential-thinking-debugging)** — REWRITE candidate. 8.2 em-dashes per 1,000 words. The reasoning-chain content is valuable but the punctuation rhythm reads AI on the page. Target fix: convert roughly half the em-dashes to either commas or full stops. The Step 1-84 trace block (lines 87-166) is content-fine; the body prose around it is where the issue lives.

2. **Post 16 (claude-code-plugins)** — LIGHT-EDIT. 7.7 em-dashes/1k. Shorter post, so fewer raw dashes, but density per paragraph is the highest in the corpus. Fix: read aloud, convert em-dashes to periods where the clauses are actually independent sentences.

3. **Post 7 (prompt-engineering-stack)** — LIGHT-EDIT. Strongest offender for AI-tell rhetorical asides (5 in one post: "Here's the thing," "Same energy," "Think about that for a second," "That's wild," "That's the whole game"). Fix: remove three; keep two strongest. Specifically keep "Same energy" (L36, grocery-list analogy lands) and "Think about that for a second" (L283, earns it via the 72%→89% compliance stat).

---

## Unresolved Questions

1. Should em-dash cap be codified as a hook in withagents.dev CMS publish pipeline, or trust author discipline? (Recommend: hook with warn-not-block, threshold = 5 per 1000 words.)
2. Posts 13/16/17 — did they come from the same copywriter-agent session? The em-dash density clustering suggests one agent's style leaked. Worth git-log check if Phase 2 rewrites are scoped.
3. The strongest voice moments ("Don't be me," "I'd already learned that the hard way," "What was I thinking?") are self-deprecating admissions. How does this translate to dog-brand voice where the author isn't the protagonist in the same way? The voice-spec should identify the analog — probably direct admission of product limitation or founder mistake.
4. "How cool is that?" in post 10 is the only genuine-enthusiasm moment in 60,000 words. The corpus is heavily weighted toward world-weary / dry. Agentic.dog likely wants more affection without becoming saccharine. Needs explicit example set.
5. Memory.md notes the 2026-04-18 Sonnet drift was caught before public launch. This audit confirms the Opus rewrite succeeded — the 12 publish-as-is posts hold. Worth documenting the specific hooks that should've blocked Sonnet (em-dash density check, rhetorical-aside counter) for the withagents.dev pipeline.
