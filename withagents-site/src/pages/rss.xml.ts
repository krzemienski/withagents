import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const siteBase = (site ?? new URL('https://withagents.dev')).toString().replace(/\/$/, '');
  const posts = await getCollection('posts');

  const items = posts
    .slice()
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((p) => {
      const url = `${siteBase}/writing/${p.data.slug}`;
      const pubDate = new Date(p.data.date).toUTCString();
      const excerpt = p.data.excerpt ?? p.data.subtitle ?? '';
      return `    <item>
      <title><![CDATA[${p.data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WithAgents — Writing</title>
    <link>${siteBase}/writing</link>
    <atom:link href="${siteBase}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Essays and technical notes on building reliable, agentic systems in production environments.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
