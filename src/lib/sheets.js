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
 * Scan all sheets/*.md files, extract metadata, validate headers, and return parsed data.
 */
export async function getAllSheets() {
  let fileNames;
  try {
    fileNames = await fs.readdir(SHEETS_DIR);
  } catch (err) {
    throw new Error(`Failed to read sheets directory at ${SHEETS_DIR}: ${err.message}`);
  }

  const mdFiles = fileNames.filter((f) => f.endsWith('.md')).sort();
  const sheets = [];
  const idMap = new Map();

  const repo = process.env.GITHUB_REPOSITORY || 'HarryKepler/codesheet';
  const branch = process.env.GITHUB_REF_NAME || 'main';

  for (const file of mdFiles) {
    const id = path.basename(file, '.md');
    const fullPath = path.join(SHEETS_DIR, file);
    const relPath = path.join('sheets', file);

    if (idMap.has(id)) {
      throw new Error(`Duplicate route ID "${id}" detected for files: ${relPath} and ${idMap.get(id)}`);
    }
    idMap.set(id, relPath);

    const rawContent = await fs.readFile(fullPath, 'utf-8');
    const tokens = lexer(rawContent);

    // 1. Validate Level-1 heading
    const firstH1Index = tokens.findIndex((t) => t.type === 'heading' && t.depth === 1);
    if (firstH1Index === -1) {
      throw new Error(`[${relPath}] File header does not conform to specification: missing level-1 heading ("# <Language> Cheat Sheet")`);
    }
    const h1Token = tokens[firstH1Index];
    const h1Text = h1Token.text.trim();
    if (!h1Text.endsWith(' Cheat Sheet')) {
      throw new Error(`[${relPath}] File header does not conform to specification: level-1 heading must end with " Cheat Sheet", got "${h1Text}"`);
    }
    const name = h1Text.replace(/ Cheat Sheet$/, '').trim();

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
      throw new Error(`[${relPath}] File header does not conform to specification: missing required blockquote "> Written for <version>" after title`);
    }

    const bqToken = tokens[bqIndex];
    const bqRawText = bqToken.text.trim();
    if (!bqRawText.startsWith('Written for ')) {
      throw new Error(`[${relPath}] File header does not conform to specification: blockquote must start with "Written for ", got "${bqRawText}"`);
    }
    const version = bqRawText.replace(/^Written for\s+/, '').trim();

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
export async function renderSheet(sheet) {
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
        return `
          <div class="code-card stdin-card">
            <div class="code-card-header stdin-header">
              <div class="code-card-left">
                <span class="code-stdin-badge">Standard Input (stdin)</span>
              </div>
              <button class="copy-btn" data-code="${escapeAttr(rawCode)}" type="button" aria-label="Copy stdin">
                <span class="copy-label">Copy</span>
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

      return `
        <div class="code-card">
          <div class="code-card-header">
            <div class="code-card-left">
              <span class="code-lang-badge">${escapeHtml(primaryLang)}</span>
              ${flagsHtml}
            </div>
            <button class="copy-btn" data-code="${escapeAttr(rawCode)}" type="button" aria-label="Copy code">
              <span class="copy-label">Copy</span>
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
