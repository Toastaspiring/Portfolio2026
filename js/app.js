/* ============================================
   APP — Bootstrap everything
   ============================================ */

(function () {
  'use strict';

  // Register routes (home renders all panel views)
  Router.register('#/', Pages.home);
  Router.register('#/projects', Pages.home);
  Router.register('#/blog', Pages.home);
  Router.register('#/blog/:slug', Pages.blogPost);
  Router.register('#/about', Pages.about);

  // Init modules
  Theme.init();
  Cursor.init();
  Animations.init();

  // Init mermaid with dark theme
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#e63946',
        primaryBorderColor: '#8b1a2b',
        primaryTextColor: '#f2eeef',
        lineColor: '#9b8b90',
        secondaryColor: '#1a1214',
        tertiaryColor: '#201518',
        fontFamily: 'Inter, sans-serif',
      }
    });
  }

  Router.init();
})();
