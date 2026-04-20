# Phase A4 — Beehiiv Newsletter Setup

**Owner:** Sonnet executor (config-heavy, no code)
**Effort:** 4–6h
**Status:** pending
**Depends on:** nothing (parallel with A1–A3)
**Blocks:** C6 (newsletter scheduling)

## Context

Approval-package skipped "newsletters" because Substack was skipped. R2 flagged this as a miss: **Beehiiv is different** — free tier (up to 2,500 subs), RSS auto-import, higher consulting conversion than Substack (3–5x per R2), clean separation from Medium/Substack cohort, creator-friendly monetization if scaled. Adopt Beehiiv now so list-growth starts Day 1.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Tasks

### A4.1 Create publication (30 min)

- Signup at beehiiv.com (free tier).
- Publication name: `withagents`
- URL: `withagents.beehiiv.com` (custom domain deferred, see Open Qs in plan.md)
- Sender: `Nick Krzemienski <nick@withagents.dev>`
- Color theme: match Midnight Observatory (Void Navy `#0f172a`, Indigo Pulse `#6366f1`, Cyan Signal `#22d3ee`)

### A4.2 RSS auto-import setup (60 min)

Beehiiv's RSS-to-email import reads `withagents.dev/rss.xml` and auto-drafts a newsletter per new item.

Steps:
1. Dashboard → Automations → "RSS to Email"
2. RSS feed URL: `https://withagents.dev/rss.xml` (A1.7 confirms this is live)
3. Mode: **auto-draft** (NOT auto-send — per-post human edit gate per C6)
4. Frequency: every 6 hours (catches daily posts without over-polling)
5. Template: blank → import HTML template from `withagents-site/src/emails/newsletter-template.html` (create in A4.3)

### A4.3 Email template (90 min)

Create `withagents-site/src/emails/newsletter-template.html` — single-column, 600px, Midnight-Observatory tokens.

Structure:
- Header: small "withagents" wordmark, dark navy bg
- Hero: post title + subtitle + date
- Body: first ~800 words auto-pulled from RSS description
- CTA block (below body):
  - "Read the full post →" (canonical URL)
  - "Work with me →" (UTM `utm_source=beehiiv&utm_medium=email&utm_campaign=day-NN-<slug>`)
- Footer: 3 recent posts + unsubscribe + social links

Token palette:
```css
--bg: #0f172a;
--surface: #1e293b;
--accent: #6366f1;
--accent-2: #22d3ee;
--text: #f1f5f9;
--text-muted: #94a3b8;
```

Verify template renders across Gmail / Outlook / Apple Mail / mobile via Beehiiv's preview tool.

### A4.4 Signup widget on withagents.dev (60 min)

Beehiiv provides an embed snippet. Add to:
- `/writing` index — above fold, below header
- `/about` — bottom of bio
- `/work` — below consulting form as secondary CTA

```astro
---
// src/components/NewsletterSignup.astro
const { variant = 'inline' } = Astro.props;
---
<div class="newsletter-signup" data-variant={variant}>
  <iframe
    src="https://withagents.beehiiv.com/embed?slim=true"
    height="52"
    frameborder="0"
    scrolling="no"
    style="margin: 0; border-radius: 8px; background: transparent;"
  ></iframe>
</div>
```

UTM-capture is automatic via Beehiiv's native subscriber metadata.

### A4.5 Welcome automation (45 min)

Beehiiv → Automations → "Welcome email series":
- Email 1 (instant): "Thanks — here's the through-line" → Day 01 post link + ValidationForge repo + Code Stories teaser
- Email 2 (T+3d): "The Iron Rule in four receipts" → pull 4 flagship headlines
- Email 3 (T+7d): "Work with me" → consulting CTA, Calendly link

All emails UTM-tagged `utm_campaign=welcome-NN`.

### A4.6 First-sync test (30 min)

1. Trigger RSS poll manually in Beehiiv dashboard
2. Confirm a draft appears for the most recent post (currently day-01 or similar)
3. Inspect template rendering, fix any CSS drift
4. Send test to `nick@withagents.dev` — verify inline, not clipped

## File ownership

| File | Owner |
|---|---|
| Beehiiv dashboard config (external) | A4 |
| `withagents-site/src/emails/newsletter-template.html` (NEW) | A4 |
| `withagents-site/src/components/NewsletterSignup.astro` (NEW) | A4 |
| `withagents-site/src/pages/writing/index.astro` (add widget) | A4 |
| `withagents-site/src/pages/about.astro` (add widget) | A4 |
| `withagents-site/src/pages/work.astro` (add widget) | A4 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| RSS auto-import drafts the wrong post first | LOW | LOW | draft-only mode; human review Day 1 |
| Beehiiv iframe blocks CSP | MED | MED | Astro site has no CSP yet; if added, whitelist `beehiiv.com` |
| Signup widget dominates /work — deflects from consulting form | MED | MED | variant prop → consulting CTA primary, newsletter secondary on /work |
| List growth stalls <100 by Day 30 | MED | MED | add exit-intent modal Day 15 if trending low |
| Custom domain DNS conflict with Vercel apex | LOW | HIGH | defer custom domain to post-Day-60 |

## Acceptance criteria

- [ ] Publication live at `withagents.beehiiv.com`
- [ ] RSS auto-import connected to `withagents.dev/rss.xml`, polling every 6h, **draft-only** mode
- [ ] Email template renders in Gmail/Outlook/Apple Mail/mobile preview
- [ ] Signup widget present on `/writing`, `/about`, `/work`
- [ ] 3-email welcome series configured
- [ ] First sync draft appears + test email to `nick@withagents.dev` renders cleanly

## Verification

```bash
# 1. RSS feed accessible
curl -sI https://withagents.dev/rss.xml | grep -i content-type

# 2. Widget renders
curl -s https://<preview>/writing/ | grep -c beehiiv
# expect ≥ 1

# 3. Manual: trigger RSS poll in Beehiiv dashboard → check Drafts queue
# 4. Manual: send test email → open in Gmail + Apple Mail mobile
```

## Rollback

If Beehiiv is a bust by Day 20 (list <50): pause RSS poll, keep publication dormant, remove widgets via single `<NewsletterSignup enabled={false} />` prop flip. No data loss.
