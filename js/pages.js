/* ============================================
   PAGES — No top navbar. Navigation is inline.
   Homepage fills viewport. Bigger layout.
   ============================================ */

const Pages = (() => {

  /* ---- HOME (renders all panels) ---- */
  function home(app) {
    app.classList.add('main--home');

    app.innerHTML = `
      <!-- ===== HOME PANEL ===== -->
      <section class="section section--hero" id="panel-home">
        <div class="container">
          <div class="grid-hero">

            <!-- Left: Identity + CTA -->
            <div class="grid-hero__left">

              <!-- Status row -->
              <div class="reveal" style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                <div style="display: flex; gap: var(--space-xs); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-tertiary);">
                  <span class="badge badge--status"><span class="badge__dot"></span> AVAILABLE</span>
                  <span class="badge badge--accent">v3.0</span>
                </div>
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" onclick="Theme.toggle()">
                  <svg class="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  <svg class="theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>
              </div>

              <!-- Name -->
              <div class="hero-text-reveal reveal">
                <h1 class="hero__title">
                  <span class="hero-text-reveal__line">LOUIS</span>
                  <span class="hero-text-reveal__line"><span style="color: var(--accent);">DEV</span><span style="color: var(--purple);">ELOPER</span></span>
                </h1>
              </div>

              <!-- Tagline -->
              <p class="reveal" style="font-size: var(--text-lg); color: var(--text-secondary); max-width: 30rem; line-height: var(--line-height-relaxed);">
                Je code des trucs, je casse des trucs, je recommence. <em style="color: var(--accent); font-style: normal; font-weight: 600;">Des fois ça marche du premier coup</em> — mais c'est rare.
              </p>

              <!-- CTAs -->
              <div class="reveal" style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm);">
                <a href="#/projects" class="btn btn--primary">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  Projets
                </a>
                <a href="#/blog" class="btn btn--ghost">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  Blog
                </a>
              </div>

              <!-- Stats row -->
              <div class="reveal" style="display: flex; gap: var(--space-xl); padding-top: var(--space-md); border-top: 1px solid var(--border); margin-top: var(--space-md);">
                <div class="stat">
                  <div class="stat__number">3+</div>
                  <div class="stat__label">Ans</div>
                </div>
                <div class="stat">
                  <div class="stat__number">10+</div>
                  <div class="stat__label">Projets</div>
                </div>
                <div class="stat">
                  <div class="stat__number">&infin;</div>
                  <div class="stat__label">Curiosité</div>
                </div>
              </div>
            </div>

            <!-- Right: Bento mini-grid -->
            <div class="grid-hero__right reveal-stagger">

              <!-- Intro (wide) -->
              <div class="card grid-hero__item--span2" style="padding: var(--space-lg);">
                <p style="font-family: var(--font-serif); font-size: var(--text-base); font-weight: 700; line-height: 1.6; color: var(--text-secondary);"><strong style="color: var(--text-primary);">Dev autodidacte</strong> basé en <span style="color: var(--accent);">France</span>. J'aime casser des trucs pour comprendre comment ils marchent. En ce moment à fond dans l'<strong style="color: var(--accent);">IA</strong>, la <strong style="color: var(--purple);">vision par ordinateur</strong>, et la construction de trucs qui tiennent debout.</p>
              </div>

              <!-- AI Engineer -->
              <div class="card" style="padding: var(--space-lg); display: flex; align-items: center; justify-content: center; text-align: center;">
                <div>
                  <div style="font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 900; background: linear-gradient(135deg, var(--accent), var(--purple)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">AI</div>
                  <div class="mono-label" style="margin-top: 6px;">ENGINEER</div>
                </div>
              </div>

              <!-- Stack icons (compact) -->
              <div class="card" style="padding: var(--space-md); display: flex; flex-direction: column; justify-content: center;">
                <p class="mono-label">STACK</p>
                <div class="stack-icons stack-icons--grid" style="margin-top: var(--space-sm);">
                  <div class="stack-icon" data-tooltip="Python" style="color: var(--accent);">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.403 3.35-3.403h5.766s3.24.052 3.24-3.134V3.2S18.28 0 11.914 0zM8.708 1.85a1.06 1.06 0 1 1 0 2.12 1.06 1.06 0 0 1 0-2.12z"/><path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.403-3.35 3.403H9.451s-3.24-.052-3.24 3.134v5.325S5.72 24 12.086 24zm3.206-1.85a1.06 1.06 0 1 1 0-2.12 1.06 1.06 0 0 1 0 2.12z"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="PyTorch" style="color: var(--accent-hover);">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.005 0L4.952 7.053a9.865 9.865 0 0 0 0 13.94 9.866 9.866 0 0 0 13.94 0 9.865 9.865 0 0 0 0-13.94l-3.488 3.488a4.87 4.87 0 0 1 0 6.964 4.87 4.87 0 0 1-6.964 0 4.87 4.87 0 0 1 0-6.964l4.95-4.95 1.05-1.06zM16.2 4.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="Computer Vision" style="color: var(--accent);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="LLMs" style="color: var(--purple);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.8-3.5 6-.3.2-.5.5-.5.9V17a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.1c0-.4-.2-.7-.5-.9C6.3 13.8 5 11.5 5 9a7 7 0 0 1 7-7z"/><path d="M10 21h4M10 17h4"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="Docker" style="color: var(--accent-hover);">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.186.186 0 0 0-.187.186v1.887c0 .103.084.185.187.185zm-2.954-5.43h2.118a.186.186 0 0 0 .187-.185V3.576a.186.186 0 0 0-.187-.186h-2.118a.186.186 0 0 0-.187.186v1.887c0 .102.084.185.187.185zm0 2.716h2.118a.187.187 0 0 0 .187-.186V6.29a.187.187 0 0 0-.187-.186h-2.118a.187.187 0 0 0-.187.186v1.887c0 .103.084.186.187.186zm-2.93 0h2.12a.186.186 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.186h-2.12a.186.186 0 0 0-.184.186v1.887c0 .103.083.186.185.186zm-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.186.186 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.186v1.887c0 .103.084.186.186.186zm5.893 2.715h2.118a.186.186 0 0 0 .187-.185V9.006a.186.186 0 0 0-.187-.186h-2.118a.186.186 0 0 0-.187.186v1.887c0 .103.084.185.187.185zm-2.93 0h2.12a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.12a.186.186 0 0 0-.184.186v1.887c0 .103.083.185.185.185zm-2.964 0h2.119a.186.186 0 0 0 .185-.185V9.006a.186.186 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.186v1.887c0 .103.084.185.186.185zm-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.186.186 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.184.186v1.887c0 .103.082.185.185.185zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.687 11.687 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.98-.098 2.96-.287a11.81 11.81 0 0 0 3.49-1.396c1.018-.632 1.933-1.414 2.72-2.33 1.31-1.524 2.09-3.23 2.7-4.73h.235c1.46 0 2.36-.59 2.86-1.089a3.04 3.04 0 0 0 .736-1.088l.103-.293z"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="FastAPI" style="color: var(--accent);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4.5 12H12l-1 10 8.5-10H12l1-10z"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="Linux" style="color: var(--accent);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="Git" style="color: var(--accent-hover);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v10M18 16V8c0-2-2-2-2-2H8"/></svg>
                  </div>
                  <div class="stack-icon" data-tooltip="Full-Stack" style="color: var(--purple);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="17" width="20" height="5" rx="1"/></svg>
                  </div>
                </div>
              </div>

              <!-- Git joke -->
              <div class="card grid-hero__item--span2" style="padding: var(--space-lg); display: flex; flex-direction: column; justify-content: center;">
                <p class="mono-label" style="color: var(--purple);">STATUS</p>
                <div style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-xs); line-height: 1.9;">
                  <div style="color: var(--accent);">$ git log --oneline -1</div>
                  <div><span style="color: var(--purple);">e4f2a1b</span> fix: fix the fix that fixed the fix</div>
                </div>
              </div>

              <!-- Code snippet — coffee recursion joke -->
              <div class="card grid-hero__item--span3" style="padding: var(--space-md) var(--space-lg); background: var(--code-bg); border-color: var(--code-border); font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.7; overflow: hidden;">
                <div><span style="color: var(--purple);">def</span> <span style="color: var(--accent);">daily_routine</span>():</div>
                <div>&nbsp;&nbsp;coffee = <span style="color: var(--accent);">drink</span>(<span style="color: #e5a04b;">"espresso"</span>)</div>
                <div>&nbsp;&nbsp;<span style="color: var(--purple);">while</span> coffee:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;code() ; sleep(<span style="color: var(--accent);">2</span>)</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;coffee = <span style="color: var(--accent);">drink</span>(<span style="color: #e5a04b;">"more espresso"</span>)</div>
                <div>&nbsp;&nbsp;<span style="color: var(--text-tertiary);"># unreachable: coffee is always truthy</span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ===== PROJECTS PANEL (hidden initially) ===== -->
      <section class="section" id="panel-projects" style="display: none; padding: var(--space-xl) var(--space-lg);">
        <div class="container">
          <div class="projects-wrap">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-xl);">
              <div>
                <a href="#/" style="display: inline-flex; align-items: center; gap: var(--space-2xs); font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-xs); transition: color 300ms ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-tertiary)'">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Accueil
                </a>
                <h1 style="font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 900;">Projets</h1>
                <p style="color: var(--text-tertiary); font-size: var(--text-sm); margin-top: var(--space-2xs);">Open source & side projects</p>
              </div>
              <a href="${CONFIG.socials.github}" class="btn btn--ghost" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                @${CONFIG.socials.github.split('/').pop()}
              </a>
            </div>
            <div id="github-stats"></div>
            <div class="grid grid--2" id="github-repos">
              <div class="skeleton" style="height: 140px;"></div>
              <div class="skeleton" style="height: 140px;"></div>
              <div class="skeleton" style="height: 140px;"></div>
              <div class="skeleton" style="height: 140px;"></div>
            </div>
            <div style="height: var(--space-3xl);"></div>
          </div>
        </div>
      </section>

      <!-- ===== BLOG PANEL (hidden initially) ===== -->
      <section class="section" id="panel-blog" style="display: none; padding: var(--space-xl) var(--space-lg);">
        <div class="container container--narrow">
          <div class="blog-wrap">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg);">
              <div>
                <a href="#/" style="display: inline-flex; align-items: center; gap: var(--space-2xs); font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-xs); transition: color 300ms ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-tertiary)'">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Accueil
                </a>
                <h1 style="font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 900;">Blog</h1>
              </div>
            </div>
            <div class="post-list" id="blog-posts">
              <div class="skeleton" style="height: 80px;"></div>
              <div class="skeleton" style="height: 80px;"></div>
            </div>
            <div style="height: var(--space-3xl);"></div>
          </div>
        </div>
      </section>
    `;

    // If URL is already on a panel route, switch immediately
    const hash = window.location.hash;
    if (hash === '#/projects') {
      document.getElementById('panel-home').style.display = 'none';
      const proj = document.getElementById('panel-projects');
      proj.style.display = '';
      proj.dataset.loaded = 'true';
      loadGitHubRepos();
    } else if (hash === '#/blog') {
      document.getElementById('panel-home').style.display = 'none';
      const blog = document.getElementById('panel-blog');
      blog.style.display = '';
      blog.dataset.loaded = 'true';
      loadAllPosts();
    }
  }

  function cleanupHome(app) {
    app.classList.remove('main--home');
  }

  /* ---- BLOG POST ---- */
  async function blogPost(app, params) {
    cleanupHome(app);
    const slug = params.slug;
    app.innerHTML = `
      <article class="article">
        <div class="skeleton" style="height: 40px; width: 60%; margin: 0 auto var(--space-md);"></div>
        <div class="skeleton" style="height: 300px;"></div>
      </article>`;

    const post = await Markdown.loadPost(slug);
    if (!post) {
      app.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">404</div>
          <p class="empty-state__text">Post not found</p>
          <a href="#/blog" class="btn btn--ghost" style="margin-top: var(--space-lg);">&larr; Back</a>
        </div>`;
      return;
    }

    const date = post.meta.date ? new Date(post.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const tags = (post.meta.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    app.innerHTML = `
      <article class="article">
        <div class="article__nav">
          <a href="#/blog" class="article__back">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to blog
          </a>
          <button class="theme-toggle" aria-label="Toggle theme" onclick="Theme.toggle()">
            <svg class="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg class="theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
        <header class="article__header reveal">
          <div class="article__meta" style="margin-bottom: var(--space-md);">
            ${date ? `<span>${date}</span>` : ''}
            <span style="color: var(--accent);">${post.meta.readingTime} min read</span>
          </div>
          <h1 class="article__title">${post.meta.title || slug}</h1>
          ${tags ? `<div class="article__tags">${tags}</div>` : ''}
        </header>
        <div class="prose">${post.html}</div>
        <div style="text-align: center; padding: var(--space-3xl) 0 var(--space-xl);">
          <a href="#/blog" class="btn btn--ghost">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            All posts
          </a>
        </div>
      </article>
    `;

    Animations.observeElements();

    // Render mermaid diagrams then attach modal click handlers
    if (typeof mermaid !== 'undefined') {
      try { await mermaid.run(); } catch(e) { console.warn('Mermaid render error:', e); }
    }
    // Attach media modal to mermaid diagrams and images
    app.querySelectorAll('pre.mermaid').forEach(el => {
      el.addEventListener('click', () => openMediaModal(el));
    });
    app.querySelectorAll('.prose img').forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => openMediaModal(el));
    });
  }

  /* Media modal with zoom + pan (mermaid diagrams & images) */
  function openMediaModal(el) {
    const svg = el.querySelector('svg');
    const isImage = el.tagName === 'IMG';
    if (!svg && !isImage) return;

    let scale = 1;
    let panX = 0, panY = 0;
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
      // Try to get the diagram title from the SVG text
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

    // We track the world-space point at the container center.
    // panX/panY = pixel offset of the element from its natural centered position.
    // transform: translate(-50% + panX, -50% + panY) scale(scale)
    // Scale is applied AFTER translate, so scaling happens around the translated center.

    let tx = 0, ty = 0;

    function applyTransform(smooth) {
      target.style.transition = smooth ? 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      target.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    function centerTarget() {
      const cRect = content.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      // tRect is already scaled, so get natural size
      const tw = tRect.width / scale;
      const th = tRect.height / scale;
      tx = (cRect.width - tw * scale) / 2;
      ty = (cRect.height - th * scale) / 2;
      applyTransform(false);
    }

    // Zoom anchored to a screen point (clientX, clientY)
    function zoomAt(factor, clientX, clientY) {
      const rect = content.getBoundingClientRect();
      // Mouse position in container space
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      const oldScale = scale;
      scale = Math.max(0.2, Math.min(8, scale * factor));

      // The world point under the mouse: wx = (mx - tx) / oldScale
      // After zoom we want: mx = tx_new + wx * scale
      // => tx_new = mx - (mx - tx) * (scale / oldScale)
      tx = mx - (mx - tx) * (scale / oldScale);
      ty = my - (my - ty) * (scale / oldScale);

      applyTransform(true);
    }

    // Zoom buttons — zoom toward container center (where you're looking)
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

    // Scroll to zoom — anchored to mouse cursor
    content.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.15 : 0.87, e.clientX, e.clientY);
    }, { passive: false });

    // Drag to pan
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

    // Close
    function close() {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('keydown', onKey);
      }, 300);
    }

    function onKey(e) { if (e.key === 'Escape') close(); }
    window.addEventListener('keydown', onKey);

    modal.querySelector('.mermaid-modal__close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    document.body.appendChild(modal);
    // Wait for layout then center, then fade in
    requestAnimationFrame(() => {
      centerTarget();
      modal.classList.add('visible');
    });
  }

  /* Projects panel is inside home — this just triggers load */
  function loadProjects() {
    loadGitHubRepos();
  }

  /* ---- ABOUT ---- */

  /* ---- Helpers ---- */


  function postItem(meta, slug) {
    const date = meta.date ? new Date(meta.date) : new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const tags = (meta.tags || []).map(t => `<span class="tag tag--clickable">${t}</span>`).join('');

    return `
      <a href="#/blog/${slug}" class="post-item">
        <div class="post-item__date">
          <span class="post-item__day">${day}</span>
          <span class="post-item__month">${month}</span>
        </div>
        <div class="post-item__content">
          <h3 class="post-item__title">${meta.title || slug}</h3>
          ${meta.excerpt ? `<p class="post-item__excerpt">${meta.excerpt}</p>` : ''}
          <div class="post-item__meta">
            ${tags}
            ${meta.readingTime ? `<span class="post-item__reading-time">${meta.readingTime} min</span>` : ''}
          </div>
        </div>
      </a>
    `;
  }

  async function loadAllPosts() {
    const container = document.getElementById('blog-posts');
    if (!container) return;

    // Try to discover posts from an index, fall back to CONFIG.posts
    let slugs = CONFIG.posts || [];
    try {
      const res = await fetch('posts/index.json');
      if (res.ok) slugs = await res.json();
    } catch { /* use CONFIG.posts */ }

    const posts = await loadPostsMeta(slugs);
    if (posts.length === 0) { container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center;">Aucun post pour l'instant.</p>'; return; }
    container.innerHTML = posts.map(({ meta, slug }) => postItem(meta, slug)).join('');
  }

  async function loadPostsMeta(slugs) {
    const results = [];
    for (const slug of slugs) {
      try {
        const res = await fetch(`posts/${slug}.md`);
        if (!res.ok) continue;
        const raw = await res.text();
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

  function loadBlog() {
    loadAllPosts();
  }

  /* ---- GitHub API ---- */

  // Language → color map
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

      // Filter out forks and empty repos, sort by stars then recent push
      repos = repos
        .filter(r => !r.fork && r.description)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.pushed_at) - new Date(a.pushed_at));

      if (repos.length === 0) {
        container.innerHTML = '<p style="color: var(--text-tertiary);">Aucun repo trouvé.</p>';
        return;
      }

      // Build stats from repo data
      const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const topLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const totalLangRepos = topLangs.reduce((s, l) => s + l[1], 0);

      // Language bar segments
      const langBar = topLangs.map(([lang, count]) => {
        const pct = (count / totalLangRepos * 100).toFixed(1);
        const color = LANG_COLORS[lang] || 'var(--text-tertiary)';
        return `<div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 2px;" data-tooltip="${lang} ${pct}%"></div>`;
      }).join('');

      const langLabels = topLangs.map(([lang]) => {
        const color = LANG_COLORS[lang] || 'var(--text-tertiary)';
        return `<span style="display: flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: ${color}; display: inline-block;"></span>${lang}</span>`;
      }).join('');

      // Insert stats card above repos
      const statsHTML = `
        <div class="card" style="padding: var(--space-lg); margin-bottom: var(--space-lg); background: var(--code-bg); border-color: var(--code-border);">
          <div style="display: flex; gap: var(--space-xl); margin-bottom: var(--space-md);">
            <div style="text-align: center;">
              <div style="font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 900; color: var(--accent);">${repos.length}</div>
              <div class="mono-label" style="margin-top: 2px;">REPOS</div>
            </div>
            <div style="text-align: center;">
              <div style="font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 900; color: var(--text-primary);">${totalStars}</div>
              <div class="mono-label" style="margin-top: 2px;">STARS</div>
            </div>
            <div style="text-align: center;">
              <div style="font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 900; color: var(--text-primary);">${totalForks}</div>
              <div class="mono-label" style="margin-top: 2px;">FORKS</div>
            </div>
            <div style="text-align: center;">
              <div style="font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: 900; color: var(--purple);">${topLangs.length}</div>
              <div class="mono-label" style="margin-top: 2px;">LANGS</div>
            </div>
          </div>
          <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; display: flex; gap: 2px; overflow: hidden; margin-bottom: var(--space-sm);">
            ${langBar}
          </div>
          <div style="display: flex; gap: var(--space-md); font-size: var(--text-xs); color: var(--text-tertiary); flex-wrap: wrap;">
            ${langLabels}
          </div>
        </div>
      `;

      const statsContainer = document.getElementById('github-stats');
      if (statsContainer) statsContainer.innerHTML = statsHTML;
      container.innerHTML = repos.map(r => repoCard(r)).join('');
    } catch (e) {
      console.error('Failed to load GitHub repos:', e);
      container.innerHTML = '<p style="color: var(--text-tertiary);">Impossible de load les repos GitHub.</p>';
    }
  }

  function repoCard(repo) {
    const lang = repo.language || '';
    const langColor = LANG_COLORS[lang] || 'var(--text-tertiary)';
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;
    const d = new Date(repo.pushed_at);
    const updated = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " '" + String(d.getFullYear()).slice(2);

    return `
      <a href="${repo.html_url}" class="card" style="padding: var(--space-lg); display: flex; flex-direction: column;" target="_blank" rel="noopener">
        <span class="card__arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></span>
        <div style="display: flex; align-items: center; gap: var(--space-xs); margin-bottom: var(--space-sm);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <span style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">${repo.name}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.6; flex: 1;">${repo.description || ''}</p>
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--border); font-size: var(--text-xs); color: var(--text-tertiary);">
          ${lang ? `<span style="display: flex; align-items: center; gap: 5px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: ${langColor}; display: inline-block;"></span>${lang}</span>` : ''}
          ${stars > 0 ? `<span style="display: flex; align-items: center; gap: 4px;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${stars}</span>` : ''}
          ${forks > 0 ? `<span style="display: flex; align-items: center; gap: 4px;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9M12 12v3"/></svg>${forks}</span>` : ''}
          <span style="margin-left: auto;">${updated}</span>
        </div>
      </a>
    `;
  }

  return { home, blogPost, loadProjects, loadBlog };
})();
