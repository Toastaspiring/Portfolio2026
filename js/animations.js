/* ============================================
   ANIMATIONS — Scroll reveal, scroll progress
   ============================================ */

const Animations = (() => {
  let observer;

  function init() {
    initScrollReveal();
    initScrollProgress();
  }

  /* Intersection Observer for scroll reveals */
  function initScrollReveal() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });
  }

  /* Observe elements — call after each page render */
  function observeElements() {
    const targets = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger, .hero-text-reveal');
    let count = 0;
    targets.forEach((el) => {
      // Skip elements already revealed
      if (el.classList.contains('visible')) return;
      count++;
      observer.observe(el);
    });
  }

  /* Scroll progress bar */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
      });
    }, { passive: true });
  }

  return { init, observeElements };
})();
