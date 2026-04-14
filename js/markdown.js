/* ============================================
   MARKDOWN — Parse MD with frontmatter,
   syntax highlight, embed support
   ============================================ */

const Markdown = (() => {

  /* Parse YAML frontmatter from markdown string */
  function parseFrontmatter(content) {
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: content };

    let meta = {};
    try {
      meta = jsyaml.load(match[1]) || {};
    } catch (e) {
      console.warn('Failed to parse frontmatter:', e);
    }

    return { meta, body: match[2] };
  }

  /* Convert markdown to HTML with all features */
  function render(markdownStr) {
    // Protect LaTeX math delimiters from being mangled by the Markdown parser.
    // We extract each math span, stash it, and replace it with a safe placeholder.
    // After marked.parse() we restore the original delimiters so KaTeX can process them.
    const mathStore = [];

    // Display math: $$...$$  (must come first so $$ is not consumed by the inline rule)
    let src = markdownStr.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      const idx = mathStore.length;
      mathStore.push({ display: true, math });
      return `MATHPLACEHOLDER${idx}END`;
    });

    // Inline math: $...$  (single-line only, no empty content)
    src = src.replace(/\$([^\n$]+?)\$/g, (_, math) => {
      const idx = mathStore.length;
      mathStore.push({ display: false, math });
      return `MATHPLACEHOLDER${idx}END`;
    });
    marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
    });

    const renderer = new marked.Renderer();

    // marked v12 uses positional args: heading(text, depth, raw)
    renderer.heading = function(text, depth) {
      const stripped = text.replace(/<[^>]+>/g, '');
      const slug = stripped.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
      return `<h${depth} id="${slug}"><a href="#${slug}">${text}</a></h${depth}>`;
    };

    // code(code, language, escaped)
    renderer.code = function(code, language) {
      const lang = language || '';

      // Mermaid diagrams — render as a special div, not a code block
      if (lang === 'mermaid') {
        return `<pre class="mermaid" translate="no">${code}</pre>`;
      }

      let highlighted;
      try {
        highlighted = lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang }).value
          : hljs.highlightAuto(code).value;
      } catch {
        highlighted = code;
      }
      return `<pre data-lang="${lang}" translate="no" class="notranslate"><code class="hljs language-${lang}">${highlighted}</code><button class="code-copy-btn" onclick="Markdown.copyCode(this)">Copy</button></pre>`;
    };

    // image(href, title, text)
    renderer.image = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${text || ''}" loading="lazy"${titleAttr}>`;
    };

    // link(href, title, text)
    renderer.link = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : '';
      const isExternal = href && href.startsWith('http');
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
    };

    marked.use({ renderer });

    let html = marked.parse(src);

    // Restore LaTeX math placeholders so KaTeX can render them after DOM insertion.
    // translate="no" prevents Google Translate from mangling LaTeX source before KaTeX parses it.
    html = html.replace(/MATHPLACEHOLDER(\d+)END/g, (_, idx) => {
      const { display, math } = mathStore[parseInt(idx, 10)];
      return display
        ? `<span class="math-display notranslate" translate="no">$$${math}$$</span>`
        : `<span class="math-inline notranslate" translate="no">$${math}$</span>`;
    });

    // Post-process: YouTube embeds
    html = html.replace(
      /(?:<p>)?(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&[^\s<]*)?\s*(?:<\/p>)?/g,
      '<div class="embed-container"><iframe src="https://www.youtube-nocookie.com/embed/$1" allowfullscreen loading="lazy"></iframe></div>'
    );

    // Post-process: CodePen embeds
    html = html.replace(
      /(?:<p>)?https?:\/\/codepen\.io\/([\w-]+)\/pen\/([\w-]+)\s*(?:<\/p>)?/g,
      '<div class="embed-container"><iframe src="https://codepen.io/$1/embed/$2?default-tab=result&theme-id=dark" allowfullscreen loading="lazy"></iframe></div>'
    );

    return html;
  }

  /* Fetch and parse a markdown file. Tries the current-locale variant first
     (e.g. posts/RL.en.md) and falls back to the original French file. */
  async function loadPost(slug) {
    const suffix = (typeof I18n !== 'undefined') ? I18n.postSuffix() : '';
    const candidates = suffix ? [`posts/${slug}${suffix}.md`, `posts/${slug}.md`] : [`posts/${slug}.md`];

    for (const path of candidates) {
      try {
        const res = await fetch(path);
        if (!res.ok) continue;
        const raw = await res.text();
        const { meta, body } = parseFrontmatter(raw);
        const html = render(body);

        const words = body.trim().split(/\s+/).length;
        meta.readingTime = Math.max(1, Math.ceil(words / 250));

        return { meta, html, raw: body };
      } catch (e) {
        console.warn(`[markdown] failed to load ${path}`, e);
      }
    }
    return null;
  }

  /* Copy code block content */
  function copyCode(btn) {
    const pre = btn.closest('pre');
    const code = pre.querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  }

  /* Extract headings for table of contents */
  function extractTOC(html) {
    const headings = [];
    const regex = /<h([23]) id="([^"]+)"><a[^>]*>(.*?)<\/a><\/h[23]>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3].replace(/<[^>]+>/g, ''),
      });
    }
    return headings;
  }

  return { parseFrontmatter, render, loadPost, copyCode, extractTOC };
})();
