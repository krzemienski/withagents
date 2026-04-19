# Routing Fix Report — US-002 + US-003

**Date:** 2026-04-19  
**Plan:** Phase 09 routing gap fix  
**Agent:** fullstack-developer (aadf0abbf4687e8cf)

---

## (a) Union Type Added

Discriminated union in `[slug].astro`:

```ts
interface SeedArticle {
  source: 'seed';
  slug: string; kind: string; title: string; subtitle: string;
  date: string; dateISO: string; readTime: string;
  body: string[]; pullQuote: string;
  codeSnippet?: string; codeLabel?: string;
}

interface CollectionArticle {
  source: 'collection';
  slug: string; kind: string; title: string; subtitle: string;
  date: string; dateISO: string; readTime: string;
  entry: CollectionEntry<'posts'>;
}

type Article = SeedArticle | CollectionArticle;
```

Dedup logic: `Map<string, Article>` keyed on slug — seeds loaded first, collection entries overwrite on collision (collection wins). Rendered via `render(entry).Content` (Astro v6 Content Layer API — `entry.render()` does not exist in this version).

`index.astro` uses a parallel `ListArticle` interface with the same Map-based dedup, sorted descending by `dateISO`.

---

## (b) Files Modified

### `src/pages/writing/[slug].astro`
- Added `render` to `astro:content` imports
- Replaced hardcoded `articles` array + old `getStaticPaths` with:
  - `SeedArticle` / `CollectionArticle` / `Article` discriminated union
  - `getStaticPaths` fully self-contained (seeds inlined — required by Astro's isolated chunk extraction)
  - `Map`-based dedup with collection-wins rule
  - Template branch: seed path renders `body[]` paragraphs + pull quote + code block; collection path renders `<Content />` from `render(entry)`
  - `RELATED_SEEDS` array for "Continue reading" sidebar (component scope only)

### `src/pages/writing/index.astro`
- Added `getCollection` import
- Replaced static 5-item array with `Map`-based union of seeds + collection entries
- Added `dateISO` field for sort key; sorted descending by date
- Added `name="email"` attribute to subscription form input (also satisfies work/index regression check)
- `kind` enum normalized to display labels (`field-note` → `Field Note`, `production-analysis` → `Production Analysis`)

---

## (c) Verification Command Outputs

| Check | Command | Result |
|-------|---------|--------|
| Route count ≥45 | `find dist/client/writing -type d -mindepth 1 -maxdepth 1 \| wc -l` | **52** |
| day-01 file size >1KB | `ls -la dist/client/writing/day-01-validationforge-ga/index.html` | **25,626 bytes** |
| Index href count ≥45 | `grep -o 'href="/writing/' index.html \| wc -l` | **52** (grep -c returns 2 because minified HTML is 1 line; -o gives correct count) |
| "Eighteen generations" in day-10 | `grep "Eighteen generations" day-10-ccb-evolution/index.html` | **MATCH** (in `<title>` and excerpt) |
| Seed regression: agent-workflows | `grep "Agent workflows should read like" agent-workflows-operating-systems/index.html` | **MATCH** |
| ValidationForge GA title in index | `grep -o "ValidationForge goes GA[^<]*" writing/index.html` | **MATCH** |
| work/index regression | `grep 'name="email"' dist/client/work/index.html` | **MATCH** |

---

## (d) Slug Collisions (seed overridden by collection)

One seed slug exists in the collection:

| Slug | Seed title | Collection title | Winner |
|------|-----------|-----------------|--------|
| `agent-workflows-operating-systems` | "Agent workflows should read like operating systems, not demos." | "Agent workflows should read like operating systems, not demos" | **Collection** |

The collection version renders via MDX (`<Content />`), uses the collection's subtitle ("What 23,479 sessions taught about the gap between impressive and dependable"), date `2026-04-19`, and `8 min read`. The seed's `body[]` paragraphs are discarded for this slug, per spec.

---

## Known Issues / Gotchas

- **Astro v6 `getStaticPaths` isolation:** Any variable or function defined in the Astro frontmatter is NOT accessible inside `getStaticPaths` — Astro extracts it into a separate module chunk at build time. All data must be inlined inside the function body. This is undocumented but confirmed by build errors on two prior attempts.
- **`entry.render()` removed in Astro v6 Content Layer API:** Use `import { render } from 'astro:content'` and call `render(entry)` instead.
- **`grep -c` vs `grep -o` for minified HTML:** Minified single-line HTML means `-c` returns 1 or 2 (line count), not occurrence count. Use `-o | wc -l` for accurate counts.

---

## Status: DONE
