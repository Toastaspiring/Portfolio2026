/* ============================================
   PAGES, Sober dev blog. Vertical document flow.
   Home is blog-first: short intro + latest posts.
   ============================================ */

const Pages = (() => {

  // French-only content. t() simply returns the French string it is given;
  // other languages are offered through the auto-translate banner below.
  const t = (_key, text) => text;
  const dateLocale = () => 'fr-FR';

  const TAG_LABELS = {
    AI: 'IA',
    'reinforcement-learning': 'Reinforcement Learning',
    'deep-learning': 'Deep Learning',
    'neural-networks': 'Réseaux de neurones',
    'quantum-computing': 'Quantum Computing',
    quantum: 'Quantique',
    physics: 'Physique',
    'reverse-engineering': 'Reverse Engineering',
    rust: 'Rust',
    'league-of-legends': 'League of Legends',
    roblox: 'Roblox', luau: 'Luau', security: 'Sécurité',
    'anti-cheat': 'Anti-cheat', 'game-dev': 'Game Dev',
    python: 'Python', math: 'Maths', business: 'Business', strategy: 'Stratégie',
    automation: 'Automatisation', meta: 'Méta', personal: 'Personnel',
    humor: 'Humour', test: 'Test', markdown: 'Markdown', debug: 'Debug',
  };
  const tagLabel = (tag) => TAG_LABELS[tag] || tag;

  /* ---- Auto-translate banner ----
     Content is French. If the visitor's browser prefers another language,
     show a small dismissible banner above the profile offering to open a
     machine-translated version of the site (via Google Translate). */
  function foreignLang() {
    const langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || ''];
    // If French appears anywhere in their preferences, assume they can read it.
    if (langs.some(l => String(l).toLowerCase().startsWith('fr'))) return null;
    const code = String(langs[0] || '').toLowerCase().split('-')[0];
    return /^[a-z]{2}$/.test(code) ? code : null;
  }

  function translateBannerHTML() {
    try { if (localStorage.getItem('translate-dismissed') === '1') return ''; } catch { /* ignore */ }
    const code = foreignLang();
    if (!code) return '';
    let name = code.toUpperCase();
    try {
      const dn = new Intl.DisplayNames([code], { type: 'language' });
      const n = dn.of(code);
      if (n) name = n.charAt(0).toUpperCase() + n.slice(1);
    } catch { /* keep the code as name */ }
    return `
      <div class="tbanner reveal" id="tbanner" data-lang="${code}">
        <svg class="tbanner__globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="tbanner__text">Ce site est en français. <span class="tbanner__sub">This site is in French.</span></span>
        <button type="button" class="tbanner__go">Traduire &rarr; ${name}</button>
        <button type="button" class="tbanner__x" aria-label="Fermer">&times;</button>
      </div>`;
  }

  function wireTranslateBanner() {
    const b = document.getElementById('tbanner');
    if (!b) return;
    const code = b.dataset.lang;
    b.querySelector('.tbanner__go').addEventListener('click', () => {
      const url = 'https://translate.google.com/translate?sl=fr&tl='
        + encodeURIComponent(code) + '&u=' + encodeURIComponent(location.href);
      window.open(url, '_blank', 'noopener');
    });
    b.querySelector('.tbanner__x').addEventListener('click', () => {
      try { localStorage.setItem('translate-dismissed', '1'); } catch { /* ignore */ }
      b.remove();
    });
  }

  /* ---- HOME (blog-first: intro + latest posts) ---- */
  async function home(app) {
    const intro = t('home.intro_text', "Développeur autodidacte basé en France. Je touche un peu à tout, en ce moment surtout de l'IA et de la vision par ordinateur. J'écris ici quand un problème me donne mal à la tête.");
    app.innerHTML = `
      <div class="container">
        ${translateBannerHTML()}
        <section class="intro reveal">
          <img class="intro__avatar" src="/assets/images/avatar.png" alt="Louis" width="104" height="104"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'intro__avatar intro__avatar--mono',textContent:'L'}))">
          <div class="intro__body">
            <h1 class="intro__name">Louis</h1>
            <p class="intro__role">${t('home.role', 'Developer · AI & Computer Vision')}</p>
            <p class="intro__bio">${intro}</p>
            <div class="intro__links">
              <a href="${CONFIG.socials.github}" target="_blank" rel="noopener">GitHub</a>
              <a href="${CONFIG.socials.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
        </section>

        <hr class="divider">

        <section class="reveal">
          <div class="blog-head">
            <h2 class="page-head__title" style="font-size: var(--text-2xl);">${t('home.blog_heading', 'Blog')}</h2>
            <input type="search" class="search" id="post-search" autocomplete="off"
                   placeholder="${t('home.search_placeholder', 'Rechercher un article...')}"
                   aria-label="${t('home.search_placeholder', 'Rechercher un article...')}">
          </div>
          <div class="post-list" id="home-posts">
            <div class="skeleton" style="height: 90px; margin-bottom: 1px;"></div>
            <div class="skeleton" style="height: 90px; margin-bottom: 1px;"></div>
            <div class="skeleton" style="height: 90px;"></div>
          </div>
        </section>
      </div>
    `;
    wireTranslateBanner();
    await initHomePosts();
  }

  /* All posts on the home page + a client-side search box. */
  let _allPosts = [];
  async function initHomePosts() {
    const container = document.getElementById('home-posts');
    const search = document.getElementById('post-search');
    if (!container) return;

    let slugs = CONFIG.posts || [];
    try {
      const res = await fetch('/posts/index.json');
      if (res.ok) slugs = await res.json();
    } catch { /* use CONFIG.posts */ }

    _allPosts = await loadPostsMeta(slugs);
    renderPosts(container, _allPosts);

    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        if (!q) { renderPosts(container, _allPosts); return; }
        const hits = _allPosts.filter(({ meta }) => {
          const tags = (meta.tags || []).flatMap(tg => [tg, tagLabel(tg)]);
          return [meta.title, meta.excerpt, ...tags].join(' ').toLowerCase().includes(q);
        });
        renderPosts(container, hits);
      });
    }
  }

  function renderPosts(container, posts) {
    container.innerHTML = posts.length
      ? posts.map(({ meta, slug }) => postItem(meta, slug)).join('')
      : `<p class="post-empty">${t('home.no_results', 'Aucun article trouvé.')}</p>`;
  }

  /* ---- PROJECTS (sober GitHub repo list) ---- */
  async function projects(app) {
    app.innerHTML = `
      <div class="container">
        <div class="page-head" style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
          <div>
            <h1 class="page-head__title">${t('projects.title', 'Projets')}</h1>
            <p class="page-head__subtitle">${t('projects.subtitle', 'Open source & side projects')}</p>
          </div>
          <a href="${CONFIG.socials.github}" class="btn" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            @${CONFIG.socials.github.split('/').pop()}
          </a>
        </div>
        <div id="github-summary"></div>
        <div class="repo-list" id="github-repos">
          <div class="skeleton" style="height: 80px; border-radius: 0;"></div>
          <div class="skeleton" style="height: 80px; border-radius: 0;"></div>
          <div class="skeleton" style="height: 80px; border-radius: 0;"></div>
        </div>
      </div>
    `;
    await loadGitHubRepos();
  }

  /* ---- BLOG POST ---- */
  async function blogPost(app, params) {
    const slug = params.slug;
    const loaderStart = Date.now();
    const MIN_LOADER_MS = 900; // keep the spinner up at least this long so it never just flickers

    app.innerHTML = `
      <div class="article-loader" id="article-loader">
        <span class="spinner" aria-hidden="true"></span>
        <span>Chargement de l'article...</span>
      </div>`;

    const post = await Markdown.loadPost(slug);
    if (!post) {
      app.innerHTML = `
        <div class="container container--narrow">
          <div class="empty-state">
            <div class="empty-state__icon">404</div>
            <p class="empty-state__text">${t('blog.not_found', 'Post non trouvé')}</p>
            <a href="#/blog" class="btn" style="margin-top: var(--space-lg);">&larr; ${t('blog.back_to_blog', 'Retour au blog')}</a>
          </div>
        </div>`;
      return;
    }

    // Rewrite URL to the path form so shared links hit the pre-rendered OG file.
    try { history.replaceState(null, '', '/blog/' + slug + '/'); } catch { /* non-fatal */ }

    const date = post.meta.date ? new Date(post.meta.date).toLocaleDateString(dateLocale(), { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const tags = (post.meta.tags || []).map(tag => `<span class="tag">${tagLabel(tag)}</span>`).join('');
    const cover = post.meta.cover || post.meta.image;

    app.innerHTML = `
      <div class="container container--narrow">
        <article class="article article--preparing">
          <div class="article__nav">
            <a href="#/blog" class="article__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              ${t('blog.back_to_blog', 'Retour au blog')}
            </a>
          </div>
          <header class="article__header">
            ${cover ? `<img class="article__cover" src="${cover}" alt="${(post.meta.title || '').replace(/"/g, '&quot;')}" loading="eager">` : ''}
            <h1 class="article__title">${post.meta.title || slug}</h1>
            <div class="article__meta">
              ${date ? `<span>${date}</span>` : ''}
              <span>${post.meta.readingTime} ${t('blog.reading_time_full', 'min de lecture')}</span>
            </div>
            ${tags ? `<div class="article__tags">${tags}</div>` : ''}
          </header>
          <div class="prose">${post.html}</div>
          <hr class="divider">
          <div style="padding-bottom: var(--space-xl);">
            <a href="#/blog" class="article__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              ${t('blog.all_posts', 'Tous les posts')}
            </a>
          </div>
        </article>
      </div>
      <div class="article-loader" id="article-loader">
        <span class="spinner" aria-hidden="true"></span>
        <span>Chargement de l'article...</span>
      </div>`;

    const article = app.querySelector('.article');

    if (typeof mermaid !== 'undefined') {
      try { await mermaid.run(); } catch (e) { console.warn('Mermaid render error:', e?.message || e); }
    }

    if (window.renderMathInElement) {
      const prose = article.querySelector('.prose');
      if (prose) {
        renderMathInElement(prose, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      }
    }

    // Wait for images (with a safety timeout) before revealing.
    const images = [...article.querySelectorAll('img')];
    await Promise.all(images.map(img => {
      if (img.complete && img.naturalWidth > 0) return null;
      return new Promise(resolve => {
        const timer = setTimeout(() => { img.onload = img.onerror = null; resolve(); }, 4000);
        img.onload = () => { clearTimeout(timer); resolve(); };
        img.onerror = () => { clearTimeout(timer); resolve(); };
      });
    }));

    // Wait for the browser to actually paint the rendered content...
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    // ...and keep the loader up for a minimum beat so it never just flickers.
    const elapsed = Date.now() - loaderStart;
    if (elapsed < MIN_LOADER_MS) await new Promise(r => setTimeout(r, MIN_LOADER_MS - elapsed));

    article.classList.remove('article--preparing');
    article.classList.add('article--revealed');

    const loaderEl = app.querySelector('#article-loader');
    if (loaderEl) {
      loaderEl.classList.add('article-loader--out');   // fade out
      setTimeout(() => loaderEl.remove(), 320);
    }

    if (typeof Animations !== 'undefined') Animations.observeElements();

    article.querySelectorAll('pre.mermaid').forEach(el => {
      el.addEventListener('click', () => openMediaModal(el));
    });
    article.querySelectorAll('.prose img').forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => openMediaModal(el));
    });
  }

  /* ---- Post list rendering ---- */
  function postItem(meta, slug) {
    const date = meta.date ? new Date(meta.date) : new Date();
    const dateStr = date.toLocaleDateString(dateLocale(), { year: 'numeric', month: 'short', day: 'numeric' });
    const tags = (meta.tags || []).slice(0, 3).map(tag => `<span class="tag">${tagLabel(tag)}</span>`).join('');
    const readingTime = meta.readingTime ? `${meta.readingTime} ${t('blog.reading_time_suffix', 'min')}` : '';
    const cover = meta.cover || meta.image;

    return `
      <a href="#/blog/${slug}" class="post-item">
        ${cover ? `<img class="post-item__thumb" src="${cover}" alt="" loading="lazy">` : ''}
        <div class="post-item__content">
          <div class="post-item__date">${dateStr}</div>
          <h3 class="post-item__title">${meta.title || slug}</h3>
          ${meta.excerpt ? `<p class="post-item__excerpt">${meta.excerpt}</p>` : ''}
          <div class="post-item__meta">
            ${tags}
            ${readingTime ? `<span class="post-item__reading-time">${readingTime}</span>` : ''}
          </div>
        </div>
      </a>
    `;
  }

  async function loadPostsMeta(slugs) {
    const results = [];
    for (const slug of slugs) {
      let raw = null;
      try {
        const res = await fetch(`/posts/${slug}.md`);
        if (res.ok) raw = await res.text();
      } catch { /* skip */ }
      if (!raw) continue;
      try {
        const { meta, body } = Markdown.parseFrontmatter(raw);
        const words = body.trim().split(/\s+/).length;
        meta.readingTime = Math.max(1, Math.ceil(words / 250));
        if (!meta.excerpt) meta.excerpt = body.replace(/^#.*\n/gm, '').trim().slice(0, CONFIG.blog.excerptLength) + '...';
        results.push({ meta, slug });
      } catch { /* skip */ }
    }
    results.sort((a, b) => new Date(b.meta.date || 0) - new Date(a.meta.date || 0));
    return results;
  }

  /* ---- GitHub repos ---- */
  const LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    HTML: '#e34c26', CSS: '#563d7c', Dart: '#00B4AB', Shell: '#89e051',
    'Jupyter Notebook': '#DA5B0B', C: '#555555', 'C++': '#f34b7d',
    Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', PHP: '#4F5D95',
    Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF',
  };

  async function loadGitHubRepos() {
    const container = document.getElementById('github-repos');
    if (!container) return;

    try {
      const res = await fetch(`https://api.github.com/users/${CONFIG.socials.github.split('/').pop()}/repos?sort=updated&per_page=30`);
      if (!res.ok) throw new Error('GitHub API error');
      let repos = await res.json();

      repos = repos
        .filter(r => !r.fork && r.description)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.pushed_at) - new Date(a.pushed_at));

      if (repos.length === 0) {
        container.innerHTML = `<p style="color: var(--text-tertiary); padding: var(--space-lg);">${t('projects.empty', 'Aucun repo trouvé.')}</p>`;
        return;
      }

      const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

      const summary = document.getElementById('github-summary');
      if (summary) {
        const langList = topLangs.map(([lang]) => {
          const color = LANG_COLORS[lang] || 'var(--text-tertiary)';
          return `<span style="display:inline-flex;align-items:center;gap:5px;"><span class="repo-dot" style="background:${color};"></span>${lang}</span>`;
        }).join('');
        summary.innerHTML = `
          <div class="repo-summary">
            <span><b>${repos.length}</b> ${t('projects.stats_repos', 'repos')}</span>
            ${totalStars > 0 ? `<span><b>${totalStars}</b> ${t('projects.stats_stars', 'stars')}</span>` : ''}
            <span style="display:inline-flex;align-items:center;gap:var(--space-md);flex-wrap:wrap;">${langList}</span>
          </div>`;
      }

      container.innerHTML = repos.map(r => repoRow(r)).join('');
    } catch (e) {
      console.error('Failed to load GitHub repos:', e);
      container.innerHTML = `<p style="color: var(--text-tertiary); padding: var(--space-lg);">${t('projects.load_error', 'Impossible de charger les repos GitHub.')}</p>`;
    }
  }

  function repoRow(repo) {
    const lang = repo.language || '';
    const langColor = LANG_COLORS[lang] || 'var(--text-tertiary)';
    const stars = repo.stargazers_count;
    const d = new Date(repo.pushed_at);
    const updated = d.toLocaleDateString(dateLocale(), { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <a href="${repo.html_url}" class="repo-row" target="_blank" rel="noopener">
        <div class="repo-row__top">
          <span class="repo-row__name">${repo.name}</span>
        </div>
        <p class="repo-row__desc">${repo.description || ''}</p>
        <div class="repo-row__meta">
          ${lang ? `<span><span class="repo-dot" style="background:${langColor};"></span>${lang}</span>` : ''}
          ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
          <span>${t('projects.updated', 'maj')} ${updated}</span>
        </div>
      </a>
    `;
  }

  /* ---- Media modal (zoom + pan) for diagrams & images ---- */
  function openMediaModal(el) {
    const svg = el.querySelector('svg');
    const isImage = el.tagName === 'IMG';
    if (!svg && !isImage) return;

    let scale = 1;
    let dragging = false, startX, startY;
    let target;
    let label = '';

    if (isImage) {
      target = document.createElement('img');
      target.src = el.src;
      target.alt = el.alt;
      label = el.alt || 'Image';
    } else {
      target = svg.cloneNode(true);
      target.removeAttribute('width');
      target.removeAttribute('height');
      const titleEl = svg.querySelector('text.titleText, [class*="title"]');
      label = titleEl ? titleEl.textContent.trim() : 'Diagram';
    }

    const modal = document.createElement('div');
    modal.className = 'mermaid-modal';
    modal.innerHTML = `
      <div class="mermaid-modal__content"></div>
      <button class="mermaid-modal__close">&times;</button>
      <div class="mermaid-modal__zoom">
        <button data-zoom="out">&minus;</button>
        <span style="display: flex; align-items: center; padding: 0 var(--space-sm); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-tertiary); letter-spacing: 0.05em;">${label}</span>
        <button data-zoom="in">&plus;</button>
      </div>
    `;

    const content = modal.querySelector('.mermaid-modal__content');
    content.appendChild(target);

    let tx = 0, ty = 0;

    function applyTransform(smooth) {
      target.style.transition = smooth ? 'transform 180ms cubic-bezier(0.4,0,0.2,1)' : 'none';
      target.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    function centerTarget() {
      const cRect = content.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const tw = tRect.width / scale;
      const th = tRect.height / scale;
      tx = (cRect.width - tw * scale) / 2;
      ty = (cRect.height - th * scale) / 2;
      applyTransform(false);
    }

    function zoomAt(factor, clientX, clientY) {
      const rect = content.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const oldScale = scale;
      scale = Math.max(0.2, Math.min(8, scale * factor));
      tx = mx - (mx - tx) * (scale / oldScale);
      ty = my - (my - ty) * (scale / oldScale);
      applyTransform(true);
    }

    modal.querySelector('[data-zoom="in"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = content.getBoundingClientRect();
      zoomAt(1.4, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
    modal.querySelector('[data-zoom="out"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = content.getBoundingClientRect();
      zoomAt(0.7, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    content.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.15 : 0.87, e.clientX, e.clientY);
    }, { passive: false });

    content.addEventListener('mousedown', (e) => {
      dragging = true; startX = e.clientX; startY = e.clientY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    function onMove(e) {
      if (!dragging) return;
      tx += (e.clientX - startX);
      ty += (e.clientY - startY);
      startX = e.clientX; startY = e.clientY;
      applyTransform(false);
    }
    function onUp() { dragging = false; }

    function close() {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('keydown', onKey);
      }, 250);
    }

    function onKey(e) { if (e.key === 'Escape') close(); }
    window.addEventListener('keydown', onKey);

    modal.querySelector('.mermaid-modal__close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    document.body.appendChild(modal);
    requestAnimationFrame(() => {
      centerTarget();
      modal.classList.add('visible');
    });
  }

  return { home, projects, blogPost };
})();
