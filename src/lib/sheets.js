import fs from 'node:fs/promises';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import { createHighlighter } from 'shiki';
import { Marked, lexer } from 'marked';

const SHEETS_DIR = path.resolve(process.cwd(), 'sheets');

let highlighterPromise = null;
function getHighlighterInstance() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['light-plus', 'dark-plus'],
      langs: [
        'python',
        'cpp',
        'csharp',
        'go',
        'java',
        'javascript',
        'kotlin',
        'rust',
        'swift',
        'typescript',
        'bash',
        'shellscript',
        'json',
        'yaml',
        'markdown',
      ],
    });
  }
  return highlighterPromise;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/**
 * Scan sheets/*.md (or sheets_zh/*.md) files, extract metadata, validate headers, and return parsed data.
 */
export async function getAllSheets(lang = 'en') {
  const repo = process.env.GITHUB_REPOSITORY || 'Kepler2024/Codesheet';
  const branch = process.env.GITHUB_REF_NAME || 'main';

  // Read all English sheets first to know the canonical list of languages
  let enFiles = [];
  try {
    enFiles = (await fs.readdir(SHEETS_DIR)).filter((f) => f.endsWith('.md')).sort();
  } catch (err) {
    throw new Error(`Failed to read sheets directory at ${SHEETS_DIR}: ${err.message}`);
  }

  const zhDir = path.resolve(process.cwd(), 'sheets_zh');
  let zhFiles = [];
  if (lang === 'zh') {
    try {
      zhFiles = (await fs.readdir(zhDir)).filter((f) => f.endsWith('.md'));
    } catch {
      zhFiles = [];
    }
  }

  const sheets = [];
  for (const file of enFiles) {
    const id = path.basename(file, '.md');
    const isZhAvailable = lang === 'zh' && zhFiles.includes(file);
    const targetDir = isZhAvailable ? zhDir : SHEETS_DIR;
    const fullPath = path.join(targetDir, file);
    const relPath = path.join(path.basename(targetDir), file);

    const rawContent = await fs.readFile(fullPath, 'utf-8');
    const tokens = lexer(rawContent);

    // 1. Validate Level-1 heading
    const firstH1Index = tokens.findIndex((t) => t.type === 'heading' && t.depth === 1);
    if (firstH1Index === -1) {
      throw new Error(`[${relPath}] File header does not conform to specification: missing level-1 heading`);
    }
    const h1Token = tokens[firstH1Index];
    const h1Text = h1Token.text.trim();
    let name = h1Text;
    if (h1Text.endsWith(' Cheat Sheet')) {
      name = h1Text.replace(/ Cheat Sheet$/, '').trim();
    } else if (h1Text.endsWith(' 速查表')) {
      name = h1Text.replace(/ 速查表$/, '').trim();
    }

    // 2. Validate Blockquote immediately following H1 (ignoring spaces/whitespace tokens)
    let bqIndex = -1;
    for (let i = firstH1Index + 1; i < tokens.length; i++) {
      if (tokens[i].type === 'space') continue;
      if (tokens[i].type === 'blockquote') {
        bqIndex = i;
      }
      break;
    }

    if (bqIndex === -1) {
      throw new Error(`[${relPath}] File header does not conform to specification: missing required blockquote after title`);
    }

    const bqToken = tokens[bqIndex];
    const bqRawText = bqToken.text.trim();
    let version = bqRawText;
    if (bqRawText.startsWith('Written for ')) {
      version = bqRawText.replace(/^Written for\s+/, '').trim();
    } else if (bqRawText.startsWith('适用于 ')) {
      version = bqRawText.replace(/^适用于\s+/, '').trim();
    } else if (bqRawText.startsWith('针对 ')) {
      version = bqRawText.replace(/^针对\s+/, '').replace(/\s*编写$/, '').trim();
    }

    // 3. Extract Headings (TOC) for H2 and H3
    const slugger = new GithubSlugger();
    const headings = [];
    for (const token of tokens) {
      if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) {
        const text = token.text.trim();
        const slug = slugger.slug(text);
        headings.push({
          depth: token.depth,
          text,
          slug,
        });
      }
    }

    // 4. Extract Introduction paragraph(s) before first H2
    let firstH2Index = tokens.findIndex((t) => t.type === 'heading' && t.depth === 2);
    if (firstH2Index === -1) firstH2Index = tokens.length;

    const introTokens = [];
    for (let i = bqIndex + 1; i < firstH2Index; i++) {
      const t = tokens[i];
      if (t.type === 'paragraph') {
        introTokens.push(t.text);
      }
    }
    const intro = introTokens.join('\n\n');

    const editUrl = `https://github.com/${repo}/edit/${branch}/${relPath}`;

    sheets.push({
      id,
      name,
      version,
      intro,
      headings,
      relPath,
      editUrl,
      rawContent,
    });
  }

  return sheets;
}

/**
 * Render a single sheet's Markdown into HTML following all frontend rules.
 */
export async function renderSheet(sheet, lang = 'en') {
  const highlighter = await getHighlighterInstance();
  const tokens = lexer(sheet.rawContent);
  const slugger = new GithubSlugger();

  // Find the H1 and blockquote tokens to exclude them from the body (they are in the page hero header)
  const firstH1Index = tokens.findIndex((t) => t.type === 'heading' && t.depth === 1);
  let bqIndex = -1;
  if (firstH1Index !== -1) {
    for (let i = firstH1Index + 1; i < tokens.length; i++) {
      if (tokens[i].type === 'space') continue;
      if (tokens[i].type === 'blockquote') {
        bqIndex = i;
      }
      break;
    }
  }

  // Also locate introductory paragraph(s)
  let firstH2Index = tokens.findIndex((t) => t.type === 'heading' && t.depth === 2);
  if (firstH2Index === -1) firstH2Index = tokens.length;

  // We filter out H1, the Written for blockquote, and intro paragraph(s) from body tokens (displayed in page hero)
  const bodyTokens = tokens.filter((_, idx) => {
    if (idx === firstH1Index || idx === bqIndex) return false;
    if (idx > bqIndex && idx < firstH2Index) {
      if (tokens[idx].type === 'paragraph' || tokens[idx].type === 'space') return false;
    }
    return true;
  });

  // Custom marked renderer for headings and code blocks
  const customRenderer = {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const rawText = token.text.trim();
      const slug = slugger.slug(rawText);

      return `
        <h${token.depth} id="${slug}" class="heading-anchor-group">
          <span class="heading-text">${text}</span>
          <a href="#${slug}" class="heading-anchor" aria-label="Permalink to ${escapeAttr(rawText)}">#</a>
        </h${token.depth}>
      `;
    },

    code(token) {
      const rawCode = token.text;
      const tagStr = (token.lang || '').trim();
      const tags = tagStr.split(/\s+/).filter(Boolean);
      const primaryLang = tags[0] || 'text';
      const isStdin = tags.includes('stdin');
      const isNorun = tags.includes('norun');
      const isNocheck = tags.includes('nocheck');

      if (isStdin) {
        const stdinBadge = lang === 'zh' ? '标准输入 (stdin)' : 'Standard Input (stdin)';
        const copyLabel = lang === 'zh' ? '复制' : 'Copy';
        const ariaLabel = lang === 'zh' ? '复制标准输入' : 'Copy stdin';
        return `
          <div class="code-card stdin-card">
            <div class="code-card-header stdin-header">
              <div class="code-card-left">
                <span class="code-stdin-badge">${stdinBadge}</span>
              </div>
              <button class="copy-btn" data-code="${escapeAttr(rawCode)}" type="button" aria-label="${ariaLabel}">
                <span class="copy-label">${copyLabel}</span>
              </button>
            </div>
            <pre class="stdin-code"><code>${escapeHtml(rawCode)}</code></pre>
          </div>
        `;
      }

      // Syntax highlighting
      let highlightedHtml = '';
      const loadedLangs = highlighter.getLoadedLanguages();
      let canHighlight = loadedLangs.includes(primaryLang);

      if (canHighlight) {
        try {
          highlightedHtml = highlighter.codeToHtml(rawCode, {
            lang: primaryLang,
            themes: {
              light: 'light-plus',
              dark: 'dark-plus',
            },
          });
        } catch {
          canHighlight = false;
        }
      }

      if (!canHighlight) {
        highlightedHtml = `<pre class="shiki plain-code"><code>${escapeHtml(rawCode)}</code></pre>`;
      }

      const flagsHtml = [
        isNorun ? '<span class="code-flag-badge badge-norun">norun</span>' : '',
        isNocheck ? '<span class="code-flag-badge badge-nocheck">nocheck</span>' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const copyLabel = lang === 'zh' ? '复制' : 'Copy';
      const ariaLabel = lang === 'zh' ? '复制代码' : 'Copy code';

      return `
        <div class="code-card">
          <div class="code-card-header">
            <div class="code-card-left">
              <span class="code-lang-badge">${escapeHtml(primaryLang)}</span>
              ${flagsHtml}
            </div>
            <button class="copy-btn" data-code="${escapeAttr(rawCode)}" type="button" aria-label="${ariaLabel}">
              <span class="copy-label">${copyLabel}</span>
            </button>
          </div>
          <div class="code-card-body">
            ${highlightedHtml}
          </div>
        </div>
      `;
    },
  };

  const markedInstance = new Marked();
  markedInstance.use({
    renderer: customRenderer,
    gfm: true,
    breaks: false,
  });

  const html = markedInstance.parser(bodyTokens);
  return html;
}

/**
 * Build a structured, lightweight search index from the sheet's Markdown content.
 */
export function buildSearchIndex(rawContent, headings = [], lang = 'en') {
  const tokens = lexer(rawContent);
  const slugger = new GithubSlugger();
  const items = [];

  let currentH2 = null;
  let currentH3 = null;

  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = token.text.trim();
      const slug = slugger.slug(text);
      if (token.depth === 2) {
        currentH2 = { text, slug };
        currentH3 = null;
        items.push({
          id: slug,
          section: text,
          title: text,
          type: 'heading',
          text: text,
          snippet: text,
        });
      } else if (token.depth === 3) {
        currentH3 = { text, slug };
        items.push({
          id: slug,
          section: currentH2 ? currentH2.text : '',
          title: text,
          type: 'heading',
          text: text,
          snippet: text,
        });
      }
    } else if (token.type === 'code' && token.lang && !token.lang.includes('stdin')) {
      const rawCode = token.text;
      const lines = rawCode.split('\n');
      const targetSlug = currentH3 ? currentH3.slug : (currentH2 ? currentH2.slug : '');
      const sectionName = currentH2 ? currentH2.text : '';

      // 1. Check for CAREFUL / gotcha lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          line.includes('CAREFUL:') ||
          line.includes('注意：') ||
          line.includes('注意:') ||
          line.includes('陷阱：') ||
          line.includes('陷阱:')
        ) {
          const cleanGotcha = line.replace(/^(\/\/|#)\s*/, '').trim();
          let codeContext = '';
          for (let j = i + 1; j < Math.min(lines.length, i + 3); j++) {
            if (lines[j].trim() && !lines[j].startsWith('//') && !lines[j].startsWith('#')) {
              codeContext = lines[j].trim();
              break;
            }
          }
          items.push({
            id: targetSlug,
            section: sectionName,
            title: cleanGotcha,
            type: 'gotcha',
            text: `${cleanGotcha} ${codeContext}`,
            snippet: codeContext ? `${cleanGotcha}\n${codeContext}` : cleanGotcha,
          });
        }
      }

      // 2. Add code snippet entry
      const codeLines = lines.filter((l) => l.trim() && !l.startsWith('//') && !l.startsWith('#'));
      if (codeLines.length > 0) {
        const preview = codeLines.slice(0, 3).join('\n');
        let descComment = '';
        const firstComment = lines.find(
          (l) =>
            (l.startsWith('//') || l.startsWith('#')) &&
            !l.includes('=>') &&
            !l.includes('CAREFUL:') &&
            !l.includes('注意') &&
            !l.includes('陷阱')
        );
        if (firstComment) {
          descComment = firstComment.replace(/^(\/\/|#)\s*/, '').trim();
        }

        items.push({
          id: targetSlug,
          section: sectionName,
          title: descComment || codeLines[0],
          type: 'code',
          text: rawCode,
          snippet: preview,
        });
      }
    }
  }

  return items;
}

