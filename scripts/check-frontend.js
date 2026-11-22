#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { getAllSheets } from '../src/lib/sheets.js';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

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
    const expectedLink = `/${sheet.id}/`;
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
    const expectedLink = `/zh/${sheet.id}/`;
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

  console.log('\n✨ All frontend acceptance checks passed successfully!\n');
}

checkFrontend().catch((err) => {
  console.error('Unexpected check failure:', err);
  process.exit(1);
});
