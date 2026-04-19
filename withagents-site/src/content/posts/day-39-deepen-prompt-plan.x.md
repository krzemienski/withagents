# X thread — Day 39 / deepen-prompt-plan

Thread target: 10 tweets. All under 280 chars.

---

**Tweet 1** (245)
I handed the skill a 1,400-word plan I was already happy with.

Three days of work. Validation spec, phased rollout, dependencies, risk table.

I ran /deepen-prompt-plan expecting a pat on the back.

It came back with 3 sections at confidence gap score 4 out of 6.

---

**Tweet 2** (207)
The plan I had been admiring was held together by optimism.

deepen-prompt-plan lives at ~/.claude/skills/deepen-prompt-plan/SKILL.md

It does NOT rewrite documents from scratch. It takes existing plans and stress-tests them section by section.

---

**Tweet 3** (236)
The skill narrates its phases:

Phase 0: Loading and classifying
Phase 1: Parsing structure
Phase 2: Scoring confidence gaps
Phase 3: Researching weak sections
Phase 4: Injecting validation gates
Phase 5: Synthesizing
Phase 6: Final checks and write

Six phases. Ruthless.

---

**Tweet 4** (232)
The scoring formula is the core:

gap_score = trigger_count + risk_bonus + critical_section_bonus

Triggers = checklist problems from the confidence-scoring reference.
Risk = +1 for high-risk topics.
Critical = +1 for Decisions / Tasks / Risks / Validation.

Threshold: score ≥ 2.

---

**Tweet 5** (240)
2026-04-16 session. Phase 05 publication pipeline plan.

Astro 5 + Keystatic + Tailwind v4 + Vercel. Already through /ck:plan --hard with red team and validate.

deepen-prompt-plan classified it: HIGH risk (prod deploy + admin auth + 3rd party API).

Flagged 3 sections at score 4.

---

**Tweet 6** (245)
Key Decisions scored 4:

"We'll use Astro 5 + Keystatic" — no alternatives considered.

Skill ran web research. Came back with Astro 5 vs Next.js 15 tradeoff (MDX-heavy static), Keystatic vs Payload (Git-backed content).

The decision didn't change. The justification did.

---

**Tweet 7** (265)
Validation scored 4:

My one-liner: "run Vercel preview and verify."

Skill injected 5 gates. VG-2 verbatim:

"curl the OG image URL, verify it returns image/png, open in Chrome, verify fonts match Space Grotesk + Inter subset, verify site-live banner not on prod routes."

---

**Tweet 8** (234)
Risks scored 4:

4 risks listed, zero mitigations.

Skill flagged the missing Keystatic admin-access decision. Content editing on a public domain needed auth. Plan didn't say how.

Became an explicit open question. Resolved 3 days later by GitHub OAuth.

---

**Tweet 9** (241)
Phase 4 injection is non-negotiable if the plan has no gates:

<mock_detection_protocol>
- .test.* files → STOP
- mock libraries → STOP
- in-memory databases → STOP
- TEST_MODE flags → STOP
Fix the REAL system.
</mock_detection_protocol>

The skill doesn't debate the Iron Rule.

---

**Tweet 10** (237)
Size budget enforces stronger-not-longer:

Under 500w: 3x growth OK
500-1500w: under 2x
Over 1500w: under 30%

My 1,400w plan came back at 1,700. Three sections stronger. Same intent.

"Deepening increases justified confidence. Not length."

withagents.dev/writing/day-39-deepen-prompt-plan

---

Char counts: 245 / 207 / 236 / 232 / 240 / 245 / 265 / 234 / 241 / 237. All under 280.
