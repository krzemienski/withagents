# Phase 5: Deploy & Validate

**Priority:** High
**Status:** Pending
**Effort:** Small

## Pre-Deploy Checklist

- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm dev` — all 10 published posts render
- [ ] Mermaid diagrams render as SVG on every post
- [ ] Theme is flat black + pink/purple (no navy remnants)
- [ ] `/admin` is accessible with password
- [ ] Admin can toggle publish state
- [ ] Public site shows exactly 10 posts
- [ ] RSS feed has 10 entries
- [ ] Sitemap has 10 post URLs
- [ ] Mobile responsive on all pages

## Deploy Steps

1. Set `ADMIN_PASSWORD` env var on Vercel
2. Remove `output: "export"` means Vercel auto-detects serverless mode
3. Deploy: `cd site && npx vercel --prod`
4. Verify live site at site-rho-pied.vercel.app

## Post-Deploy Validation

- [ ] Homepage loads, shows 10 post cards
- [ ] Click into each post — content renders, mermaid works
- [ ] `/admin` — password gate works, post list loads
- [ ] Toggle a post unpublished — verify it disappears from public site
- [ ] Toggle it back — verify it reappears
- [ ] RSS feed accessible at /feed.xml
- [ ] Sitemap accessible at /sitemap.xml
- [ ] No console errors
- [ ] Lighthouse: accessibility score > 90

## Rollback Plan

If serverless mode causes issues:
- Revert `output: "export"` in next.config.ts
- Admin functionality degrades (no API routes)
- Published filtering still works at build time
