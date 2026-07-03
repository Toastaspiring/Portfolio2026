/* ============================================
   APP — Bootstrap. French-only content; other
   languages are handled by the auto-translate
   banner (see js/pages.js), not by an i18n layer.
   ============================================ */

(function () {
  'use strict';

  // Routes — each page is a plain vertical document.
  Router.register('#/', Pages.home);
  Router.register('#/projects', Pages.projects);
  Router.register('#/blog', Pages.home);          // blog lives on the home page
  Router.register('#/blog/:slug', Pages.blogPost);

  Theme.init();
  if (typeof Animations !== 'undefined') Animations.init();

  /* Mermaid — theme-aware, neutral palette matching the design tokens. */
  function initMermaid() {
    if (typeof mermaid === 'undefined') return;
    const isLight = document.documentElement.dataset.theme === 'light';
    mermaid.initialize({
      startOnLoad: false,
      theme: isLight ? 'neutral' : 'dark',
      themeVariables: {
        fontFamily: 'Inter, sans-serif',
        primaryColor: isLight ? '#f6f8fa' : '#21262d',
        primaryBorderColor: isLight ? '#d0d7de' : '#444c56',
        primaryTextColor: isLight ? '#1f2328' : '#e6edf3',
        lineColor: isLight ? '#656d76' : '#768390',
        secondaryColor: isLight ? '#eaeef2' : '#161b22',
        tertiaryColor: isLight ? '#ffffff' : '#0d1117',
      },
    });
  }
  initMermaid();
  new MutationObserver(() => initMermaid())
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  Router.init();
})();
