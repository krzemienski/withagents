# Post 3: "Functional Validation: Kill Your Mocks"

## Metadata
- Target word count: 2,500
- Source posts: old 03, 12, 27, 42, 53, 58
- Companion repo: `functional-validation-framework/`
- New content needed: No -- six source posts provide overwhelming material. The challenge is selection, not creation.

## Opening (hook -- 2 sentences max)
The agent said the feature was complete. The build passed, TypeScript reported zero errors, I merged the PR, and within minutes got a Slack message: "Login button doesn't do anything."

## Narrative Arc

1. **The Delete Account button** -- From post 27. The button had the correct icon, correct confirmation dialog, correct loading spinner. The onClick handler called a function with the correct signature. The function body was a TODO comment. Every static check passed. A user filed a ticket asking why they could not delete their account. This is the canonical example of compilation-passes-but-feature-broken. ~300 words

2. **The mirror problem** -- From post 03. The core argument: when AI writes both the implementation AND the tests, passing tests are not independent evidence of correctness. They are a mirror reflecting itself. Four bug categories unit tests systematically miss: visual rendering bugs, integration boundary failures, state management bugs on second interaction, platform-specific issues. "A passing test suite is an assertion. A timestamped screenshot is evidence." ~350 words

3. **The three-layer validation stack** -- From posts 27 and 42. Layer 1: compilation/Docker/type check (catches missing deps, env assumptions). Layer 2: runtime verification/server readiness (catches runtime errors, config mismatches). Layer 3: functional verification with Playwright MCP (catches UI not wired up, broken flows). Each layer catches a distinct class of failure -- they are not redundant. From post 42: 127 agent-generated PRs with zero "works on my machine" failures after implementing the stack. ~400 words

4. **Server readiness is harder than you think** -- From post 27. The three-check pattern: TCP connection + HTTP 200 + content marker. Three specific false positives: port open but server crashing on first request, responding but serving wrong content, cached response from previous build. ~200 words

5. **Scaling to 321 screenshots** -- From post 12. 321 screenshots in 24 hours. The 0.3s settle time calibration (SwiftUI spring animations mid-frame at 0.1s). 12 specific regressions found, 4 outside any manual test intuition. The accessibility tree as tap coordinate source (no hardcoded pixels). Pixel diff thresholds from two weeks of calibration: <0.05 pass, 0.05-0.15 review, >0.15 regression. "It did not get bored on screenshot 200." ~350 words

6. **Gap analysis: finding what you forgot to build** -- From post 58. Tracked spec compliance across 12 projects: average gap rate 14.7% -- one in seven specified features missing, incomplete, or wrong. Three gap categories: Missing (not implemented), Partial (missing behaviors), Divergent (implemented differently). Continuous gap analysis at phase gates reduced final gap rate from 14.7% to 2.1%. ~250 words

7. **Admin panels: where bugs hide** -- From post 53. Admin bugs hide because the admin assumes they made a mistake. The resource-disappears-on-navigation bug. State carry-over as a distinct validation category. The 7 bugs caught by full flow testing that isolated testing missed. ~200 words

8. **The evidence standard** -- Synthesis. The validation pyramid: compile (necessary, insufficient), runtime (necessary, insufficient), functional (the bar). Every claim of "done" requires a screenshot, a log, or a recording. "You cannot argue with a screenshot." ~150 words

## Key Code Blocks to Include
- The Playwright MCP validation transcript from post 27 (navigate, snapshot, click, verify) -- shows the workflow
- The `wait_for_server()` three-check readiness function from post 27 (simplified)
- The `build_element_map()` accessibility tree to coordinate map from post 12 (10 lines)
- The evidence standards table from post 03 (Claim vs Minimum Evidence)
- NO full FVF framework code -- the post is about the philosophy, the repo is for the code

## Real Data Points
- Delete Account button: correct UI, empty function body, shipped to production (post 27)
- 470 evidence screenshots across the project (post 03)
- 127 PRs, zero "works on my machine" failures (post 42)
- 321 screenshots in 24 hours, 12 regressions found (post 12)
- 0.3s settle time for SwiftUI animations (post 12)
- Pixel diff thresholds: <0.05 pass, 0.05-0.15 review, >0.15 regression (post 12)
- 14.7% spec gap rate across 12 projects, reduced to 2.1% (post 58)
- 7 bugs in admin panel caught only by full flow testing (post 53)
- 4.3 seconds per validated state (post 12)
- 37% to 94% coverage increase (post 12)

## Material to NOT Include
- The extended FVF Click CLI implementation from post 03 (framework boilerplate)
- The migration guide for teams from post 03 (tutorial content)
- The repeated mirror problem restatements from post 03 (stated 3+ times)
- The "Before you close this tab" engagement bait from post 03
- The full ValidationStep/StepResult/ValidationReport code from post 27 (too long)
- Docker integration details from post 27 (Layer 1 specifics are less interesting)
- The screenshot comparison code from post 27 (standard perceptual hashing)
- The NetworkFaultInjection details from post 12 (too granular)
- The "Why Admin Panels Need the Most Testing" section from post 53 (restates the intro)
- The "Manual vs Automated Gap Analysis" comparison from post 58 (obvious)
- The honest analysis of when unit tests still have value from post 03 -- this post's thesis is stronger without the caveat

## Companion Repo Tie-in
The `functional-validation-framework/` repo is a Claude Code plugin that enforces functional validation as a gate. Run `fvf init --type web` to generate a validation config. The framework blocks completion claims until screenshots exist as evidence. "The repo does not help you write tests. It helps you stop pretending tests are enough."
