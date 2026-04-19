# Reader 5 Extraction Report: Posts 41-50

## Post 41: Runtime Theme Systems: AI-Built Dynamic Styling
**Word count:** 6,572
**Target consolidated post:** NEW 10 — Design-to-Code

### Keep (best material)
- Opening war story: designer sent spec at 3 PM, 214 hardcoded colors across the app, agent built entire theme engine by 7 PM including dynamic color tokens, live switching, custom theme creator UI, persistence, and accessibility contrast checker
- Three failed approaches before finding the right architecture: (1) UserDefaults + NotificationCenter polling -- 400ms lag per token, (2) ObservableObject singleton -- view update storms with 200+ views, (3) Combine pipeline with debouncing -- overcomplicated, 850ms propagation delay
- The winning approach: SwiftUI `@Environment` with `EnvironmentKey` -- zero-lag propagation because SwiftUI's environment system does the diffing
- Real metric: "The part that impressed me wasn't the speed; it was that the agent understood SwiftUI's environment system well enough to make theme changes propagate instantly to every view in the hierarchy without a single manual subscription."
- Accessibility contrast checker that flags low-contrast token combinations before the user saves -- WCAG AA minimum 4.5:1 ratio enforcement
- Concrete data: 214 hardcoded colors converted, 47 semantic tokens created, 23 color palette slots, 3 built-in themes + unlimited custom

### Cut (LLM filler)
- "Let me": 1
- Very low filler overall -- this post reads authentically
- Some padding in the "why theming matters" introductory section that states obvious things about user customization

### Unique Insights
- The three failed SwiftUI theming approaches (UserDefaults polling, ObservableObject singleton, Combine pipeline) with specific performance numbers for each failure -- this is genuinely useful architectural knowledge
- The `@Environment` approach being the winner because SwiftUI's environment propagation does view diffing automatically
- The accessibility contrast checker as a pre-save validation gate -- novel integration of WCAG into the theming workflow
- Theme persistence using Codable + UserDefaults with migration support for theme schema changes

### Code Worth Keeping
- `ThemeEnvironmentKey` and `ThemeManager` showing the `@Environment` pattern (~30 lines)
- `ContrastChecker` with WCAG relative luminance calculation (~40 lines)
- `ThemeToken` enum with semantic color mapping (~25 lines)

### Mermaid Diagrams Worth Keeping
- Theme propagation flow diagram showing Environment -> ViewHierarchy -> AutomaticDiffing
- Theme persistence lifecycle diagram

---

## Post 42: Docker + Dev Server + Playwright: The Three-Layer Stack
**Word count:** 6,498
**Target consolidated post:** NEW 3 — Functional Validation

### Keep (best material)
- Opening failure story: "The pull request looked perfect. The agent had implemented a complete authentication flow -- login form, session management, protected routes, logout. It compiled. The linter was happy. The type checker found no issues. I merged it, deployed to staging, and within minutes got a Slack message: 'Login button doesn't do anything.'"
- The click handler was wired to a function that called an API endpoint that didn't exist yet -- every static check passed because the code was syntactically flawless
- Three-layer validation concept: Layer 1 (Docker builds environment from scratch), Layer 2 (Dev server runs with real dependencies), Layer 3 (Playwright clicks through it like a user)
- 127 agent-generated pull requests with zero "works on my machine" failures after implementing the stack
- Specific failure modes that taught why each layer exists -- each layer catches a distinct class of bug
- Layer 1 catches: missing dependencies, environment assumptions, version conflicts
- Layer 2 catches: runtime errors, configuration mismatches, database connection issues
- Layer 3 catches: UI not wired up, broken user flows, visual regressions
- The "compilation is not validation" principle stated clearly with evidence

### Cut (LLM filler)
- "robust": 1, "This is where": 3, "Let me": 1, "comprehensive": 1, "journey": 1
- Some sections explaining Docker basics that any reader of this blog would already know
- Repetitive emphasis on "compilation is not validation" -- stated well once, then restated in slightly different words 3 more times

### Unique Insights
- The three-layer validation stack as a systematic framework (not just "use Docker + Playwright" but specific ordering and what each layer catches)
- 127 PRs with zero "works on my machine" failures is a strong metric
- The insight that each layer catches a fundamentally different class of failure -- they are not redundant
- Docker as "environment reproduction" vs Docker as "deployment" -- the distinction matters for validation

### Code Worth Keeping
- Docker validation script with health checks (~30 lines)
- Playwright validation flow runner with retry logic (~50 lines)
- Pipeline orchestrator combining all three layers (~40 lines)

### Mermaid Diagrams Worth Keeping
- Three-layer stack diagram showing what each layer catches
- Validation pipeline flow: Docker Build -> Dev Server Start -> Playwright Tests -> Evidence Collection

---

## Post 43: Multi-Agent Dev Teams with File Ownership
**Word count:** 7,351
**Target consolidated post:** NEW 2 — Multi-Agent Consensus

### Keep (best material)
- Opening disaster: "Two agents edited the same file at the same time. Agent dev-1 added a new API route at line 47. Agent dev-2 refactored the middleware at line 52. Both committed. The merge produced a Frankenstein file where half a route handler flowed into half a middleware function. The app didn't crash -- it served authentication middleware as a REST endpoint. Users could POST /api/auth and get back raw JWT verification internals instead of a login token."
- File ownership model with glob patterns: each agent owns distinct files, no overlapping edits
- 23 feature sprints with zero merge conflicts, zero edit races, and 2.3x speedup over single-agent development
- Lead agent resolves conflicts by restructuring tasks or handling shared files directly
- The coordination protocol: clear boundaries, defined ownership, programmatic enforcement
- Insight: "humans notice when they're about to edit someone else's code. Agents don't. They need programmatic enforcement."
- Task claiming protocol: claim lowest-ID unblocked task first
- Git worktrees for team isolation -- each dev in own worktree eliminates conflicts

### Cut (LLM filler)
- "Here is": 1, "This is where": 1
- Very low filler -- post reads well
- Some sections explaining git merge conflicts that are too basic for the audience

### Unique Insights
- File ownership via glob patterns as the core coordination primitive
- The Frankenstein merge story -- a real horror story about what happens without ownership enforcement
- 2.3x speedup over single-agent with zero conflicts
- The lead agent role as conflict resolver -- not a bottleneck but a safety net
- Task claiming protocol (lowest-ID first) ensuring dependency ordering

### Code Worth Keeping
- `FileOwnership` class with glob-based ownership checking (~35 lines)
- `TeamCoordinator` with task assignment and conflict detection (~50 lines)
- `OwnershipValidator` pre-commit hook that blocks cross-boundary edits (~30 lines)

### Mermaid Diagrams Worth Keeping
- Team coordination flow: Lead -> Task Assignment -> File Ownership Check -> Agent Execution -> Merge
- File ownership map showing non-overlapping glob regions per agent

---

## Post 44: Building a Content Editor with Live Mermaid
**Word count:** 8,909
**Target consolidated post:** NEW 16 — Plugins

### Keep (best material)
- Opening: "Every diagram in this blog series was created in a tool that an AI agent built in a single afternoon"
- Concrete metrics: CodeMirror editor, Mermaid renderer, toolbar with diagram templates, export to SVG and PNG -- built in 387 tool calls across 3.5 hours
- Workflow improvement: 5-10 minutes per diagram down to 1-2 minutes. Over 61 posts with avg 2.5 diagrams = ~6 hours saved on diagrams alone
- The meta-irony: "a blog series about AI-built tools uses a diagram tool that was itself AI-built"
- Debounced rendering: renders only after 300ms of typing inactivity to prevent crashes on invalid mid-edit syntax
- Error containment: Mermaid.js throws on invalid syntax; the editor catches errors and shows the last valid render + error message overlay
- Template system: pre-built templates for flowchart, sequence, state, class, ER, gantt diagrams with one-click insertion

### Cut (LLM filler)
- "Here is": 2, "deep dive": 1
- Extensive CodeMirror configuration details that are implementation minutiae rather than insight
- Long section on CSS styling of the split pane that adds no conceptual value
- Toolbar icon implementation details -- too granular

### Unique Insights
- Debounced Mermaid rendering as a pattern for live preview editors (300ms threshold)
- Error containment strategy: show last valid render + error overlay rather than blank screen
- Template system as a productivity accelerator for diagram creation
- The agent chose CodeMirror 6 over Monaco despite Monaco being more popular -- lighter bundle size was the deciding factor (200KB vs 2MB)

### Code Worth Keeping
- Debounced Mermaid renderer with error containment (~40 lines)
- Template insertion system (~25 lines)
- Export pipeline (SVG and PNG) (~30 lines)

### Mermaid Diagrams Worth Keeping
- Editor architecture: CodeMirror -> Debounce -> Mermaid.render -> SVG Output (with error branch)

---

## Post 45: Agent SDK Podcast Generation (30+ Minutes)
**Word count:** 6,988
**Target consolidated post:** NEW 9 — Content Pipelines

### Keep (best material)
- Opening: "I pressed enter on a single command and walked away. When I came back 47 minutes later, there was a 34-minute podcast episode sitting in my output directory."
- Distinction from NotebookLM: "This is not NotebookLM's 'deep dive' feature. That gives you a couple of minutes of overview. I needed 30+ minute episodes -- deep, technical, structured."
- Multi-agent pipeline: research -> script writing -> editing -> TTS synthesis -> audio assembly -- all triggered by one `client.messages` call
- Agent chain: Researcher (gathers sources) -> Scriptwriter (creates dialogue) -> Editor (refines flow) -> TTS Synthesizer -> Audio Assembler
- The dialogue generation approach: two "hosts" with distinct voices and speaking styles, natural back-and-forth, genuine questions and pushback
- Weekly production without 20 hours per episode on research, scripting, recording, editing
- TTS quality management: voice selection, pacing control, emphasis markers in the script

### Cut (LLM filler)
- "Here is": 5, "powerful": 1, "elegant": 1, "This is where": 1, "Let me": 5, "deep dive": 1, "comprehensive": 1, "unlock": 2
- Highest filler count in this batch -- post 45 has the most LLM-ish language
- "Here is the complete pipeline" / "Here is how the scriptwriter works" / "Here is the full chain" -- 5 instances of "Here is" as transition phrases
- "Let me walk through" / "Let me explain" -- 5 instances of "Let me"
- Section on "Why Podcasts Matter" is pure padding -- the reader already clicked on a post about podcast generation
- Extended discussion of TTS API options that reads like a comparison blog post rather than a war story

### Unique Insights
- Single `client.messages` call triggering a full multi-agent pipeline producing 30+ minute episodes
- The dialogue generation technique: two distinct host personas with different expertise areas creating natural back-and-forth
- Script structure: each segment has a topic intro, deep exploration, counterargument, synthesis -- mimicking real podcast structure
- Emphasis markers in TTS scripts (pauses, stress, speed changes) as first-class script elements

### Code Worth Keeping
- Agent chain orchestrator showing single-call triggering (~40 lines)
- Script template with dialogue structure and emphasis markers (~30 lines)
- Audio assembly pipeline combining TTS segments (~35 lines)

### Mermaid Diagrams Worth Keeping
- Pipeline flow: Research -> Script -> Edit -> TTS -> Assembly (with agent types at each stage)

---

## Post 46: Supabase Auth Migration: Lessons from Production
**Word count:** 10,936
**Target consolidated post:** NEW 17 — GSD Framework

### Keep (best material)
- Opening crisis: "Auth0 renewal is $14k/year. We need to move to Supabase Auth before the billing cycle resets in 19 days." 14 protected routes, 3 token refresh flows, 2,400 active users, zero forced logouts allowed.
- The session bridge pattern: Auth0 and Supabase coexist peacefully during transition. Users with Auth0 tokens get transparently migrated on next login. No forced logouts.
- Completed in 11 days with zero forced logouts, rollback mechanism always ready but never needed
- $14,000/year Auth0 bill dropped to $0 within Supabase's free tier
- Real migration complexity: cookie domains, session hydration edge cases, the one OAuth flow you forgot existed
- Agent division of labor: agents handled mechanical parts (route updates, token swaps, callback redirects) while human focused on strategy
- Rollback mechanism design: every step reversible, canary deployment checking error rates before full rollout
- The dual-auth middleware that checks both providers during transition period

### Cut (LLM filler)
- "Here is": 8 (highest in this batch), "deep dive": 1
- 8 instances of "Here is" is notably high -- "Here is the session bridge", "Here is the rollback", "Here is the middleware", etc.
- Lengthy setup section explaining what Auth0 and Supabase are -- unnecessary for the target audience
- Extended Supabase API reference content that reads like documentation rather than narrative
- Some sections duplicate information about the dual-auth approach from slightly different angles

### Unique Insights
- Session bridge pattern for zero-downtime auth migration: dual middleware checking both providers, transparent token migration on next login
- The economics: $14k/year to $0 -- concrete cost savings
- 19-day deadline as a forcing function for agent-assisted migration
- Rollback mechanism: canary deployment with error rate thresholds before full rollout
- Cookie domain migration strategy for multi-subdomain apps

### Code Worth Keeping
- Dual-auth middleware checking both Auth0 and Supabase tokens (~45 lines)
- Session bridge: transparent token migration on login (~40 lines)
- Rollback mechanism with canary deployment (~35 lines)
- Migration progress tracker across 14 protected routes (~25 lines)

### Mermaid Diagrams Worth Keeping
- Migration timeline: parallel operation period with Auth0 and Supabase coexisting
- Dual-auth middleware decision flow

---

## Post 47: Chrome DevTools Protocol: Beyond Playwright
**Word count:** 6,770
**Target consolidated post:** NEW 16 — Plugins

### Keep (best material)
- Opening: "I was 28 firecrawl_scrape calls into a web analysis session when I realized Playwright was not going to cut it. I needed heap snapshots mid-interaction, network timing at the TCP level, and CPU profiles that correlated with specific DOM mutations."
- Key insight: "Playwright gives you a browser. CDP gives you a microscope."
- CDP is the raw wire protocol that Chrome DevTools itself uses -- every time you open the Network tab, you are sending CDP commands over a WebSocket
- "Playwright wraps CDP with a clean API. But wrapping means abstracting, and abstracting means hiding -- and sometimes the thing you need is exactly what got hidden."
- Four CDP domains used simultaneously: heap profiling, CPU profiling, network interception, console monitoring -- correlated by monotonic timestamp
- The 28-page analysis that broke Playwright's abstraction boundary
- Production system running all four domains and producing a single correlated diagnostic report

### Cut (LLM filler)
- "Here is": 1, "powerful": 1, "robust": 1, "In this post": 2, "journey": 1
- Moderate filler -- some transitional phrases could be tightened
- Extended explanation of what WebSocket protocol is -- too basic for audience
- Section listing all CDP domains with descriptions reads like API docs copy

### Unique Insights
- CDP as the level below Playwright -- when abstractions hide what you need
- Running 4 CDP domains simultaneously with monotonic timestamp correlation
- The specific use case: heap snapshots mid-interaction, TCP-level network timing, CPU profiles correlated with DOM mutations -- none available through Playwright
- Practical CDP instrumentation pipeline for production use

### Code Worth Keeping
- CDP session manager connecting 4 domains simultaneously (~50 lines)
- Monotonic timestamp correlator across domains (~30 lines)
- Heap snapshot trigger during specific interactions (~25 lines)

### Mermaid Diagrams Worth Keeping
- CDP domain architecture: 4 domains feeding into timestamp correlator -> unified report

---

## Post 48: 50 Screens, 6 Phases: Automated App Audits
**Word count:** 11,522
**Target consolidated post:** NEW 16 — Plugins

### Keep (best material)
- Opening metrics: 47 screens, six navigation groups, three user roles, 22 settings options. Manual estimate: 5 days. Automated: 14 hours, 50 screens captured, 83 observations by severity.
- "Fourteen hours is not impressive because it is fast. It is impressive because it is exhaustive."
- Human bias anecdote: QA lead spent 90 minutes on dashboard (already reviewed twice) and 4 minutes on settings (6 accessibility violations). "He was right about importance, wrong about risk."
- Three real production bugs that manual audit missed: (1) VoiceOver trap on settings -- custom toggle swallowed focus, (2) Dark mode text collision on billing -- hardcoded color, (3) Empty state crash on specific HTTP 204 response
- Cost analysis: 40 engineering hours across 3 incidents for hotfixes, vs 30 hours to build the automated framework. ROI: 16.4x after 6 release cycles.
- Six audit phases: Navigation (BFS mapping), Consistency (design token compliance), Accessibility (VoiceOver + Dynamic Type + contrast), Performance (launch time + memory), Data Handling (loading/empty/error states), Edge Cases (offline + rotation + input overflow)
- BFS navigation mapper producing 47 screens with 89 navigation edges in 47 minutes
- 5,076 possible visual states (47 screens x 3 roles x 6 loading states x 2 themes x 3 type sizes) -- manual audit covers ~200, automated covers structured sample of all dimensions
- After 6 release cycles: critical-issue count dropped from 7 to 0

### Cut (LLM filler)
- "Here is": 5, "robust": 1, "This is where": 1, "comprehensive": 2
- Very long at 11,522 words -- could be cut by 40% without losing substance
- Extended Python class definitions for data models (Observation, ScreenNode, AuditReport) with full docstrings and XML serialization -- the pattern matters, not the full implementation
- The entire Phase 2 (UI Consistency) code walkthrough is exhaustive beyond what a blog post needs
- Phase-by-phase code walkthroughs are too detailed -- each phase could be summarized in a paragraph + key code snippet

### Unique Insights
- The human bias problem: auditors allocate attention based on perceived importance, not actual risk. Automated systems check every screen with equal rigor.
- 6-phase audit framework as a systematic methodology (not just "run tests")
- BFS navigation mapping discovering unreachable screens and dead ends
- WCAG contrast math and Dynamic Type cycling as automated checks
- Structured XML observations as the lingua franca across audit phases
- The lost-navigation recovery system (swipe-back -> close button -> dismiss keyboard -> nuclear restart from root)

### Code Worth Keeping
- `build_navigation_map` BFS explorer with lost-navigation recovery (~80 lines, could be excerpted to ~40)
- `Observation` data model with XML serialization (~25 lines)
- `AuditROI` cost tracker with the 16.4x multiplier result (~20 lines)
- WCAG contrast ratio calculator (appears in Phase 3)

### Mermaid Diagrams Worth Keeping
- 6-phase audit architecture with parallel execution paths and XML observation aggregation
- The one showing Phase dependencies: Navigation feeds Consistency, Consistency + Accessibility feed Performance, Performance feeds Data Handling + Edge Cases

---

## Post 49: Building a Real-Time Session Observer
**Word count:** 6,651
**Target consolidated post:** NEW 12 — Cross-Session Memory

### Keep (best material)
- Opening: "At session number 3,000 I realized I had no idea what was actually happening across my AI coding sessions."
- The observability gap: "A JSONL file is not observability. It is a firehose."
- Spent a Saturday afternoon manually reading JSONL files -- after 3 hours had annotated about 12 sessions. At that rate, 47 sessions would take 2 full days. Manual analysis was never going to scale.
- Seven-type observation taxonomy evolved from 200 manually categorized sessions: DISCOVERY, DECISION, ERROR, RECOVERY, BREAKTHROUGH, CONTEXT_SWITCH, COMPLETION
- Heuristic classifier (84% accuracy) beat a small ML model (71%) because Claude Code session patterns are remarkably consistent
- Confidence scores: first file read is 0.95 (almost always discovery), assistant saying "all done" is 0.75 (might be premature)
- SQLite WAL mode for concurrent reads/writes -- "the difference between a responsive dashboard and a frozen one"
- Batch buffer: individual INSERTs were bottleneck, batching 50 observations reduced write latency by 12x
- Spectacular failure: shared classifier across sessions caused cross-session contamination -- database grew from 45MB to 3.2GB overnight, 312,847 observations for single session
- Key findings from 365 projects / 4,500 sessions:
  - Sessions starting with discovery have 2x the breakthrough rate (31.2% vs 15.7%)
  - 5 consecutive errors predict 90% session failure
  - Breakthrough sessions average 40% fewer errors
  - Alert system detects stuck sessions in 30 seconds
  - 9-11 AM: highest breakthrough rate. After 10 PM: highest error rate (prompt quality, not AI quality)
  - 18% observation error rate was the surprise -- nearly 1 in 5 observations
- "Observability is not about watching. It is about learning."

### Cut (LLM filler)
- "Here is": 2, "robust": 2, "Let me": 1
- Low filler overall
- Extended SQLite schema definitions with CREATE INDEX statements -- the schema design matters, but full DDL is too much
- Dashboard query code is straightforward SQL that doesn't add insight
- The ProjectWatcher class for multi-project file watching is implementation detail

### Unique Insights
- Seven-type observation taxonomy (DISCOVERY through COMPLETION) as a framework for understanding AI session behavior
- Heuristic classifier beating ML classifier -- counter-intuitive finding that transparent rules outperform small ML models on well-structured data
- Discovery-first sessions having 2x breakthrough rate -- actionable insight that changed prompting strategy
- 5-consecutive-error predictor of session failure (90% accuracy)
- The shared-classifier cross-contamination bug -- a real debugging story that teaches about per-session state isolation
- Byte-offset tail parsing for real-time performance (0.1% CPU vs 40% re-parsing)
- The insight about prompt quality varying by time of day (11 PM sessions had 2x error rate of 10 AM sessions)

### Code Worth Keeping
- `ObservationClassifier.classify()` showing the heuristic classification approach (~60 lines, excerpted)
- `SessionAlertMonitor` with empirical thresholds (5 errors, 50% error rate, 45 min duration, 15 reads without edit) (~40 lines)
- `JSONLParser.parse_tail()` with byte-offset seeking (~25 lines)

### Mermaid Diagrams Worth Keeping
- Event capture architecture: JSONL Streams -> File Watcher -> Parser -> Buffer -> Classifier -> 7 types -> SQLite -> Dashboard/Alerts
- Observation type distribution pie chart (34% Discovery, 28% Decision, 18% Error, etc.)
- Dashboard architecture: Data Capture -> Real-Time Layer (WebSocket) -> Analytics Layer -> Output

---

## Post 50: Hitting the 100-Image API Limit (and Recovering)
**Word count:** 6,319
**Target consolidated post:** NEW 13 — Debugging

### Keep (best material)
- Opening: Pipeline extracted 2,224 frames from a 74-minute video, queued the batch, hit send, got "400 Bad Request: maximum 100 images per request". Ratio was 22x the limit.
- "The pipeline was not wrong; it was designed without knowledge of a constraint that was not obvious until you hit it."
- The boundary problem explained clearly: transition at frame 97 lands at batch boundary -- neither batch sees both sides. With transitions every 4-8 seconds, ~14 of 137 transitions would be missed (unacceptable).
- Batch-to-30 with 5-frame overlap: 17% overlap provides 2.5 seconds of temporal context at every boundary. 94% of overlap-zone transitions detected by both batches (cross-validation).
- Three reasons for 30 instead of 100: (1) Overlap budget -- 17% overlap is enough, 5% is not; (2) Analysis quality -- model gives more detail with fewer images; (3) Failure blast radius -- lose 30 frames not 100 on retry.
- Batch size tuning data: batch-10 (96% accuracy, 2.5x cost), batch-30 (94% accuracy, 1.0x cost), batch-100 (81% accuracy, 0.4x cost). Batch-30 is sweet spot.
- "What followed was a systematic recovery that produced a better pipeline than the one we started with."
- Concurrency tuning: 5 parallel = 6.3 min (sweet spot), 10 parallel = 12.4 min (rate limit overhead worse than sequential)
- Checkpoint system saved progress 3 times during development (network failure at batch 52, parse error at batch 71, accidental Ctrl-C at batch 84)
- Production stats after 340 videos: 847,000 frames, 31,200 API calls, 0 pipeline crashes after checkpoint system, 93.7% overlap confirmation rate
- "Design for limits from day one, not after the first 400 error."

### Cut (LLM filler)
- "journey": 1
- Extremely low filler -- this is one of the cleanest posts in the batch
- The cost analysis section at the end ($11.28 vs $13.59) is useful but could be condensed
- The "Handling API Version Changes" section with limit detector probe code is interesting but tangential
- The `validate_against_ground_truth` function is thorough but could be summarized as results only

### Unique Insights
- Overlap windows as cross-validation mechanism at batch boundaries -- not just safety but quality signal (confirmed transitions have higher confidence)
- Batch-to-30 being strictly better than batch-to-100 for quality despite more API calls
- Concurrency sweet spot: too much parallelism triggers rate limits that negate gains (5x parallel optimal, 10x parallel worse than sequential)
- Checkpoint + resume as essential pipeline infrastructure -- "safety before speed" (build checkpoints before parallelism)
- The F1 score drop from 0.94 (batch-30) to 0.82 (batch-100) quantifying quality vs batch size tradeoff
- The limit detector probing API with 1x1 pixel JPEGs via binary search

### Code Worth Keeping
- `create_batches()` with overlap window logic (~40 lines)
- `merge_batch_results()` with dedup at boundaries and overlap confirmation (~50 lines)
- `send_with_backoff()` with automatic batch halving on image limit (~40 lines)
- `PipelineConfig` with validation and estimation (~25 lines)
- Batch size tuning results table (data, not code)

### Mermaid Diagrams Worth Keeping
- Batch boundary problem diagram showing CUT falling between batches with neither seeing both sides
- Full pipeline flow: Video -> Frame Extraction -> Deduplication -> Batch Creation -> Send (with retry branches) -> Merge -> Final Results
- Checkpoint resume flow: Start -> Checkpoint exists? -> Load/Create -> Process remaining -> Save per batch -> Merge

---

## Cross-Post Summary

### Filler Pattern Totals Across 10 Posts
| Pattern | Count |
|---------|-------|
| "Here is" | 25 (worst: post 46 with 8) |
| "Let me" | 8 (worst: post 45 with 5) |
| "This is where" | 6 |
| "robust" | 6 |
| "comprehensive" | 4 |
| "deep dive" | 3 |
| "powerful" | 2 |
| "unlock" | 2 |
| "In this post" | 2 |
| "journey" | 3 |
| "elegant" | 1 |

**Overall filler assessment:** Low to moderate. Posts 41, 43, 49, 50 are very clean. Posts 45 and 46 have the most filler (45 with 17 filler instances, 46 with 9). The dominant pattern is "Here is" as a transitional phrase (25 total instances) -- easy to find-and-replace.

### Posts with Most Unique/Irreplaceable Content
1. **Post 49** (Session Observer) -- The 7-type taxonomy, discovery-first 2x breakthrough finding, heuristic-beats-ML finding, and the 3.2GB shared-classifier bug are all genuinely unique
2. **Post 50** (API Image Limit) -- The overlap-as-cross-validation insight, batch-30 sweet spot with tuning data, concurrency-sweet-spot finding are all novel
3. **Post 48** (Automated Audits) -- The human bias anecdote (QA lead), 6-phase framework, and 3 real production bugs are strong
4. **Post 43** (Multi-Agent Teams) -- The Frankenstein merge story and file ownership model are memorable

### Posts Most Suitable for Aggressive Cutting
1. **Post 46** (Supabase Auth) -- At 10,936 words with 8 "Here is" instances, this has the most room for compression. The core story (session bridge pattern, $14k savings, 19-day deadline) can be told in 1,500 words.
2. **Post 48** (Automated Audits) -- At 11,522 words, the phase-by-phase code walkthroughs are excessive. The framework concept + key metrics + human bias story can be told in 2,000 words.
3. **Post 44** (Mermaid Editor) -- At 8,909 words, the CSS and CodeMirror config details are padding. The meta-story + debounced rendering + error containment pattern can be told in 1,200 words.
4. **Post 45** (Podcast Gen) -- Has the highest filler density (17 instances in 6,988 words). Core pipeline story can be told in 1,500 words.
