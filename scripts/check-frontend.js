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

  console.log('\n✨ All frontend acceptance checks passed successfully!\n');
}

checkFrontend().catch((err) => {
  console.error('Unexpected check failure:', err);
  process.exit(1);
});
