# WithAgents OG Image Template — Phase 09 Integration Guide

Satori-compatible React/JSX template for `withagents.dev` Open Graph images.
Output: 1200×630 PNG via `@vercel/og` on Vercel Edge.

---

## Files in this directory

```
og-template/
├── og-template.tsx              # React/JSX template (Satori-compatible)
├── font-subsets/
│   ├── SpaceGrotesk-Bold-subset.ttf    (32 KB — display headlines)
│   ├── Inter-Regular-subset.ttf        (32 KB — body text)
│   ├── Inter-Medium-subset.ttf         (33 KB — body emphasis)
│   ├── IBMPlexMono-Regular-subset.ttf  (12 KB — mono tags)
│   └── glyphs.txt                      (glyph inventory for re-subsetting)
├── bundle-size.txt              # Measured bundle estimate (165 KB / 1024 KB)
├── preview/
│   ├── preview-home.html
│   ├── preview-product-runbooks.html
│   ├── preview-writing.html
│   ├── preview-opensource.html
│   └── preview-about.html
└── README.md                    (this file)
```

---

## 1. Drop-in location in Astro

Create an Edge API route at `src/pages/og.png.ts`:

```ts
// src/pages/og.png.ts
import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import OGTemplate from "../components/og/og-template";

// Required for Vercel Edge runtime
export const config = { runtime: "edge" };

export const GET: APIRoute = async ({ url }) => {
  const title    = url.searchParams.get("title")    ?? "WithAgents";
  const subtitle = url.searchParams.get("subtitle") ?? undefined;
  const kind     = (url.searchParams.get("kind")    ?? "home") as any;
  const tag      = url.searchParams.get("tag")      ?? undefined;
  const byline   = url.searchParams.get("byline")   ?? undefined;

  // Load subsetted fonts
  const [sgBold, interRegular, interMedium, ibmMono] = await Promise.all([
    fetch(new URL("../../og-fonts/SpaceGrotesk-Bold-subset.ttf", import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL("../../og-fonts/Inter-Regular-subset.ttf",     import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL("../../og-fonts/Inter-Medium-subset.ttf",      import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL("../../og-fonts/IBMPlexMono-Regular-subset.ttf", import.meta.url)).then(r => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    OGTemplate({ title, subtitle, kind, tag, byline }),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Space Grotesk", data: sgBold,       weight: 700, style: "normal" },
        { name: "Inter",         data: interRegular, weight: 400, style: "normal" },
        { name: "Inter",         data: interMedium,  weight: 500, style: "normal" },
        { name: "IBM Plex Mono", data: ibmMono,      weight: 400, style: "normal" },
      ],
    }
  );
};
```

### Font file placement

Copy the subsetted fonts to a location accessible by the Edge function. Two options:

**Option A — Public static assets (simplest):**
```
public/og-fonts/SpaceGrotesk-Bold-subset.ttf
public/og-fonts/Inter-Regular-subset.ttf
public/og-fonts/Inter-Medium-subset.ttf
public/og-fonts/IBMPlexMono-Regular-subset.ttf
```
Then fetch from the CDN URL (e.g. `https://withagents.dev/og-fonts/SpaceGrotesk-Bold-subset.ttf`).

**Option B — Relative import via URL (Edge-safe):**
```
src/og-fonts/SpaceGrotesk-Bold-subset.ttf
```
Use `new URL("../../og-fonts/SpaceGrotesk-Bold-subset.ttf", import.meta.url)` as shown above.

**Option C — Inline as base64 data URIs (smallest fetch cost, but larger JS bundle):**
```ts
import sgBoldB64 from "./fonts/SpaceGrotesk-Bold-subset.ttf?base64";
const sgBold = Buffer.from(sgBoldB64, "base64").buffer;
```
Only use if your Vite config supports the `?base64` asset query.

---

## 2. Required runtime declaration

Every Edge route in Astro + Vercel must export:

```ts
export const config = { runtime: "edge" };
```

Without this, Vercel deploys the function as a Node.js serverless function which does
not support `@vercel/og`. The 1MB bundle limit applies only to Edge functions.

---

## 3. Passing props via query params

```
/og.png?title=Runbooks&subtitle=Opinionated+workflows&kind=product&tag=PRODUCT
/og.png?title=Agent+workflows+should+read+like...&kind=writing&byline=Nick+Krzemienski&tag=ESSAY
/og.png?title=trace-timeline&subtitle=Chronological+execution+trace+viewer&kind=opensource&tag=OPEN+SOURCE
/og.png?title=About&subtitle=Quiet+collaboration+on+applied+systems&kind=about
```

### Usage in Astro page frontmatter

```astro
---
const ogUrl = new URL("/og.png", Astro.site);
ogUrl.searchParams.set("title", post.title);
ogUrl.searchParams.set("kind", "writing");
ogUrl.searchParams.set("byline", "Nick Krzemienski");
ogUrl.searchParams.set("tag", "ESSAY");
if (post.subtitle) ogUrl.searchParams.set("subtitle", post.subtitle);
---
<meta property="og:image" content={ogUrl.toString()} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={ogUrl.toString()} />
```

---

## 4. Install dependency

```bash
pnpm add @vercel/og
# or
npm install @vercel/og
```

`@vercel/og` includes Satori internally. Do not install `satori` separately — version
mismatches cause subtle layout breakage.

---

## 5. Bundle size verification

From the `og-template/` directory:

```bash
# Per-file sizes
du -sh font-subsets/*.ttf og-template.tsx

# Total font bytes
find font-subsets -name "*.ttf" -exec wc -c {} + | tail -1

# Quick estimate (fonts + template, excluding runtime overhead)
python3 -c "
import os, glob
files = glob.glob('font-subsets/*.ttf') + ['og-template.tsx']
total = sum(os.path.getsize(f) for f in files)
print(f'Font + template: {total/1024:.1f} KB')
print(f'+ ~50 KB Satori runtime = ~{(total + 51200)/1024:.1f} KB total')
print(f'Budget remaining: {(1024*1024 - total - 51200)/1024:.0f} KB of 1024 KB')
"
```

Current estimate: **165 KB / 1024 KB** (16% of budget used).

---

## 6. Fallback strategy if bundle exceeds 1MB

Drop fonts in this priority order (each saves budget):

| Drop | Saves | Fallback |
|------|-------|----------|
| `IBMPlexMono-Regular-subset.ttf` | 12 KB | Tag chip: `"Courier New", monospace` |
| `Inter-Medium-subset.ttf` | 33 KB | Use Inter-Regular with `fontWeight: 600` |
| `Inter-Regular-subset.ttf` | 32 KB | `"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"` |
| `SpaceGrotesk-Bold-subset.ttf` | 32 KB | Same system stack; never drop this one if possible |

---

## 7. Re-subsetting fonts

If you need additional Unicode ranges (e.g. accented characters for localisation):

```bash
# Edit glyphs.txt to add characters, then re-run:
pyftsubset SpaceGrotesk-Bold.ttf \
  --output-file=font-subsets/SpaceGrotesk-Bold-subset.ttf \
  --text-file=font-subsets/glyphs.txt \
  --no-hinting \
  --desubroutinize

pyftsubset Inter-Regular.ttf \
  --output-file=font-subsets/Inter-Regular-subset.ttf \
  --text-file=font-subsets/glyphs.txt \
  --no-hinting \
  --desubroutinize

pyftsubset Inter-Medium.ttf \
  --output-file=font-subsets/Inter-Medium-subset.ttf \
  --text-file=font-subsets/glyphs.txt \
  --no-hinting \
  --desubroutinize

pyftsubset IBMPlexMono-Regular.ttf \
  --output-file=font-subsets/IBMPlexMono-Regular-subset.ttf \
  --text-file=font-subsets/glyphs.txt \
  --no-hinting \
  --desubroutinize
```

Install pyftsubset: `pip install fonttools` (or `pip3 install fonttools`).

---

## 8. Satori CSS constraints

The template uses only Satori-supported properties. Do NOT add these when editing:

| Not supported | Use instead |
|---------------|-------------|
| CSS Grid | Nested flex containers |
| `text-overflow: ellipsis` | `maxWidth` + `wordBreak: "break-word"` |
| `calc()` | Hardcoded pixel values |
| `::before`, `::after` | Explicit child `<div>` elements |
| `position: absolute` | Supported only inside `position: relative` parent |
| `transform` | Not supported |
| `clip-path` | Not supported |
| `box-shadow` | Not supported |
| `text-shadow` | Not supported |
| `background-image` | Not supported (use `background` solid only) |

---

## 9. Theme swapping (Ultraviolet is default)

To swap the accent theme, change these 3 values in `og-template.tsx`:

```ts
// Ultraviolet (default — §5)
accent:     "#8B5CF6"
accentAlt:  "#C084FC"
accentWash: "rgba(139,92,246,0.12)"

// Magenta
accent:     "#A855F7"
accentAlt:  "#F472B6"
accentWash: "rgba(168,85,247,0.16)"

// Lime Signal
accent:     "#7C3AED"
accentAlt:  "#A3E635"
accentWash: "rgba(124,58,237,0.12)"

// Orchid
accent:     "#9333EA"
accentAlt:  "#DDD6FE"
accentWash: "rgba(147,51,234,0.10)"

// Plasma
accent:     "#9333EA"
accentAlt:  "#EC4899"
accentWash: "rgba(147,51,234,0.13)"

// Mono Hyper
accent:     "#7C3AED"
accentAlt:  "#D4D4D8"
accentWash: "rgba(124,58,237,0.09)"
```

Base surfaces (`#040404`, `#0A0A0D`, border, text) never change per BRIEF §4.
