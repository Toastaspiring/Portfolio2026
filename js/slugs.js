/* ============================================
   SLUGS — Per-post slug translations.
   Central source of truth for URL aliases.
   ============================================ */

const Slugs = (() => {
  // alias -> canonical (base slug from index.json / source filename)
  const canonicalBySlug = {};
  // canonical -> { lang: alias, ... }
  const byCanonical = {};
  let readyPromise = null;

  function load() {
    if (readyPromise) return readyPromise;
    readyPromise = fetch('/posts/slugs.json')
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}))
      .then(data => {
        for (const [canonical, langMap] of Object.entries(data || {})) {
          canonicalBySlug[canonical] = canonical;
          byCanonical[canonical] = { ...langMap };
          for (const alias of Object.values(langMap)) {
            if (typeof alias === 'string') canonicalBySlug[alias] = canonical;
          }
        }
      })
      .catch(() => { /* ignore — fallback to identity resolution */ });
    return readyPromise;
  }

  /* Resolve any URL slug (canonical or per-lang alias) to the canonical slug
     used for file lookups. Unknown slugs pass through unchanged. */
  function canonical(slug) {
    return canonicalBySlug[slug] || slug;
  }

  /* Return the slug to render in hrefs for a given canonical + locale.
     Falls back to canonical when no translation is defined. */
  function localized(canonicalSlug, lang) {
    const map = byCanonical[canonicalSlug];
    return (map && map[lang]) || canonicalSlug;
  }

  return { load, canonical, localized, ready: () => readyPromise || load() };
})();

// Kick off the fetch immediately; callers that need correctness await ready().
Slugs.load();
