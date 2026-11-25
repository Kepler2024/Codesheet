import { getAllSheets } from '../lib/sheets';
import { langPaths, withBase } from '../lib/paths';

// Lists every page for search engines, with its English/Chinese counterpart as
// an hreflang alternate. Google reads this from robots.txt or Search Console.
export async function GET({ site }) {
  const sheets = await getAllSheets();
  const abs = (path) => new URL(withBase(path), site).href;

  const urls = ['/', ...sheets.map((s) => `/${s.id}/`)].flatMap((path) => {
    const { en, zh } = langPaths(path);
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="en" href="${abs(en)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${abs(zh)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(en)}"/>`,
    ].join('\n');
    return [en, zh].map((loc) => `  <url>\n    <loc>${abs(loc)}</loc>\n${alternates}\n  </url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
