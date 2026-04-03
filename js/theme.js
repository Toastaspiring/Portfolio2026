/* ============================================
   THEME — Dark/light toggle with system pref
   ============================================ */

const Theme = (() => {
  const STORAGE_KEY = 'portfolio-theme';

  function get() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Swap hljs theme
    const hljsLink = document.getElementById('hljs-theme');
    if (hljsLink) {
      hljsLink.href = theme === 'light'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    set(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    set(get());

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        set(e.matches ? 'dark' : 'light');
      }
    });
  }

  return { init, toggle, get, set };
})();
