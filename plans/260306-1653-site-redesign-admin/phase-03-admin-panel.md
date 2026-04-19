# Phase 3: Admin Panel + Post Publishing Control

**Priority:** High
**Status:** Pending
**Effort:** Large (7 files)

## Architecture Change

Current site uses `output: "export"` (static HTML). To support admin functionality with API routes, switch to standard Next.js on Vercel (serverless functions).

### Key Decisions
- **Remove** `output: "export"` from next.config.ts
- **Add** API routes for post management
- **Add** `/admin` route with password protection via `ADMIN_PASSWORD` env var
- **Add** `published` field to post frontmatter
- **Keep** static generation for public pages (ISR/SSG still works)

## Implementation Steps

### 1. Update Next.js config
**File:** `site/next.config.ts`

- Remove `output: "export"`
- Keep `images: { unoptimized: true }` (or switch to optimized now that we have serverless)

### 2. Add `published` field to post interface
**File:** `site/src/lib/posts.ts`

- Add `published: boolean` to `PostFrontmatter` interface
- Add `getAllPublishedPosts()` — filters to `published: true`
- Keep `getAllPosts()` returning ALL posts (for admin use)
- Update `getAdjacentPosts()` to only navigate between published posts

### 3. Create admin API routes
**File:** `site/src/app/api/admin/posts/route.ts`

- `GET /api/admin/posts` — returns all posts with published status
- Password check via `Authorization` header vs `ADMIN_PASSWORD` env var

**File:** `site/src/app/api/admin/posts/[slug]/route.ts`

- `PATCH /api/admin/posts/[slug]` — toggle published field
- Reads post.md, updates frontmatter, writes back
- Password check same as above

### 4. Create admin page
**File:** `site/src/app/admin/page.tsx`

- Password gate (simple form → stores in sessionStorage)
- Post list table: number, title, published toggle, word count, date
- Bulk actions: "Publish first 10" / "Unpublish all"
- Visual indicators: green dot = published, gray = draft
- Search/filter by title
- "Deploy" button hint (link to Vercel dashboard or trigger)

### 5. Update public pages to use published filter
**File:** `site/src/app/page.tsx` — use `getAllPublishedPosts()`
**File:** `site/src/app/schedule/page.tsx` — filter to published only
**File:** `site/src/app/feed.xml/route.ts` — published posts only
**File:** `site/src/app/sitemap.xml/route.ts` — published posts only

### 6. Update frontmatter for all 61 posts
- Posts 1-10: add `published: true`
- Posts 11-61: add `published: false`

### 7. Add ADMIN_PASSWORD to Vercel env
- Set via `vercel env add ADMIN_PASSWORD`
- Also add to `.env.local` for dev

## Admin Page UI Design

```
┌─────────────────────────────────────────────────┐
│  Admin / Post Management           [Logout]     │
├─────────────────────────────────────────────────┤
│  Published: 10/61  │  Draft: 51/61              │
├────┬──────────────────────────┬────────┬────────┤
│ #  │ Title                    │ Status │ Action │
├────┼──────────────────────────┼────────┼────────┤
│ 01 │ 4,500 AI Sessions...     │ ● Live │ [Hide] │
│ 02 │ 3 AI Agents Found...     │ ● Live │ [Hide] │
│ .. │ ...                      │        │        │
│ 11 │ AI Dev Operating System  │ ○ Draft│ [Pub]  │
│ .. │ ...                      │        │        │
└────┴──────────────────────────┴────────┴────────┘
```

## Security
- Admin password via env var (not in source)
- API routes validate password on every request
- No user registration/DB — single admin only
- Admin page not linked from public nav

## Success Criteria
- [ ] `/admin` shows all 61 posts with publish status
- [ ] Toggle publish/unpublish works via API
- [ ] Public site only shows published posts
- [ ] RSS feed only includes published posts
- [ ] Sitemap only includes published posts
- [ ] Admin protected by password
- [ ] Deploy still works on Vercel (non-static mode)
