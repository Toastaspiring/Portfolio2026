/* ============================================
   I18N — Inline dictionaries (synchronous).
   Keeps current locale in localStorage, exposes
   t(key) for UI lookups. No fetch at boot.
   ============================================ */

const I18n = (() => {

  const LOCALES = ['fr', 'en', 'de', 'es'];
  const DEFAULT = 'fr';
  const STORAGE_KEY = 'portfolio-locale';

  const LOCALE_NAMES = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
  };

  /* ---- Dictionaries (inline, synchronous) ---- */

  const DICTS = {
    fr: {
      meta: {
        title: 'Louis — Dev Portfolio',
        description: 'Dev autodidacte basé en France. AI, computer vision, et des trucs qui marchent (des fois).',
        og_title: 'Louis — Dev Portfolio',
        og_description: 'Dev autodidacte basé en France. AI, computer vision, et des trucs qui marchent (des fois).',
      },
      site: {
        name: 'Louis',
        tagline: 'Des trucs qui comptent, construits avec soin.',
      },
      nav: {
        home: 'Accueil',
        blog: 'Blog',
        projects: 'Projets',
        about: 'À propos',
      },
      home: {
        badge_available: 'DISPONIBLE',
        tagline_html: "Je code, je break, je recommence. <em>Des fois ça marche du premier coup</em> — mais c'est rare.",
        cta_projects: 'Projets',
        cta_blog: 'Blog',
        stats_years: 'Ans',
        stats_projects: 'Projets',
        stats_curiosity: 'Curiosité',
        intro_html: '<strong>Autodidacte</strong>, basé en <span class="accent-fr">France</span>. Je touche à tout, ça marche pas tout le temps. En ce moment je build des trucs en <strong class="accent-fr">AI</strong> et <strong class="purple-fr">computer vision</strong>.',
        ai_engineer_big: 'AI',
        ai_engineer_sub: 'ENGINEER',
        stack_label: 'STACK',
        status_label: 'STATUS',
        git_log_cmd: '$ git log --oneline -1',
        git_log_msg: 'fix: fix the fix that fixed the fix',
        coffee_comment: '# unreachable: coffee is always truthy',
      },
      projects: {
        title: 'Projets',
        subtitle: 'Open source & side projects',
        back_home: 'Accueil',
        empty: 'Aucun repo trouvé.',
        load_error: 'Impossible de load les repos GitHub.',
        stats_repos: 'REPOS',
        stats_stars: 'STARS',
        stats_forks: 'FORKS',
        stats_langs: 'LANGS',
      },
      blog: {
        title: 'Blog',
        back_home: 'Accueil',
        empty: 'Aucun post pour le moment.',
        reading_time_suffix: 'min',
        reading_time_full: 'min de lecture',
        not_found: 'Post non trouvé',
        back_to_blog: 'Retour au blog',
        all_posts: 'Tous les posts',
      },
      tags: {
        AI: 'IA',
        'reinforcement-learning': 'Reinforcement Learning',
        'deep-learning': 'Deep Learning',
        'neural-networks': 'Réseaux de neurones',
        python: 'Python',
        math: 'Maths',
        business: 'Business',
        strategy: 'Stratégie',
        automation: 'Automatisation',
        meta: 'Méta',
        personal: 'Personnel',
        humor: 'Humour',
        test: 'Test',
        markdown: 'Markdown',
        debug: 'Debug',
      },
      footer: {
        tagline: 'Je construis des trucs.',
        copyright: 'Disponible · France · © 2026 Louis',
        lang_aria: 'Choisir la langue',
      },
    },

    en: {
      meta: {
        title: 'Louis — Dev Portfolio',
        description: 'Self-taught developer based in France. AI, computer vision, and things that work (sometimes).',
        og_title: 'Louis — Dev Portfolio',
        og_description: 'Self-taught developer based in France. AI, computer vision, and things that work (sometimes).',
      },
      site: {
        name: 'Louis',
        tagline: 'Things that matter, built with care.',
      },
      nav: {
        home: 'Home',
        blog: 'Blog',
        projects: 'Projects',
        about: 'About',
      },
      home: {
        badge_available: 'AVAILABLE',
        tagline_html: "I code, I break stuff, I start over. <em>Sometimes it works on the first try</em> — but that's rare.",
        cta_projects: 'Projects',
        cta_blog: 'Blog',
        stats_years: 'Years',
        stats_projects: 'Projects',
        stats_curiosity: 'Curiosity',
        intro_html: '<strong>Self-taught</strong>, based in <span class="accent-fr">France</span>. I dabble in everything, it doesn\'t always work out. Right now I\'m building things in <strong class="accent-fr">AI</strong> and <strong class="purple-fr">computer vision</strong>.',
        ai_engineer_big: 'AI',
        ai_engineer_sub: 'ENGINEER',
        stack_label: 'STACK',
        status_label: 'STATUS',
        git_log_cmd: '$ git log --oneline -1',
        git_log_msg: 'fix: fix the fix that fixed the fix',
        coffee_comment: '# unreachable: coffee is always truthy',
      },
      projects: {
        title: 'Projects',
        subtitle: 'Open source & side projects',
        back_home: 'Home',
        empty: 'No repos found.',
        load_error: "Couldn't load GitHub repos.",
        stats_repos: 'REPOS',
        stats_stars: 'STARS',
        stats_forks: 'FORKS',
        stats_langs: 'LANGS',
      },
      blog: {
        title: 'Blog',
        back_home: 'Home',
        empty: 'No posts yet.',
        reading_time_suffix: 'min read',
        reading_time_full: 'min read',
        not_found: 'Post not found',
        back_to_blog: 'Back to blog',
        all_posts: 'All posts',
      },
      tags: {
        AI: 'AI',
        'reinforcement-learning': 'Reinforcement Learning',
        'deep-learning': 'Deep Learning',
        'neural-networks': 'Neural Networks',
        python: 'Python',
        math: 'Math',
        business: 'Business',
        strategy: 'Strategy',
        automation: 'Automation',
        meta: 'Meta',
        personal: 'Personal',
        humor: 'Humor',
        test: 'Test',
        markdown: 'Markdown',
        debug: 'Debug',
      },
      footer: {
        tagline: 'I build stuff.',
        copyright: 'Available · France · © 2026 Louis',
        lang_aria: 'Choose language',
      },
    },

    de: {
      meta: {
        title: 'Louis — Dev Portfolio',
        description: 'Autodidaktischer Entwickler aus Frankreich. KI, Computer Vision und Sachen, die (manchmal) funktionieren.',
        og_title: 'Louis — Dev Portfolio',
        og_description: 'Autodidaktischer Entwickler aus Frankreich. KI, Computer Vision und Sachen, die (manchmal) funktionieren.',
      },
      site: {
        name: 'Louis',
        tagline: 'Dinge, die zählen — mit Sorgfalt gebaut.',
      },
      nav: {
        home: 'Startseite',
        blog: 'Blog',
        projects: 'Projekte',
        about: 'Über mich',
      },
      home: {
        badge_available: 'VERFÜGBAR',
        tagline_html: "Ich code, ich breche Sachen kaputt, ich fange nochmal an. <em>Manchmal funktioniert's beim ersten Versuch</em> — aber das ist selten.",
        cta_projects: 'Projekte',
        cta_blog: 'Blog',
        stats_years: 'Jahre',
        stats_projects: 'Projekte',
        stats_curiosity: 'Neugier',
        intro_html: '<strong>Autodidakt</strong>, aus <span class="accent-fr">Frankreich</span>. Ich probiere alles aus — klappt nicht immer. Gerade baue ich Sachen mit <strong class="accent-fr">KI</strong> und <strong class="purple-fr">Computer Vision</strong>.',
        ai_engineer_big: 'KI',
        ai_engineer_sub: 'ENGINEER',
        stack_label: 'STACK',
        status_label: 'STATUS',
        git_log_cmd: '$ git log --oneline -1',
        git_log_msg: 'fix: fix the fix that fixed the fix',
        coffee_comment: '# unreachable: coffee is always truthy',
      },
      projects: {
        title: 'Projekte',
        subtitle: 'Open Source & Nebenprojekte',
        back_home: 'Startseite',
        empty: 'Keine Repos gefunden.',
        load_error: 'GitHub-Repos konnten nicht geladen werden.',
        stats_repos: 'REPOS',
        stats_stars: 'STARS',
        stats_forks: 'FORKS',
        stats_langs: 'LANGS',
      },
      blog: {
        title: 'Blog',
        back_home: 'Startseite',
        empty: 'Noch keine Posts.',
        reading_time_suffix: 'Min.',
        reading_time_full: 'Min. Lesezeit',
        not_found: 'Post nicht gefunden',
        back_to_blog: 'Zurück zum Blog',
        all_posts: 'Alle Posts',
      },
      tags: {
        AI: 'KI',
        'reinforcement-learning': 'Reinforcement Learning',
        'deep-learning': 'Deep Learning',
        'neural-networks': 'Neuronale Netze',
        python: 'Python',
        math: 'Mathe',
        business: 'Business',
        strategy: 'Strategie',
        automation: 'Automatisierung',
        meta: 'Meta',
        personal: 'Persönlich',
        humor: 'Humor',
        test: 'Test',
        markdown: 'Markdown',
        debug: 'Debug',
      },
      footer: {
        tagline: 'Ich baue Sachen.',
        copyright: 'Verfügbar · Frankreich · © 2026 Louis',
        lang_aria: 'Sprache wählen',
      },
    },

    es: {
      meta: {
        title: 'Louis — Dev Portfolio',
        description: 'Desarrollador autodidacta afincado en Francia. IA, computer vision, y cosas que funcionan (a veces).',
        og_title: 'Louis — Dev Portfolio',
        og_description: 'Desarrollador autodidacta afincado en Francia. IA, computer vision, y cosas que funcionan (a veces).',
      },
      site: {
        name: 'Louis',
        tagline: 'Cosas que importan, construidas con cariño.',
      },
      nav: {
        home: 'Inicio',
        blog: 'Blog',
        projects: 'Proyectos',
        about: 'Sobre mí',
      },
      home: {
        badge_available: 'DISPONIBLE',
        tagline_html: 'Programo, rompo cosas, vuelvo a empezar. <em>A veces sale a la primera</em> — pero es raro.',
        cta_projects: 'Proyectos',
        cta_blog: 'Blog',
        stats_years: 'Años',
        stats_projects: 'Proyectos',
        stats_curiosity: 'Curiosidad',
        intro_html: '<strong>Autodidacta</strong>, afincado en <span class="accent-fr">Francia</span>. Toco un poco de todo, no siempre sale bien. Ahora mismo estoy construyendo cosas con <strong class="accent-fr">IA</strong> y <strong class="purple-fr">computer vision</strong>.',
        ai_engineer_big: 'IA',
        ai_engineer_sub: 'ENGINEER',
        stack_label: 'STACK',
        status_label: 'STATUS',
        git_log_cmd: '$ git log --oneline -1',
        git_log_msg: 'fix: fix the fix that fixed the fix',
        coffee_comment: '# unreachable: coffee is always truthy',
      },
      projects: {
        title: 'Proyectos',
        subtitle: 'Open source & side projects',
        back_home: 'Inicio',
        empty: 'No se encontraron repos.',
        load_error: 'No se pudieron cargar los repos de GitHub.',
        stats_repos: 'REPOS',
        stats_stars: 'STARS',
        stats_forks: 'FORKS',
        stats_langs: 'LANGS',
      },
      blog: {
        title: 'Blog',
        back_home: 'Inicio',
        empty: 'Aún no hay posts.',
        reading_time_suffix: 'min',
        reading_time_full: 'min de lectura',
        not_found: 'Post no encontrado',
        back_to_blog: 'Volver al blog',
        all_posts: 'Todos los posts',
      },
      tags: {
        AI: 'IA',
        'reinforcement-learning': 'Reinforcement Learning',
        'deep-learning': 'Deep Learning',
        'neural-networks': 'Redes Neuronales',
        python: 'Python',
        math: 'Matemáticas',
        business: 'Negocios',
        strategy: 'Estrategia',
        automation: 'Automatización',
        meta: 'Meta',
        personal: 'Personal',
        humor: 'Humor',
        test: 'Test',
        markdown: 'Markdown',
        debug: 'Debug',
      },
      footer: {
        tagline: 'Construyo cosas.',
        copyright: 'Disponible · Francia · © 2026 Louis',
        lang_aria: 'Elegir idioma',
      },
    },
  };

  /* ---- Runtime state ---- */

  /* Read ?lang=xx from the URL (case-insensitive). Returns a supported locale
     or null. Query param must appear before the hash: /?lang=en#/blog/xxx. */
  function getUrlLang() {
    const match = window.location.search.match(/[?&]lang=([^&]+)/);
    if (!match) return null;
    const lang = decodeURIComponent(match[1]).toLowerCase();
    return LOCALES.includes(lang) ? lang : null;
  }

  /* Detect the language from the pathname prefix ("/en/...", "/de/...",
     "/fr/..."). Returns a supported locale or null. Accepts the default
     lang too — /fr/ is a pre-rendered alias and must be honoured so a
     user with a stale localStorage doesn't get served the wrong language. */
  function getPathLang() {
    const match = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (match && LOCALES.includes(match[1])) return match[1];
    return null;
  }

  /* Pick the initial locale. Path prefix is the canonical source of truth
     post-build (pre-rendered pages live at /en/, /de/..., etc); ?lang= still
     wins when explicitly provided (shared legacy hash URLs, deep links).
     1. URL ?lang=xx — explicit override, persisted.
     2. URL pathname prefix — /en/..., /de/..., /es/...
     3. Explicit user choice in localStorage.
     4. Browser / system languages (navigator.languages → navigator.language).
     5. Fall back to French. */
  function getStoredLocale() {
    const urlLang = getUrlLang();
    if (urlLang) {
      localStorage.setItem(STORAGE_KEY, urlLang);
      return urlLang;
    }

    const pathLang = getPathLang();
    if (pathLang) return pathLang;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (LOCALES.includes(stored)) return stored;

    const browserLangs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ''];
    for (const raw of browserLangs) {
      const short = String(raw).toLowerCase().split('-')[0];
      if (LOCALES.includes(short)) return short;
    }
    return DEFAULT;
  }

  let current = getStoredLocale();
  let dict = DICTS[current] || DICTS[DEFAULT];

  // Reflect the locale on the root element right away.
  document.documentElement.lang = current;

  /* Resolve a dot-path key against the dictionary. */
  function t(key, fallback) {
    if (!key) return fallback ?? '';
    const parts = key.split('.');
    let val = dict;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) val = val[p];
      else return fallback ?? key;
    }
    return typeof val === 'string' ? val : (fallback ?? key);
  }

  /* Change locale: persist, rewrite the URL's pathname prefix (and post
     slug, if any) to reflect the new lang, then navigate. The pathname is
     the canonical source of truth — ?lang= is dropped, since the new path
     already communicates the language. location.replace() forces a real
     navigation; location.reload() would re-fetch the stale URL. */
  function setLocale(locale) {
    if (!LOCALES.includes(locale)) return;
    localStorage.setItem(STORAGE_KEY, locale);

    const url = new URL(window.location.href);
    url.searchParams.delete('lang');

    // Swap the pathname's lang prefix. /en/blog/ -> /de/blog/, / -> /de/,
    // /blog/ -> /de/blog/, etc. Default lang has no prefix.
    const pathMatch = url.pathname.match(/^\/(fr|en|de|es)(\/.*)?$/);
    const rest = pathMatch ? (pathMatch[2] || '/') : url.pathname;
    const newPrefix = locale === DEFAULT ? '' : '/' + locale;
    url.pathname = newPrefix + (rest.startsWith('/') ? rest : '/' + rest);

    // Rewrite blog post slug to its new-lang alias — both in the hash (SPA
    // hash routes) and in the pathname (pre-rendered path URLs).
    const hashMatch = url.hash.match(/^#\/blog\/(.+)$/);
    if (hashMatch && typeof Slugs !== 'undefined') {
      const canonical = Slugs.canonical(hashMatch[1]);
      const next = Slugs.localized(canonical, locale);
      if (next !== hashMatch[1]) url.hash = '#/blog/' + next;
    }
    const pathPostMatch = url.pathname.match(/^(?:\/[a-z]{2})?\/blog\/([^/]+)\/?$/);
    if (pathPostMatch && typeof Slugs !== 'undefined') {
      const canonical = Slugs.canonical(pathPostMatch[1]);
      const next = Slugs.localized(canonical, locale);
      url.pathname = newPrefix + '/blog/' + next + '/';
    }

    const target = url.toString();
    if (target === window.location.href) window.location.reload();
    else window.location.replace(target);
  }

  /* Get the post file suffix: '' for FR, '.en' / '.de' / '.es' otherwise. */
  function postSuffix() {
    return current === DEFAULT ? '' : '.' + current;
  }

  return {
    t,
    setLocale,
    current: () => current,
    locales: () => LOCALES.slice(),
    localeNames: () => ({ ...LOCALE_NAMES }),
    postSuffix,
  };
})();
