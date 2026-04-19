# README patch — withagents-skills

This is a NEW repo. The README does not yet exist. Use the following block as the README body in full; do not splice. Replace the placeholder "TBD" sections with actual install instructions once the plugin is registered.

---

# withagents-skills

Ten Claude Code skills that earned their slot across 90 days of shipping real products.

Not every skill in the author's `.claude/skills/` directory — that's 217 of them. These ten fired more than 30 times each, crossed multiple projects, and survived a documented cull described in the launch post.

## Install

```
claude plugin install withagents-skills
```

Adds `.claude/skills/withagents/` with namespaced protocols. Does not overwrite existing skills with matching names.

## Contents

1. `functional-validation` — real system or nothing
2. `create-validation-plan` — journey-scoped validation plans
3. `preflight` — environment checks before execution
4. `verdict-writer` — evidence-cited PASS/FAIL verdicts
5. `devlog-publisher` — session-mining devlog generator
6. `ck-plan` — structured phase planning
7. `visual-explainer` — HTML visual explanations
8. `deepen-prompt-plan` — plan stress-testing
9. `ai-dev-operating-system` — skill coordination layer
10. `skill-creator` — meta-skill for authoring new skills

## Featured in

**withagents-skills: ten skills that survived 1,293 invocations** — launch post covering the 40-to-10 cull, the design rules for authoring durable skills, and the selection criteria each skill had to clear. Published May 23, 2026 on withagents.dev.

→ [Read the launch post](https://withagents.dev/writing/day-35-withagents-skills-package)

Companion series: *WithAgents — applied agent design, production-grade*. Days 36-40 publish one deep-dive post per skill-track skill, weekly.

## License

MIT.
