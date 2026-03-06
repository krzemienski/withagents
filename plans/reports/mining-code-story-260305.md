# Session Mining Report: code-story-platform Cluster

**Miner:** miner-code-story
**Date:** 2026-03-05
**Scope:** code-story-platform (91 dirs), code-story-rn, code-tales-ios
**Sessions analyzed:** ~40 largest JSONL files across 3 project clusters
**Total session data:** ~120MB across code-story-platform, code-story-rn, code-tales-ios

## Executive Summary

The code-story-platform cluster represents a full-stack audio storytelling app ("Code Tales") built across three codebases: a Next.js web platform, an Expo React Native mobile app, and a native SwiftUI iOS app. Sessions reveal rich patterns in AI-driven audio generation pipelines, cross-platform coordinate mapping struggles, systematic codebase archaeology, and real-time SSE progress tracking. 8 novel topics identified with strong evidence.

---

## Topic 1: AI Audio Narration Pipeline -- From GitHub Repo to Spoken Story

**Description:** Code Tales transforms GitHub repositories into audio narratives using a multi-stage pipeline: repo analysis via Anthropic Claude, script generation, text chunking, ElevenLabs TTS voice synthesis, audio chunk stitching, and SSE-based real-time progress streaming to the UI. The pipeline handles multi-chunk stories (splitting long narratives into 6-minute segments), voice model selection from 14+ ElevenLabs voices, and progress tracking across generation stages.

**Evidence:**
- Backend architecture analysis session reveals: PostgreSQL via Drizzle ORM (14 tables), Anthropic Claude for script generation, ElevenLabs for TTS, SSE for real-time progress
- Frontend architecture session shows SSE-based generation tracking with EventSource, progress bar updates per-chunk
- `agent-a46ce75.jsonl` (381KB): Full backend codemap documenting the generation pipeline
- `agent-a290d26.jsonl` (450KB): Frontend SSE integration with real-time progress UI
- `agent-af1527d.jsonl` (928KB): Multi-chunk audio playback validation showing 2-chunk story "The Encrypted Realms" with 12:41 total duration
- `agent-a6a7275.jsonl` (672KB): Scout mission documenting all web app features including story generation flow

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 3 | 3x | 9 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 2 | 2x | 4 |
| Failure+Recovery | 2 | 3x | 6 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 2 | 1x | 2 |
| Visual | 3 | 2x | 6 |
| **TOTAL** | | | **39** |

---

## Topic 2: Simulator Coordinate Mapping -- The Pixel-to-Point Translation Problem

**Description:** Across 33+ session files (118 hits), agents struggled with iOS simulator coordinate mapping when using `idb ui tap` for UI automation. The iPhone 16 Pro has a 3x Retina scale factor (1206x2622 pixels vs 402x874 points), but different tools use different coordinate systems. Sessions show agents discovering through trial-and-error that `idb` uses point coordinates, `xcrun simctl io screenshot` outputs pixel images, and tap targets must be divided by the scale factor. Agents repeatedly tapped wrong elements (opening Story Details instead of Library tab), then developed systematic calibration strategies.

**Evidence:**
- `agent-ae587af.jsonl` (7.4MB, 1416 lines): "I need to figure out the correct screen coordinates. Let me first get the Simulator window bounds to calculate the correct tap position."
- `agent-a4c8061.jsonl` (6.1MB, 1064 lines): "The coordinate mapping note says multiply by 1.31 to map to original image"
- `agent-a01930f.jsonl` (5.6MB, 1158 lines): "iPhone 16 Pro has 3x scale factor, so screen is 402x874 points. The screenshot is 1206x2622 pixels. So to convert pixel coordinates to points: divide by 3."
- `agent-a9990c7.jsonl` (6.2MB, 1200 lines): "The tap landed on the Home tab text and navigated to Discover instead"
- 118 coordinate-related hits across 33 unique session files
- Multiple approaches tried: AppleScript, cliclick, Python subprocess, idb_companion, direct simctl

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 3 | 3x | 9 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 3 | 3x | 9 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 3 | 1x | 3 |
| Visual | 3 | 2x | 6 |
| **TOTAL** | | | **45** |

---

## Topic 3: Codebase Archaeology -- AI-Driven Code Audit at Scale

**Description:** Sessions show a systematic approach to auditing a large, evolving codebase: generating codebase inventories, import graphs, dependency audits, documentation freshness reports, and identifying abandoned/stale directories. One session classified 23 directories as ACTIVE/ABANDONED/STALE/EMPTY with evidence, identified 2.3GB of recoverable storage from abandoned directories, and generated 4 comprehensive audit documents. Another session performed a doc freshness audit across 33 documents, rating each as CURRENT/NEEDS_UPDATE/STALE.

**Evidence:**
- `agent-a34d008.jsonl` (728KB, 770 lines): Generated CODEBASE_INVENTORY.md (323 lines), DEPENDENCY_AUDIT.md, IMPORT_GRAPH.md, CONFIG_CONFLICTS.md
- `agent-ac21338.jsonl` (664KB, 336 lines): DOC_FRESHNESS_AUDIT.md reviewing 33 documents
- `agent-acfb0bd.jsonl` (705KB, 520 lines): Comprehensive React Native codebase inventory
- `agent-a72c752.jsonl` (428KB): Error handling patterns analysis across 31 API routes and 13+ lib files
- `agent-a4f0ded.jsonl` (481KB): JSDoc coverage analysis of 267+ exported items across 22 lib files

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 3 | 3x | 9 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 1 | 3x | 3 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 3 | 1x | 3 |
| Visual | 2 | 2x | 4 |
| **TOTAL** | | | **37** |

---

## Topic 4: Deep Link Testing in Expo Go vs Dev Builds -- URL Scheme Discovery

**Description:** Sessions reveal the complex debugging journey of testing deep links across Expo Go, Expo dev builds, and native iOS builds. Agents discovered that Expo Go only registers for `exp://`, `exps://`, and Facebook schemes -- not custom schemes like `codetales://`. The custom scheme works in dev builds but not Expo Go. Testing revealed that `xcrun simctl openurl` silently succeeds even when no app handles the scheme, making failures invisible. The native iOS project had correct URL scheme registration but the wrong app was running.

**Evidence:**
- `agent-a39578a.jsonl` (1.5MB, 372 lines): Full deep link testing journey across 3 URL schemes
- Tested: `codetales://auth/callback?token=test-token-123`, `com.codetales.app://auth/callback`, `exp://`
- Discovery: "Expo Go only registers for exp, exps, fb..., expauth, and host.exp.exponent URL schemes. The codetales:// scheme is NOT registered"
- "The command silently succeeds but the URL is never delivered to the app"
- Found native iOS project with correct scheme registration, but Expo Go was running instead
- 18 deep-link related hits across 9 session files

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 2 | 3x | 6 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 3 | 3x | 9 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 1 | 1x | 1 |
| Visual | 2 | 2x | 4 |
| **TOTAL** | | | **38** |

---

## Topic 5: Offline Audio Download System -- expo-file-system + MMKV Architecture

**Description:** Sessions document building an offline audio download system for a React Native app using expo-file-system for downloads and MMKV for persistent metadata storage. The architecture includes a download manager with queue management, progress tracking per-download, background download support, and a Zustand store backed by MMKV for download state persistence across app restarts. The system handles multi-chunk stories where each audio segment must be downloaded independently.

**Evidence:**
- `agent-abfe503.jsonl` (RN session, 170 lines): Created downloadManager.ts, downloadStore.ts, useDownloads.ts, download/index.ts
- Uses expo-file-system for file I/O, react-native-mmkv for persistent storage
- Download queue with concurrent download limits
- Progress tracking per-download with Zustand store
- Multi-chunk audio story support (each chunk downloaded separately)
- `agent-ac0b653.jsonl`: Scout report documenting download manager architecture
- `agent-a3bbcd5.jsonl`: Codebase audit confirming offline mode patterns

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 2 | 3x | 6 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 2 | 2x | 4 |
| Failure+Recovery | 1 | 3x | 3 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 2 | 1x | 2 |
| Visual | 1 | 2x | 2 |
| **TOTAL** | | | **29** |

---

## Topic 6: Network Error Simulation in iOS Simulator -- The Cosmetic Status Bar Trap

**Description:** An agent attempted to test error states by using `xcrun simctl status_bar override` to simulate no-network conditions. The agent discovered that `status_bar override` is purely cosmetic -- it changes the visual indicators but the simulator still uses the host's network. The agent then tried hosts file manipulation (needed sudo), firewall rules, and ultimately had to pivot to code-based error state verification instead of runtime network simulation. The session exposes a common trap in iOS simulator testing.

**Evidence:**
- `agent-a4d837a.jsonl` (461KB, 239 lines): Full error simulation journey
- Commands: `xcrun simctl status_bar override --cellularMode notSupported --wifiMode failed --wifiBars 0`
- Discovery: "The status bar override only changes the visual indicators, not the actual network"
- "The simulator shares the host's network -- the status bar override is purely cosmetic"
- Pivot to code analysis: found ErrorBoundary components, API client error handling (401 auto-logout, 500+ Server Error alerts, network Connection Error alerts)
- 22 error-boundary related hits across 11 session files

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 2 | 3x | 6 |
| Tool/Pattern | 2 | 3x | 6 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 3 | 3x | 9 |
| Reproducibility | 2 | 1x | 2 |
| Scale | 1 | 1x | 1 |
| Visual | 2 | 2x | 4 |
| **TOTAL** | | | **34** |

---

## Topic 7: Multi-Platform Gap Analysis -- Spec-to-Implementation Verification at 40 Gates

**Description:** Sessions show a systematic approach to verifying a mobile app against a specification using 40 validation gates. An AI planner created a comprehensive gap analysis comparing spec vs implementation across all screens, finding 28/40 gates READY (70%), 9 PARTIAL (22.5%), 3 NOT READY (7.5%). The process included reading every source file, cross-referencing with the specification document, and generating a prioritized gap report. This was then executed by 10+ parallel validator agents, each assigned 3-4 gates, using idb_tap and screenshot evidence.

**Evidence:**
- `agent-ac30aa3.jsonl` (703KB, 211 lines): Created expo-react-native-gap-analysis.md
- `agent-a3c0fd6.jsonl` (628KB, 165 lines): Full app verification plan with 8 phases
- `agent-a0bdff1.jsonl` (462KB, 122 lines): Frontend bug analysis report
- 10+ parallel gate validator sessions (cc58673a cluster): Each 5-6MB, 1000+ lines, validating specific gates
- 11 gap-analysis related hits across 7 session files
- Evidence directory structure: `.agent/evidence/gate-{1..40}/` with numbered screenshots

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 2 | 3x | 6 |
| Tool/Pattern | 3 | 3x | 9 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 2 | 3x | 6 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 3 | 1x | 3 |
| Visual | 3 | 2x | 6 |
| **TOTAL** | | | **39** |

---

## Topic 8: Native Module Crashes in Expo Go -- The MMKV/TrackPlayer Invariant Violation

**Description:** Multiple sessions reveal a recurring crash pattern: React Native apps using native modules (react-native-mmkv, react-native-track-player) crash with "Invariant Violation: Your JavaScript code tried to access a native module that doesn't exist" when running in Expo Go instead of a development build. The fix required: (1) clearing Metro cache (`rm -rf /tmp/metro-*`), (2) clearing node_modules cache, (3) running `watchman watch-del-all`, and (4) rebuilding with `npx expo run:ios`. Stale Metro cache was the root cause -- the bundler served cached JS referencing native bindings that were no longer mapped.

**Evidence:**
- `agent-a1eeee3.jsonl` (2.3MB, 349 lines): "Invariant Violation: Your JavaScript code tried to access a native module that doesn't exist"
- Fix: "rm -rf /tmp/metro-* node_modules/.cache && watchman watch-del-all"
- Verification: "RNMMKV initialized -- All three MMKV storage instances created successfully"
- `agent-af1527d.jsonl` (928KB): Same crash during audio playback testing -- "react-native-track-player native module not being available in Expo Go"
- `agent-a39578a.jsonl`: Same crash triggered by deep link processing when MMKV store accessed
- Pattern: 3+ independent sessions hitting same root cause

**Scoring:**
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Novel | 2 | 3x | 6 |
| Tool/Pattern | 2 | 3x | 6 |
| Before/After | 3 | 2x | 6 |
| Failure+Recovery | 3 | 3x | 9 |
| Reproducibility | 3 | 1x | 3 |
| Scale | 2 | 1x | 2 |
| Visual | 2 | 2x | 4 |
| **TOTAL** | | | **36** |

---

## Ranked Summary

| Rank | Score | Topic | Key Hook |
|------|-------|-------|----------|
| 1 | 45 | Simulator Coordinate Mapping | 118 hits across 33 files, pixel-to-point discovery through failure |
| 2 | 39 | AI Audio Narration Pipeline | GitHub repo to spoken story via Claude + ElevenLabs + SSE |
| 3 | 39 | Multi-Platform Gap Analysis | 40-gate spec verification with 10+ parallel validators |
| 4 | 38 | Deep Link Testing (Expo Go vs Dev) | Silent URL scheme failure, invisible debugging |
| 5 | 37 | Codebase Archaeology | 23 dirs classified, 2.3GB recoverable, 33 docs audited |
| 6 | 36 | Native Module Crashes (MMKV/TrackPlayer) | Invariant Violation across 3+ sessions, Metro cache root cause |
| 7 | 34 | Network Error Simulation Trap | Cosmetic status bar vs real network, pivot to code analysis |
| 8 | 29 | Offline Audio Download System | expo-file-system + MMKV + Zustand for multi-chunk downloads |

## Unresolved Questions

1. Are there more sessions in worktree directories (only found 1 worktree session for social-sharing-embeds)?
2. The Documents/code-story-platform path has large sessions (3.8MB, 2.5MB) -- are these from an earlier project phase with different patterns?
3. The code-tales-ios cc58673a session cluster (8 files, 40-50MB total) seems to be a single massive parallel validation run -- worth documenting the orchestration pattern separately?
4. ElevenLabs voice model selection and voice cloning features were referenced but not deeply explored in sessions -- is there a dedicated voice engineering session?
