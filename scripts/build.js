#!/usr/bin/env node
/*
 * Build script — pre-renders OG-tagged HTML for each blog post × language.
 *
 * Why this exists: the site is a client-side SPA with hash routing. Scrapers
 * (Discord, Twitter, Slack, FB…) don't execute JS, so they only ever see
 * index.html's generic meta tags when a hash URL is shared. This script
 * writes one static file per (post, lang) at a path URL like
 *   /en/blog/apprentice-intern/index.html
 * with the post-specific <meta og:*> baked in. Scrapers see rich previews;
 * real users load the file, an inline bootstrap hands off to the SPA.
 *
 * Output: dist/  (upload this to GitHub Pages)
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'posts');

const SITE_URL = 'https://www.toastydevblog.xyz';
const LANGS = ['fr', 'en', 'de', 'es'];
const DEFAULT_LANG = 'fr';

const OG_LOCALE = {
  fr: 'fr_FR',
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
};

/* ---------- helpers ---------- */

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: normalized };
  let meta = {};
  try { meta = yaml.load(match[1]) || {}; } catch { /* ignore — body still usable */ }
  return { meta, body: match[2] };
}

function extractFirstImageUrl(body) {
  const m = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (!m) return null;
  const raw = m[1];
  if (/^https?:\/\//i.test(raw)) return raw;
  // Relative URL — resolve against site root
  return SITE_URL + (raw.startsWith('/') ? raw : '/' + raw);
}

function buildPostUrl(lang, alias) {
  return lang === DEFAULT_LANG
    ? `${SITE_URL}/blog/${alias}/`
    : `${SITE_URL}/${lang}/blog/${alias}/`;
}

async function readMarkdownForLang(canonicalSlug, lang) {
  const suffix = lang === DEFAULT_LANG ? '' : `.${lang}`;
  const primary = path.join(POSTS_DIR, `${canonicalSlug}${suffix}.md`);
  try {
    return await fs.readFile(primary, 'utf8');
  } catch {
    // Fallback to the default-language file if translation is missing
    return await fs.readFile(path.join(POSTS_DIR, `${canonicalSlug}.md`), 'utf8');
  }
}

/* ---------- template surgery ---------- */

/* Build the pre-rendered HTML from the shared SPA template by:
 *  - replacing the generic <meta> tags with post-specific ones
 *  - inserting og:image, og:url, og:type=article, canonical + hreflang
 *  - injecting an inline bootstrap that rewrites the URL to the SPA's
 *    hash form before the SPA boots, so routing "just works". */
function buildPostHtml(template, data) {
  const { lang, alias, canonicalSlug, slugsMap, title, description, tags, ogImage } = data;

  const url = buildPostUrl(lang, alias);
  const fullTitle = `${title} — Louis`;

  let html = template;

  // Root element lang
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}">`);

  // <title> and <meta name="description">
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtml(description)}">`
  );

  // Existing OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeHtml(description)}">`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*">/,
    `<meta property="og:type" content="article">`
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`
  );

  // Existing Twitter tags — upgrade card to large image and replace title/description
  html = html.replace(
    /<meta name="twitter:card" content="[^"]*">/,
    `<meta name="twitter:card" content="summary_large_image">`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`
  );

  // Extra OG/SEO tags to inject before </head>. Each hreflang must use
  // the alias for its own language, not the current page's alias.
  const hreflangTags = LANGS.map(l => {
    const langAlias = (slugsMap[canonicalSlug] && slugsMap[canonicalSlug][l]) || canonicalSlug;
    return `  <link rel="alternate" hreflang="${l}" href="${buildPostUrl(l, langAlias)}">`;
  }).join('\n');

  const extras = `
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="article:tag" content="${(tags || []).map(escapeHtml).join(',')}">
  <link rel="canonical" href="${url}">
${hreflangTags}
`;
  html = html.replace('</head>', `${extras}</head>`);

  // Bootstrap script: run before the SPA loads. Rewrites the URL to the
  // hash form the SPA understands, without a redirect/reload.
  const bootstrap = `
<script>
  (function() {
    try {
      var lang = ${JSON.stringify(lang)};
      var alias = ${JSON.stringify(alias)};
      var u = new URL(location.href);
      u.pathname = '/';
      if (lang !== ${JSON.stringify(DEFAULT_LANG)}) u.searchParams.set('lang', lang);
      else u.searchParams.delete('lang');
      u.hash = '#/blog/' + alias;
      history.replaceState(null, '', u.toString());
    } catch (e) { /* no-op — SPA will still try to render home */ }
  })();
</script>
`;
  // Insert right after the opening <head> so it runs before any other script
  html = html.replace(/<head>/, `<head>${bootstrap}`);

  return html;
}

/* ---------- copy util ---------- */

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

async function copyIfExists(src, dest) {
  try { await fs.copyFile(src, dest); } catch { /* skip missing files */ }
}

/* ---------- main ---------- */

async function main() {
  console.log('Cleaning dist/...');
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  console.log('Copying source files...');
  for (const dir of ['css', 'js', 'posts', 'assets']) {
    const src = path.join(ROOT, dir);
    try {
      await fs.access(src);
      await copyDir(src, path.join(DIST, dir));
    } catch { /* skip missing source dir */ }
  }
  for (const file of ['index.html', 'CNAME', 'favicon.ico', 'robots.txt']) {
    await copyIfExists(path.join(ROOT, file), path.join(DIST, file));
  }

  console.log('Loading post index + slug map...');
  const postIndex = JSON.parse(await fs.readFile(path.join(POSTS_DIR, 'index.json'), 'utf8'));
  let slugsMap = {};
  try {
    slugsMap = JSON.parse(await fs.readFile(path.join(POSTS_DIR, 'slugs.json'), 'utf8'));
  } catch { /* no slug translations — everyone uses the canonical slug */ }

  const template = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');

  console.log('Pre-rendering posts...');
  let count = 0;
  for (const entry of postIndex) {
    const canonicalSlug = typeof entry === 'string' ? entry : entry.slug;
    if (!canonicalSlug) continue;

    for (const lang of LANGS) {
      let md;
      try { md = await readMarkdownForLang(canonicalSlug, lang); }
      catch (e) { console.warn(`  skip ${canonicalSlug}/${lang}: ${e.message}`); continue; }

      const { meta, body } = parseFrontmatter(md);
      const alias = (slugsMap[canonicalSlug] && slugsMap[canonicalSlug][lang]) || canonicalSlug;

      const ogImage = extractFirstImageUrl(body) || `${SITE_URL}/assets/favicon.svg`;

      const html = buildPostHtml(template, {
        lang,
        alias,
        canonicalSlug,
        slugsMap,
        title: meta.title || canonicalSlug,
        description: meta.excerpt || '',
        tags: meta.tags || [],
        ogImage,
      });

      const outDir = lang === DEFAULT_LANG
        ? path.join(DIST, 'blog', alias)
        : path.join(DIST, lang, 'blog', alias);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8');
      count++;
      const rel = lang === DEFAULT_LANG ? `/blog/${alias}/` : `/${lang}/blog/${alias}/`;
      console.log(`  ✓ ${rel}`);
    }
  }

  console.log(`\nDone. Pre-rendered ${count} files into dist/.`);
}

main().catch(err => { console.error(err); process.exit(1); });
