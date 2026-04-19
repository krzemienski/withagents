# Post 11: "One YAML, Eight Agents, Complete App"

## Metadata
- Target word count: 2,300
- Source posts: 14, 25, 54, 59
- Companion repo: `reponexus`
- New content needed: Yes — synthesize GSD execution framework with spec-driven patterns into a unified narrative, reframe companion repo as spec execution framework

## Opening (hook — 2 sentences max)
One YAML file. Eight agents. A complete app in 3.2 days — down from 11 days of manual coordination.

## Narrative Arc

1. **The YAML Spec Format** — Post 14's foundation. The spec is not documentation — it is the executable contract. YAML with JSON schema validation: every field typed, every dependency declared, every acceptance criterion machine-checkable. The spec contains component definitions, data models, API contracts, and validation gates. Post 14's key insight: "The spec is the single source of truth that agents read, not a document that humans write for other humans." Show the anatomy of a real spec from ils-ios `.auto-claude/roadmap/roadmap.json` — components, dependencies, acceptance criteria, priority ordering. ~400 words

2. **Multi-Agent Builder** — Post 25's execution engine. The builder reads the spec, topologically sorts components by dependency, and spawns one agent per component. Eight agents working in parallel on non-conflicting files, each with a clear contract: input types, output types, validation gate. The coordination problem: Agent 3 depends on Agent 1's data model, but Agent 1 is still running. Solution: dependency-aware scheduling with stub interfaces — agents code against the spec's type definitions, not each other's implementations. The merge step: all agents commit to worktree branches, orchestrator merges in dependency order. ~400 words

3. **GSD Phase Execution** — Post 59's framework that wraps the builder. GSD (Get Stuff Done) as a phase machine: Discover, Plan, Execute, Verify, Ship. Each phase has entry criteria, exit gates, and rollback triggers. The Execute phase spawns the multi-agent builder from section 2. The Verify phase runs the spec's acceptance criteria as automated checks. The `gsd-tools.cjs` tooling from awesome-site: phase state tracking, gate evaluation, progress reporting. Post 59's metric: "11 days to 3.2 days" — the reduction comes from eliminating coordination overhead, not from faster coding. ~400 words

4. **The Full Rebuild Test** — Post 54's ultimate validation. Take a production app, write the spec from scratch, feed it to the builder, compare output to the original. The ILS iOS app: 47 screens, 12 data models, 8 API integrations. The rebuild produced 91% feature parity in the first pass. The 9% gap: edge cases that were never documented, behavior that lived in code comments, UI polish that existed only in the designer's muscle memory. Post 54's lesson: "The spec rebuild test reveals everything your documentation is missing — which is everything that matters." ~350 words

5. **Verification Gates** — Post 25's gate system. Each component in the spec has acceptance criteria. The builder doesn't mark a component complete until its gate passes. Gate types: type-check gates (does it compile), contract gates (does the API match the spec), integration gates (do connected components work together), functional gates (does the feature work end-to-end). The 3.2x fewer surprises metric from Ralplan consensus planning: specs reviewed by Planner + Architect + Critic before execution begins. Post 59's GSD Verify phase as the final gate: all components assembled, all acceptance criteria evaluated, ship-or-fix decision. ~350 words

6. **Closing: Spec as Coordination Protocol** — The spec replaces meetings, tickets, and Slack threads. Post 14's line: "Eight agents don't need a standup. They need a schema." Post 59's production reality: GSD has shipped 4 complete applications. The compound effect: specs from previous projects become templates for the next. ~200 words

## Key Code Blocks to Include
- A trimmed YAML spec showing component definition with dependencies and acceptance criteria from post 14 (~20 lines)
- The GSD phase state machine from post 59 (phase enum + transition rules, ~15 lines)
- The `gsd-tools.cjs` gate evaluation snippet from awesome-site (session evidence, ~10 lines)
- The dependency-aware agent spawn logic from post 25 (~12 lines)

## Real Data Points
- 11 days to 3.2 days reduction with GSD framework (post 59)
- 3.2x fewer surprises with Ralplan consensus pre-review (post 25)
- 8 agents running in parallel per build (post 25)
- 91% feature parity on first rebuild pass, 9% gap from undocumented behavior (post 54)
- 47 screens, 12 data models, 8 API integrations in ILS rebuild (post 54)
- 4 complete applications shipped with GSD (post 59)
- ils-ios roadmap.json as real spec artifact (session evidence)
- awesome-site specs/admin-e2e-validation/ as real validation artifact (session evidence)

## Material to NOT Include
- Post 14's full YAML spec listing (too long, use trimmed excerpt)
- Post 25's full worktree merge orchestration code (belongs in post 5)
- Post 25's Ralplan consensus deliberation details (belongs in post 7)
- Post 54's full screen-by-screen rebuild comparison (too granular)
- Post 54's SwiftUI migration details (tangential)
- Post 59's GSD installation and setup guide (filler)
- Post 59's "why existing project management tools fail" section (opinion, not evidence)
- Ralph loop details (post 8 material)
- Memory architecture details (post 12 material)
- Debugging patterns (post 13 material)

## Companion Repo Tie-in
The `reponexus` repo provides a spec execution framework: YAML spec parser with JSON schema validation, dependency-aware agent scheduler, and GSD phase runner. Reader can write a YAML spec for a simple app (3-4 components) and watch the framework spawn agents, enforce gates, and produce a working codebase. Includes example specs from real projects.
