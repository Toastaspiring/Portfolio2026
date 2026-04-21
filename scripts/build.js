#!/usr/bin/env node
/*
 * Build script — pre-renders OG-tagged HTML for every blog post AND every
 * SPA panel (home, blog listing, projects), per language.
 *
 * Why this exists: the site is a client-side SPA with hash routing. Scrapers
 * (Discord, Twitter, Slack, FB…) don't execute JS, so they only ever see
 * index.html's generic meta tags when a hash URL is shared. This script
 * writes one static file per (page, lang) at a path URL like
 *   /en/blog/apprentice-intern/index.html    (blog post, EN)
 *   /de/blog/index.html                       (blog listing, DE)
 *   /es/index.html                            (home, ES)
 * with the page-specific <meta og:*> baked in. Scrapers see rich previews;
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
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/favicon.svg`;
const LANGS = ['fr', 'en', 'de', 'es'];
const DEFAULT_LANG = 'fr';

const OG_LOCALE = {
  fr: 'fr_FR',
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
};

/* Panels exposed by the SPA router. slug is the path segment under the
   optional language prefix; hash is the SPA route. */
const PANELS = [
  { id: 'home',     slug: '',         hash: '#/' },
  { id: 'blog',     slug: 'blog',     hash: '#/blog' },
  { id: 'projects', slug: 'projects', hash: '#/projects' },
];

/* Per-language metadata for each panel. Pulled to this file to keep the
   Node build pure (i18n.js is browser-scoped). Keep in sync if you change
   the equivalent strings in js/i18n.js. */
const PANEL_META = {
  fr: {
    home: {
      title: 'Louis — Dev Portfolio',
      description: 'Dev autodidacte basé en France. AI, computer vision, et des trucs qui marchent (des fois).',
    },
    blog: {
      title: 'Blog — Louis',
      description: "Articles sur l'AI, le dev, et les problèmes tordus qui m'ont appris un truc.",
    },
    projects: {
      title: 'Projets — Louis',
      description: "Open source et side projects — trucs que je build quand j'ai du temps.",
    },
  },
  en: {
    home: {
      title: 'Louis — Dev Portfolio',
      description: 'Self-taught developer based in France. AI, computer vision, and things that work (sometimes).',
    },
    blog: {
      title: 'Blog — Louis',
      description: 'Posts on AI, development, and the weird problems that taught me something.',
    },
    projects: {
      title: 'Projects — Louis',
      description: 'Open source and side projects — stuff I build when I have time.',
    },
  },
  de: {
    home: {
      title: 'Louis — Dev Portfolio',
      description: 'Autodidaktischer Entwickler aus Frankreich. KI, Computer Vision und Sachen, die (manchmal) funktionieren.',
    },
    blog: {
      title: 'Blog — Louis',
      description: 'Beiträge über KI, Entwicklung und die kniffligen Probleme, die mich was gelehrt haben.',
    },
    projects: {
      title: 'Projekte — Louis',
      description: 'Open Source und Nebenprojekte — Sachen, die ich baue, wenn ich Zeit habe.',
    },
  },
  es: {
    home: {
      title: 'Louis — Dev Portfolio',
      description: 'Desarrollador autodidacta afincado en Francia. IA, computer vision, y cosas que funcionan (a veces).',
    },
    blog: {
      title: 'Blog — Louis',
      description: 'Posts sobre IA, desarrollo y los problemas raros que me enseñaron algo.',
    },
    projects: {
      title: 'Proyectos — Louis',
      description: 'Open source y side projects — cosas que construyo cuando tengo tiempo.',
    },
  },
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
  return SITE_URL + (raw.startsWith('/') ? raw : '/' + raw);
}

function buildPostUrl(lang, alias) {
  return lang === DEFAULT_LANG
    ? `${SITE_URL}/blog/${alias}/`
    : `${SITE_URL}/${lang}/blog/${alias}/`;
}

function buildPanelUrl(lang, panel) {
  const langSeg = lang === DEFAULT_LANG ? '' : '/' + lang;
  const panelSeg = panel.slug ? '/' + panel.slug : '';
  return `${SITE_URL}${langSeg}${panelSeg}/`;
}

function panelOutputPath(lang, panel) {
  let dir = DIST;
  if (lang !== DEFAULT_LANG) dir = path.join(dir, lang);
  if (panel.slug) dir = path.join(dir, panel.slug);
  return path.join(dir, 'index.html');
}

function postOutputPath(lang, alias) {
  const dir = lang === DEFAULT_LANG
    ? path.join(DIST, 'blog', alias)
    : path.join(DIST, lang, 'blog', alias);
  return path.join(dir, 'index.html');
}

async function readMarkdownForLang(canonicalSlug, lang) {
  const suffix = lang === DEFAULT_LANG ? '' : `.${lang}`;
  const primary = path.join(POSTS_DIR, `${canonicalSlug}${suffix}.md`);
  try {
    return await fs.readFile(primary, 'utf8');
  } catch {
    return await fs.readFile(path.join(POSTS_DIR, `${canonicalSlug}.md`), 'utf8');
  }
}

/* Inline bootstrap that runs before the SPA boots. The pathname already
   communicates the language (/en/, /de/, ...) — all the SPA router needs
   from us is the hash for non-home panels/posts so it routes correctly
   on first load. User-supplied hashes are left alone. */
function makeBootstrap(lang, hashTarget) {
  return `
<script>
  (function() {
    try {
      if (!location.hash && ${JSON.stringify(hashTarget)} !== '#/') {
        var u = new URL(location.href);
        u.hash = ${JSON.stringify(hashTarget)};
        history.replaceState(null, '', u.toString());
      }
    } catch (e) { /* no-op — SPA will still try to render */ }
  })();
</script>
`;
}

/* ---------- template surgery ---------- */

/* Rewrite the shared SPA template with page-specific meta tags, inject
   canonical + hreflang + og:image, and insert the SPA bootstrap script. */
function buildHtml(template, data) {
  const {
    lang, url, fullTitle, description,
    ogType, ogImage, tags,
    hreflangs, bootstrap,
  } = data;

  let html = template;

  // Root element lang
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}">`);

  // Title + description
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
    `<meta property="og:type" content="${ogType}">`
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`
  );

  // Twitter — upgrade card to large image + sync title/description
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

  const hreflangTags = hreflangs
    .map(h => `  <link rel="alternate" hreflang="${h.lang}" href="${h.url}">`)
    .join('\n');

  const articleTags = (tags && tags.length)
    ? `  <meta name="article:tag" content="${tags.map(escapeHtml).join(',')}">\n`
    : '';

  const extras = `
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:image" content="${ogImage}">
${articleTags}  <link rel="canonical" href="${url}">
${hreflangTags}
`;
  html = html.replace('</head>', `${extras}</head>`);
  // Inject the bootstrap as the first child of <head> so it runs before
  // any other script on the page.
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

/* ---------- pre-render: posts ---------- */

async function preRenderPosts(template, postIndex, slugsMap) {
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
      const ogImage = extractFirstImageUrl(body) || DEFAULT_OG_IMAGE;
      const fullTitle = `${meta.title || canonicalSlug} — Louis`;

      const hreflangs = LANGS.map(l => ({
        lang: l,
        url: buildPostUrl(l, (slugsMap[canonicalSlug] && slugsMap[canonicalSlug][l]) || canonicalSlug),
      }));

      const html = buildHtml(template, {
        lang,
        url: buildPostUrl(lang, alias),
        fullTitle,
        description: meta.excerpt || '',
        ogType: 'article',
        ogImage,
        tags: meta.tags || [],
        hreflangs,
        bootstrap: makeBootstrap(lang, `#/blog/${alias}`),
      });

      const outPath = postOutputPath(lang, alias);
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, html, 'utf8');
      count++;
      const rel = lang === DEFAULT_LANG ? `/blog/${alias}/` : `/${lang}/blog/${alias}/`;
      console.log(`  ✓ ${rel}`);
    }
  }
  return count;
}

/* ---------- pre-render: panels ---------- */

async function preRenderPanels(template) {
  let count = 0;
  for (const panel of PANELS) {
    for (const lang of LANGS) {
      const meta = PANEL_META[lang][panel.id];
      if (!meta) continue;

      const hreflangs = LANGS.map(l => ({
        lang: l,
        url: buildPanelUrl(l, panel),
      }));

      const html = buildHtml(template, {
        lang,
        url: buildPanelUrl(lang, panel),
        fullTitle: meta.title,
        description: meta.description,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        tags: [],
        hreflangs,
        bootstrap: makeBootstrap(lang, panel.hash),
      });

      const outPath = panelOutputPath(lang, panel);
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, html, 'utf8');
      count++;
      const langSeg = lang === DEFAULT_LANG ? '' : `/${lang}`;
      const panelSeg = panel.slug ? `/${panel.slug}` : '';
      console.log(`  ✓ ${langSeg}${panelSeg}/`);
    }
  }
  return count;
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
  const postCount = await preRenderPosts(template, postIndex, slugsMap);

  console.log('Pre-rendering panels...');
  const panelCount = await preRenderPanels(template);

  console.log(`\nDone. Pre-rendered ${postCount} posts and ${panelCount} panels into dist/.`);
}

main().catch(err => { console.error(err); process.exit(1); });
