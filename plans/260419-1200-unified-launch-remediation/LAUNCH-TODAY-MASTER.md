---
title: "LAUNCH TODAY — Master Validation Prompt (withagents.dev full-dump)"
description: "Single-file gated runbook. Deploy withagents-site + personally post ALL 46 posts + 46 LI + 46 X + 46 README patches + 3 HN + 2 PH + newsletter today."
status: active
priority: P0
created: 2026-04-19
scope: full-dump-same-day
brand: withagents.dev (Hyper-black + Ultraviolet)
---

# LAUNCH TODAY — Master Validation Prompt

Single source of truth for shipping withagents.dev TODAY with ALL content. Execute gates top-to-bottom. Every gate is BLOCKING unless marked otherwise. Evidence on disk or it didn't happen.

The 20-phase plan (A1..C7 in this directory) is the detailed reference; this file collapses its Track A pre-launch gates + Day-1 flagship subset of Tracks B/C into a single executable flow for today's full-dump launch.

<mock_detection_protocol>
Before any task:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries → STOP
- Adding TEST_MODE / NODE_ENV=test flags → STOP
- Fabricating social-platform screenshots or analytics → STOP
- Claiming a URL "posted" without fetching it → STOP
- Writing a placeholder like "TODO-paste-linkedin-url" into evidence → STOP
Fix the REAL system. Post to the REAL platform. Capture the REAL URL. No exceptions.
</mock_detection_protocol>

## Platform-risk acknowledgment (user-locked 2026-04-19)

<platform_risks acknowledged_by="nick">
  Chosen scope = "literally all 46 LI + 46 X + 46 README + 3 HN + 2 PH today."
  Known risks the user accepts:
  - LinkedIn: 10+ Articles in one day is likely to trigger a 7-day feed-distribution throttle.
  - Hacker News: 3 submissions from same author in one day increases shadowflag odds — mitigate by spacing ≥2h apart + distinct URLs + distinct titles.
  - Product Hunt: 2 launches same day dilutes maker attention; hunters see only one on-tap.
  - X/Twitter: 46 thread-starts in a day tips "automated content" heuristics — mitigate by spacing ≥3 min between posts, vary wording, post from one device.
  Mitigation strategy: execute serial, not burst; capture evidence per-post; abort any channel if a platform enforces against us mid-run (gate-level `<verdict>FAIL → pause channel, continue others</verdict>`).
</platform_risks>

## Ground truth (audited 2026-04-19)

<ground_truth>
  <launch_site>
    /Users/nick/Desktop/blog-series/withagents-site/ (Astro 6, static + @astrojs/vercel adapter, Hyper-black + Ultraviolet brand).
    17 routes: index, about, consulting, work, lab, now, hyper, opensource/, products/[slug], products/, series/, writing/[slug], writing/, rss.xml, 404, api/consult, api/og.png.
    Vercel: NOT LINKED YET (.vercel/project.json absent). Must run `vercel link` then `vercel --prod` OR `vercel` (preview) as first infra step.
    astro.config site = `https://withagents.dev` (domain not connected today — site will ship to Vercel-generated preview or production URL).
  </launch_site>
  <content>
    46 `day-NN-*.mdx` essays in `withagents-site/src/content/posts/`.
    46 matching `.linkedin.md` + 46 `.x.md` + 46 `.readme-patch.md` sidecars.
    Off-days / gaps in numbering: 6, 30, 32, 33, 41, 48, 52–59. Content runs Day 01 → Day 51 + Day 60 retro (46 active publishing rows).
    Flagship quintet: Day 01 VF → Day 10 CCB → Day 22 Ralph → Day 35 Skills-package → Day 50 SF+CS manifesto.
  </content>
  <code_blockers_status from="phase-A1" audited_on_disk="2026-04-19 18:25">
    A1.1 X-channel removal in runner.ts — UNKNOWN (runner.ts modified, not verified).
    A1.2 Supabase channel CHECK mismatch — UNKNOWN.
    A1.3 Keystatic local-mode — RESOLVED (astro.config.mjs gates `keystaticEnabled` behind env flag, prod safe).
    A1.4 OG endpoint font bootstrap — UNCERTAIN (og.png.ts has uncommitted edit; og-fonts lib exists at src/lib/og-fonts.ts).
    A1.5 Plausible hardcoded — UNCERTAIN (BaseLayout.astro has uncommitted edit).
    A1.6 Missing 404.astro — RESOLVED (file present, 549 bytes).
    A1.7 RSS prerender — UNCERTAIN (rss.xml.ts has uncommitted edit, prerender flag unverified).
    A1.8 article-prep.ts — RESOLVED (scripts/syndication/linkedin/article-prep.ts, 336 lines, shipped in 6d09ce2).
    A1.9 audit scripts — RESOLVED (scripts/audit/ untracked dir exists).
    A1.10 /consulting/ page — RESOLVED (consulting.astro, 4.9KB).
  </code_blockers_status>
  <companion_repos>
    8/8 spot-checked public on github.com/krzemienski/* (validationforge, auto-claude-worktrees, claude-ios-streaming-bridge, claude-code-skills-factory, ralph-orchestrator-guide, stitch-design-to-code, agentic-development-guide, withagents).
    Full repo inventory required at VG-6 since 46 README patches need 46 target repos.
  </companion_repos>
  <accounts_required>
    LinkedIn (personal @nkrzemienski), X/Twitter, Hacker News (karma check), Product Hunt (maker), GitHub (push), Beehiiv (publisher), Resend (welcome email), Supabase (consult inquiry DB), Plausible (analytics).
  </accounts_required>
</ground_truth>

## Launch target decision

<decision id="LT-1" confidence="HIGH">
  <value>Deploy to Vercel preview URL today (e.g. `withagents-site-&lt;hash&gt;-krzemienski.vercel.app` OR a stable `withagents-site.vercel.app`). Use THAT URL as `$LAUNCH_URL` for all 46 posts + 46 LI + 46 X + HN + PH content.</value>
  <rationale>withagents.dev DNS is deferred per user; site ships today on vercel.app. Once DNS connects, Vercel's alias rewrites preserve inbound traffic and canonical URL redirects to withagents.dev — no link-rot for today's posts.</rationale>
  <followup>Domain cutover = single `vercel alias set` command later; not on today's critical path.</followup>
</decision>

```bash
export REPO_ROOT="/Users/nick/Desktop/blog-series"
export SITE_ROOT="$REPO_ROOT/withagents-site"
export EVIDENCE_DIR="$REPO_ROOT/plans/260419-1200-unified-launch-remediation/evidence/launch-today"
export LAUNCH_URL=""   # populated after VG-3 (Vercel deploy)
mkdir -p "$EVIDENCE_DIR"/{build,routes,sidecars,repos,readme-patches,linkedin,x,hn,ph,newsletter,bundle}
```

## Pre-launch readiness (VG-1 → VG-10)

<validation_gate id="VG-1" blocking="true" owner="claude">
  <name>A1 code-blocker verification — commit or revert pending edits</name>
  <prerequisites>cd $SITE_ROOT; git status shows uncommitted edits on astro.config.mjs, BaseLayout.astro, og.png.ts, rss.xml.ts.</prerequisites>
  <execute>
    cd $SITE_ROOT
    git diff astro.config.mjs src/layouts/BaseLayout.astro src/pages/api/og.png.ts src/pages/rss.xml.ts | tee "$EVIDENCE_DIR/build/vg1-pending-diffs.patch"
    # Inspect each hunk. For each file, decide: commit (intended fix) or revert (regression).
    # Expected per phase-A1:
    #   og.png.ts — inlines fonts via src/lib/og-fonts.ts (A1.4)
    #   BaseLayout.astro — env-gates Plausible (A1.5)
    #   rss.xml.ts — adds `export const prerender = true` (A1.7)
    #   astro.config.mjs — any remaining Keystatic gating or adapter config
    grep -E "export const prerender" src/pages/rss.xml.ts | tee -a "$EVIDENCE_DIR/build/vg1-rss-prerender.txt"
    grep -E "readFileSync|SPACE_GROTESK_BOLD|JETBRAINS_MONO" src/pages/api/og.png.ts src/lib/og-fonts.ts 2>/dev/null | tee -a "$EVIDENCE_DIR/build/vg1-og-fonts.txt"
    grep -E "import\.meta\.env\.PROD|PUBLIC_PLAUSIBLE_DOMAIN|VERCEL_ENV" src/layouts/BaseLayout.astro | tee -a "$EVIDENCE_DIR/build/vg1-plausible-gate.txt"
  </execute>
  <capture>$EVIDENCE_DIR/build/vg1-*.patch + .txt</capture>
  <pass_criteria>vg1-rss-prerender.txt has ≥1 match; vg1-og-fonts.txt has ≥1 match from og-fonts.ts import; vg1-plausible-gate.txt contains an env-gate expression for Plausible; every pending diff hunk is intentional (no accidental debug logs, no placeholder TODOs).</pass_criteria>
  <review>Read each captured file; confirm the edits match phase-A1 intent; commit them with `git add -p + git commit -m "fix: A1 blockers — OG inline fonts, Plausible gate, RSS prerender"` once confirmed.</review>
  <verdict>PASS → VG-2 | FAIL → either finish the A1 fix correctly OR revert the pending edit so VG-2 build runs against clean state.</verdict>
  <mock_guard>IF tempted to `git stash` and forget → STOP. The edits either ship or they don't; intermediate states cause mid-execution surprises.</mock_guard>
</validation_gate>

<validation_gate id="VG-2" blocking="true" owner="claude">
  <name>withagents-site builds green</name>
  <prerequisites>VG-1 PASS; node ≥18; pnpm installed; `$SITE_ROOT` accessible.</prerequisites>
  <execute>
    cd $SITE_ROOT
    pnpm install --frozen-lockfile 2>&1 | tee "$EVIDENCE_DIR/build/vg2-install.log"
    pnpm build 2>&1 | tee "$EVIDENCE_DIR/build/vg2-build.log"
    ls -la dist/client/ 2>&1 | tee "$EVIDENCE_DIR/build/vg2-dist-root.txt"
    ls dist/client/writing/ 2>/dev/null | wc -l | tee "$EVIDENCE_DIR/build/vg2-writing-count.txt"
    test -f dist/client/rss.xml && echo "rss.xml PRESENT" || echo "rss.xml MISSING"  | tee "$EVIDENCE_DIR/build/vg2-rss-check.txt"
    test -f dist/client/404.html && echo "404.html PRESENT" || echo "404.html MISSING" | tee "$EVIDENCE_DIR/build/vg2-404-check.txt"
  </execute>
  <capture>$EVIDENCE_DIR/build/vg2-*.log + *.txt</capture>
  <pass_criteria>pnpm build exits 0; vg2-writing-count.txt ≥ 46 (one directory per publishing day); vg2-rss-check.txt reports PRESENT; vg2-404-check.txt reports PRESENT; no `[ERROR]` or `[FATAL]` lines outside a successful-build summary.</pass_criteria>
  <review>tail -40 "$EVIDENCE_DIR/build/vg2-build.log"; cat vg2-writing-count.txt vg2-rss-check.txt vg2-404-check.txt.</review>
  <verdict>PASS → VG-3 | FAIL → read build error, fix the named file (no stubs), re-run. If TypeScript/astro:check errors, address them — do not pass `--skipTypeCheck`.</verdict>
  <mock_guard>IF tempted to skip types or disable astro:check → STOP. A failing content-type = a broken post rendering live.</mock_guard>
</validation_gate>

<validation_gate id="VG-3" blocking="true" owner="nick">
  <name>Link Vercel project + deploy to production URL</name>
  <prerequisites>VG-2 PASS; Nick has a Vercel account; `gh auth status` clean.</prerequisites>
  <execute>
    cd $SITE_ROOT
    vercel link --yes 2>&1 | tee "$EVIDENCE_DIR/build/vg3-link.log"
    # Set required prod env vars per phase-B2.2
    for v in SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY RESEND_API_KEY NICK_INQUIRY_EMAIL CALENDLY_URL PUBLIC_PLAUSIBLE_DOMAIN BEEHIIV_API_KEY BEEHIIV_PUBLICATION_ID; do
      vercel env ls production 2>/dev/null | grep -q "^$v" || echo "MISSING: $v"
    done | tee "$EVIDENCE_DIR/build/vg3-env-check.txt"
    # If any MISSING rows, run `vercel env add $NAME production` interactively before deploying.
    vercel --prod 2>&1 | tee "$EVIDENCE_DIR/build/vg3-deploy.log"
    DEPLOY_URL=$(grep -Eo 'https://[a-z0-9-]+\.vercel\.app' "$EVIDENCE_DIR/build/vg3-deploy.log" | tail -1)
    echo "$DEPLOY_URL" > "$EVIDENCE_DIR/build/vg3-launch-url.txt"
    echo "export LAUNCH_URL=\"$DEPLOY_URL\"" > "$EVIDENCE_DIR/build/vg3-env.sh"
    curl -sI --max-time 15 "$DEPLOY_URL/" | head -1 | tee "$EVIDENCE_DIR/build/vg3-home-status.txt"
  </execute>
  <capture>$EVIDENCE_DIR/build/vg3-{link,deploy,launch-url,env-check,home-status}.{log,txt,sh}</capture>
  <pass_criteria>vg3-deploy.log contains "Production: https://...vercel.app"; vg3-launch-url.txt non-empty; vg3-home-status.txt first line = `HTTP/2 200`; vg3-env-check.txt contains zero MISSING lines.</pass_criteria>
  <review>source "$EVIDENCE_DIR/build/vg3-env.sh" to load $LAUNCH_URL in subsequent gates; open $LAUNCH_URL in a browser and confirm Hyper-black design + Ultraviolet accent renders.</review>
  <verdict>PASS → VG-4 | FAIL → if env vars missing, add them and re-deploy; if build times out, consult Vercel logs; if SSL pending, wait 2-5 min then re-curl.</verdict>
  <mock_guard>IF tempted to hand-edit vg3-launch-url.txt to a fake URL → STOP. $LAUNCH_URL cascades into 46 post-URL checks + 46 LI comments + 46 X tweets.</mock_guard>
</validation_gate>

<validation_gate id="VG-4" blocking="true" owner="claude">
  <name>All 46 post URLs return 200 on $LAUNCH_URL</name>
  <prerequisites>VG-3 PASS; $LAUNCH_URL loaded.</prerequisites>
  <execute>
    source "$EVIDENCE_DIR/build/vg3-env.sh"
    for mdx in $SITE_ROOT/src/content/posts/day-*.mdx; do
      slug=$(basename "$mdx" .mdx)
      url="$LAUNCH_URL/writing/$slug/"
      code=$(curl -sI --max-time 10 "$url" -o /dev/null -w "%{http_code}")
      echo "$code $url" | tee -a "$EVIDENCE_DIR/routes/vg4-posts.txt"
    done
    # Also check IA pages
    for route in "" "/writing/" "/about/" "/consulting/" "/work/" "/lab/" "/now/" "/opensource/" "/products/" "/series/" "/hyper/" "/rss.xml" "/404-does-not-exist-slug"; do
      code=$(curl -sI --max-time 10 "$LAUNCH_URL$route" -o /dev/null -w "%{http_code}")
      echo "$code $LAUNCH_URL$route" | tee -a "$EVIDENCE_DIR/routes/vg4-ia.txt"
    done
  </execute>
  <capture>$EVIDENCE_DIR/routes/vg4-posts.txt + vg4-ia.txt</capture>
  <pass_criteria>vg4-posts.txt: 46 lines, ALL starting with `200`; vg4-ia.txt: 12 routes return 200, final "/404-does-not-exist-slug" returns 404 (negative check).</pass_criteria>
  <review>awk '$1 != "200" {bad=1; print "BAD:", $0} END {exit bad}' "$EVIDENCE_DIR/routes/vg4-posts.txt"; grep -v "404 .*does-not-exist" "$EVIDENCE_DIR/routes/vg4-ia.txt" | awk '$1 != "200" {bad=1; print "BAD:", $0} END {exit bad}'.</review>
  <verdict>PASS → VG-5 | FAIL → inspect failing slugs; check content collection schema; if static build skipped a post, fix and re-deploy (loop back to VG-2).</verdict>
  <mock_guard>IF tempted to remove a 404ing post from the list → STOP. Fix the rendering or the content file. Every post we tease on social MUST resolve.</mock_guard>
</validation_gate>

<validation_gate id="VG-5" blocking="true" owner="claude">
  <name>OG image + meta tags work for every one of 46 posts</name>
  <prerequisites>VG-4 PASS.</prerequisites>
  <execute>
    source "$EVIDENCE_DIR/build/vg3-env.sh"
    while read -r line; do
      url=$(echo "$line" | awk '{print $2}')
      slug=$(echo "$url" | sed 's|.*/writing/||;s|/$||')
      html=$(curl -s --max-time 10 "$url")
      og_img=$(echo "$html" | grep -Eio 'property="og:image" content="[^"]+"' | sed 's/.*content="//;s/".*//')
      og_title=$(echo "$html" | grep -Eio 'property="og:title" content="[^"]+"' | sed 's/.*content="//;s/".*//')
      if [ -z "$og_img" ] || [ -z "$og_title" ]; then
        echo "MISSING-META $slug" | tee -a "$EVIDENCE_DIR/routes/vg5-og-results.txt"
        continue
      fi
      # Resolve relative og:image to absolute
      [[ "$og_img" != http* ]] && og_img="$LAUNCH_URL$og_img"
      img_code=$(curl -sI --max-time 10 "$og_img" -o /dev/null -w "%{http_code}")
      img_type=$(curl -sI --max-time 10 "$og_img" | grep -i "^content-type:" | tr -d '\r')
      echo "$img_code $slug $og_img $img_type" | tee -a "$EVIDENCE_DIR/routes/vg5-og-results.txt"
    done < "$EVIDENCE_DIR/routes/vg4-posts.txt"
    # Spot-download 3 og images for visual inspection
    for slug in day-01-validationforge-ga day-22-ralph-orchestrator-origin day-50-sessionforge-codestories-manifesto; do
      curl -s --max-time 10 "$LAUNCH_URL/api/og.png?title=$slug&kind=essay" -o "$EVIDENCE_DIR/routes/vg5-og-$slug.png"
      file "$EVIDENCE_DIR/routes/vg5-og-$slug.png"
    done | tee "$EVIDENCE_DIR/routes/vg5-og-file-types.txt"
  </execute>
  <capture>$EVIDENCE_DIR/routes/vg5-og-results.txt + 3 sample PNGs + vg5-og-file-types.txt</capture>
  <pass_criteria>Zero MISSING-META lines in vg5-og-results.txt; every image HTTP code = 200; every content-type = `image/png` or `image/jpeg`; vg5-og-file-types.txt shows `PNG image data, 1200 x 630` for all 3 spot samples.</pass_criteria>
  <review>grep -c MISSING "$EVIDENCE_DIR/routes/vg5-og-results.txt" (expect 0); Read tool on the 3 PNG samples to visually confirm layout = Hyper-black + Ultraviolet + legible title.</review>
  <verdict>PASS → VG-6 | FAIL → OG generator broken or font bundle too big (Edge cap 1MB) → loop to A1.4 fix → re-deploy.</verdict>
  <mock_guard>IF tempted to proceed despite broken OG because "it still posts" → STOP. LinkedIn/X preview cards drive ~30% of CTR.</mock_guard>
</validation_gate>

<validation_gate id="VG-6" blocking="true" owner="claude">
  <name>Every .readme-patch.md has a matching public GitHub companion repo</name>
  <prerequisites>VG-2 PASS.</prerequisites>
  <execute>
    # 46 readme-patch sidecars reference 46 target companion repos. Map slug → target repo.
    grep -Eroh --include="*.readme-patch.md" "github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+" \
      $SITE_ROOT/src/content/posts/ \
      | sort -u | tee "$EVIDENCE_DIR/repos/vg6-referenced-repos.txt"
    while read -r ref; do
      code=$(curl -sI --max-time 5 "https://$ref" -o /dev/null -w "%{http_code}")
      echo "$code https://$ref" | tee -a "$EVIDENCE_DIR/repos/vg6-repo-status.txt"
    done < "$EVIDENCE_DIR/repos/vg6-referenced-repos.txt"
  </execute>
  <capture>$EVIDENCE_DIR/repos/vg6-{referenced-repos,repo-status}.txt</capture>
  <pass_criteria>Every status line starts with `200` or `301`. Zero `404`, zero `403`.</pass_criteria>
  <review>awk '$1 ~ /^(404|403|000)/ {bad=1; print "PRIVATE/MISSING:", $0} END {exit bad}' "$EVIDENCE_DIR/repos/vg6-repo-status.txt".</review>
  <verdict>PASS → VG-7 | FAIL → for each private repo, `gh repo edit krzemienski/&lt;name&gt; --visibility public --accept-visibility-change-consequences`; for each missing repo, either create+push OR edit the .readme-patch.md to remove the reference. Re-run VG-6.</verdict>
  <mock_guard>IF tempted to ship with 5 private repos "I'll flip them later" → STOP. You're posting links TODAY. They resolve TODAY.</mock_guard>
</validation_gate>

<validation_gate id="VG-7" blocking="true" owner="claude">
  <name>Sidecar content sanitation — no TODOs, placeholders, or draft markers</name>
  <prerequisites>VG-2 PASS.</prerequisites>
  <execute>
    cd $SITE_ROOT/src/content/posts
    grep -Ern "TODO|FIXME|XXX|&lt;paste|PLACEHOLDER|LOREM" day-*.{mdx,linkedin.md,x.md,readme-patch.md} \
      2>/dev/null | tee "$EVIDENCE_DIR/sidecars/vg7-todos.txt"
    # X thread per-tweet character check
    for f in day-*.x.md; do
      python3 - &lt;&lt;'PY' "$f" &gt;&gt; "$EVIDENCE_DIR/sidecars/vg7-x-char-overflow.txt"
import re,sys
fn=sys.argv[1]; t=open(fn).read()
for n,c in re.findall(r'&lt;!-- Tweet (\d+) \[(\d+) chars\] --&gt;', t):
    if int(c)&gt;280: print(f"{fn}: tweet {n} = {c} chars")
PY
    done
    # LI article minimum length sanity (Wave 1b audit: &lt;900w = feed, ≥900w = Article-eligible)
    for f in day-*.linkedin.md; do
      wc -w "$f" &gt;&gt; "$EVIDENCE_DIR/sidecars/vg7-li-wordcount.txt"
    done
  </execute>
  <capture>$EVIDENCE_DIR/sidecars/vg7-{todos,x-char-overflow,li-wordcount}.txt</capture>
  <pass_criteria>vg7-todos.txt is EMPTY (0 bytes). vg7-x-char-overflow.txt is EMPTY. vg7-li-wordcount.txt has 46 rows, all with numeric word count &gt;0.</pass_criteria>
  <review>test ! -s "$EVIDENCE_DIR/sidecars/vg7-todos.txt" || { echo "FAIL: TODOs present"; head "$EVIDENCE_DIR/sidecars/vg7-todos.txt"; }; awk '{sum+=$1; n++} END {print n" files, avg "sum/n" words"}' "$EVIDENCE_DIR/sidecars/vg7-li-wordcount.txt".</review>
  <verdict>PASS → VG-8 | FAIL → edit the offending sidecar(s) to replace placeholder text with real content; re-run.</verdict>
  <mock_guard>IF tempted to silence the grep with `|| true` → STOP. A TODO on LinkedIn reaches 2K+ connections before you delete it.</mock_guard>
</validation_gate>

<validation_gate id="VG-8" blocking="true" owner="claude">
  <name>Paste-ready content index — one row per post with LI/X/README drafts + target URLs</name>
  <prerequisites>VG-3 PASS ($LAUNCH_URL known); VG-7 PASS (sidecars clean).</prerequisites>
  <execute>
    source "$EVIDENCE_DIR/build/vg3-env.sh"
    echo "day,slug,post_url,linkedin_draft_path,x_draft_path,readme_patch_path,target_repo" > "$EVIDENCE_DIR/bundle/content-index.csv"
    for mdx in $SITE_ROOT/src/content/posts/day-*.mdx; do
      slug=$(basename "$mdx" .mdx)
      day=$(echo "$slug" | grep -oE '^day-[0-9]+' | grep -oE '[0-9]+')
      post_url="$LAUNCH_URL/writing/$slug/"
      li=$(ls $SITE_ROOT/src/content/posts/$slug.linkedin.md 2>/dev/null)
      xp=$(ls $SITE_ROOT/src/content/posts/$slug.x.md 2>/dev/null)
      rp=$(ls $SITE_ROOT/src/content/posts/$slug.readme-patch.md 2>/dev/null)
      target_repo=$(grep -m1 -Eo 'github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+' "$rp" 2>/dev/null | head -1)
      echo "$day,$slug,$post_url,$li,$xp,$rp,$target_repo" >> "$EVIDENCE_DIR/bundle/content-index.csv"
    done
    wc -l "$EVIDENCE_DIR/bundle/content-index.csv"
  </execute>
  <capture>$EVIDENCE_DIR/bundle/content-index.csv</capture>
  <pass_criteria>content-index.csv has 47 lines (header + 46 rows); every row has non-empty post_url, linkedin_draft_path, x_draft_path, readme_patch_path, target_repo.</pass_criteria>
  <review>column -t -s, "$EVIDENCE_DIR/bundle/content-index.csv" | head -5; awk -F, 'NR&gt;1 &amp;&amp; (NF&lt;7 || $3=="" || $7=="") {bad=1; print "INCOMPLETE:", $0} END {exit bad}' "$EVIDENCE_DIR/bundle/content-index.csv".</review>
  <verdict>PASS → VG-9 | FAIL → fill in missing rows; this index is the master worksheet for VG-11..VG-15 amplification.</verdict>
</validation_gate>

<validation_gate id="VG-9" blocking="false" owner="nick">
  <name>Optional: consulting form end-to-end round-trip</name>
  <prerequisites>VG-3 PASS; Supabase + Resend env vars set.</prerequisites>
  <execute>
    source "$EVIDENCE_DIR/build/vg3-env.sh"
    curl -i -X POST "$LAUNCH_URL/api/consult" \
      -H "Content-Type: application/json" \
      -d '{"name":"Launch Smoke","email":"launch-check+'"$(date +%s)"'@krzemienski.com","use_case":"smoke test"}' \
      2>&1 | tee "$EVIDENCE_DIR/build/vg9-consult.log"
    # Optional: query Supabase for the row
    if [ -n "$SUPABASE_DB_URL" ]; then
      psql "$SUPABASE_DB_URL" -c "SELECT id, created_at, name, email FROM consultant_inquiries WHERE email LIKE 'launch-check+%' ORDER BY created_at DESC LIMIT 1;" | tee "$EVIDENCE_DIR/build/vg9-supabase.txt"
      psql "$SUPABASE_DB_URL" -c "DELETE FROM consultant_inquiries WHERE email LIKE 'launch-check+%';"
    fi
  </execute>
  <capture>$EVIDENCE_DIR/build/vg9-{consult,supabase}.{log,txt}</capture>
  <pass_criteria>POST returns 2xx or 303 (redirect to Calendly); Supabase row present with the submitted email; test row deleted after.</pass_criteria>
  <verdict>PASS → VG-10 | FAIL (non-blocking) → document and proceed; consulting form can be fixed post-launch.</verdict>
</validation_gate>

<validation_gate id="VG-10" blocking="true" owner="nick">
  <name>Live credentials on every outbound channel</name>
  <prerequisites>Nick at laptop.</prerequisites>
  <execute>
    Screenshot each logged-in state to $EVIDENCE_DIR/build/vg10-&lt;channel&gt;.png:
    1. LinkedIn — linkedin.com/in/nkrzemienski (your profile, "Me" control visible)
    2. X / Twitter — x.com/home (timeline)
    3. Hacker News — news.ycombinator.com/user?id=&lt;handle&gt; (karma visible, ≥50 preferred)
    4. Product Hunt — producthunt.com/my/profile (maker profile)
    5. GitHub — terminal screenshot of `gh auth status` showing authenticated user
    6. Beehiiv — app.beehiiv.com/dashboard (your publication listed)
    7. Vercel — vercel.com/dashboard showing withagents-site project
  </execute>
  <capture>$EVIDENCE_DIR/build/vg10-*.png (7 screenshots)</capture>
  <pass_criteria>7 PNGs exist; each shows a logged-in indicator (not a login/splash wall).</pass_criteria>
  <verdict>PASS → START AMPLIFICATION (VG-11..VG-16) | FAIL → log in / reset / recover BEFORE posting starts.</verdict>
  <mock_guard>IF HN karma is &lt;50 → STOP. Nick's original Show HN may get soft-ranked. Decide now: ship anyway (document risk) OR have an older-karma friend submit and Nick comment first.</mock_guard>
</validation_gate>

## Amplification execution (VG-11 → VG-16)

**Execution model:** serial per-channel across all 46 posts to stay within platform heuristics and maintain operator focus. Rough time budget: 4-7 hours end-to-end. Evidence captured per-post.

<validation_gate id="VG-11" blocking="true" owner="claude" automated="true">
  <name>46 README patches applied to companion repos via runner</name>
  <prerequisites>VG-6 PASS; all 46 target repos public; `$REPO_ROOT/.launch-date` may or may not exist — set it now if missing.</prerequisites>
  <execute>
    cd $REPO_ROOT
    [ -f .launch-date ] || echo "$(date -u +%Y-%m-%d)" > .launch-date
    # Loop days; runner.ts already patches READMEs per phase-B3.3
    for mdx in $SITE_ROOT/src/content/posts/day-*.mdx; do
      slug=$(basename "$mdx" .mdx)
      day=$(echo "$slug" | grep -oE '^day-[0-9]+' | grep -oE '[0-9]+')
      pnpm tsx scripts/syndication/scheduler/runner.ts --day "$day" --channel readme 2>&1 \
        | tee -a "$EVIDENCE_DIR/readme-patches/vg11-runner-all.log"
      # Capture the commit URL runner emits per day
      grep -oE "https://github\.com/[^[:space:]]+/commit/[a-f0-9]+" "$EVIDENCE_DIR/readme-patches/vg11-runner-all.log" \
        | tail -1 &gt;&gt; "$EVIDENCE_DIR/readme-patches/vg11-commit-urls.txt"
    done
    # Verify each commit URL resolves 200
    while read -r url; do
      code=$(curl -sI --max-time 8 "$url" -o /dev/null -w "%{http_code}")
      echo "$code $url" &gt;&gt; "$EVIDENCE_DIR/readme-patches/vg11-commit-status.txt"
    done &lt; "$EVIDENCE_DIR/readme-patches/vg11-commit-urls.txt"
  </execute>
  <capture>$EVIDENCE_DIR/readme-patches/vg11-{runner-all,commit-urls,commit-status}.{log,txt}</capture>
  <pass_criteria>vg11-commit-urls.txt contains 46 GitHub commit URLs; every status row starts with `200`.</pass_criteria>
  <review>wc -l "$EVIDENCE_DIR/readme-patches/vg11-commit-urls.txt" (expect 46); awk '$1 != "200" {bad=1; print "BAD:", $0} END {exit bad}' "$EVIDENCE_DIR/readme-patches/vg11-commit-status.txt".</review>
  <verdict>PASS → VG-12 | FAIL — if runner errors on a specific day (branch protection, patch conflict), either fix the underlying .readme-patch.md or manually `cd /tmp/readme-patch-&lt;N&gt; &amp;&amp; git push` as B3 runbook notes. Re-run remaining days.</verdict>
  <mock_guard>IF runner appears to succeed but commits aren't visible on GitHub → STOP and check `git log --all` in each companion repo; local commits without push don't count.</mock_guard>
</validation_gate>

<validation_gate id="VG-12" blocking="true" owner="nick">
  <name>LinkedIn — 46 posts published (Articles for flagships + long-form, feed posts otherwise)</name>
  <prerequisites>VG-10 PASS; content-index.csv ready.</prerequisites>
  <execute>
    Work through content-index.csv top-to-bottom. Per row:
    1. Read linkedin_draft_path → copy body.
    2. For flagships (days 1, 10, 22, 35, 50) + any post ≥900 words: use LI Article UI. Run helper first:
       `pnpm tsx scripts/syndication/linkedin/article-prep.ts &lt;slug&gt;` to open LI composer prefilled.
    3. For others: paste into LI feed composer.
    4. Publish. Copy URL from address bar.
    5. Drop first-comment link: `Full essay + code: &lt;post_url&gt;?utm_source=linkedin&amp;utm_medium=social&amp;utm_campaign=launch-day-&lt;slug&gt;`
    6. Append `echo "&lt;li-url&gt;" &gt;&gt; "$EVIDENCE_DIR/linkedin/vg12-urls.txt"` per row.
    Pacing guidance: ≥2 min between posts to humanize velocity. Mix Article and feed to avoid 10-Article-burst throttle.
  </execute>
  <capture>$EVIDENCE_DIR/linkedin/vg12-urls.txt (one URL per line, ≥46)</capture>
  <pass_criteria>vg12-urls.txt has ≥46 lines; every line matches `https://www.linkedin.com/(pulse|posts)/...`; spot-check 5 random URLs via `curl -sI` returns 200.</pass_criteria>
  <review>
    wc -l "$EVIDENCE_DIR/linkedin/vg12-urls.txt" (expect ≥46);
    shuf -n 5 "$EVIDENCE_DIR/linkedin/vg12-urls.txt" | while read u; do curl -sI --max-time 8 "$u" | head -1; done (expect 5× `HTTP/2 200`).
  </review>
  <verdict>PASS → VG-13 | FAIL (throttle hit) → pause channel, capture throttle message to $EVIDENCE_DIR/linkedin/THROTTLE.md, continue VG-13 onwards and resume remaining LI posts tomorrow.</verdict>
  <mock_guard>IF tempted to rush 10 Articles in the first hour to "beat the algo" → STOP. Known risk per platform_risks block — pace the Articles across the day.</mock_guard>
</validation_gate>

<validation_gate id="VG-13" blocking="true" owner="nick">
  <name>X / Twitter — 46 threads published (Typefully or manual per DECISIONS-LOCKED.md B1.5)</name>
  <prerequisites>VG-10 PASS; content-index.csv ready.</prerequisites>
  <execute>
    Per content-index.csv row:
    1. Open x_draft_path → the thread content is split by `&lt;!-- Tweet N [NN chars] --&gt;` markers.
    2. Publish the thread (Typefully paste-split OR manual reply-chain).
    3. Copy the first-tweet URL (x.com/.../status/...).
    4. `echo "&lt;x-url&gt;" &gt;&gt; "$EVIDENCE_DIR/x/vg13-urls.txt"`.
    Pacing: ≥3 min between threads to avoid spam heuristic.
  </execute>
  <capture>$EVIDENCE_DIR/x/vg13-urls.txt</capture>
  <pass_criteria>≥46 lines; each matches `https://(x|twitter)\.com/.*/status/\d+`; spot-check 5 URLs via curl → 200.</pass_criteria>
  <review>wc -l "$EVIDENCE_DIR/x/vg13-urls.txt"; shuf -n 5 "$EVIDENCE_DIR/x/vg13-urls.txt" | while read u; do curl -sI --max-time 8 "$u" | head -1; done.</review>
  <verdict>PASS → VG-14 | FAIL (rate-limit) → stop posting immediately, record partial count, wait 15 min, resume. If account flagged, channel pauses for day.</verdict>
  <mock_guard>IF tempted to post all 46 via a script to save time → STOP. Automated bursts from a single account = flag. Manual, paced, one device.</mock_guard>
</validation_gate>

<validation_gate id="VG-14" blocking="true" owner="nick">
  <name>Hacker News — 3 flagship submissions spaced ≥2h apart</name>
  <prerequisites>VG-10 PASS; VG-4 PASS ($LAUNCH_URL home and 3 flagship slugs return 200).</prerequisites>
  <execute>
    Space these ≥2h apart to reduce same-author shadowflag odds:
    1. T+0h:  Show HN — title: "Show HN: WithAgents — 46 lessons from 23,479 AI coding sessions"; url: $LAUNCH_URL/
    2. T+2h:  "Ralph Orchestrator — infinite agent loops without token waste" → url: $LAUNCH_URL/writing/day-22-ralph-orchestrator-origin/
    3. T+4h:  "The Iron Rule — validate real systems, not mocks (manifesto)" → url: $LAUNCH_URL/writing/day-50-sessionforge-codestories-manifesto/
    Post a first comment on each WITHIN 60s of submitting (meta-context, what you want feedback on).
    After each, capture: `echo "&lt;hn-url&gt;" &gt;&gt; "$EVIDENCE_DIR/hn/vg14-urls.txt"`.
  </execute>
  <capture>$EVIDENCE_DIR/hn/vg14-urls.txt (3 URLs)</capture>
  <pass_criteria>3 lines each `news.ycombinator.com/item?id=NNN`; every URL returns 200; each item page HTML contains your handle as commenter.</pass_criteria>
  <review>while read u; do curl -s "$u" | grep -oE 'user\?id=[^"]+' | head -3; done &lt; "$EVIDENCE_DIR/hn/vg14-urls.txt" → expect Nick's handle present.</review>
  <verdict>PASS → VG-15 | FAIL (flagged/dead) → DO NOT re-submit from any account today. Stop HN channel, continue others.</verdict>
  <mock_guard>IF tempted to upvote from alt accounts → STOP. Fastest known path to simultaneous ban of all accounts involved.</mock_guard>
</validation_gate>

<validation_gate id="VG-15" blocking="true" owner="nick">
  <name>Product Hunt — 2 launches (series + consulting) spaced ≥4h apart</name>
  <prerequisites>VG-10 PASS; /consulting/ returns 200 (VG-4 verified).</prerequisites>
  <execute>
    Launch 1 (T+0h): producthunt.com/posts/new
      - Title: "WithAgents — 46 lessons from 23,479 AI coding sessions"
      - Tagline: "Applied agent design. Products + open source + writing that holds up in production."
      - URL: $LAUNCH_URL/
      - Category: Developer Tools + AI
      - Gallery: upload 3 OG images (home + Day 01 VF + Day 22 Ralph)
    Launch 2 (T+4h): producthunt.com/posts/new
      - Title: "WithAgents Consulting — quiet applied work on agent systems"
      - Tagline: "Short audits and embedded pair-weeks with engineering teams."
      - URL: $LAUNCH_URL/consulting/
      - Category: Developer Tools
    For each launch: copy PH post URL → append to $EVIDENCE_DIR/ph/vg15-urls.txt.
    Drop a Maker comment within 5 min of each going live.
  </execute>
  <capture>$EVIDENCE_DIR/ph/vg15-urls.txt (2 URLs)</capture>
  <pass_criteria>2 producthunt.com/posts/&lt;slug&gt; URLs; both return 200; each page shows your handle as Maker.</pass_criteria>
  <review>curl each URL via `-sI`; open in browser and confirm Maker block lists Nick.</review>
  <verdict>PASS → VG-16 | FAIL → PH allows editing; fix the listing, re-capture URL. Consulting launch less critical than series — if PH 2 fails, document and skip.</verdict>
  <mock_guard>IF tempted to run fake-account upvote sprint → STOP. PH de-ranks on detection.</mock_guard>
</validation_gate>

<validation_gate id="VG-16" blocking="false" owner="nick">
  <name>Beehiiv newsletter — one broadcast announcing full series live</name>
  <prerequisites>VG-4 PASS; Beehiiv pub configured (per phase-A4) OR skipped if not set up yet.</prerequisites>
  <execute>
    app.beehiiv.com → create Post → subject: "46 posts, one day. Here's the through-line."
    Body: short intro + link to $LAUNCH_URL/ + 5 flagship callouts (VF Day 1, CCB Day 10, Ralph Day 22, Skills Day 35, Manifesto Day 50).
    Send to full list.
    Capture sent-confirmation URL / screenshot → $EVIDENCE_DIR/newsletter/vg16-sent.{txt,png}.
    Check inbox for delivered copy; verify SPF/DKIM pass in headers → screenshot → $EVIDENCE_DIR/newsletter/vg16-inbox.png.
  </execute>
  <capture>$EVIDENCE_DIR/newsletter/vg16-{sent,inbox}.{txt,png}</capture>
  <pass_criteria>Beehiiv dashboard shows status="sent" with recipient count; inbox shows delivered copy with SPF=pass, DKIM=pass in "Show original".</pass_criteria>
  <verdict>PASS → VG-17 | FAIL (non-blocking) → if Beehiiv not ready, document residual-risk and proceed.</verdict>
  <mock_guard>IF tempted to skip SPF/DKIM verification because "email looks fine" → STOP. Unauthed mail → spam folder → 0% open rate.</mock_guard>
</validation_gate>

<validation_gate id="VG-17" blocking="true" owner="claude">
  <name>Launch bundle — all evidence manifested, hashed, immutable</name>
  <prerequisites>VG-1..VG-15 PASS (VG-9, VG-16 may be waived).</prerequisites>
  <execute>
    cd "$EVIDENCE_DIR"
    find . -type f ! -name 'MANIFEST.txt' ! -name 'SHA256SUMS' | sort &gt; MANIFEST.txt
    shasum -a 256 $(cat MANIFEST.txt) &gt; SHA256SUMS
    # Counts
    printf "Posts live: %s\n" "$(wc -l &lt; routes/vg4-posts.txt)" &gt;&gt; SUMMARY.txt
    printf "README commits: %s\n" "$(wc -l &lt; readme-patches/vg11-commit-urls.txt 2&gt;/dev/null || echo 0)" &gt;&gt; SUMMARY.txt
    printf "LinkedIn URLs: %s\n" "$(wc -l &lt; linkedin/vg12-urls.txt 2&gt;/dev/null || echo 0)" &gt;&gt; SUMMARY.txt
    printf "X URLs: %s\n" "$(wc -l &lt; x/vg13-urls.txt 2&gt;/dev/null || echo 0)" &gt;&gt; SUMMARY.txt
    printf "HN submissions: %s\n" "$(wc -l &lt; hn/vg14-urls.txt 2&gt;/dev/null || echo 0)" &gt;&gt; SUMMARY.txt
    printf "PH launches: %s\n" "$(wc -l &lt; ph/vg15-urls.txt 2&gt;/dev/null || echo 0)" &gt;&gt; SUMMARY.txt
    find . -type f -size 0 &gt; ZERO-BYTE-EVIDENCE.txt
  </execute>
  <capture>$EVIDENCE_DIR/{MANIFEST.txt, SHA256SUMS, SUMMARY.txt, ZERO-BYTE-EVIDENCE.txt}</capture>
  <pass_criteria>MANIFEST.txt ≥ 40 lines; SHA256SUMS rows = MANIFEST rows; SUMMARY.txt shows: Posts live = 46, README commits = 46 (or documented partial), LinkedIn ≥ 46 (or partial with THROTTLE.md), X ≥ 46 (or partial), HN = 3, PH = 2; ZERO-BYTE-EVIDENCE.txt is EMPTY.</pass_criteria>
  <review>cat "$EVIDENCE_DIR/SUMMARY.txt"; test ! -s "$EVIDENCE_DIR/ZERO-BYTE-EVIDENCE.txt" || { echo "FAIL: empty evidence files present"; cat "$EVIDENCE_DIR/ZERO-BYTE-EVIDENCE.txt"; }.</review>
  <verdict>PASS → LAUNCH COMPLETE; commit evidence dir to git | FAIL → identify missing artifact, re-run gate, re-bundle.</verdict>
  <mock_guard>IF tempted to backfill a URL after the fact ("I posted it, just forgot the tee") → STOP. Re-fetch from platform history, confirm URL live, then add.</mock_guard>
</validation_gate>

## Gate manifest

<gate_manifest>
  <total_gates>17 (15 blocking + 2 non-blocking — VG-9 consult, VG-16 newsletter)</total_gates>
  <claude_owned>VG-1 blocker verify, VG-2 build, VG-4 URL sweep, VG-5 OG sweep, VG-6 repo sweep, VG-7 sidecar clean, VG-8 content-index, VG-11 runner READMEs, VG-17 bundle</claude_owned>
  <nick_owned>VG-3 Vercel link+deploy, VG-9 consult round-trip, VG-10 credentials, VG-12 LinkedIn, VG-13 X, VG-14 HN, VG-15 PH, VG-16 Beehiiv</nick_owned>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7 → VG-8 → VG-9? → VG-10 → [VG-11 parallel with VG-12..VG-16 serial] → VG-17</sequence>
  <parallelism>
    Once VG-10 PASSes: VG-11 (README runner, automated) can run in background while Nick executes VG-12 (LI) serial. VG-13 X can start once Nick wants a break from LI. VG-14 HN and VG-15 PH can interleave into the day (HN ≥2h spacing, PH ≥4h spacing). VG-16 Beehiiv fires once.
  </parallelism>
  <evidence_dir>/Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/evidence/launch-today/</evidence_dir>
  <regression>Any FAIL blocks that gate's forward dependency. Partial amplification (throttled LI, rate-limited X) is allowed with THROTTLE.md/RATE-LIMIT.md in the evidence dir; VG-17 bundle tolerates partials as long as they're documented.</regression>
  <abort_conditions>
    HARD STOP (VG-2 build fails 2× with distinct errors) — the site cannot deploy.
    HARD STOP (VG-10 LinkedIn auth fails) — primary B2B channel dead, relaunch better than partial launch.
    SOFT STOP (per channel): if LinkedIn throttles, HN flags, X rate-limits, or PH rejects — pause THAT channel, continue others. Never retry from a flagged account.
  </abort_conditions>
  <time_budget>
    Pre-launch (VG-1..VG-10): 60-120 min (claude: 30 min, nick: 30-90 min for login + Vercel link).
    Amplification (VG-11..VG-16): 4-7 hours serial (claude VG-11 runs in parallel, ~15 min automated).
    Bundle (VG-17): 5 min.
    Total wall-clock: 5-9 hours.
  </time_budget>
</gate_manifest>

## What this runbook replaces

<replaces>
  The 20-phase 45-day arc (phase-A1..phase-C7 files in this directory): collapsed into this single file.
  phase-A1 code blockers → VG-1 (pending-diff check) + implicit in VG-2 build.
  phase-A2 content date verification → superseded (launch today, no arc dates).
  phase-A3 functional validation Playwright smoke → collapsed into VG-4 + VG-5 curl sweeps (simpler, faster).
  phase-A4 Beehiiv setup → VG-16 (assumed already configured OR skipped with waiver).
  phase-A5 Wave-1b polish → absorbed into VG-7 sidecar sanitation.
  phase-A6 arc-date helper → obsoleted (no per-day arithmetic needed).
  phase-A7 5-reader resonance gate → superseded by public reception today.
  phase-B1 pre-push decisions → either already made or moot for same-day.
  phase-B2 pre-push infra → VG-1 + VG-3 (Vercel link+deploy, env vars).
  phase-B3 daily runbook → VG-11..VG-16 compressed to one day.
  phase-B4 kill-switch → obsoleted (one-day launch, not 45-60d).
  phase-B5 metrics daily-capture → post-launch follow-up.
  phase-C1..C6 amplification → VG-12..VG-16.
  phase-C7 deferred items → still deferred (Reddit, carousels, company page, etc.).
</replaces>

## Follow-ups (post-launch, NOT today)

<followups>
  <item priority="HIGH">withagents.dev DNS setup + SSL + `vercel alias set $DEPLOY_URL withagents.dev` + 308 redirect preserving inbound links.</item>
  <item priority="HIGH">Commit evidence dir to git: `git add plans/260419-1200-unified-launch-remediation/evidence/launch-today/`.</item>
  <item priority="MED">Day +1 morning: pull Plausible + LinkedIn analytics + HN + PH rankings. Write retro to `plans/phase-12-retro/retro-day-1.md`.</item>
  <item priority="MED">Consulting inquiry monitoring: `psql $SUPABASE_DB_URL -c "SELECT * FROM consultant_inquiries ORDER BY created_at DESC;"` — respond within 24h.</item>
  <item priority="MED">Newsletter list review: if VG-16 PASSed, monitor subscriber growth + open rate.</item>
  <item priority="LOW">Archive or delete the deprecated 20-phase files (phase-A1..C7 + deepened plan.md) once the launch is stable.</item>
  <item priority="LOW">Decide on channel-continuation strategy — paced LinkedIn follow-ups, X authority sprint, Reddit (if sub rules allow), etc. Per C7 deferred-items review.</item>
</followups>
