export const prerender = false;
export const config = { runtime: 'edge' };

import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';
import OGTemplate from '@/lib/og-template';
import type { OGKind } from '@/lib/og-template';

// Font fetch is hoisted so it runs once at Edge cold-start, not per request.
// Using absolute public URLs so Vercel Edge can resolve them at runtime.
const fontPromises = [
  fetch(new URL('/fonts/SpaceGrotesk-Bold-subset.ttf', 'https://withagents.dev')).then(r => r.arrayBuffer()),
  fetch(new URL('/fonts/Inter-Regular-subset.ttf', 'https://withagents.dev')).then(r => r.arrayBuffer()),
  fetch(new URL('/fonts/Inter-Medium-subset.ttf', 'https://withagents.dev')).then(r => r.arrayBuffer()),
  fetch(new URL('/fonts/IBMPlexMono-Regular-subset.ttf', 'https://withagents.dev')).then(r => r.arrayBuffer()),
];

export const GET: APIRoute = async ({ url }) => {
  const { searchParams } = url;
  const title    = searchParams.get('title')    ?? 'WithAgents';
  const subtitle = searchParams.get('subtitle') ?? undefined;
  const kind     = (searchParams.get('kind')    ?? 'home') as OGKind;
  const tag      = searchParams.get('tag')      ?? undefined;
  const byline   = searchParams.get('byline')   ?? undefined;

  const [sgBold, interRegular, interMedium, ibmMono] = await Promise.all(fontPromises);

  return new ImageResponse(
    OGTemplate({ title, subtitle, kind, tag, byline }),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Space Grotesk', data: sgBold,       weight: 700, style: 'normal' },
        { name: 'Inter',         data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter',         data: interMedium,  weight: 500, style: 'normal' },
        { name: 'IBM Plex Mono', data: ibmMono,      weight: 400, style: 'normal' },
      ],
    }
  );
};
