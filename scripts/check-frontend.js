#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { getAllSheets } from '../src/lib/sheets.js';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
// Same BASE_PATH the build used: "" for a domain root, "/Codesheet" for a github.io subpath.
const BASE = (process.env.BASE_PATH || '/').replace(/\/+$/, '');

async function checkFrontend() {
  console.log('🔍 Running Frontend Acceptance Checks on dist/ ...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Error: dist/ directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Error: dist/index.html is missing.');
    process.exit(1);
  }
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  const sheets = await getAllSheets();
  console.log(`📋 Found ${sheets.length} sheets in sheets/*.md:`);

  // Check 1: 1:1 mapping between sheets and home page links + generated files
  for (const sheet of sheets) {
    const pageHtmlPath = path.join(DIST_DIR, sheet.id, 'index.html');
    if (!fs.existsSync(pageHtmlPath)) {
      console.error(`❌ Error: Missing generated page for ${sheet.id} at ${pageHtmlPath}`);
      process.exit(1);
    }

    // Verify index page link
    const expectedLink = `${BASE}/${sheet.id}/`;
    if (!indexHtml.includes(`href="${expectedLink}"`)) {
      console.error(`❌ Error: Index page dist/index.html is missing link to ${expectedLink}`);
      process.exit(1);
    }
    // Verify name and version appear on index page
    if (!indexHtml.includes(sheet.name)) {
      console.error(`❌ Error: Index page dist/index.html is missing language name "${sheet.name}"`);
      process.exit(1);
    }

    // Check 2: Content and anchors inside each language page
    const pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');

    // Title and version check
    if (!pageHtml.includes(`${sheet.name} Cheat Sheet`)) {
      console.error(`❌ Error: ${sheet.id} page is missing title "${sheet.name} Cheat Sheet"`);
      process.exit(1);
    }
    if (!pageHtml.includes(sheet.version)) {
      console.error(`❌ Error: ${sheet.id} page is missing version "${sheet.version}"`);
      process.exit(1);
    }

    // Edit link check
    if (!pageHtml.includes(sheet.editUrl)) {
      console.error(`❌ Error: ${sheet.id} page is missing edit link "${sheet.editUrl}"`);
      process.exit(1);
    }

    // Headings and TOC anchors check
    for (const h of sheet.headings) {
      const anchorId = `id="${h.slug}"`;
      if (!pageHtml.includes(anchorId)) {
        console.error(`❌ Error: ${sheet.id} page is missing section anchor ${anchorId} for "${h.text}"`);
        process.exit(1);
      }
      const tocLink = `href="#${h.slug}"`;
      if (!pageHtml.includes(tocLink)) {
        console.error(`❌ Error: ${sheet.id} page is missing TOC link ${tocLink} for "${h.text}"`);
        process.exit(1);
      }
    }

    console.log(`  ✓ ${sheet.id}: generated HTML, edit link, and ${sheet.headings.length} section anchors verified`);
  }

  // Check 3: C++ specific checks (verbatim copy text and stdin)
  const cppHtml = fs.readFileSync(path.join(DIST_DIR, 'cpp', 'index.html'), 'utf-8');
  if (!cppHtml.includes('&lt;iostream&gt;') && !cppHtml.includes('<iostream>')) {
    console.error('❌ Error: cpp/index.html does not contain #include <iostream>');
    process.exit(1);
  }
  if (!cppHtml.includes('Standard Input (stdin)')) {
    console.error('❌ Error: cpp/index.html missing stdin sample input label');
    process.exit(1);
  }
  console.log('  ✓ C++ verbatim code and standard input verified');

  // Check 4: Rust specific checks (Ownership and Borrowing)
  const rustHtml = fs.readFileSync(path.join(DIST_DIR, 'rust', 'index.html'), 'utf-8');
  if (!rustHtml.includes('id="ownership-and-borrowing"')) {
    console.error('❌ Error: rust/index.html missing section "Ownership and Borrowing"');
    process.exit(1);
  }
  if (!rustHtml.includes('href="#ownership-and-borrowing"')) {
    console.error('❌ Error: rust/index.html missing TOC anchor for "Ownership and Borrowing"');
    process.exit(1);
  }
  console.log('  ✓ Rust Ownership and Borrowing section and TOC anchor verified');

  // Check 5: Chinese routes (/zh/ and /zh/<id>/) verification
  console.log('\n🇨🇳 Verifying Simplified Chinese routes (/zh/ and /zh/<id>/)...');
  const zhIndexHtmlPath = path.join(DIST_DIR, 'zh', 'index.html');
  if (!fs.existsSync(zhIndexHtmlPath)) {
    console.error('❌ Error: dist/zh/index.html is missing.');
    process.exit(1);
  }
  const zhIndexHtml = fs.readFileSync(zhIndexHtmlPath, 'utf-8');

  const zhSheets = await getAllSheets('zh');
  console.log(`📋 Found ${zhSheets.length} Chinese sheets:`);

  for (const sheet of zhSheets) {
    const zhPageHtmlPath = path.join(DIST_DIR, 'zh', sheet.id, 'index.html');
    if (!fs.existsSync(zhPageHtmlPath)) {
      console.error(`❌ Error: Missing generated Chinese page for ${sheet.id} at ${zhPageHtmlPath}`);
      process.exit(1);
    }

    // Verify index page link
    const expectedLink = `${BASE}/zh/${sheet.id}/`;
    if (!zhIndexHtml.includes(`href="${expectedLink}"`)) {
      console.error(`❌ Error: Chinese index page is missing link to ${expectedLink}`);
      process.exit(1);
    }

    const zhPageHtml = fs.readFileSync(zhPageHtmlPath, 'utf-8');

    // Title check
    const expectedTitle = `${sheet.name} 速查表`;
    if (!zhPageHtml.includes(expectedTitle)) {
      console.error(`❌ Error: ${sheet.id} Chinese page is missing title "${expectedTitle}"`);
      process.exit(1);
    }

    // Headings and TOC anchors check
    for (const h of sheet.headings) {
      const anchorId = `id="${h.slug}"`;
      if (!zhPageHtml.includes(anchorId)) {
        console.error(`❌ Error: ${sheet.id} Chinese page is missing section anchor ${anchorId} for "${h.text}"`);
        process.exit(1);
      }
      const tocLink = `href="#${h.slug}"`;
      if (!zhPageHtml.includes(tocLink)) {
        console.error(`❌ Error: ${sheet.id} Chinese page is missing TOC link ${tocLink} for "${h.text}"`);
        process.exit(1);
      }
    }

    console.log(`  ✓ zh/${sheet.id}: generated HTML, title "${expectedTitle}", and ${sheet.headings.length} section anchors verified`);
  }

  // Check 6: Chinese specific UI components and labels
  const zhCppHtml = fs.readFileSync(path.join(DIST_DIR, 'zh', 'cpp', 'index.html'), 'utf-8');
  if (!zhCppHtml.includes('标准输入 (stdin)')) {
    console.error('❌ Error: zh/cpp/index.html missing Chinese stdin label "标准输入 (stdin)"');
    process.exit(1);
  }
  if (!zhCppHtml.includes('本页目录')) {
    console.error('❌ Error: zh/cpp/index.html missing Chinese TOC label "本页目录"');
    process.exit(1);
  }
  if (!zhCppHtml.includes('所有语言')) {
    console.error('❌ Error: zh/cpp/index.html missing Chinese back link label "所有语言"');
    process.exit(1);
  }
  console.log('  ✓ Chinese UI labels ("标准输入 (stdin)", "本页目录", "所有语言") verified');

  // Check 7: under a subpath, every root-relative link and asset must start with the base,
  // or it points outside the site (e.g. kepler2024.github.io/cpp/ instead of .../Codesheet/cpp/).
  if (BASE) {
    const htmlFiles = fs.readdirSync(DIST_DIR, { recursive: true }).filter((f) => f.endsWith('.html'));
    let count = 0;
    for (const file of htmlFiles) {
      const html = fs.readFileSync(path.join(DIST_DIR, file), 'utf-8');
      for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        if (!url.startsWith(`${BASE}/`)) {
          console.error(`❌ Error: dist/${file} links to "${url}", which is outside the base path "${BASE}/"`);
          process.exit(1);
        }
        count++;
      }
    }
    console.log(`  ✓ ${count} internal links and assets in ${htmlFiles.length} pages stay under "${BASE}/"`);
  }

  // Check 8: icons and link-preview tags. Chat apps only fetch absolute og:image URLs,
  // so every page needs one that resolves to an image in this build.
  console.log('\n🔗 Verifying icons and link previews...');
  for (const icon of ['favicon.ico', 'logo.svg', 'apple-touch-icon.png']) {
    if (!fs.existsSync(path.join(DIST_DIR, icon))) {
      console.error(`❌ Error: dist/${icon} is missing`);
      process.exit(1);
    }
  }
  const allPages = fs.readdirSync(DIST_DIR, { recursive: true }).filter((f) => f.endsWith('.html'));
  const meta = (html, key) => html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`))?.[1];
  for (const file of allPages) {
    const html = fs.readFileSync(path.join(DIST_DIR, file), 'utf-8');
    for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card']) {
      if (!meta(html, key)) {
        console.error(`❌ Error: dist/${file} is missing <meta ${key}>`);
        process.exit(1);
      }
    }
    const image = new URL(meta(html, 'og:image'));
    if (image.protocol !== 'https:' && image.protocol !== 'http:') {
      console.error(`❌ Error: dist/${file} og:image "${image.href}" is not an absolute URL`);
      process.exit(1);
    }
    const imageFile = image.pathname.slice(BASE.length + 1);
    if (!image.pathname.startsWith(`${BASE}/`) || !fs.existsSync(path.join(DIST_DIR, imageFile))) {
      console.error(`❌ Error: dist/${file} og:image "${image.href}" does not match a file in dist/`);
      process.exit(1);
    }
  }
  console.log(`  ✓ Icons present; ${allPages.length} pages have Open Graph tags with an og:image in dist/`);

  // Check 9: search engines. Every page declares itself canonical and names both language
  // versions; the sitemap lists exactly the generated pages; robots.txt points to the sitemap.
  console.log('\n🔎 Verifying canonical URLs, hreflang, sitemap and robots.txt...');
  const pageUrlFor = (file) => {
    const dir = path.dirname(file);
    return dir === '.' ? `${BASE}/` : `${BASE}/${dir.split(path.sep).join('/')}/`;
  };
  const toDistPage = (url) => {
    const { pathname } = new URL(url);
    if (!pathname.startsWith(`${BASE}/`)) return null;
    return path.join(pathname.slice(BASE.length + 1), 'index.html');
  };
  const linkHref = (html, attrs) => html.match(new RegExp(`<link ${attrs} href="([^"]*)"`))?.[1];
  for (const file of allPages) {
    const html = fs.readFileSync(path.join(DIST_DIR, file), 'utf-8');
    const canonical = linkHref(html, 'rel="canonical"');
    if (!canonical || new URL(canonical).pathname !== pageUrlFor(file) || canonical !== meta(html, 'og:url')) {
      console.error(`❌ Error: dist/${file} canonical "${canonical}" should be this page's URL and match og:url`);
      process.exit(1);
    }
    for (const lang of ['en', 'zh-CN', 'x-default']) {
      const href = linkHref(html, `rel="alternate" hreflang="${lang}"`);
      const target = href && toDistPage(href);
      if (!target || !fs.existsSync(path.join(DIST_DIR, target))) {
        console.error(`❌ Error: dist/${file} hreflang="${lang}" "${href}" does not match a page in dist/`);
        process.exit(1);
      }
    }
  }

  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ Error: dist/sitemap.xml is missing');
    process.exit(1);
  }
  const listed = [...fs.readFileSync(sitemapPath, 'utf-8').matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, url]) => url);
  const listedPages = new Set(listed.map(toDistPage));
  const generated = new Set(allPages);
  for (const url of listed) {
    if (!generated.has(toDistPage(url))) {
      console.error(`❌ Error: dist/sitemap.xml lists ${url}, which has no page in dist/`);
      process.exit(1);
    }
  }
  for (const file of generated) {
    if (!listedPages.has(file)) {
      console.error(`❌ Error: dist/sitemap.xml does not list dist/${file}`);
      process.exit(1);
    }
  }
  if (listed.length !== listedPages.size) {
    console.error('❌ Error: dist/sitemap.xml lists a page more than once');
    process.exit(1);
  }

  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  const sitemapLine = fs.existsSync(robotsPath) && fs.readFileSync(robotsPath, 'utf-8').match(/^Sitemap: (\S+)$/m)?.[1];
  if (!sitemapLine || new URL(sitemapLine).pathname !== `${BASE}/sitemap.xml`) {
    console.error(`❌ Error: dist/robots.txt must contain "Sitemap: <absolute URL of ${BASE}/sitemap.xml>"`);
    process.exit(1);
  }
  console.log(`  ✓ ${allPages.length} pages have canonical and hreflang links; sitemap lists all ${listed.length}; robots.txt points to it`);

  console.log('\n✨ All frontend acceptance checks passed successfully!\n');
}

checkFrontend().catch((err) => {
  console.error('Unexpected check failure:', err);
  process.exit(1);
});
