# Architect Review: ValidationForge PRD v2.0.0

**Reviewer:** Architect agent (Opus 4.6)
**Date:** 2026-03-10
**Documents reviewed:** PRD.md (976 lines), COMPETITIVE-ANALYSIS.md (272 lines), TECHNICAL-DEBT.md (321 lines), ARCHITECTURE.md (368 lines), findings.md (101 lines)
**On-disk verification:** plugin.json, hooks.json, 40 SKILL.md files, 7 hook JS files, 15 commands, 5 agents, 8 rules

---

## STRENGTHS

### S1. The 3-Engine Separation is Architecturally Sound

VALIDATE, CONSENSUS, and FORGE map cleanly to distinct concerns: detection/execution, agreement, and autonomous loops. Each engine can ship independently (VALIDATE in M1, CONSENSUS in V1.5, FORGE in V2.0), which de-risks the roadmap. The engines compose naturally: FORGE calls VALIDATE as a subroutine; CONSENSUS wraps VALIDATE's output. No circular dependencies exist between engines.

- Evidence: PRD.md:72-88 defines the engines; TECHNICAL-DEBT.md:180-208 confirms CONSENSUS and FORGE are deferred to post-launch milestones, validating the independence claim.

### S2. Skill Layering (L0-L4) is Well-Structured

The 5-layer dependency graph flows strictly downward. L0 (foundation: verification-before-completion, error-recovery) has no upward dependencies. L4 (e2e-validate orchestrator) routes to L3 planners, which depend on L2 protocols, which depend on L1 guardrails. Cross-references confirm this: 9 of 40 skills reference L1 guardrails (no-mocking-validation-gates, gate-validation-discipline), and only e2e-validate references all layers.

- Evidence: 20 cross-references to L1 guardrails found across 9 SKILL.md files. e2e-validate/SKILL.md:25-26 explicitly references no-mocking-validation-gates. No upward dependency violations detected.

### S3. The e2e-validate Orchestrator is the Right Architectural Choice

The L4 orchestrator (2,421 lines across 15 files: 1 SKILL.md + 8 workflows + 6 references) acts as a single entry point that routes to platform-specific validation. This fan-out pattern keeps platform knowledge isolated. Each reference file (ios-validation.md: 212 lines, web-validation.md: 200 lines, etc.) is self-contained.

- Evidence: Skills e2e-validate/SKILL.md:29-38 defines priority-ordered detection. workflows/ and references/ subdirectories confirmed on disk.

### S4. Evidence Pipeline Tiers are a Good Abstraction

The 3-tier model (Deterministic 95%+, Behavioral 80-90%, Heuristic 40-60%) correctly maps confidence to evidence type. Screenshots and API response bodies are Deterministic; accessibility trees are Behavioral; visual similarity scores are Heuristic. This allows the verdict-writer agent to weight evidence appropriately.

- Evidence: PRD.md:409-425 defines the tiers with specific confidence ranges.

### S5. Hooks are Production-Quality

All 7 hooks are real JavaScript (335 total lines), not SKILL.md instructions. block-test-files.js (70 lines) correctly parses stdin JSON, extracts file paths, checks 15 test patterns against an allowlist, and outputs structured `{decision: "block", reason: "..."}`. The object-vs-string bug in validation-not-compilation.js and completion-claim-validator.js was found and fixed.

- Evidence: hooks/block-test-files.js verified on disk. findings.md:16-19 documents the bug fix. hooks.json:1-56 correctly wires all 7 hooks to PreToolUse/PostToolUse events.

### S6. The TECHNICAL-DEBT.md is Unusually Honest

The document self-identifies 5 BLOCKER issues, including "the core command has never been run as an automated pipeline" and "plugin has never been verified loading in a fresh Claude Code session." This level of honesty is rare and architecturally valuable -- it means the team knows exactly what is scaffolding vs. what is proven.

- Evidence: TECHNICAL-DEBT.md:21-107 catalogs all 5 blockers with fix plans and effort estimates.

---

## CONCERNS

### C1. CRITICAL: plugin.json is Incomplete (Launch Blocker)

The actual `plugin.json` on disk contains only `name`, `version`, `description`, and `author`. It is missing ALL five directory declarations: `skills`, `commands`, `agents`, `hooks`, `rules`. The PRD (Section 7.1, lines 522-533) shows a plugin.json with all 5 directories, but that does not match reality. Without these declarations, Claude Code cannot discover any VF skills, commands, agents, or rules.

The findings.md (line 84) acknowledges "Incomplete plugin.json (missing commands, agents, rules declarations) -- fixed with all 5 directories." However, the on-disk file at `.claude-plugin/plugin.json` still lacks them. Either the fix was not persisted or was applied to a different copy.

- Evidence: `.claude-plugin/plugin.json` (10 lines, read during this review) vs PRD.md:522-533 (shows 5 directory keys).
- Impact: BLOCKER. VF literally cannot function as a plugin without this.
- Fix: Add `"skills": "./skills/", "commands": "./commands/", "agents": "./agents/", "hooks": "./hooks/", "rules": "./rules/"` to the on-disk plugin.json.

### C2. HIGH: Line Count Claims are Inflated or Stale

The PRD claims e2e-validate is 2,563 lines (actual: 2,421), functional-validation is 732 lines (actual: 543), and "9,593 lines of specification" total (actual skill .md files: 11,186 lines; total .md+.js+.json: 24,287 lines). The numbers are directionally correct but imprecise. For a product that markets on credibility ("23,479 real sessions"), imprecise self-reported metrics undermine trust.

- Evidence: `find ... -exec wc -l` against actual files. PRD.md:31 claims "9,593" which matches neither the skill total (11,186) nor the grand total (24,287).
- Impact: MEDIUM. Savvy users will verify.
- Fix: Automate a `scripts/count-inventory.sh` that generates accurate numbers. Reference the script output in the PRD.

### C3. HIGH: 28 of 40 Skills Have No Subdirectory Support Files

Only 12 skills have `references/` or `workflows/` subdirectories. The remaining 28 are single SKILL.md files averaging 197 lines. The PRD's ARCHITECTURE.md (lines 352-367) explicitly calls out that the "current state" has "no skill subdirectories" and the "target state" should have workflows/, references/, case-studies/ for most skills. This means 70% of skills are still in prototype form.

The platform-specific skills without subdirectories (ios-validation: 213 lines, web-validation: 184 lines, api-validation: 222 lines, cli-validation: 185 lines) are the most concerning because they are the ones users will interact with directly. They contain inline instructions but no reference files for edge cases.

- Evidence: `find` results showing 12 skills with subdirs, 28 without. ARCHITECTURE.md:352-367 acknowledges the gap.
- Impact: HIGH for user experience on non-web platforms (only web has been functionally validated).

### C4. HIGH: Platform Detection is "First Match Wins" with Ambiguity Risk

The detection priority (e2e-validate/SKILL.md:29-38) uses "first match wins": iOS > CLI > API > Web > Fullstack > Generic. This creates problems:

1. A **React Native** project has both `.xcodeproj` AND `package.json` with React. It would be classified as iOS, missing the JavaScript layer entirely.
2. A **Node.js CLI tool** with `package.json "bin"` would match CLI (priority 2), but it also has `package.json` which could match Web (priority 4). The correct classification depends on whether it has a frontend, which the priority system ignores.
3. A **monorepo** with `apps/ios/`, `apps/web/`, `packages/api/` would match iOS at priority 1 and stop, missing 2 of 3 platforms.

The `--platform` override flag mitigates this but only for users who know the detection is wrong. First-time users will get silent misclassification.

- Evidence: e2e-validate/SKILL.md:29-38 for the priority table. No multi-platform detection logic exists.
- Impact: HIGH for non-trivial project structures.
- Fix: (a) Allow comma-separated platform results (e.g., `ios,web`). (b) Add a confidence score to each detection. (c) Prompt user for confirmation when multiple platforms match. (d) Detect monorepo structures by scanning for nested project roots.

### C5. MEDIUM: CONSENSUS and FORGE Engines are Marketing-Only

The PRD markets a "3-engine system" but TECHNICAL-DEBT.md explicitly states both CONSENSUS (Section 3.1, lines 182-194) and FORGE (Section 3.2, lines 196-208) are "NOT IMPLEMENTED." The skills exist as SKILL.md files (forge-setup: 103 lines, forge-plan: 88 lines, etc.) but have never been executed.

This is not inherently wrong -- the roadmap correctly defers them. But the PRD's Section 2.4 (lines 72-88) presents all three engines as part of the product definition without distinguishing which ones actually work. A reader would conclude all three are functional.

- Evidence: TECHNICAL-DEBT.md:182-208. Forge skills on disk are the smallest in the project (88-131 lines vs 184-274 for platform skills).
- Impact: MEDIUM. Addressable by clearly labeling CONSENSUS and FORGE as "Coming in V1.5/V2.0" in all marketing materials.

### C6. MEDIUM: Hook Fail-Open Design (`|| true`)

Every hook command in hooks.json ends with `|| true`, meaning if the hook script crashes or fails for any reason, the failure is silently swallowed and the tool call proceeds. This is a deliberate choice (don't break the user's workflow), but it means:

1. If `${CLAUDE_PLUGIN_ROOT}` doesn't resolve, all 7 hooks silently fail.
2. If a hook has a JavaScript error, enforcement disappears without warning.
3. The user has no way to know enforcement is active or inactive.

For a product whose primary value proposition is "enforcement," silent failure of enforcement is a significant architectural risk.

- Evidence: hooks.json lines 9, 19, 29, 33, 37, 46, 50 -- all end with `|| true`.
- Impact: MEDIUM. Users believe they're protected when they may not be.
- Fix: Add a `/vf-status` command that actively tests whether hooks are firing. Log hook activations to a `.vf/hook-log.txt` file. Consider a startup self-check hook.

### C7. LOW: Skill Overlap Creates Context Bloat

Several skills cover substantially overlapping territory:
- `functional-validation` (L2) and `e2e-validate` (L4) both describe the full pipeline
- `e2e-testing` and `e2e-validate` have confusingly similar names but different scopes
- `web-validation` (standalone skill) and `e2e-validate/references/web-validation.md` (reference file) both contain web validation instructions
- `ios-validation` (standalone) vs `ios-validation-gate` vs `ios-validation-runner` vs `ios-simulator-control` -- 4 skills for one platform

When Claude Code loads multiple skills simultaneously, overlapping instructions compete for attention in the context window. At 40 skills, if even 10 are loaded simultaneously, that is ~1,650 lines of SKILL.md instructions before any user code is considered.

- Evidence: 40 skill directories confirmed. Average SKILL.md: 165 lines. `functional-validation` SKILL.md:9-14 explicitly notes scope overlaps.
- Impact: LOW now, MEDIUM at scale.
- Fix: Add a `context_priority` field to each SKILL.md frontmatter. The orchestrator should load only the minimum skill set for the detected platform and requested command.

---

## RECOMMENDATIONS

### R1. Fix plugin.json Immediately (Effort: 5 minutes, Impact: BLOCKER)

Add the 5 directory declarations to `.claude-plugin/plugin.json`. Without this, nothing else matters.

### R2. Build a Platform Detection Test Matrix (Effort: 3 hours, Impact: HIGH)

Before claiming "6-platform support," create a test matrix:

| Project Type | Detection Input | Expected Platform | Actual Platform | Status |
|---|---|---|---|---|
| Next.js web app | package.json + next.config.ts | web | web | PASS |
| Swift iOS app | .xcodeproj + .swift files | ios | ? | UNTESTED |
| React Native | .xcodeproj + package.json + React | ios + web | ? | UNTESTED |
| Go CLI | go.mod + main.go | cli | ? | UNTESTED |
| Node API | package.json + routes/ | api | ? | UNTESTED |
| Python Flask API | app.py + routes/ | api | ? | UNTESTED |
| Monorepo | apps/ios + apps/web + packages/api | multi | ? | UNTESTED |

Validate against real projects. Update detection signals based on results.

### R3. Add Multi-Platform Detection (Effort: 4-6 hours, Impact: HIGH)

Replace "first match wins" with "collect all matches, prompt for confirmation." The platform-detector agent should return an array, not a string:

```json
{
  "platforms": [
    {"type": "ios", "confidence": 0.95, "signals": [".xcodeproj"]},
    {"type": "web", "confidence": 0.80, "signals": ["package.json", "next.config.ts"]}
  ],
  "recommended": "fullstack",
  "override": "--platform ios"
}
```

### R4. Add Hook Health Check (Effort: 2 hours, Impact: MEDIUM)

Create `/vf-status` that:
1. Verifies `${CLAUDE_PLUGIN_ROOT}` resolves
2. Runs each hook with a test payload
3. Reports which hooks are active/inactive
4. Checks plugin.json registration
5. Shows loaded skills/commands/agents/rules count

### R5. Automate Inventory Counts (Effort: 1 hour, Impact: MEDIUM)

Create `scripts/inventory.sh` that counts skills, commands, hooks, agents, rules, total lines. Reference the output in PRD/README. Run it before every release. Never hand-type counts.

### R6. Clearly Label Engine Maturity in All Materials (Effort: 1 hour, Impact: MEDIUM)

In the PRD, README, and all marketing:
- VALIDATE: "Verified" (with a badge or label)
- CONSENSUS: "Planned for V1.5"
- FORGE: "Planned for V2.0"

### R7. Consolidate iOS Skills (Effort: 4-6 hours, Impact: LOW)

4 skills for one platform is excessive: `ios-validation`, `ios-validation-gate`, `ios-validation-runner`, `ios-simulator-control`. Consider merging into 2: `ios-validation` (the protocol) and `ios-tooling` (simulator control + runner). This reduces context overhead and clarifies which skill to invoke.

---

## TRADE-OFFS

| Decision | Pros | Cons |
|----------|------|------|
| AI-native (SKILL.md, not compiled code) | Zero dependencies, trivial distribution, improves with model upgrades | Quality depends on model instruction-following, untestable with traditional methods, no type safety |
| No-mock philosophy (The Iron Rule) | Catches real integration bugs, zero maintenance overhead | Polarizing, requires real infrastructure, slower than unit tests for pure logic |
| 40 skills at launch | Comprehensive coverage, impressive breadth | Context bloat risk, 70% are prototype-quality (no subdirs), maintenance surface area |
| `|| true` on all hooks | Never breaks user workflow | Silent enforcement failure, user may not know protections are inactive |
| First-match-wins platform detection | Simple, deterministic, no ambiguity | Misclassifies multi-platform and monorepo projects silently |
| Free plugin + SaaS companion revenue model | Matches ecosystem norms (all plugins free), low friction | 6+ month revenue gap, SaaS companion not yet designed, consulting pipeline is speculative |

---

## VERDICT: APPROVE WITH CHANGES

The architecture is sound at its core. The 3-engine separation, 5-layer skill dependency graph, evidence pipeline tiers, and hook-based enforcement are well-designed and well-documented. The TECHNICAL-DEBT.md demonstrates unusual self-awareness about what is real vs. aspirational.

**Must-fix before launch (3 items):**
1. **C1: Fix plugin.json** -- Literal 5-minute fix, but without it VF cannot load as a plugin
2. **C4: Test platform detection** on at least 3 project types beyond Next.js (R2)
3. **C5: Label CONSENSUS/FORGE as "planned"** in all user-facing materials (R6)

**Should-fix before growth phase (3 items):**
4. C6: Add hook health check (R4)
5. C2: Automate inventory counts (R5)
6. C3: Flesh out platform-specific skills with subdirectory reference files

**Architecture risks to monitor:**
- Context window pressure as skill count grows (C7)
- Multi-platform detection for non-trivial projects (C4)
- Silent hook failure undermining the enforcement value proposition (C6)

The product has a clear category-creation opportunity ("AI Code Validation") and the competitive analysis shows a genuine market gap. The architecture supports the vision. The concerns are all fixable, and the team's technical debt documentation shows they know what needs fixing.

---

## REFERENCES

- `/Users/nick/Desktop/blog-series/ValidationForge/PRD.md` -- Primary product document (976 lines)
- `/Users/nick/Desktop/blog-series/ValidationForge/COMPETITIVE-ANALYSIS.md` -- Market analysis (272 lines)
- `/Users/nick/Desktop/blog-series/ValidationForge/TECHNICAL-DEBT.md` -- Launch blockers inventory (321 lines)
- `/Users/nick/Desktop/blog-series/validationforge/ARCHITECTURE.md` -- Pipeline and benchmarking architecture (368 lines)
- `/Users/nick/Desktop/blog-series/validationforge/findings.md` -- Session audit findings (101 lines)
- `/Users/nick/Desktop/blog-series/validationforge/.claude-plugin/plugin.json:1-9` -- Incomplete plugin manifest (CRITICAL)
- `/Users/nick/Desktop/blog-series/validationforge/hooks/hooks.json:1-56` -- Hook wiring (all use `|| true`)
- `/Users/nick/Desktop/blog-series/validationforge/hooks/block-test-files.js` -- Primary enforcement hook (70 lines)
- `/Users/nick/Desktop/blog-series/validationforge/skills/e2e-validate/SKILL.md:29-38` -- Platform detection priority table
- `/Users/nick/Desktop/blog-series/validationforge/skills/functional-validation/SKILL.md:9-14` -- Scope overlap documentation
