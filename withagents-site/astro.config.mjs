import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

const keystaticEnabled =
  process.env.KEYSTATIC_ENABLED === 'true' || process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: 'https://withagents.dev',
  output: 'static',
  adapter: vercel({ imageService: true, webAnalytics: { enabled: false } }),
  integrations: [mdx(), sitemap(), react(), ...(keystaticEnabled ? [keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
