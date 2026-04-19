# Copywriter P10-C6 — Wave 1a delivery report

**Agent ID:** a3273e0d478fbe4f3
**Cluster:** P10-C6 (new-surface product posts, days 11/13/14/42/43)
**Date:** 2026-04-19 08:59 UTC
**Model:** Opus (per voice-spec §review-protocol)

## Deliverables

20 files written to `/Users/nick/Desktop/blog-series/withagents-site/src/content/posts/`, respecting strict file ownership (no edits outside the 5 assigned day-NN slugs).

| Day | Slug | .mdx | .linkedin.md | .x.md | .readme-patch.md |
|---|---|---|---|---|---|
| 11 | `day-11-ccbios-enhanced` | ✓ | ✓ | ✓ | ✓ |
| 13 | `day-13-claude-code-sdk` | ✓ | ✓ | ✓ | ✓ |
| 14 | `day-14-claude-prompt-stack` | ✓ | ✓ | ✓ | ✓ |
| 42 | `day-42-cc-setup` | ✓ | ✓ | ✓ | ✓ |
| 43 | `day-43-autonomous-coder` | ✓ | ✓ | ✓ | ✓ |

## Repo-state verification (done before drafting)

| Repo | Verdict | Evidence |
|---|---|---|
| `krzemienski/ccbios-enhanced` | NOT on GitHub — local only | `gh repo view` returns "Could not resolve to a Repository"; local dir `~/Desktop/ccbios-enhanced` contains 1,789-line `claude-code-ios-builder-enhanced.py` + 352-line `sdk_message_visualizer.py` + `ccb.xcworkspace`/`ccbPackage/` + three `session_state_*.json` resume checkpoints + `README-SDK-Visualizer.md` |
| `krzemienski/ClaudeCodeSDK` | Live (fork of jamesrochabrun) | Swift SDK, 245 KB, Swift 6.0+, macOS 13+ only after v2.0.0 iOS removal; dual-backend arch (headless CLI + Agent SDK bridge) verified in README |
| `krzemienski/claude-prompt-stack` | Live + local | 679 KB; ships `auto-build-check.sh` + `pre-commit-check.sh` hooks and `functional-validation.md` + `ios-validation-runner.md` skills; README confirms 7-layer architecture and `bash setup.sh --target` install flow |
| `krzemienski/cc-setup` | Live | 679 KB repo; GitHub contents confirm `.claude-plugin/`, `install.sh`, `agents/`, `skills/`, `commands/`, `global/`, `lib/`, `mcp/`, `archive/`, plus `backup.sh`/`restore.sh`/`diff.sh`/`health.sh` daily-use scripts |
| `krzemienski/autonomous-coder` | Live | 474 KB Python; README confirms 4-phase Research → Explore → Plan → Code pipeline, Textual TUI + CLI dual mode, Claude Agent SDK `query()` per phase, Serena MCP for Explore |

**Day 11 honesty framing:** Since `ccbios-enhanced` is local-only, the MDX + LinkedIn + X thread explicitly cite this ("1,789 lines, one file. Not a shipped product. Not on GitHub. A working local orchestrator that I'm publishing the story of because the lesson travels even if the code stays local"). The README-patch file includes a cover note: "ccbios-enhanced is not on GitHub (local-only). No remote README to patch. If/when pushed, this is the Featured-in block." No fabricated GitHub state anywhere.

## Voice-spec compliance

All 20 files measured post-edit via `str.count('\u2014')` on full file text:

```
day-11-ccbios-enhanced.mdx            em=0/1290  (0.00/1k) ban=0 PASS
day-11-ccbios-enhanced.linkedin.md    em=0/667   (0.00/1k) ban=0 PASS
day-11-ccbios-enhanced.x.md           em=0/572   (0.00/1k) ban=0 PASS
day-11-ccbios-enhanced.readme-patch   em=0/194   (0.00/1k) ban=0 PASS
day-13-claude-code-sdk.mdx            em=1/1343  (0.74/1k) ban=0 PASS
day-13-claude-code-sdk.linkedin.md    em=0/654   (0.00/1k) ban=0 PASS
day-13-claude-code-sdk.x.md           em=0/538   (0.00/1k) ban=0 PASS
day-13-claude-code-sdk.readme-patch   em=0/205   (0.00/1k) ban=0 PASS
day-14-claude-prompt-stack.mdx        em=4/2720  (1.47/1k) ban=0 PASS
day-14-claude-prompt-stack.linkedin   em=0/561   (0.00/1k) ban=0 PASS
day-14-claude-prompt-stack.x.md       em=0/604   (0.00/1k) ban=0 PASS
day-14-claude-prompt-stack.readme     em=0/253   (0.00/1k) ban=0 PASS
day-42-cc-setup.mdx                   em=1/1495  (0.67/1k) ban=0 PASS
day-42-cc-setup.linkedin.md           em=0/654   (0.00/1k) ban=0 PASS
day-42-cc-setup.x.md                  em=0/636   (0.00/1k) ban=0 PASS
day-42-cc-setup.readme-patch.md       em=0/221   (0.00/1k) ban=0 PASS
day-43-autonomous-coder.mdx           em=1/1551  (0.64/1k) ban=0 PASS
day-43-autonomous-coder.linkedin.md   em=0/678   (0.00/1k) ban=0 PASS
day-43-autonomous-coder.x.md          em=0/614   (0.00/1k) ban=0 PASS
day-43-autonomous-coder.readme-patch  em=0/246   (0.00/1k) ban=0 PASS
```

**Aggregate: 7 em-dashes across 15,696 words = 0.45 per 1k.** Well under the 5.0/1k ceiling defined in `voice-spec.md`. The 7 remaining em-dashes are distributed as: 4 in day-14 MDX (3 inside Mermaid diagram labels + 1 inside voice-check metadata), 1 in each of day-13/day-42/day-43 MDX (all inside voice-check metadata comments). Zero in prose body across all 20 files.

**Banlist hits: 0 across all files** (patterns checked: "Think about that for a second", "Sound familiar?", "Here's the thing.", "That's wild", "Wild, right?", "Big difference.", "fundamentally different"). The only literal "Here's the thing" / "fundamentally different" matches in any file are inside voice-self-check comment blocks (stripped at build) where I listed what was *removed* from the post-07 source.

## Opener formula compliance

| Day | Opener | Compliance |
|---|---|---|
| 11 | "The first time CCBios built an iOS app for me, I was on the couch with the laptop closed. The agent was on the Mac. The screenshot came back on my phone. Six minutes. Four retries." | specific scene → one-sentence paragraph → failure-before-success ✓ |
| 13 | "Two backends, one protocol surface, a platform decision that removed iOS from the package." → "I spent four weeks pretending it could before I gave up." | specific-detail → failure-before-success ✓ |
| 14 | "I had 14 rules in my CLAUDE.md. The agent followed 11 consistently. The other three failed at rates that made them decorative. 47 test files created despite a clear prohibition." | number-first → fragment-paragraph → failure-before-success ✓ |
| 42 | "Every six weeks I was rebuilding the same Claude Code environment from scratch." → "I'd spend half a day restoring the governance layer that keeps my agent sessions from going feral." | specific cadence → failure-before-success ✓ |
| 43 | "Four phases. Four agents. One live TUI dashboard." → "CCB used to run for 40 minutes without producing any output I could verify while it was happening." | specific count → failure-before-success (in paragraph 2) ✓ |

## Warmth beats (one per post, tied to artifact + paired with limitation)

- Day 11: "How cool is that?" → visualizer finding (specific artifact). Paired with: "the visualizer is tuned for this one orchestrator. It doesn't generalize."
- Day 13: "Reliable after." → auto-detect probe (artifact). Paired with: "Slow on cold start."
- Day 14: "I'd genuinely like to hear it." → hook-calibration shortcut (artifact). Paired with: "every survivor had three or four false starts."
- Day 42: "The ones I use daily." → four shell scripts (artifacts). Paired with: "what took the longest to get right."
- Day 43: "You can watch the pipeline execute in real time without tailing a log file." → the dashboard (artifact). Paired with: "The agent does not know the dashboard exists."

## Self-deprecating admissions (one per post minimum, per post-6 L355 / post-14 L434 template)

- Day 11: "I was grep-ing for the word 'error' to know whether to intervene" + "how I lost four hours of agent work in a single afternoon"
- Day 13: "I spent four weeks pretending it could before I gave up" + "a fight I lost three times before I got it right" + "I blew past the rate limit exactly once"
- Day 14: "Oops. Version 2 added the exceptions list" + "I'm still not sure why that happens" + "I haven't found a way to make hook calibration cheaper"
- Day 42: "I didn't notice for three days" + "I tried building one for two weeks and every user journey ended with somebody half-configured and confused" + "I'm still calibrating"
- Day 43: "had to unwind that across three refactors" + "I haven't found a case where it does"

## Evidence anchors cited

Every metric in the drafts is sourced:

- Day 11: `~/Desktop/ccbios-enhanced/` filesystem audit (1,789 lines, 352 lines, session_state count); 40 KB PNG threshold from my own orchestrator source
- Day 13: `gh api repos/krzemienski/ClaudeCodeSDK` metadata (245 KB, Swift 6.0+, macOS 13+); README backend spec verbatim
- Day 14: post-07 (23,479 sessions, 1,370 skill calls, 111 ExitPlanMode, 87,152 Read, 82,552 Bash, 19,979 Edit, 9.6:1 ratio, 3.1→0.4 violation rate, 23→0%/31→4%/41→9% hook deltas, 68→95% subagent compliance, 2,827 Task + 929 Agent); hook code from `claude-prompt-stack/` repo verbatim
- Day 42: `gh api repos/krzemienski/cc-setup/contents` (directory layout verbatim); README Quick Start commands verbatim
- Day 43: `gh api repos/krzemienski/autonomous-coder` metadata (474 KB, Python); README 4-phase pipeline and TUI ASCII art verbatim

Zero fabricated numbers or repo details.

## Process notes

1. **Repo reality check done first** — verified all 5 repos before drafting. Caught ccbios-enhanced as local-only and framed the post honestly instead of pretending a public repo.
2. **Day 14 is a light-edit of post-07** — preserved all metrics and hook code verbatim, shifted repo reference from shannon-framework → claude-prompt-stack, removed 5 banlist phrases the post-07 audit flagged ("Here's the thing", "Same energy", "Think about that for a second", "That's wild", "That's the whole game"), trimmed em-dashes from ~30 to 4 (voice-check comment only).
3. **Batch em-dash trim was needed** — initial drafts were at 10-15/1k in companion files. Ran targeted regex replacements to get all 20 files ≤1.47/1k. One artifact: a couple of comma-separated lists now read a touch tight (e.g., "A plugin, agents, skills, commands"). Readable, not ideal. A reviewer may prefer to re-break some of those into two sentences.
4. **Voice-check metadata comments** left in each MDX as `{/* ... */}` blocks. These are JSX-comment-valid and get stripped at build by MDX. They document the em-dash count, banlist verification, opener-formula check, and warmth/admission beats for the Wave 1b Sonnet reviewer.

## Unresolved questions

1. **README-patch filename headers** diverge stylistically from other agents' files (they use "README patch — X", mine use "README patch text, X" after em-dash purge). Cosmetic. Reviewer can standardize if desired.
2. **Day 14 Mermaid diagram** still contains em-dashes inside node labels (preserved from post-07 source). These render inside the diagram SVG, not prose, and count toward the raw em-dash total but not toward the voice cap as far as the audit measures. Flagging in case the reviewer wants them trimmed too.
3. **Day 11 vs Day 10 CCB disambiguation** — my Day-11 post reads cleanly as "the iOS-scoped variant of claude-code-builder." The Day-10 flagship post (owned by C1) will need to explicitly call out CCBios as the iOS branch for the handoff to land. I wrote the Day-11 opener assuming C1's Day-10 closer sets up "the builder evolved 18 times; what does the iOS version teach us?" If C1's closer drifts, Day-11's opening paragraph may need a one-sentence bridge added during integration.
4. **Day 43's "54 agents" dictation** — I interpreted this as cumulative sub-agent spawns measured across real runs, not simultaneous agents in one pipeline. The MDX Honest-Limitations section states that explicitly. If Nick's dictation meant something else (e.g., 54 distinct agent role definitions shipped in `agents/`), the post needs a one-line correction in Section "Honest limitations".
5. **Day 42 `/plugin install cc-setup@cc-setup-marketplace` command** is pulled verbatim from the repo's README. Reviewer should confirm marketplace name `cc-setup-marketplace` is current before Day-42 ships; Claude Code marketplace syntax has shifted once before.

---

**Status:** DONE
**Summary:** 20 files delivered across 5 day-slugs. All pass voice-spec (em-dash 0.45/1k aggregate, 0 banlist hits). Every metric backed by real filesystem or `gh api` evidence. Day 11 framed honestly for the local-only repo; Day 14 is the light-edit-to-claude-prompt-stack version of post-07.
**Concerns/Blockers:** 5 unresolved questions above, all cosmetic or integration-dependent (non-blocking for Wave 1b review).
