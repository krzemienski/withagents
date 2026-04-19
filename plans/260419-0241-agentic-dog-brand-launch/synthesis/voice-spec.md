# Voice Spec — withagents.dev + hack.ski content

_Word count: 612_

## Source corpus

All 18 existing blog posts in `/Users/nick/Desktop/blog-series/posts/post-{01..18}-*/post.md` (≈60,000 words total) served as the voice reference. Audit: `plans/260419-0241-agentic-dog-brand-launch/research/H-blog-series-voice-audit.md`. Verdict distribution from that audit: 12 PUBLISH-AS-IS, 5 LIGHT-EDIT, 1 REWRITE (Post 13), 0 RETIRE. The voice holds at corpus scale — this spec preserves what works and flags what drifted.

## Tone examples (verbatim)

**Example 1 — `posts/post-01-series-launch/post.md` L16-20:**
> I averaged 559 AI coding sessions per day for 42 days straight. Not prompts. Sessions. Each one a self-contained agent with its own context window, its own task, its own tools.
>
> 23,479 total. 3,474,754 lines of interaction data across 27 projects.

Specific number first, sentence fragments, zero preamble.

**Example 2 — `posts/post-08-ralph-orchestrator/post.md` L17-22:**
> 1:47 AM on a Wednesday. I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep. By morning, 28 of 30 tasks were complete.

Timestamp, human detail, metric payoff.

**Example 3 — `posts/post-17-ccb-evolution/post.md` L14-17:**
> I woke up to a $47 bill and an infinite loop.

Seven-word opener. Strongest in corpus.

**Example 4 — `posts/post-14-multi-agent-merge/post.md` L17-19:**
> Twelve AI agents. Thirty-five git worktrees. One codebase modified in thirty-five places at once. The merge took ninety seconds. Zero conflicts.
>
> That was the second attempt. The first? Twenty-three conflicts. Three hours of manual untangling.

Zero adjectives. The reversal is the move.

**Example 5 — `posts/post-11-spec-driven-development/post.md` L16-22:**
> It was a disaster... Without a shared contract, agents coordinated through hope. Across 23,479 sessions, I can tell you: hope is not a coordination protocol.

One-sentence paragraph kicker, single aphorism landed once.

## Banlist (forbid)

1. "Think about that for a second" — banned.
2. "Sound familiar?" — banned.
3. "Here's the thing." — banned in dog-brand short posts.
4. "Ever tried [X]?" — cap at **1 per post**.
5. "fundamentally different" — replace with specific comparison.
6. "That's wild." / "Wild, right?" — banned.
7. "Big difference." as single-fragment paragraph — banned in closing position.
8. "It's not X, it's Y" construction — banned.
9. "I honestly don't know" / "I'm not sure why" as closer — cap at **1 per post**.
10. Em-dash as primary clause separator — cap at **5 per 1,000 words** (Post 13 ran 8.2/1k and reads AI on the page).

## Structural preferences

- **Opener formula:** specific detail (time / number / scene) → one-sentence paragraph → failure stated before success. See Posts 1, 8, 14, 17.
- **Fragment-as-emphasis:** single-sentence paragraphs only punctuate longer prose, never carry the paragraph.
- **Verb-lead first person.** "I built," "I watched," "I lost." Never "one finds," never "it can be observed."
- **Admit what you don't know in the same paragraph as what you do.** Post 6 L355 and Post 14 L434 are the template. This is the single move that separates this voice from AI-slop.
- **Concrete numbers before abstractions.** "23,479 sessions" before "agent orchestration." "$47" before "cost control."
- **One aphorism per post, max.** "Hope is not a coordination protocol." "The boulder never stops." Two per post and it becomes a LinkedIn thread.

## Review protocol (prevents 2026-04-18 voice-drift incident)

- Model-different review pass required before publish. Writer = one model; reviewer = a different model.
- Reviewer reads this `voice-spec.md` and diffs the draft against banlist + structural preferences.
- At least one independent model review logged per publish under `plans/260419-0241-agentic-dog-brand-launch/reports/voice-review-{slug}.md` citing banlist hits, em-dash density (per 1k), rhetorical-aside count, and opener-formula compliance.
- **Em-dash cap:** ≤5 per 1,000 words. Post 13 at 31/3,758 words (8.2/1k) is the outlier that defines the ceiling.
- **Escalation:** if reviewer finds ≥3 banlist violations, the post goes to full rewrite, not light-edit. No inline polish passes.
- All copywriter-agent spawns on this repo pass `model: "opus"` — Sonnet drift caused the 2026-04-18 Wave-1 restart.

## Warmth calibration

The 60,000-word corpus contains exactly **one** genuine-enthusiasm moment: "How cool is that?" in Post 10 L151. Everything else is dry, self-deprecating, or analytical. For withagents.dev's brand launch, widen that dial deliberately:

- **Allow one warmth beat per post**, anchored to a specific artifact the reader can see or run (not a feeling, a thing). "How cool is that?" lands because it points at a working Stitch-generated screen, not at an idea.
- **Warmth targets the artifact, never the audience.** No "you're going to love this," no "I'm so excited to share." Affection goes toward the repo, the diagram, the stack trace, the dog.
- **Pair every warmth beat with a limitation** in the next paragraph. Admiration plus honesty stays credible; admiration alone slides into hype.
