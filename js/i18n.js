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

  /* Silently sync ?lang=xx with the active locale via replaceState — no
     reload, no router trigger (the hash is untouched). Default locale is
     kept off the URL to keep FR URLs clean; non-default is always shown
     so shared/copied links land the recipient on the same language. */
  function syncUrlParam(locale) {
    try {
      const url = new URL(window.location.href);
      const currentParam = url.searchParams.get('lang');
      if (locale === DEFAULT) {
        if (currentParam === null) return;
        url.searchParams.delete('lang');
      } else {
        if (currentParam === locale) return;
        url.searchParams.set('lang', locale);
      }
      window.history.replaceState(null, '', url.toString());
    } catch (_) { /* ignore URL parsing issues */ }
  }

  /* Pick the initial locale:
     1. URL ?lang=xx — shareable deep links, highest priority (also persisted).
     2. Explicit user choice in localStorage.
     3. Browser / system languages (navigator.languages → navigator.language),
        matched by short tag (e.g. "en-US" → "en").
     4. Fall back to French. */
  function getStoredLocale() {
    const urlLang = getUrlLang();
    if (urlLang) {
      localStorage.setItem(STORAGE_KEY, urlLang);
      return urlLang;
    }

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

  // Keep URL ?lang=xx in sync with the active locale so copied URLs
  // always reproduce the same experience for the recipient.
  syncUrlParam(current);

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

  /* Change locale: persist, rewrite the URL to reflect the new lang, and
     navigate. location.replace() forces navigation to the new URL —
     location.reload() ignores history.replaceState() and re-fetches the
     original URL, which would re-read the stale ?lang= and clobber the
     localStorage we just wrote. */
  function setLocale(locale) {
    if (!LOCALES.includes(locale)) return;
    localStorage.setItem(STORAGE_KEY, locale);

    const url = new URL(window.location.href);
    if (locale === DEFAULT) url.searchParams.delete('lang');
    else url.searchParams.set('lang', locale);

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
