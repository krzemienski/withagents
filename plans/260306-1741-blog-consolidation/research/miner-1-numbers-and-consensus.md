# Miner 1: Numbers and Multi-Agent Consensus Evidence

## Post 1: Verified Metrics

### Core Numbers

- **Total JSONL files:** 5,248
- **Meaningful sessions (>1KB):** 4,510
- **Observer/automated sessions:** 2,693 (claude-mem-observer background processes)
- **Human-initiated meaningful sessions:** 1,817
- **Project directories:** 411 (includes worktree branches, observer sessions, and embedded app contexts)
- **Top-level projects (with significant activity):** 20
- **Total lines of session data:** 1,762,452
- **Date range:** 2026-02-04 to 2026-03-06 (31 days)

### Top 5 Most-Used Tools (Across ALL Projects)

| Tool | Count |
|------|-------|
| Bash | 35,216 |
| Read | 26,303 |
| Edit | 8,118 |
| Grep | 5,392 |
| Write | 3,148 |

### Extended Tool Leaderboard

| Tool | Count | Category |
|------|-------|----------|
| Bash | 35,216 | Core |
| Read | 26,303 | Core |
| Edit | 8,118 | Core |
| Grep | 5,392 | Core |
| Write | 3,148 | Core |
| TaskUpdate | 2,871 | Agent Orchestration |
| Task | 2,825 | Agent Orchestration |
| Glob | 2,758 | Core |
| TaskCreate | 1,477 | Agent Orchestration |
| idb_tap | 1,471 | iOS Simulator MCP |
| Skill | 737 | OMC Framework |
| browser_click | 489 | Playwright MCP |
| TaskOutput | 481 | Agent Orchestration |
| browser_navigate | 358 | Playwright MCP |
| browser_take_screenshot | 327 | Playwright MCP |
| simulator_screenshot | 226 | iOS Simulator MCP |
| Agent | 134 | Agent Orchestration |
| SendMessage | 56 | Agent Teams |

### Top 5 Projects by Session Volume

| Project | Sessions | Lines | Data Size | Agents Spawned |
|---------|----------|-------|-----------|----------------|
| claude-mem-observer-sessions | 2,690 | 371,506 | 2,140 MB | 0 |
| ils-ios | 974 | 768,412 | 2,752 MB | 287 |
| yt-transition-shorts-detector | 240 | 135,231 | 845 MB | 0 |
| sessionforge | 202 | 155,012 | 560 MB | 192 |
| ralph-orchestrator | 138 | 152,254 | 599 MB | 57 |

**Note:** claude-mem-observer-sessions is an automated background process, not human-initiated. For "top 5 human projects," replace it with:

| Project | Sessions | Lines | Data Size | Agents Spawned |
|---------|----------|-------|-----------|----------------|
| ils-ios | 974 | 768,412 | 2,752 MB | 287 |
| yt-transition-shorts-detector | 240 | 135,231 | 845 MB | 0 |
| sessionforge | 202 | 155,012 | 560 MB | 192 |
| ralph-orchestrator | 138 | 152,254 | 599 MB | 57 |
| sessionforge-apps-dashboard | 112 | 3,377 | 16 MB | 6 |

### Agent Orchestration Totals

| Metric | Count |
|--------|-------|
| Task (subagent spawn) calls | 2,825 |
| Agent (inline agent) calls | 134 |
| TaskCreate calls | 1,477 |
| TaskUpdate calls | 2,871 |
| TaskOutput calls | 481 |
| SendMessage (teammate) calls | 56 |
| **Total agent-related operations** | **7,844** |
| Agents spawned (from project headers) | 676 |

### File Operations Totals

| Operation | Count |
|-----------|-------|
| Read | 26,303 |
| Write | 3,148 |
| Edit | 8,118 |
| **Total files touched** | **37,569** |

---

## Post 2: Multi-Agent Consensus Evidence

### War Story 1: "The Three-Agent iOS Audit" (75 TaskCreates, 6 TeamCreates, 19 SendMessages)

- **Project:** ils-ios
- **Session file:** `f9d4b6e2-d720-4d8a-a419-33d4a4d405e5.jsonl` (15,933 lines)
- **What happened:** A full-stack iOS app audit using a 3-agent consensus model (Lead, Alpha, Bravo). The team ran a 6-phase, 10-gate validation of dual-mode streaming (SDK + CLI), with each gate requiring unanimous PASS/FAIL from all three agents. The team created 75 individual tasks and spawned 3 separate team configurations.
- **Agents involved:** 3 named agents (Lead, Alpha, Bravo) across 6 TeamCreate calls
- **Team names created:** `ils-audit`, `ils-audit` (phase 2), `ils-audit-v2`

**Real output — Gate 1 Consensus Achieved:**
```
**GATE 1: THREE-AGENT CONSENSUS ACHIEVED!**

| Agent | Vote | Tests | Key Evidence |
|-------|------|-------|-------------|
| Lead | **PASS** | 4/4 cURL + 3 sims | gate1-lead-vote.md |
| Alpha | **PASS** | 18/18 cURL | 12 vg1-*.txt files |
| Bravo | **PASS** | 23 screenshots + live streaming | bravo-01 through bravo-23 |

**Result: GATE 1 — PASS** with 2 findings for investigation.
```

**Real output — Status Board showing voting in progress:**
```
## Gate 1 Status Board

| Agent | Vote | Tests | Evidence |
|-------|------|-------|----------|
| Lead | **PASS** | 4/4 cURL + 3 simulators | gate1-lead-vote.md |
| Alpha | **PASS** | 18/18 cURL | 12 evidence files |
| Bravo | **PENDING** | 8 screenshots | bravo-01 through bravo-08 |

**Blocking**: Bravo's Gate 1 vote. Message sent with urgency.
```

**TaskCreate examples from this session:**
- "Alpha submits Phase 1 plan covering: (1) SDK mode streaming endpoint verification via cURL, (2) CLI mode streaming endpoint verification via cURL..."
- "ALL three agents (Lead, Alpha, Bravo) must independently confirm PASS for: SDK streaming, CLI streaming, session lifecycle, and iOS rendering in both modes. Requires unanimous vote. Any FAIL triggers..."
- "Two root causes found: 1. handleAssistantMessage line 929 uses += instead of = for text blocks, duplicating content after streaming deltas..."

### War Story 2: "The 13-Team Design Consensus" (13 TeamCreates, 21 SendMessages, 80 Task/Agent spawns)

- **Project:** ils-ios
- **Session file:** `33771457-38a0-470b-b05a-c441ea3b14bf.jsonl` (14,993 lines)
- **What happened:** Consolidating 5 incomplete iOS app specifications into one "finish-v1" spec. The orchestrator spawned 13 different team configurations over the session, including design teams with architect + 3 validators, implementation teams with executor + validators, and consensus checkpoint teams requiring unanimous PASS/FAIL.
- **Agents involved:** 13 teams with named roles: architect, validator-a, validator-b, validator-c, executor-a, executor-b, executor-c

**Real TeamCreate configurations:**
```
TeamCreate: 'finish-v1-design' — Architect drafts design, 3 validators review
TeamCreate: 'finish-v1-phase1' — Executor handles implementation, 3 validators for consensus
TeamCreate: 'v1-consensus' — 3 validators review evidence for unanimous PASS/FAIL
TeamCreate: 'finish-v1-p1-endpoints' — Executor validates endpoints, 3 validators for consensus
```

**SendMessage activity (teammates addressed):** architect, validator-a, validator-b, validator-c, executor-a, executor-b, executor-c, executor

### War Story 3: "The Triple-Verification Build Team" (7 TeamCreates, 12 SendMessages)

- **Project:** ils (original project)
- **Session file:** `5796ad7d-98c6-4e81-b721-d3013cc01ef4.jsonl` (4,046 lines)
- **What happened:** Building a production iOS app from scratch with multi-agent teams at every phase. Started with a build team, then a Solution Design Document team with cross-validation, then an implementation team running 3 parallel tracks, culminating in a triple-verification validation team.
- **Agents involved:** Multiple named agents: spec-extractor, sdd-constraints, sdd-building-blocks, sdd-runtime, sdd-design, sdd-adrs, cross-validator, impl-models

**Real TeamCreate configurations:**
```
'ils-build' — Production-grade iOS 17+ SwiftUI app with real-time SSE streaming
'ils-sdd' — Solution Design Document creation with cross-validation
'ils-impl' — Phase 1 (Models), Phase 2A (API Verification), Phase 2B (Design System) in parallel
'ils-validation' — Triple-verification team: 3 independent agents verify builds,
                    architecture, code quality, and produce consensus reports
```

### Quotable Metrics

| Metric | Value |
|--------|-------|
| Largest multi-agent session | 80 agent spawns in one session (ils-ios/33771457) |
| Most TaskCreates in one session | 75 (ils-ios/f9d4b6e2 — 3-agent audit) |
| Most TeamCreates in one session | 13 (ils-ios/33771457 — design consensus) |
| Most SendMessages in one session | 25 (ils-ios/509fc17b) |
| Total Task/Agent calls across corpus | 2,959 (Task: 2,825 + Agent: 134) |
| Total TaskCreate calls across corpus | 1,477 |
| Total SendMessage calls across corpus | 56 |
| Total agent-related operations | 7,844 |
| Projects with >10 agent spawns | ils-ios (287), sessionforge (192), blog-series (128), ralph-orchestrator (57), sessionforge-apps-dashboard (6) |

### Sessions With Richest Team Coordination

| Session | Project | TeamCreate | SendMessage | TaskCreate |
|---------|---------|------------|-------------|------------|
| 33771457 | ils-ios | 13 | 21 | 31 |
| f9d4b6e2 | ils-ios | 6 | 19 | 75 |
| 509fc17b | ils-ios | 3 | 25 | 15 |
| 070f1544 | ils-ios | 4 | 8 | 48 |
| 5796ad7d | ils | 7 | 12 | 27 |
| c9a10ef3 | ils | 2 | 10 | 17 |
| 04a12e93 | blog-series | 1 | 24 | 16 |
| 7eea67ec | awesome-site | 1 | 17 | 0 |

### Key Patterns Observed

1. **Unanimous gate voting** — The 3-agent audit model (Lead, Alpha, Bravo) required all three agents to independently vote PASS before advancing to the next phase. Real blocking occurred when Bravo's vote was pending.

2. **Parallel evidence gathering** — Alpha ran 18 cURL endpoint tests while Lead ran 4 and Bravo ran visual iOS simulator verification, all simultaneously.

3. **Team reconfiguration mid-session** — The 13-TeamCreate session shows the orchestrator dissolving and reforming teams as the project moved from design to implementation to validation phases.

4. **Named agent roles** — Agents were given specific identities (architect, validator-a/b/c, executor-a/b/c, Lead/Alpha/Bravo) with distinct responsibilities and file ownership.

5. **Consensus-gated progression** — No phase could advance without unanimous PASS from all validators. The "v1-consensus" team was created specifically as a checkpoint gate.

6. **Real bug discovery through multi-agent audit** — The 3-agent audit found a real P2 text duplication bug (line 929: `+=` instead of `=` for text blocks), which was fixed and committed (`32e5d36`).
