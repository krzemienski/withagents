export const prerender = false;
export const config = { runtime: 'edge' };

import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';
import OGTemplate from '@/lib/og-template';
import type { OGKind } from '@/lib/og-template';
import {
  SPACE_GROTESK_BOLD,
  INTER_REGULAR,
  INTER_MEDIUM,
  IBM_PLEX_MONO,
} from '@/lib/og-fonts';

export const GET: APIRoute = async ({ url }) => {
  const { searchParams } = url;
  const title    = searchParams.get('title')    ?? 'WithAgents';
  const subtitle = searchParams.get('subtitle') ?? undefined;
  const kind     = (searchParams.get('kind')    ?? 'home') as OGKind;
  const tag      = searchParams.get('tag')      ?? undefined;
  const byline   = searchParams.get('byline')   ?? undefined;

  return new ImageResponse(
    OGTemplate({ title, subtitle, kind, tag, byline }),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Space Grotesk', data: SPACE_GROTESK_BOLD, weight: 700, style: 'normal' },
        { name: 'Inter',         data: INTER_REGULAR,      weight: 400, style: 'normal' },
        { name: 'Inter',         data: INTER_MEDIUM,       weight: 500, style: 'normal' },
        { name: 'IBM Plex Mono', data: IBM_PLEX_MONO,      weight: 400, style: 'normal' },
      ],
    }
  );
};
