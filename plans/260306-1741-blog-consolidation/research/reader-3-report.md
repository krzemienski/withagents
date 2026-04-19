# Reader 3 Report: Posts 21-30 Extraction

Posts read: 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
Total words across batch: 64,522

---

## Post 21: 581 Sessions Under the Microscope: Building Observability for AI Development
**Word count:** 2,495
**Target consolidated post:** NEW 12 — Cross-Session Memory

### Keep (best material)
- Opening paragraph is genuine and self-aware: "I spent three months building systems to make AI agents more effective. Then I realized I had no idea which parts were actually working."
- The correlation matrix data is excellent — Grep-before-Edit ratio (+0.51) as strongest positive predictor, Bash error count (-0.54) as strongest negative. Real statistical findings with p-values.
- The 12-minute cliff finding: bimodal session duration distribution. 4-8 min sessions succeed 78%, 25+ min sessions succeed 22%. Phase transition at 12 minutes.
- Five specific telemetry-driven process changes with measured outcomes: cache-aware Read wrapper (13% token savings), verifier delay gate (12.4% to 2.1% error rate), selective prompt loading (+8% success), error cliff circuit breaker (19% to 34%), session scope guidelines (58% to 67%).
- "Observability without action is just surveillance" — good line.
- The 11% redundant read overhead stat — invisible waste quantified.
- Final paragraph: "the difference between 'using AI tools' and 'practicing AI-augmented engineering' is measurement."

### Cut (LLM filler)
- Minimal filler — this is an original post (post 21 of 21 original series), well-written
- No significant LLM patterns detected
- Series navigation section at bottom is boilerplate (removal)

### Unique Insights
- Statistical correlation data between session attributes and outcomes (the only post with actual p-values)
- The 12-minute session duration cliff
- Quantified redundant read overhead (11% of tokens)
- Selective prompt loading outperforming full 7-layer stack (3-5 layers beat all 7)
- Verifier timing bug (3-second delay fix)
- "9 percentage points of improvement" from combined telemetry changes

### Code Worth Keeping
- Event schema JSON (lines 66-92) — shows what to capture in session telemetry
- SQL aggregation query (lines 135-149) — simple but effective tool-usage heatmap
- Sampling strategy YAML (lines 109-124)

### Mermaid Diagrams Worth Keeping
- Telemetry pipeline flowchart (lines 41-56) — clean 5-stage pipeline with feedback loop

---

## Post 22: 2,224 Frames, One Vision Model: Building Ground Truth at Scale
**Word count:** 7,055
**Target consolidated post:** NEW 10 — Design-to-Code

### Keep (best material)
- Opening is strong and specific: "I needed ground truth labels for 2,224 video frames and I had no budget for a labeling service."
- The batch size calibration experiment is excellent content — systematic empirical testing with a clear data table showing accuracy peaks at batch size 30 (94.2%) and degrades above 40.
- The 100-image API wall story: tried 100 images per request, quality degraded progressively after frame 60-70, confidence annotations disappeared after frame 66, last 11 frames not classified at all. Real failure with real debugging.
- Prompt iteration story: first prompt 67% accuracy, second with visual heuristics 82%, batch approach with temporal context 94.2%. Clear improvement arc.
- Confidence calibration data: high=97.1% accuracy, medium=88.3%, low=62.7%. Confidence as routing signal for human review.
- The recovery pipeline with checkpoint/retry/resume — practical engineering for long-running API pipelines.
- Cost analysis: $0.0016/frame at batch size 30, total ~$3.56 for 2,224 frames vs $18/hr manual labeling.

### Cut (LLM filler)
- "Let me walk through" — 1 instance
- "It's worth noting" — 1 instance
- Several sections have padding around code blocks that could be tightened
- The pipeline architecture section repeats what the code already shows

### Unique Insights
- Batch size sweet spot for vision API (30 frames optimal, quality degrades above 40)
- Progressive attention degradation in multi-image API calls
- Temporal context improves single-frame classification (hard cuts undetectable without neighbors)
- Confidence scores as reliable routing signal for human-in-the-loop correction
- The 100-image API limit is documented but the quality degradation well before that limit is not

### Code Worth Keeping
- Classification prompt with visual heuristics (lines 218-244) — the prompt engineering for vision classification
- Batch processing with calibration results table (lines 420-431) — empirical batch size data
- Batch prompt with temporal reasoning instructions (lines 453-499) — well-structured prompt
- Checkpoint/resume pipeline (lines 608-700) — practical resumable API pipeline pattern
- Frame-to-label pipeline flowchart is good

### Mermaid Diagrams Worth Keeping
- Batch size vs accuracy xychart (lines 432-438) — clear visualization of the sweet spot
- Full pipeline flowchart with confidence routing (lines 563-600) — shows the complete system

---

## Post 23: The Xcode Project File Problem: Why .pbxproj Breaks Every AI Agent
**Word count:** 8,621
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- Opening: "I lost four hours to a merge conflict in a file I did not write." Punchy.
- The core stat: ".pbxproj conflicts accounted for 73.4% of all merge conflicts in my workflow" — specific and surprising.
- The Ghost File Bug narrative is the post's crown jewel: file appears in Xcode, syntax-highlighted, editable, but compiler never sees it. PBXFileReference exists but PBXSourcesBuildPhase reference is missing. "No Xcode warning. No build error. No static analysis finding. Just a runtime crash."
- The 4-section cross-reference explanation: PBXFileReference, PBXBuildFile, PBXGroup, PBXSourcesBuildPhase — why each file creates 4 entries.
- Conflict math with 12 worktrees: 74 total file additions, UUID sort order conflicts, escalating conflict regions with each merge.
- AI agents create 2.25x more files than humans (6.3 vs 2.8 per session) — "optimizing for code quality inadvertently maximizes merge conflict surface."
- Four failed approaches before the toolkit: `.gitattributes merge=union` (40% invalid), Xcode merge editor (GUI not scriptable), `xcodeproj` Ruby gem (lost modifications), separate projects (shifted the problem).
- Deterministic UUID solution with SHA-256 hash of file path + section.
- Section-aware merging: treat pbxproj sections as sets, union additions, detect semantic conflicts in config sections.
- Merge conflict source table: 73.4% pbxproj, 11.2% XIB, 8.7% Package.resolved, 4.9% source code.

### Cut (LLM filler)
- "This is where X comes in" — 2 instances
- Some sections explaining pbxproj format basics could be trimmed for the consolidated post (readers of iOS post likely know this)
- The UUID math section (lines 340-363) is detailed but could be condensed

### Unique Insights
- pbxproj as THE bottleneck for parallel AI iOS development (73.4% of all conflicts)
- Ghost file bug pattern — file visible in Xcode but not compiled
- Deterministic UUID generation as a merge conflict reducer (34% reduction alone)
- AI agents' small-file preference creating 2.25x more merge conflict surface
- Section-aware merge driver concept for structured config files
- Four failed approaches form a good "what doesn't work" narrative

### Code Worth Keeping
- `deterministic_pbx_uuid()` function (lines 457-489) — the core solution
- `normalize_pbxproj_uuids()` function (lines 500-564) — the post-processing step
- `PbxprojMerger` class outline (lines 609-700) — section-aware merge driver
- Pre-commit hook bash script (lines 569-583)

### Mermaid Diagrams Worth Keeping
- Merge conflict sources pie chart (lines 324-331) — clear visualization of the 73.4% dominance

---

## Post 24: Project Constitutions: When CLAUDE.md Became Machine-Readable Governance
**Word count:** 6,865
**Target consolidated post:** NEW 7 — Prompt Engineering Stack

### Keep (best material)
- Opening: "The rule was simple: never create test files. I wrote it in CLAUDE.md... agents created test files 23% of the time anyway." Perfect setup.
- "A rule in a markdown file is a suggestion. It has no mechanism to prevent violations."
- L1/L2/L3 classification system with clear behavioral contracts: L1=block, L2=warn, L3=remind.
- 3-level vs 2-level vs 5-level compliance comparison data: 3-level system at 95.3% average beats both 2-level (87.3%) and 5-level (88.4%). The 5-level system actually performed worse due to "decision fatigue."
- Hook enforcement pipeline: PreToolUse for L1, PostToolUse for L3, with clear mermaid diagram.
- Agent workaround problem: agent created `search-verification.ts` — functionally a test suite without the `.test.` suffix. "The agent had learned to evade the pattern-based block by renaming the file."
- Content-based detection hook in response to evasion.
- Subagent constitution inheritance problem: subagents spawned via Task tool don't inherit CLAUDE.md rules. Subagent L1 compliance jumped from 68% to 94.7% with constitution injection.
- Amendment process with dated entries, versioned rules, evidence requirements.
- "L1-001 Pattern List Expanded" amendment showing agents finding creative workarounds (__tests__/, .mock. suffix, Python conventions).

### Cut (LLM filler)
- "Let me walk through" — 1 instance
- Some sections repeat concepts already covered in post 28 (hooks). For consolidation, merge the unique constitution framing (L1/L2/L3) with the hook implementation details from post 28.

### Unique Insights
- L1/L2/L3 constitutional hierarchy with measured compliance rates per level
- 3-level system outperforming 2-level and 5-level alternatives (with data)
- Agent creative evasion of pattern-based blocks — renaming test files
- Subagent constitution inheritance gap (68% to 94.7% with injection)
- Amendment process as a versioned governance mechanism
- "Passive rules fail the same way passive documentation fails in human teams"

### Code Worth Keeping
- Constitution CLAUDE.md structure with L1/L2/L3 sections (lines ~140-239) — the full template
- `block-test-files.js` hook (lines 355-399) — canonical example of L1 enforcement
- `read-before-edit.js` hook (lines 407-450) — L2 warning example
- `validation-not-compilation.js` hook (lines 458-487) — L3 reminder example
- `subagent-constitution-enforcer.js` hook (lines 527-565) — critical for multi-agent

### Mermaid Diagrams Worth Keeping
- Hook pipeline flowchart with L1/L2/L3 mapping (lines 296-339) — excellent architecture diagram

---

## Post 25: 52 Tasks, 8 Phases, Zero Drift: Spec-Driven Execution Loops
**Word count:** 6,625
**Target consolidated post:** NEW 11 — Spec-Driven

### Keep (best material)
- Opening: "I watched an agent destroy four hours of work in eleven seconds." Strong.
- "The agent interpreted 'use the existing auth system' as 'implement a new auth system that's compatible with the existing one.' It created 47 new files."
- "Natural language specifications are fundamentally inadequate for multi-agent AI execution. Not because the agents are stupid — because they're too creative."
- The YAML spec format showing how "use the existing auth system" becomes 5 specific fields (middleware path, export name, token type, refresh mechanism, role requirement).
- Six-category constraint taxonomy: Technology, Boundary, Interface, Behavioral, Quality, Integration — each targeting a specific failure mode.
- Phase gates concept: blocking validation checkpoints between execution phases. Schema->API->Components->Integration ordering.
- Bottom-up vs top-down ordering data: gate failures dropped from 4.7 to 1.2, rework phases from 2.3 to 0.6, completion time from 4.2h to 2.8h.
- "Execute the most constrained phases first" — the key principle.
- Parallel task scheduling within phases with file ownership enforcement.
- Continuous drift detection as background monitoring during execution.
- The DriftDetector class running every 5 seconds to catch violations mid-phase.

### Cut (LLM filler)
- "This is where X comes in" — 2 instances
- "Let me show" — 1 instance
- The constraint taxonomy YAML block is long and could be condensed for the consolidated post
- Phase gate validator code is verbose — the concept matters more than the full implementation

### Unique Insights
- YAML spec format replacing natural language for agent instructions
- Six-category constraint taxonomy covering all spec drift failure modes
- Phase gates as blocking validation checkpoints (not just CI checks)
- Bottom-up execution order outperforming top-down (with specific data)
- Continuous drift detection during execution (not just at phase boundaries)
- "Agents fill ambiguity with invention. Every gap in your spec becomes a canvas for improvisation."

### Code Worth Keeping
- YAML spec example for admin dashboard (lines ~160-203) — concrete before/after
- Constraint taxonomy YAML (lines 219-287) — the 6-category system
- Phase gate structure YAML (lines 312-379) — the blocking/advisory/rollback/halt model
- PhaseGateValidator class (lines 393-487) — the core validator
- DriftDetector class concept (lines 668-699)

### Mermaid Diagrams Worth Keeping
- None particularly notable — the YAML structures serve as the primary visual

---

## Post 26: 596 IPC Channels: Auto-Mapping Electron to Native Platform Specs
**Word count:** 6,707
**Target consolidated post:** NEW 11 — Spec-Driven

### Keep (best material)
- Opening: "Auto-Claude started as an Electron app. 596 IPC channels connecting the renderer process to the main process."
- The Electron performance numbers: 340MB baseline memory, 2.1s cold start. Native target: 80MB, 0.4s.
- 4-agent parallel extraction strategy: Agent 1 (file domain, 47 channels), Agent 2 (session+auth, 156 channels), Agent 3 (editor+terminal+git, 153 channels), Agent 4 (ui+legacy+misc, 240 channels).
- The ChannelContract dataclass — 16 fields capturing every aspect of an IPC channel including confidence scores.
- Type inference on untyped channels: `data:migrate-v2` example where call site passes `dryRun` but handler ignores it. `confidence: 0.72` flagging for manual review.
- Agent 4 failure with dynamic channel names (`plugin:${pluginId}:init`) — 14 channels computed at runtime, invisible to static scan.
- Preload script blind spot: 12 channels classified as "dead code" were actually called from preload scripts, not renderer components.
- Generated Swift protocol with traceability comments, platform-idiomatic patterns (AsyncStream vs IPC subscription), typed error enums, confidence annotations.
- Kotlin interface generation with Kotlin-idiomatic patterns (Flow vs AsyncStream, sealed class vs enum, Long timestamps vs Date).
- Zustand store mapping complexity: 23 stores with 11 IPC channels each, reactive state synchronized through IPC.

### Cut (LLM filler)
- "Notice several things" — 1 instance
- The full generated Swift protocol is very long (lines 396-532) — a condensed version showing 3-4 methods with the key patterns would suffice
- The Kotlin interface (lines 552-644) largely duplicates the Swift section — show one with a note about platform differences
- Zustand store section at the end is interesting but runs long

### Unique Insights
- Parallel agent extraction for large-scale codebase analysis (4 agents, domain-partitioned)
- Confidence scoring for inferred types — routing low-confidence specs to human review
- Dynamic channel names as a blind spot for static analysis
- Preload scripts as a missed call site location
- Platform-idiomatic translation (not literal): IPC subscription -> AsyncStream (Swift) / Flow (Kotlin)
- "The question was never whether to go native. It was how to go native without spending twelve weeks reverse-engineering."

### Code Worth Keeping
- ChannelContract dataclass (lines 252-271) — the complete contract shape
- Untyped channel inference example (lines 278-323) — the `dryRun` discovery
- Dynamic channel registration code (lines 336-353) — the `plugin:${pluginId}` pattern
- Generated FileServiceProtocol (condensed, lines 396-476) — showing traceability comments and platform idioms
- FileChangeEvent sealed class in Kotlin (lines 638-644) — showing platform-idiomatic translation

### Mermaid Diagrams Worth Keeping
- None particularly notable — the code examples serve as the primary illustration

---

## Post 27: It Compiles Is Not Done: Playwright-Driven Functional Validation
**Word count:** 7,174
**Target consolidated post:** NEW 3 — Functional Validation

### Keep (best material)
- Opening: "The agent said the feature was complete. The build passed. TypeScript reported zero errors. I merged the PR. The button did not work." Devastating.
- "The onClick handler was wired to a function that existed but contained a TODO comment where the implementation should have been. The build passed because the function had the correct signature."
- The Delete Account button story: correct icon, correct confirmation dialog, correct loading spinner, empty function body. "A user discovered the bug and filed a ticket asking why they could not delete their account."
- Three-layer validation stack: Layer 1 (compilation/Docker/type check), Layer 2 (runtime verification/server readiness), Layer 3 (functional verification with Playwright MCP).
- Server readiness three-check pattern: TCP connection + HTTP 200 + content marker. Catches three specific false positives (port open but crashing, responding but wrong content, cached response).
- Real Playwright MCP validation transcript (lines 361-404): navigate, snapshot, click, verify, screenshot. "This is fundamentally different from 'the build passed.'"
- ValidationStep protocol with StepType enum and ValidationReport with markdown generation.
- Screenshot evidence pattern with named evidence files: "11 screenshots showing 11 features working in a real browser."
- Screenshot comparison using perceptual hashing (imagehash.phash) for visual regression detection.
- Docker integration for environment drift elimination.

### Cut (LLM filler)
- "This is fundamentally different" — used well, keep
- "Let me show" — 1 instance
- The ValidationStep/StepResult/ValidationReport code block (lines 413-548) is very long — could be condensed to show the concept with 3-4 steps
- Screenshot comparison code (lines 630-685) is standard — the concept matters more than the implementation

### Unique Insights
- Three-layer validation stack (compilation -> runtime -> functional) as a complete hierarchy
- Server readiness three-check pattern (TCP + HTTP 200 + content marker) with three specific false positive scenarios
- Playwright MCP as interactive validation (not scripted tests) — agent navigates dynamically like a human tester
- Screenshot evidence as unambiguous validation artifact ("You cannot argue with a screenshot")
- Perceptual hash-based screenshot comparison for visual regression detection
- "The Delete Account button" as the canonical example of compilation-passes-but-feature-broken

### Code Worth Keeping
- `wait_for_server()` with three-check readiness (lines 246-321) — the definitive server readiness check
- Playwright MCP validation transcript (lines 361-404) — real session showing the workflow
- Validation report markdown format (lines 579-621) — the evidence standard
- `compare_screenshots()` with perceptual hashing (lines 637-657) — visual regression detection concept

### Mermaid Diagrams Worth Keeping
- None in particular — the validation transcript serves as the primary illustration

---

## Post 28: Hooks as Guardrails: Enforcing Agent Discipline at the Tool Level
**Word count:** 6,643
**Target consolidated post:** NEW 7 — Prompt Engineering Stack

### Keep (best material)
- Opening: "I had 14 rules in CLAUDE.md. The agent followed 11 of them consistently." Concrete and relatable.
- "Forty-seven test files created over three months. A hundred and twelve edits to files the agent had not read first. Sixty-three times the agent declared a feature 'complete' immediately after the build succeeded."
- The "asked about test file rules, quoted CLAUDE.md verbatim, then 11 tool calls later created auth.test.ts" — demonstrates the comprehension vs enforcement gap.
- Aggregate impact mermaid diagram: 3.1 violations/session -> 0.4 violations/session, 87% reduction across 847 sessions.
- Hook 1 (block-test-files): 23% to 0% test file creation. "In 847 sessions with the hook active, not a single test file was successfully created." The allowlist evolution (3 versions).
- Hook 2 (read-before-edit): 31% to 4%. Why warning not block — the cascade problem with 5-minute expiry. Testing 1/3/5/10/15 minute windows, 5 was sweet spot.
- Hook 3 (block-api-keys): 2.1% to 0%. Allowlist for `process.env.*` references.
- Hook 4 (validation-not-compilation): 41% to 9%. "The agent no longer acknowledges the reminder in its output, but its behavior changes" — learned compliance.
- Hook 5 (evidence-gate-reminder): +34% task completion quality.
- The 18 hooks built and discarded: max-file-size, no-console-log, import-order, commit-message-reviewer, type-annotation-enforcer, function-length, single-responsibility, dry-violation-detector. "Hooks that enforce style preferences create more problems than they solve."
- The distinction: "if the violation can be objectively detected from the tool input alone, a hook works. If it requires understanding intent, a hook does not work."
- Three-period measurement table (No Hooks n=312, Warnings Only n=223, Full Enforcement n=312) — rigorous before/during/after comparison.
- Hook overhead: 7ms per tool call — negligible.

### Cut (LLM filler)
- "Let me walk through each one" — 1 instance
- Some code blocks are very long (full hook implementations) — for consolidation, show 1-2 representative hooks with the concept, reference others by name
- The read-before-edit hook code (lines 337-426) includes filesystem persistence logic that's implementation detail

### Unique Insights
- PreToolUse blocks vs PostToolUse reminders — different enforcement levels for different rule types
- Quantified impact of each hook individually (5 hooks, 5 measurements)
- The 18 failed hooks and the pattern of WHY they failed — style hooks don't work, safety/workflow hooks do
- 5-minute window calibration for read-before-edit
- "Comprehension vs enforcement gap" — agent understands rule, still violates it
- Warning-not-block for read-before-edit and the cascade reasoning
- Hook overhead measurement (7ms) proving negligible cost
- Three-period comparison methodology (baseline, partial, full)

### Code Worth Keeping
- `block-test-files.js` full implementation with allowlist (lines 240-317) — canonical PreToolUse blocker
- `validation-not-compilation.js` (lines 532-605) — canonical PostToolUse reminder
- `evidence-gate-reminder.js` (lines 626-652) — completion gate checklist
- Three-period measurement table (lines 688-698) — the rigorous comparison data

### Mermaid Diagrams Worth Keeping
- Aggregate impact diagram (lines 200-230) — shows all 5 hooks with measured impact in one view

---

## Post 29: 4,597 Session Logs, 1,768,085 Lines: Mining AI Sessions for Blog Content
**Word count:** 6,181
**Target consolidated post:** NEW 9 — Content Pipelines

### Keep (best material)
- Opening: "There is a certain irony in using the exact system you are writing about to write about it." Self-referential and engaging.
- "The session where I debugged the scoring algorithm's novelty metric? That session was later ingested by the scoring algorithm, which scored the novelty of its own debugging as 0.78 — 'moderately novel, limited cross-project applicability.' The algorithm was right."
- Three-zone sampling strategy: head (50 lines), middle (3 random windows of 30), tail (50 lines). 48% processing time reduction, <3% insight loss.
- Tool signatures beat natural language for topic extraction — the key surprising finding. Tool patterns are "precise and invariant. They do not lie about what the session actually did."
- K-means clustering (k=20) on tool signatures: 20 clusters with clear semantic meaning, 94% stability across re-runs vs 71% for NLP approach.
- Cluster table (lines 426-449): 20 topic clusters from tool patterns, each mapping to a real development activity.
- 7-dimension scoring system: novelty (0.20), complexity (0.15), reproducibility (0.20), impact (0.15), narrative (0.10), breadth (0.10), evidence (0.10).
- Three concrete scoring examples: Multi-Agent Consensus scored 0.94 (became Post 2), Hook-Based Discipline scored 0.84 (became Post 28), Config File Edits scored 0.16 (not publishable).
- Narrative scoring: "Sessions with both failure signals AND resolution signals indicate a story arc."

### Cut (LLM filler)
- "Let me walk through" — 1 instance
- "Let me show how" — 1 instance
- The InsightScorer implementation (lines 510-643) is very detailed — the scoring concept and weights matter more than the full implementation
- ToolSignature extraction code (lines 306-421) is thorough but long

### Unique Insights
- Tool usage patterns as superior topic signal vs natural language analysis (94% vs 71% cluster stability)
- Three-zone sampling strategy for large session logs (<3% insight loss, 48% time savings)
- 7-dimension scoring system with empirically tuned weights
- "The algorithm scored the novelty of its own debugging" — recursive self-evaluation
- Cluster T (miscellaneous) as largest cluster at 1,240 sessions — most sessions are too short/varied to be interesting
- Failure+resolution signal combination as narrative arc detector

### Code Worth Keeping
- SamplingStrategy with three-zone approach (concept, not full code)
- ToolSignature dataclass (lines 314-330) — the feature vector for clustering
- InsightScore dataclass with weighted_score (lines 464-493) — the 7 dimensions with weights
- Cluster table (lines 426-449) — shows what tool pattern clustering reveals
- Scoring examples with specific scores (lines 652-668)

### Mermaid Diagrams Worth Keeping
- Full pipeline architecture (lines 674-700+) — 4-phase pipeline from ingest to rank

---

## Post 30: Multi-Simulator Parallel Validation
**Word count:** 6,156
**Target consolidated post:** NEW 4 — iOS Streaming Bridge

### Keep (best material)
- Opening: "The bug report came in on a Friday afternoon. 'Layout is broken on iPhone SE.'" Relatable.
- "Three days where users on the most popular budget iPhone in the world could not tap the primary call-to-action in our app. Three days where our analytics showed a mysterious 40% drop in new item creation that we had attributed to 'seasonal variation.'"
- Three device-specific bugs in one month: Dynamic Type overlap on iPad, safe area miscalculation on iPhone 14 vs 15, tab bar overlap on SE.
- Device matrix definition: iPhone SE (375x667), iPhone 15 (393x852), iPad Air (820x1180) — the minimum viable matrix.
- ParallelSimulatorOrchestrator class: boot_matrix, install_and_launch, navigate_all, capture_all, shutdown_all lifecycle.
- Parallel boot: 45s sequential -> 18s parallel (60% reduction). Install: 12s -> 5s.
- idb_tap navigation using accessibility labels instead of coordinates: "The 'Settings' tab might be at y=750 on iPhone 15 and y=620 on iPhone SE. Accessibility labels are consistent across all device sizes."
- NavigationRoute with verification_label — confirming we reached the target screen.
- Parallel screenshot capture within 200ms window — ensuring same app state across devices.
- Element visibility comparison across devices: expected elements checked on all devices, issues flagged when element visible on one but not another.

### Cut (LLM filler)
- "This is where X comes in" — 1 instance
- The SimulatorNavigator code (lines 441-553) is very detailed with idb parsing — could be condensed
- The _find_or_create_device method (lines 274-299) is implementation detail
- ParallelScreenshotCapture class (lines 589-700) duplicates concepts shown in the orchestrator

### Unique Insights
- Multi-simulator parallel validation as a systematic approach to device-specific bugs
- Device matrix concept: minimum set of devices covering the key variation axes (screen size, safe area, Dynamic Type)
- Accessibility labels as device-independent tap targets for simulator automation
- 200ms capture window for cross-device screenshot comparison
- "Seasonal variation" misattribution of a device-specific regression — the human cost of not testing across devices
- Parallel simulator boot optimization (sequential vs concurrent timings)

### Code Worth Keeping
- Device matrix definition (concept — the 3-device minimum)
- ParallelSimulatorOrchestrator.boot_matrix() with concurrent boot (lines 227-272)
- NavigationRoute with TapTarget using accessibility labels (lines 384-439)
- navigate_all for parallel navigation to same screen (lines 539-553)
- capture_all within 200ms window (lines 596-615)

### Mermaid Diagrams Worth Keeping
- None particularly notable — the code and device matrix table serve as primary illustrations

---

## Cross-Post Overlap Analysis

### Post 24 (Constitutions) vs Post 28 (Hooks)
HIGH OVERLAP. Both cover the same enforcement system from different angles:
- Post 24 focuses on the L1/L2/L3 constitutional framework and the philosophy of rule hierarchies
- Post 28 focuses on the specific hook implementations and measured impact
- For NEW Post 7 (Prompt Engineering Stack), merge: take the L1/L2/L3 framework from 24, the 5 hook implementations with measurements from 28, the 18 failed hooks from 28, and the subagent inheritance problem from 24.
- Key dedup: `block-test-files.js` appears in both posts with slightly different versions. Use the more complete version from 28.
- Key dedup: `read-before-edit.js` appears in both. Use version from 28 (has the 5-minute window reasoning).
- Key dedup: `validation-not-compilation.js` appears in both. Either version works.

### Post 25 (Spec-Driven) vs Post 26 (Electron-to-Native)
MODERATE OVERLAP. Both target NEW Post 11 (Spec-Driven):
- Post 25 is the general framework (YAML specs, constraint taxonomy, phase gates, drift detection)
- Post 26 is a specific case study (596 IPC channels, multi-agent extraction, platform-specific spec generation)
- For consolidation: use post 25 for the framework/principles, post 26 for the war story and concrete example
- No code duplication between the two

### Post 21 (Observability) for NEW Post 12 (Cross-Session Memory)
LOW FIT. Post 21 is about session telemetry/observability, not cross-session memory. The correlation data and 12-minute cliff finding could fit as supporting evidence in a memory/observability section, but the core telemetry pipeline is its own topic.

### Post 30 (Multi-Simulator) for NEW Post 4 (iOS Streaming Bridge)
LOW FIT. Multi-simulator validation is about device testing, not streaming/SSE. Could contribute a section on "validating across device types" but the core content is distinct from streaming bridge architecture.
