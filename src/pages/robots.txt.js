import { withBase } from '../lib/paths';

// Allow all crawlers and point them at the sitemap (an absolute URL, as robots.txt requires).
export function GET({ site }) {
  const sitemap = new URL(withBase('/sitemap.xml'), site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
