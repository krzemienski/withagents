import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://withagents.dev',
  output: 'static', // static pages + Edge OG (hybrid merged into static in Astro v5)
  adapter: vercel({ imageService: true, webAnalytics: { enabled: false } }), // Plausible replaces Vercel analytics
  integrations: [mdx(), sitemap(), react(), keystatic()],
  vite: { plugins: [tailwindcss()] },
});
