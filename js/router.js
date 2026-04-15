/* ============================================
   ROUTER — Hash-based SPA routing
   Panel-based for home/projects/blog,
   page-based for about & blog posts
   ============================================ */

const Router = (() => {
  const routes = {};
  let currentRoute = null;
  let transitioning = false;

  // Panel routes and their slide directions relative to home
  const PANEL_DIR = {
    '#/':         { x: 0, y: 0 },
    '#/projects': { x: 1, y: 0 },   // right of home
    '#/blog':     { x: 0, y: 1 },   // below home
  };

  function register(path, handler) { routes[path] = handler; }

  function getRoute() {
    const hash = window.location.hash || '#/';
    if (routes[hash]) return { path: hash, params: {} };
    for (const pattern of Object.keys(routes)) {
      const regex = patternToRegex(pattern);
      const match = hash.match(regex);
      if (match) {
        const paramNames = (pattern.match(/:(\w+)/g) || []).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        return { path: pattern, params };
      }
    }
    return { path: '#/', params: {} };
  }

  function patternToRegex(pattern) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escaped.replace(/:(\w+)/g, '([^/]+)')}$`);
  }

  function isPanel(path) { return path in PANEL_DIR; }

  /* Animate children of each target independently */
  function animateChildren(targets, keyframes, options) {
    const animations = [];
    targets.forEach(el => {
      [...el.children].forEach((child, i) => {
        const anim = child.animate(keyframes, { ...options, delay: i * 60 });
        animations.push(anim.finished);
      });
    });
    return Promise.all(animations);
  }

  function getTargets(panel) {
    return panel.querySelectorAll('.grid-hero__left, .grid-hero__right, .projects-wrap, .blog-wrap');
  }

  /* Switch between any two panels with directional slide */
  async function switchPanel(from, to) {
    if (transitioning) return;
    transitioning = true;

    const fromDir = PANEL_DIR[from];
    const toDir = PANEL_DIR[to];
    // Direction vector: where the new panel comes from
    const dx = toDir.x - fromDir.x; // +1 = from right, -1 = from left
    const dy = toDir.y - fromDir.y; // +1 = from below, -1 = from above

    const panelMap = { '#/': 'panel-home', '#/projects': 'panel-projects', '#/blog': 'panel-blog' };
    const exitPanel = document.getElementById(panelMap[from]);
    const enterPanel = document.getElementById(panelMap[to]);
    if (!exitPanel || !enterPanel) { transitioning = false; return; }

    const dist = 120;
    const exitTo = `translate(${-dx * dist}px, ${-dy * dist}px) scale(0.97)`;
    const exitBounce = `translate(${dx * 12}px, ${dy * 12}px) scale(1.01)`;
    const enterFrom = `translate(${dx * dist}px, ${dy * dist}px) scale(0.97)`;
    const enterBounce = `translate(${-dx * 8}px, ${-dy * 8}px) scale(1.005)`;

    // === EXIT ===
    const exitTargets = getTargets(exitPanel);
    await animateChildren(exitTargets, [
      { opacity: 1, transform: 'translate(0,0) scale(1)' },
      { opacity: 1, transform: exitBounce, offset: 0.3 },
      { opacity: 0, transform: exitTo }
    ], { duration: 550, easing: 'cubic-bezier(0.6, -0.1, 0.7, 0.05)', fill: 'both' });

    // === SWAP ===
    exitPanel.style.display = 'none';
    exitTargets.forEach(el => [...el.children].forEach(c => c.getAnimations().forEach(a => a.cancel())));

    // Reset reveals on the hidden panel so they replay next time
    exitPanel.querySelectorAll('.reveal, .reveal-stagger, .hero-text-reveal').forEach(el => {
      el.classList.remove('visible');
    });

    const app = document.getElementById('app');
    if (to === '#/') {
      app.style.cssText = '';
    } else {
      app.style.cssText = 'overflow: auto !important; height: auto !important; min-height: 100vh;';
    }

    enterPanel.style.display = '';

    // Lazy loads
    if (to === '#/projects' && !enterPanel.dataset.loaded) {
      enterPanel.dataset.loaded = 'true';
      Pages.loadProjects();
    }
    if (to === '#/blog' && !enterPanel.dataset.loaded) {
      enterPanel.dataset.loaded = 'true';
      Pages.loadBlog();
    }

    // === ENTER ===
    const enterTargets = getTargets(enterPanel);

    // Trigger reveals early so they animate alongside the slide
    setTimeout(() => {
      enterPanel.querySelectorAll('.reveal, .reveal-stagger, .hero-text-reveal').forEach(el => {
        el.classList.add('visible');
      });
    }, 200);

    await animateChildren(enterTargets, [
      { opacity: 0, transform: enterFrom },
      { opacity: 1, transform: enterBounce, offset: 0.6 },
      { opacity: 1, transform: 'translate(0,0) scale(1)' }
    ], { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });

    // Cancel enter animations
    enterTargets.forEach(el => [...el.children].forEach(c => {
      c.getAnimations().forEach(a => a.cancel());
    }));

    transitioning = false;
  }

  /* Slide transition between blog panel and blog post page */
  async function slidePage(direction, handler, app, params, returningToPanel) {
    transitioning = true;
    const dist = 120;
    const exitX = direction === 'forward' ? -dist : dist;
    const enterX = direction === 'forward' ? dist : -dist;

    // Animate current content out
    const currentChildren = [...app.children].filter(el => el.style.display !== 'none');
    const exitAnims = [];
    currentChildren.forEach((child, i) => {
      const a = child.animate([
        { opacity: 1, transform: 'translateX(0) scale(1)' },
        { opacity: 1, transform: `translateX(${-exitX * 0.1}px) scale(1.01)`, offset: 0.3 },
        { opacity: 0, transform: `translateX(${exitX}px) scale(0.97)` }
      ], { duration: 450, easing: 'cubic-bezier(0.6, -0.1, 0.7, 0.05)', fill: 'both', delay: i * 40 });
      exitAnims.push(a.finished);
    });
    await Promise.all(exitAnims);

    // If returning to blog panel, just show the panel again
    if (returningToPanel) {
      // We need to re-render the home page (which has all panels)
      app.innerHTML = '';
      app.style.cssText = '';
      app.classList.remove('main--home');
      window.scrollTo({ top: 0 });
      await handler(app, params);

      // Show blog panel, hide others
      const homePanel = document.getElementById('panel-home');
      const projPanel = document.getElementById('panel-projects');
      const blogPanel = document.getElementById('panel-blog');
      if (homePanel) homePanel.style.display = 'none';
      if (projPanel) projPanel.style.display = 'none';
      if (blogPanel) {
        blogPanel.style.display = '';
        blogPanel.dataset.loaded = 'true';
        Pages.loadBlog();
      }

      app.style.cssText = 'overflow: auto !important; height: auto !important; min-height: 100vh;';

      // Animate blog panel in
      const enterTargets = blogPanel ? getTargets(blogPanel) : [];
      const enterAnims = [];
      enterTargets.forEach(el => {
        [...el.children].forEach((child, i) => {
          const a = child.animate([
            { opacity: 0, transform: `translateX(${enterX}px) scale(0.97)` },
            { opacity: 1, transform: `translateX(${enterX * -0.07}px) scale(1.005)`, offset: 0.6 },
            { opacity: 1, transform: 'translateX(0) scale(1)' }
          ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both', delay: i * 60 });
          enterAnims.push(a.finished);
        });
      });
      await Promise.all(enterAnims);
      enterTargets.forEach(el => [...el.children].forEach(c => c.getAnimations().forEach(a => a.cancel())));
    } else {
      // Going to blog post page
      app.innerHTML = '';
      app.style.cssText = '';
      app.classList.remove('main--home');
      window.scrollTo({ top: 0 });
      await handler(app, params);

      const footer = document.querySelector('.footer');
      if (footer) footer.style.display = '';

      Animations.observeElements();

      // Animate new page content in
      const newChildren = [...app.children];
      const enterAnims = [];
      newChildren.forEach((child, i) => {
        const a = child.animate([
          { opacity: 0, transform: `translateX(${enterX}px) scale(0.97)` },
          { opacity: 1, transform: `translateX(${enterX * -0.07}px) scale(1.005)`, offset: 0.6 },
          { opacity: 1, transform: 'translateX(0) scale(1)' }
        ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both', delay: i * 60 });
        enterAnims.push(a.finished);
      });
      await Promise.all(enterAnims);
      newChildren.forEach(c => c.getAnimations().forEach(a => a.cancel()));
    }

    transitioning = false;
  }

  async function navigate() {
    if (transitioning) return;

    const { path, params } = getRoute();
    const handler = routes[path] || routes['#/'];
    const app = document.getElementById('app');

    // Mark body as "article mode" on blog post routes so the reading
    // progress bar (bottom of viewport) is only shown there. Done at the
    // top of navigate() so every early-return branch picks it up too.
    document.body.classList.toggle('is-article', path.startsWith('#/blog/') && path !== '#/blog');

    const fromPanel = currentRoute !== null && isPanel(currentRoute);
    const toPanel = isPanel(path);

    if (fromPanel && toPanel && currentRoute !== path) {
      await switchPanel(currentRoute, path);
      currentRoute = path;
      return;
    }

    // Blog panel <-> Blog post: slide right/left
    const isBlogPost = path.startsWith('#/blog/');
    const wasBlogPost = currentRoute !== null && currentRoute.startsWith('#/blog/') && currentRoute !== '#/blog';
    const fromBlogPanel = currentRoute === '#/blog';
    const toBlogPanel = path === '#/blog';

    if ((fromBlogPanel && isBlogPost) || (wasBlogPost && toBlogPanel)) {
      await slidePage(
        fromBlogPanel ? 'forward' : 'backward',
        handler, app, params, toBlogPanel
      );
      currentRoute = path;
      return;
    }

    const supportsVT = typeof document.startViewTransition === 'function';

    if (currentRoute !== null && !supportsVT) {
      app.classList.add('page-transition-exit');
      await new Promise(r => setTimeout(r, 250));
    }

    app.innerHTML = '';
    app.style.cssText = '';
    app.classList.remove('page-transition-exit', 'main--home');
    if (!supportsVT && currentRoute !== null) app.classList.add('page-transition-enter');

    window.scrollTo({ top: 0 });
    await handler(app, params);

    Animations.observeElements();

    if (!supportsVT) {
      setTimeout(() => app.classList.remove('page-transition-enter'), 500);
    }

    currentRoute = path;
  }

  function init() {
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  return { register, init, navigate };
})();
