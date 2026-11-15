import { realpathSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Markdown fences → RefineUI CodeBlock.
 *
 * Each ```lang fence in an .mdx file becomes `<DocsCode code lang tokens />`
 * (see src/components/docs-code/DocsCode.astro). Highlighting runs here at
 * build time with Shiki (Night Owl light/dark as CSS variables), so the page
 * ships static colored lines; only the copy button hydrates.
 */

const COMPONENT_NAME = '__RefineDocsCode';
const COMPONENT_PATH = fileURLToPath(new URL('../components/docs-code/DocsCode.astro', import.meta.url));
const THEMES = { light: 'night-owl-light', dark: 'night-owl' };
const LANGS = ['bash', 'shellscript', 'css', 'html', 'json', 'jsonc', 'yaml', 'tsx', 'ts', 'typescript', 'jsx', 'js', 'javascript', 'mdx', 'md', 'diff'];
const LANG_ALIASES = { sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash', yml: 'yaml', plaintext: 'text', txt: 'text' };

/** Shiki ships with Astro; resolve it next to Astro's real install (bun isolated node_modules). */
async function loadShiki() {
  const require = createRequire(import.meta.url);
  const astroPkg = realpathSync(require.resolve('astro/package.json'));
  const shikiEntry = path.join(path.dirname(astroPkg), '..', 'shiki', 'dist', 'index.mjs');
  return import(/* @vite-ignore */ pathToFileURL(shikiEntry).href);
}

/**
 * Loaded eagerly at config time: Astro evaluates astro.config (and this file)
 * through a short-lived Vite module runner, so a lazy import() from inside the
 * remark transform would run after that runner has closed.
 */
const { createHighlighter } = await loadShiki();
const highlighter = await createHighlighter({ themes: Object.values(THEMES), langs: LANGS });

function normalizeLang(lang, highlighter) {
  const raw = (lang ?? '').trim().toLowerCase();
  const name = LANG_ALIASES[raw] ?? raw;
  if (!name || name === 'text') return 'text';
  return highlighter.getLoadedLanguages().includes(name) ? name : 'text';
}

/**
 * Compact token payload: lines → [content, lightColor, darkColor, fontStyle][]
 * fontStyle bit flags follow Shiki (1 italic, 2 bold, 4 underline).
 */
function tokenize(highlighter, code, lang) {
  if (lang === 'text') return code.split('\n').map((line) => (line ? [[line]] : []));
  const { tokens } = highlighter.codeToTokens(code, { lang, themes: THEMES, defaultColor: false });
  return tokens.map((line) =>
    line.map((token) => {
      const style = token.htmlStyle ?? {};
      const entry = [token.content, style['--shiki-light'] ?? '', style['--shiki-dark'] ?? ''];
      const fontStyle = token.fontStyle ?? 0;
      if (fontStyle > 0) entry.push(fontStyle);
      return entry;
    }),
  );
}

function importNode() {
  const source = JSON.stringify(COMPONENT_PATH);
  return {
    type: 'mdxjsEsm',
    value: `import ${COMPONENT_NAME} from ${source};`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [{ type: 'ImportDefaultSpecifier', local: { type: 'Identifier', name: COMPONENT_NAME } }],
            source: { type: 'Literal', value: COMPONENT_PATH, raw: source },
            attributes: [],
          },
        ],
      },
    },
  };
}

function attr(name, value) {
  return { type: 'mdxJsxAttribute', name, value };
}

function collectCodeNodes(node, parent, out) {
  if (node.type === 'code' && parent) out.push({ node, parent });
  if (Array.isArray(node.children)) for (const child of node.children) collectCodeNodes(child, node, out);
}

export function remarkDocsCode() {
  return async (tree, file) => {
    const filePath = file.path ?? file.history?.[0] ?? '';
    if (!filePath.endsWith('.mdx')) return;

    const found = [];
    collectCodeNodes(tree, null, found);
    if (found.length === 0) return;

    for (const { node, parent } of found) {
      const lang = normalizeLang(node.lang, highlighter);
      const code = node.value ?? '';
      const replacement = {
        type: 'mdxJsxFlowElement',
        name: COMPONENT_NAME,
        attributes: [
          attr('code', code),
          attr('lang', lang),
          attr('tokens', JSON.stringify(tokenize(highlighter, code, lang))),
          ...(/(^|\s)wrap(\s|$)/.test(node.meta ?? '') ? [attr('wrap', 'true')] : []),
        ],
        children: [],
        position: node.position,
      };
      const index = parent.children.indexOf(node);
      parent.children.splice(index, 1, replacement);
    }

    tree.children.unshift(importNode());
  };
}
