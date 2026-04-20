# Phase C5 — Reddit Strategic (2–3 posts)

**Owner:** Nick (submitter + engagement)
**Effort:** ~15h across 2–3 posts
**Status:** pending
**Blocks:** none
**Blocked by:** B2 (site live), A3 (functional validation)

## Context

Reddit is high-risk, high-reward. Moderators remove promotional posts aggressively and ban accounts for low-effort blog-drops. Karma floors and community-specific rules vary per sub.

**Locked decisions (parent plan.md #44):**
- **r/programming: REMOVED.** The sub bans LLM-generated content (sidebar rule) and auto-flags AI-related blog URLs. Attempting = near-certain removal + shadowban risk.
- Candidate subs: `r/ClaudeAI`, `r/LocalLLaMA`, `r/devops`, `r/SaaS`.
- 2–3 strategic posts total over 45d. Not every candidate sub gets a post — select based on karma-floor pass + content fit.

Source: R2 §5.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Fabricating social-platform screenshots, fake analytics → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

**Deferral status:** Per C7 (D1), this phase is **DEFERRED** to Day-60 retro reconsideration. Full work-items retained below as reference for possible re-activation; the single validation gate at the bottom asserts that deferral is properly recorded. Do NOT execute C5.1–C5.8 unless C7 re-activation operating rule is followed (metric trigger + new phase file + plan.md update).

## Work items

### C5.1 — Sub candidate evaluation (Day -5 audit)

**Fix:** Before any Reddit post, run per-sub audit:

| Sub | Karma floor | Content fit | Rule notes |
|---|---|---|---|
| r/ClaudeAI | ~50 comment karma | HIGH — direct audience | Self-promo allowed in weekly megathread; standalone submissions need "Discussion" flair |
| r/LocalLLaMA | ~100 total | MED — more local-model focus | No `Show/Self` flair; strong anti-marketing norm |
| r/devops | ~50 | MED — broader | Flair required; no title clickbait |
| r/SaaS | ~20 | LOW-MED — marketing-heavy sub | Friday self-promo thread only; standalone posts often removed |

**Action:** Nick reads sidebar + top-100 posts of last 30d per candidate sub. Records:
- Current Nick karma vs floor
- Existing AI-related posts and their outcomes (removed? upvoted? comment sentiment?)
- Flair requirements

**Output:** `plans/reports/reddit-sub-audit.md` — one section per candidate with verdict `PROCEED | HOLD | SKIP`.

**Verification:** audit doc exists by Day -3, has decisions for all 4 candidate subs.

### C5.2 — Submission selection matrix (2–3 posts)

**Fix:** Based on C5.1 audit, select 2–3. Recommended default if all audits proceed:

1. **r/ClaudeAI, Day 3–5:** Link-post to Day 2 (Multi-Agent Consensus) — topic is most Claude-specific. Flair: `Discussion` or `Showcase` per sub.
2. **r/LocalLLaMA, Day 14–18:** Link-post to a manifesto or deeply technical essay (e.g., parallel worktrees, session mining) — this sub respects substance.
3. **r/devops, Day 30–35:** Link-post to Ralph or orchestrator essay — ops-adjacent.

**Skip r/SaaS** unless consulting-practice launch (C3.2) fires — then post only in their Friday self-promo thread, not standalone.

**Decision criteria (matrix):**
- Sub audit `PROCEED` = mandatory
- Content relevance score ≥ 7/10 (Nick's judgment) = required
- Nick's karma on that sub ≥ floor = required
- Previous post by any AI-blog author removed in last 30d = SKIP

**Verification:** `plans/reports/reddit-posts-planned.md` lists selected posts with date, sub, URL target. Grep `grep SKIP plans/reports/reddit-sub-audit.md` matches any explicit skips.

### C5.3 — Title and URL format

**Fix:** Reddit titles cannot be editorial-promo. Use declarative, descriptive titles that state what the link is — no "How I" or "5 lessons".

**Good:**
- `45-day trace of 23k Claude Code sessions — field report`
- `Multi-agent consensus with unanimous 3-agent voting — Python implementation`
- `Ralph: hat-based execution loops for Claude Code agents`

**Bad:**
- `How I automated my entire dev workflow with Claude 🚀`
- `You won't believe what 23k agent sessions taught me`

**URL:** always the post or repo URL, not the home page. UTM: `?utm_source=reddit&utm_medium=social&utm_campaign=<sub>-<day>`.

**Verification:** `scripts/syndication/reddit-post-drafts.md` contains 2–3 draft entries, each title passes `validate-hn-title.sh` (same rules work) plus sub-specific rules noted in C5.1.

### C5.4 — First-comment author context

**Fix:** Post author comment within 60s of submission. Pattern mirrors HN but tuned for Reddit conversational register:

```
Author here — posted the link because <sub name> tends to surface deep
technical takes. The essay dropped today as part of a 45-day series I'm
running at withagents.dev. Happy to answer questions about the implementation
or push back on anything that smells like hype.
```

Register rules: Reddit tolerates more casualness than HN but still penalizes marketing speak. No "🚀", no "check it out", no "DM me". Honest, grounded, willing-to-be-wrong tone — pulled from `plans/260419-0241-agentic-dog-brand-launch/synthesis/voice-spec.md`.

**Verification:** each `posts/post-*/evidence/reddit-first-comment-*.txt` passes grep cleanliness check (no 🚀, "DM me", "check it out", "subscribe").

### C5.5 — Mod-message disclosure (consulting-practice posts only)

**Fix:** If posting about consulting services (only relevant if r/SaaS proceeds per C5.2), DM mods first with disclosure:

```
Subject: Disclosure — consulting-practice post planned

Hi mods — I'm planning to post about my agentic-dev consulting practice in
the Friday self-promo thread. Wanted to flag that it's paid services, not
a free tool. Link: <consulting landing page>. Happy to hold off or adjust
if this doesn't fit.
```

For the 3 default subs (ClaudeAI, LocalLLaMA, devops) — content posts are blog/repo URLs, no paid service, no mod-message needed.

**Verification:** if r/SaaS post fires, screenshot of mod DM saved to `plans/reports/reddit-mod-message.png`.

### C5.6 — Downvote-recovery protocol

**Fix:** 6-hour mark check on every Reddit submission. If upvote score < 10:
- Do NOT edit title (signals manipulation)
- Do NOT delete and re-post (bannable)
- Do leave post in place; reply to any remaining comments politely
- Do NOT double-post same content to a sibling sub within 14d

Log the flop in `plans/reports/reddit-outcomes.md` with metric snapshot at +6h and +24h.

**Upvote flop is NOT a failure state — it's data.** Reddit audience variance is wide. Strategic posts are meant to plant flags, not drive traffic. The LinkedIn + X + newsletter stack carries acquisition.

**Verification:** `reddit-outcomes.md` has 1 entry per post with +6h and +24h metrics.

### C5.7 — Engagement window

**Fix:** Nick commits 2h of active commenting starting 15 min post-submission. Respond to every top-level comment within 20 min. After 2h, decay to responding every 1h until hour 6, then leave it.

Weekend posts die faster — prefer Tue-Wed mornings (09:00–11:00 ET, overlaps with US + EU workday).

**Verification:** Reddit thread screenshot at +2h shows author-reply density ≥ 5 replies on posts with ≥ 10 top-level comments. `posts/post-NN/evidence/reddit-thread-NN.png`.

### C5.8 — Karma and history hygiene

**Fix:** Before Day -5 audit, Nick reviews own Reddit account history:
- No deleted posts on candidate subs in last 90d
- Comment karma ≥ 50 on each target sub (or general karma ≥ 500)
- Account age ≥ 1 year (all candidate subs enforce this indirectly)

If karma deficient for a target sub: either skip that sub, or spend 2 weeks commenting substantively on unrelated posts in that sub to build baseline karma before Day 1.

**Verification:** Nick's `u/<handle>` page screenshot at Day -5 with karma visible, saved to `plans/reports/reddit-account-state.png`.

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/reports/reddit-sub-audit.md` (NEW) | C5 | none |
| `plans/reports/reddit-posts-planned.md` (NEW) | C5 | none |
| `plans/reports/reddit-outcomes.md` (NEW) | C5 | none |
| `plans/reports/reddit-account-state.png` (NEW) | C5 | none |
| `plans/reports/reddit-mod-message.png` (NEW, conditional) | C5 | none |
| `scripts/syndication/reddit-post-drafts.md` (NEW) | C5 | none |
| `posts/post-NN/evidence/reddit-*.{txt,png}` (NEW) | C5 | none |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Post removed by mods as promo | HIGH | MED | pre-audit sub rules C5.1; honest author comment C5.4; skip subs with red flags |
| Shadowban triggered by multiple same-domain posts within a week | MED | HIGH | cap at 1 post per sub per 14d; stagger across 3 different subs |
| r/programming auto-flag catches cross-posts | LOW | LOW | C5 explicitly excludes r/programming; don't let any crosspost script target it |
| Nick's karma below sub floor on Day 0 | MED | MED | C5.8 Day -5 audit; karma-build window if deficient |
| Downvote flop on all 3 posts creates morale hit | MED | LOW | C5.6 reframes flop as data; retrospective in Day 30 retro |

## Acceptance criteria

- [ ] Sub audit completed Day -3, covers 4 candidate subs
- [ ] 2–3 Reddit posts published Day 1–35
- [ ] Zero posts in r/programming
- [ ] All posts have first-comment author note within 60s
- [ ] Zero posts removed by mods (target; ≤1 acceptable)
- [ ] `reddit-outcomes.md` captures +6h and +24h metrics for each
- [ ] Karma state documented Day -5

## Verification steps

```bash
# Sub audit completeness
grep -cE '^## (r/ClaudeAI|r/LocalLLaMA|r/devops|r/SaaS)' \
  plans/reports/reddit-sub-audit.md  # expect 4

# r/programming exclusion audit
grep -ri 'r/programming' plans/reports/reddit-*.md \
  scripts/syndication/reddit-*.md && echo "VIOLATION" || echo "clean"

# First-comment cleanliness
for f in posts/post-*/evidence/reddit-first-comment-*.txt; do
  grep -iE '(🚀|DM me|check it out|subscribe)' "$f" && echo "BAD: $f"
done

# Post removal check (Reddit API, no auth needed for public data)
for sub in ClaudeAI LocalLLaMA devops; do
  curl -s -A "withagents-audit" \
    "https://www.reddit.com/user/$NICK_REDDIT_HANDLE/submitted.json?limit=25" \
    | jq -r '.data.children[].data | select(.subreddit=="'$sub'") | .removed_by_category // "live"'
done

# Plausible Reddit UTM sessions
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&filters=utm_source==reddit&period=45d"
```

## Rollback

Reddit posts can be self-deleted, but deletion within 1h of posting is a footgun — it signals manipulation to mods. If a post needs removal (factual error, wrong link), edit the body (titles are immutable) and post a correction as a reply. If mods remove, accept it, do not re-submit for ≥30d.

<validation_gate id="VG-1" blocking="false">
  <prerequisites>C7 deferred-items doc exists at `plans/reports/c7-deferred-items.md` OR `plans/260419-1200-unified-launch-remediation/phase-C7-deferred-items.md`</prerequisites>
  <execute>DEFERRAL_DOC=$(ls plans/reports/c7-deferred-items.md plans/260419-1200-unified-launch-remediation/phase-C7-deferred-items.md 2>/dev/null | head -1); grep -cE "^### D1\. Reddit|^## Reddit" "$DEFERRAL_DOC"; grep -cE "Reconsider when:.*Day.?45|Reconsider when:.*Day.?60" "$DEFERRAL_DOC"; grep -E "Reddit.*deferred|Reddit.*reconsider" "$DEFERRAL_DOC"</execute>
  <capture>evidence/phase-C5/vg-1-deferral-recorded.log</capture>
  <pass_criteria>Deferral doc contains a Reddit section heading (count ≥1); contains a future re-eval date string (Day 45 or Day 60); Reddit entry mentions `deferred` or `reconsider`; no Reddit posts submitted during Track C (`grep -cE 'reddit.com/r/' plans/reports/reddit-outcomes.md` returns 0 OR file does not exist)</pass_criteria>
  <review>READ vg-1-deferral-recorded.log: confirm Reddit deferral entry + re-eval trigger date present</review>
  <verdict>PASS → proceed | FAIL → fix real system (update C7 doc to include Reddit deferral row with trigger date) → re-run</verdict>
  <mock_guard>IF tempted to silently re-activate Reddit by posting "just once" during Track C → STOP → follow C7 operating rule (metric trigger + new phase file + plan.md update)</mock_guard>
</validation_gate>

<gate_manifest>
  <total_gates>1</total_gates>
  <sequence>VG-1</sequence>
  <policy>Phase DEFERRED per C7 D1. Single gate is blocking="false" review-point asserting deferral is properly recorded. If phase is re-activated, restore full C5.1–C5.8 gate set via new phase file.</policy>
  <evidence_dir>evidence/phase-C5/</evidence_dir>
  <regression>On FAIL: fix C7 deferral doc → re-run; re-activation requires metric trigger + new phase file + plan.md update (no silent re-adds).</regression>
</gate_manifest>
