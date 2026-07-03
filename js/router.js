/* ============================================
   ROUTER, Hash-based SPA routing.
   Plain content swap with a short fade. No panels.
   ============================================ */

const Router = (() => {
  const routes = {};
  let currentRoute = null;

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

  /* Rewrite the browser URL to the canonical path form for panels:
   *   #/         -> /
   *   #/blog     -> /blog/
   *   #/projects -> /projects/
   * Post routes handle their own replaceState in pages.blogPost(). */
  function syncUrlPath(hashPath) {
    if (hashPath.startsWith('#/blog/') && hashPath !== '#/blog') return;
    let target;
    if (hashPath === '#/') target = '/';
    else if (hashPath === '#/blog') target = '/blog/';
    else if (hashPath === '#/projects') target = '/projects/';
    else return;

    const url = new URL(window.location.href);
    url.pathname = target;
    url.searchParams.delete('lang');
    url.hash = '';
    const desired = url.pathname + url.search;
    const currentNoHash = window.location.pathname + window.location.search;
    if (currentNoHash !== desired || window.location.hash) {
      history.replaceState(null, '', desired);
    }
  }

  /* Highlight the active nav link in the header. */
  function updateActiveNav(path) {
    const key = path.startsWith('#/blog') ? 'blog'
      : path.startsWith('#/projects') ? 'projects'
      : 'home';
    document.querySelectorAll('.site-nav__link[data-nav]').forEach(link => {
      link.classList.toggle('is-active', link.dataset.nav === key);
    });
  }

  async function navigate() {
    const { path, params } = getRoute();
    syncUrlPath(path);
    updateActiveNav(path);

    const handler = routes[path] || routes['#/'];
    const app = document.getElementById('app');

    // Article mode → show the reading-progress bar (CSS gated on this class).
    document.body.classList.toggle('is-article', path.startsWith('#/blog/') && path !== '#/blog');

    const supportsVT = typeof document.startViewTransition === 'function';

    if (currentRoute !== null && !supportsVT) {
      app.classList.add('page-transition-exit');
      await new Promise(r => setTimeout(r, 140));
    }

    app.innerHTML = '';
    app.classList.remove('page-transition-exit');
    if (!supportsVT && currentRoute !== null) app.classList.add('page-transition-enter');

    window.scrollTo({ top: 0 });
    await handler(app, params, path);

    if (typeof Animations !== 'undefined') Animations.observeElements();

    if (!supportsVT) {
      setTimeout(() => app.classList.remove('page-transition-enter'), 260);
    }

    currentRoute = path;
  }

  function init() {
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  return { register, init, navigate };
})();
