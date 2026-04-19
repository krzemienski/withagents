# Post 15: "The Skill That Writes This Blog"

## Metadata
- Target word count: 2,200
- Source posts: NEW
- Companion repo: `claude-code-skills-factory`
- New content needed: Yes — entirely new. Skill anatomy derived from real SKILL.md files (blog-post-writer at 201 lines, build-quality-gates at 1,853 lines, slash-command-factory at 1,014 lines). Devlog-pipeline case study from the pipeline that generated 429K words across 61 posts.

## Opening (hook — 2 sentences max)
This blog series — 18 posts, 35,000 words — was written by a skill file under 200 lines. Here is how SKILL.md files work, why most of them fail, and how to build one that does real work.

## Narrative Arc
1. **What a Skill Actually Is** — A SKILL.md file is a reusable prompt program that Claude Code loads on demand. Not a system prompt (those are always loaded), not a plugin (those enforce rules). A skill is invocable, scoped, and composable. Before skills: copy-pasting the same 200-line prompt every session, forgetting steps, getting inconsistent results. Source: real observation — 100+ skills across ~/.claude/skills/. ~250 words

2. **Anatomy of SKILL.md** — Walk through the structural elements using real files as reference. YAML frontmatter (name + description — the description IS the trigger surface). `<essential_principles>` — the 3-5 rules that override everything. `<intake>` — the menu that asks the user what they want BEFORE doing anything ("Wait for response before proceeding"). `<routing>` — the switch statement mapping user choices to workflows. Domain-specific sections. `<output_structure>` — where files go. `<success_criteria>` — how to know when done. Real example: blog-post-writer's routing (receive brain dump, read voice/tone reference, check story potential, organize content). Source: /Users/nick/.claude/skills/blog-post-writer/SKILL.md (201 lines). ~500 words

3. **The Devlog-Pipeline Case Study** — The skill that built this series. 8 routing options (full pipeline, scan, write, repo, visuals, social, publish, expand), each pointing to a different workflow. Parallel agent orchestration across phases. Generated 61 posts, 429K+ words from one invocation pattern. The "wait for response" pattern — never assume, always ask. How routing tables prevent the "do everything at once" failure mode. Source: real pipeline metrics. ~400 words

4. **What Makes Skills Fail** — Trigger description too vague (skill never activates or activates for wrong tasks). No intake step (skill charges ahead with wrong assumptions). No routing table (tries to do everything in one pass). Missing success criteria (declares victory without checking). Monolithic SKILL.md over 1,000 lines (context window filled before work begins — build-quality-gates at 1,853 lines is the anti-pattern). The fix: split into SKILL.md (routing, under 400 lines) + reference files (domain knowledge loaded on demand) + workflow files (step-by-step protocols). The blog-post-writer pattern: 201-line SKILL.md loads references/voice-tone.md and references/story-circle.md only when needed. Source: real file sizes from 100+ skills. ~400 words

5. **Reference Files and Workflow Decomposition** — The `references/` directory holds domain knowledge the skill needs but should not load upfront. The `workflows/` directory holds step-by-step protocols for each routing option. Pattern: SKILL.md routes to a workflow file, workflow file loads reference files on demand. Token budget: SKILL.md under 400 lines, depth in reference files. Source: blog-post-writer loading voice-tone.md and story-circle.md selectively. ~300 words

6. **Building Your First Skill** — Write a description that matches how you would ask for help. Add an intake menu with 3-5 options. Create a routing table. Add success criteria. Test by invoking it — no test framework, you test skills by running them. The "dry run" pattern. Debugging trigger failures: check the description field matches what users actually say. Source: practical synthesis from building 100+ skills. ~350 words

## Key Code Blocks to Include
- A minimal complete SKILL.md (~25 lines) showing frontmatter + intake + routing + success criteria — written from scratch as teaching example
- The blog-post-writer routing structure (4 phases: receive dump, read voice reference, check story potential, organize) — extracted from real SKILL.md
- A reference file loading pattern: "Read references/voice-tone.md to understand Nick's writing style" — from blog-post-writer
- The `<intake>` block showing the "wait for response" anti-rush pattern

## Real Data Points
- 100+ skills built across ~/.claude/skills/ — the patterns come from real iteration
- blog-post-writer: 201 lines, loads 2 reference files on demand
- build-quality-gates: 1,853 lines — the monolithic anti-pattern
- slash-command-factory: 1,014 lines — another skill that got too large
- devlog-pipeline: 8 routing options, 61 posts, 429K+ words generated
- Skill file sizes range from 50 lines (simple) to 1,853 lines (too large) — sweet spot is 150-400

## Material to NOT Include
- Plugin architecture (post 16 covers hooks, manifests, enforcement)
- SDK vs CLI comparison (post 18)
- Ralph loops and orchestration patterns (post 8)
- Full SKILL.md contents from any real skill (too long — excerpt patterns only)
- The Shannon Framework or oh-my-claudecode internals (post 16 territory)
- Testing frameworks or mock strategies (not relevant to skills)

## Companion Repo Tie-in
The `claude-code-skills-factory` repo provides a skill starter kit: a minimal SKILL.md template, a multi-workflow skill scaffold with reference file architecture, and three working example skills (autonomous-coder with 3-phase explore/plan/code, plus generated skills/agents/hooks/commands). The repo itself was built to generate skills programmatically. Post ends with: "Copy the template. Write a description that matches how you'd ask for help. Add an intake menu. You'll have a working skill in 10 minutes."
