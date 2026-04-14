/* ============================================
   APP — Bootstrap everything
   ============================================ */

(function () {
  'use strict';

  // I18n is synchronous (dicts are inlined in i18n.js), so we can apply
  // static strings and render immediately without awaiting anything.
  applyStaticI18n();
  setupScrollGate();

  // Register routes (home renders all panel views)
  Router.register('#/', Pages.home);
  Router.register('#/projects', Pages.home);
  Router.register('#/blog', Pages.home);
  Router.register('#/blog/:slug', Pages.blogPost);

  // Init modules
  Theme.init();
  Cursor.init();
  Animations.init();

  /* Update static index.html strings: title, meta, footer copyright,
     and wire up the language switcher. */
  function applyStaticI18n() {
    const t = I18n.t;
    document.title = t('meta.title');
    const setMeta = (sel, val) => {
      const el = document.querySelector(sel);
      if (el && val) el.setAttribute('content', val);
    };
    setMeta('meta[name="description"]', t('meta.description'));
    setMeta('meta[property="og:title"]', t('meta.og_title'));
    setMeta('meta[property="og:description"]', t('meta.og_description'));
    setMeta('meta[name="twitter:title"]', t('meta.og_title'));
    setMeta('meta[name="twitter:description"]', t('meta.og_description'));

    // Footer copyright + tagline
    const footerTagline = document.querySelector('.footer__tagline');
    if (footerTagline) footerTagline.textContent = t('footer.tagline');
    const footerCopyright = document.querySelector('.footer__bottom p');
    if (footerCopyright) footerCopyright.innerHTML = t('footer.copyright').replace(/·/g, '&middot;');

    // Wire up the custom language picker
    setupLangPicker();
  }

  /* Custom language picker: pill trigger + popover list. Keyboard accessible,
     closes on outside click / Escape, arrow key navigation between options. */
  function setupLangPicker() {
    const picker = document.getElementById('lang-picker');
    if (!picker) return;

    const trigger = picker.querySelector('.lang-picker__trigger');
    const menu = picker.querySelector('.lang-picker__menu');
    const options = [...picker.querySelectorAll('.lang-picker__option')];
    const codeEl = picker.querySelector('[data-lang-code]');
    const current = I18n.current();

    // Sync initial state
    trigger.setAttribute('aria-label', I18n.t('footer.lang_aria'));
    if (codeEl) codeEl.textContent = current.toUpperCase();
    options.forEach(opt => {
      opt.setAttribute('aria-selected', opt.dataset.lang === current ? 'true' : 'false');
    });

    let focusedIndex = options.findIndex(o => o.dataset.lang === current);
    if (focusedIndex < 0) focusedIndex = 0;

    function open() {
      picker.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      setFocused(focusedIndex);
      document.addEventListener('click', onOutside);
      document.addEventListener('keydown', onKey);
    }

    function close() {
      picker.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      options.forEach(o => o.classList.remove('is-focused'));
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
    }

    function toggle() {
      if (picker.classList.contains('is-open')) close();
      else open();
    }

    function setFocused(i) {
      focusedIndex = ((i % options.length) + options.length) % options.length;
      options.forEach((o, idx) => o.classList.toggle('is-focused', idx === focusedIndex));
      options[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }

    function select(lang) {
      if (lang === I18n.current()) { close(); return; }
      I18n.setLocale(lang);
    }

    function onOutside(e) {
      if (!picker.contains(e.target)) close();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocused(focusedIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocused(focusedIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocused(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setFocused(options.length - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(options[focusedIndex].dataset.lang);
      }
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!picker.classList.contains('is-open')) open();
      }
    });

    options.forEach((opt, i) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        select(opt.dataset.lang);
      });
      opt.addEventListener('mouseenter', () => setFocused(i));
    });
  }

  /* Scroll gate: on panel routes the body is overflow:hidden, so the hero
     stays fullscreen by default. The gate opens (body.scroll-hint) when
     EITHER the mouse approaches the viewport bottom OR the user has already
     scrolled down — that way, moving the mouse away while reading the footer
     doesn't trap the user; they can always scroll back up to the hero. */
  function setupScrollGate() {
    const BOTTOM_THRESHOLD = 140;
    const SCROLLED_THRESHOLD = 8;
    let lastY = 0;

    function update() {
      const mouseNearBottom = lastY > window.innerHeight - BOTTOM_THRESHOLD;
      const alreadyScrolled = window.scrollY > SCROLLED_THRESHOLD;
      const shouldUnlock = mouseNearBottom || alreadyScrolled;
      document.body.classList.toggle('scroll-hint', shouldUnlock);
    }

    document.addEventListener('mousemove', (e) => { lastY = e.clientY; update(); });
    document.addEventListener('mouseleave', () => { lastY = 0; update(); });
    window.addEventListener('scroll', update, { passive: true });

    // Touch devices: tapping the bottom strip also opens the gate briefly.
    document.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (t) { lastY = t.clientY; update(); }
    }, { passive: true });
  }

  // Init mermaid with theme-aware config
  function initMermaid() {
    if (typeof mermaid === 'undefined') return;
    const isLight = document.documentElement.dataset.theme === 'light';
    mermaid.initialize({
      startOnLoad: false,
      theme: isLight ? 'base' : 'dark',
      themeVariables: isLight ? {
        primaryColor: '#f5eeee',
        primaryBorderColor: '#c2223b',
        primaryTextColor: '#1a0e10',
        lineColor: '#7a6068',
        secondaryColor: '#ebe0e0',
        tertiaryColor: '#fdf8f8',
        fontFamily: 'Inter, sans-serif',
        noteBkgColor: '#f5eeee',
        noteTextColor: '#1a0e10',
        pie1: '#c2223b',
        pie2: '#7a1525',
        pie3: '#d4838d',
        pieTextColor: '#1a0e10',
        xyChart: {
          backgroundColor: 'transparent',
          titleColor: '#1a0e10',
          xAxisLabelColor: '#5a4048',
          yAxisLabelColor: '#5a4048',
          xAxisTitleColor: '#1a0e10',
          yAxisTitleColor: '#1a0e10',
          xAxisTickColor: '#ebe0e0',
          yAxisTickColor: '#ebe0e0',
          xAxisLineColor: '#ebe0e0',
          yAxisLineColor: '#ebe0e0',
          plotColorPalette: '#d4838d',
        },
      } : {
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
  initMermaid();

  // Re-init mermaid when theme changes
  const themeObserver = new MutationObserver(() => initMermaid());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  Router.init();

  // Easter egg: click the CV eye icon 7 times → webcam background
  let eyeClicks = 0;
  let eyeTimer = null;
  document.addEventListener('click', (e) => {
    const eye = e.target.closest('#cv-eye');
    if (!eye) return;

    clearTimeout(eyeTimer);
    eyeClicks++;

    // Reset counter after 2s of no clicks
    eyeTimer = setTimeout(() => { eyeClicks = 0; }, 2000);

    if (eyeClicks >= 7) {
      eyeClicks = 0;
      captureWebcamBackground();
    }
  });

  // Easter egg: click Linux icon 7 times → hacker terminal background
  let linuxClicks = 0;
  let linuxTimer = null;
  let hackerActive = false;
  document.addEventListener('click', (e) => {
    const icon = e.target.closest('#linux-icon');
    if (!icon) return;

    clearTimeout(linuxTimer);
    linuxClicks++;
    linuxTimer = setTimeout(() => { linuxClicks = 0; }, 2000);

    if (linuxClicks >= 7) {
      linuxClicks = 0;
      if (hackerActive) {
        stopHackerMode();
      } else {
        startHackerMode();
      }
    }
  });

  const hackerLines = [
    '$ sudo rm -rf /boredom',
    '[sudo] password for louis: ********',
    'Removing boredom... done.',
    '$ nmap -sV portfolio.local',
    'Starting Nmap 7.94 ( https://nmap.org )',
    'PORT     STATE SERVICE  VERSION',
    '22/tcp   open  ssh      OpenSSH 9.2',
    '80/tcp   open  http     nginx 1.24',
    '443/tcp  open  ssl/http nginx 1.24',
    '8080/tcp open  http     Python 3.12',
    '$ cat /etc/shadow',
    'Permission denied. Nice try.',
    '$ python3 -c "import antigravity"',
    '$ gcc -o life life.c',
    'life.c:42: warning: implicit declaration of sleep()',
    'life.c:69: error: too many arguments to function happiness()',
    '$ git log --oneline --all',
    'e4f2a1b fix: fix the fix that fixed the fix',
    'a1b2c3d feat: mass commit because yolo',
    'f00ba12 refactor: renamed everything for no reason',
    'd34db33f chore: deleted node_modules (again)',
    '$ top -b -n 1 | head -5',
    'PID USER      PR  NI    VIRT    RES  COMMAND',
    '  1 root      20   0   12.3g   2.1g  chrome',
    '  2 louis     20   0    4.2g   1.8g  vscode',
    '  3 louis     20   0    2.1g   0.9g  spotify',
    '  4 root      20   0    0.5g   0.1g  everything-else',
    '$ curl -s wttr.in/France?format=3',
    'France: ⛅ +18°C',
    '$ fortune | cowsay',
    ' _________________________________',
    '/ Il mass commit parce que        \\',
    '\\ "git is just a backup tool"     /',
    ' ---------------------------------',
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
    '$ echo $((13*3+7))',
    '46',
    '$ whoami',
    'louis — dev qui fait semblant de savoir ce qui se passe',
    '$ uptime',
    ' 23:42:01 up 347 days, 12:03, mass-commit-count: 1',
    '$ neofetch',
    '  ████████   OS: Portfolio v3.0',
    '  ██    ██   Host: localhost:8000',
    '  ████████   Kernel: vanilla JS',
    '  ██    ██   Packages: 0 (npm)',
    '  ████████   Shell: aucun framework',
    '             Coffee: ∞',
    '$ _',
  ];

  let hackerInterval = null;
  let hackerEl = null;

  function startHackerMode() {
    hackerActive = true;

    hackerEl = document.createElement('div');
    hackerEl.id = 'hacker-bg';
    const isLight = document.documentElement.dataset.theme === 'light';
    hackerEl.style.cssText = `
      position: fixed; inset: 0; z-index: -2;
      background: ${isLight ? '#f5eeee' : '#000'}; overflow: hidden;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; line-height: 1.6;
      color: ${isLight ? '#a81d33' : '#0f0'}; padding: 20px;
      opacity: 0; transition: opacity 1s ease;
      white-space: pre; pointer-events: none;
    `;
    document.body.appendChild(hackerEl);
    requestAnimationFrame(() => { hackerEl.style.opacity = isLight ? '0.3' : '0.2'; });

    const mesh = document.querySelector('.mesh-gradient');
    if (mesh) mesh.style.opacity = '0';

    let lineIndex = 0;
    let content = '';

    hackerInterval = setInterval(() => {
      const line = hackerLines[lineIndex % hackerLines.length];
      content += line + '\n';

      // Keep only last 40 lines
      const lines = content.split('\n');
      if (lines.length > 40) content = lines.slice(-40).join('\n');

      hackerEl.textContent = content;
      lineIndex++;
    }, 250);
  }

  function stopHackerMode() {
    hackerActive = false;
    if (hackerInterval) clearInterval(hackerInterval);
    if (hackerEl) {
      hackerEl.style.opacity = '0';
      setTimeout(() => hackerEl.remove(), 1000);
    }
    const mesh = document.querySelector('.mesh-gradient');
    if (mesh) mesh.style.opacity = '';
  }

  // Easter egg: AI ENGINEER → click 5 times → cycle funny titles
  const funnyTitles = [
    ['AI', 'ENGINEER'],
    ['BUG', 'CREATOR'],
    ['STACK', 'OVERFLOW'],
    ['CTRL+C', 'CTRL+V'],
    ['COFFEE', 'TO CODE'],
    ['SUDO', 'MAKE IT'],
    ['404', 'TALENT'],
    ['GIT', 'PUSHER'],
    ['NPM', 'INSTALL'],
    ['YAML', 'INDENT'],
    ['SEG', 'FAULT'],
    ['NULL', 'POINTER'],
    ['WORKS', 'ON MY PC'],
    ['CHMOD', '777'],
    ['TODO', 'FIXME'],
  ];
  let titleClicks = 0;
  let titleTimer = null;
  let titleIndex = 0;
  document.addEventListener('click', (e) => {
    const card = e.target.closest('#egg-title');
    if (!card) return;
    clearTimeout(titleTimer);
    titleClicks++;
    titleTimer = setTimeout(() => { titleClicks = 0; }, 1500);

    if (titleClicks >= 5) {
      titleClicks = 0;
      titleIndex = (titleIndex + 1) % funnyTitles.length;
      const [big, sub] = funnyTitles[titleIndex];
      const bigEl = document.getElementById('egg-title-big');
      const subEl = document.getElementById('egg-title-sub');
      if (bigEl && subEl) {
        // Spin animation
        card.animate([
          { transform: 'scale(1) rotateY(0)' },
          { transform: 'scale(0.8) rotateY(90deg)', offset: 0.4 },
          { transform: 'scale(0.8) rotateY(90deg)', offset: 0.5 },
          { transform: 'scale(1) rotateY(0)' },
        ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        setTimeout(() => {
          bigEl.textContent = big;
          subEl.textContent = sub;
        }, 225);
      }
    }
  });

  // Easter egg: Git widget → click → random commit message
  const gitMsgs = [
    'fix: fix the fix that fixed the fix',
    'feat: mass commit parce que yolo',
    'chore: deleted node_modules (again)',
    'fix: ça marchait avant je comprends pas',
    'refactor: renamed everything for no reason',
    'feat: add AI (it just prints hello world)',
    'hotfix: oops wrong branch',
    'fix: remove console.log (for real this time)',
    'chore: npm audit fix --force (pray)',
    'feat: dark mode (it was already dark)',
    'fix: typo in the typo fix',
    'wip: TODO fix later (2 years ago)',
    'refactor: rewrite everything from scratch',
    'fix: works on my machine ¯\\_(ツ)_/¯',
    'chore: update dependencies (broke everything)',
    'feat: added 47 packages for a button',
    'fix: remove fix that broke the fix',
    'style: align div (3 hours later)',
  ];
  document.addEventListener('click', (e) => {
    const card = e.target.closest('#egg-git');
    if (!card) return;
    const msgEl = document.getElementById('egg-git-msg');
    if (!msgEl) return;
    const hash = Math.random().toString(16).slice(2, 9);
    const msg = gitMsgs[Math.floor(Math.random() * gitMsgs.length)];
    msgEl.innerHTML = `<span style="color: var(--purple);">${hash}</span> ${msg}`;
    // Glitch flash
    card.animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(2)', offset: 0.1 },
      { filter: 'brightness(1)' },
    ], { duration: 200 });
  });

  // Easter egg: Coffee widget → hover 3s → fills with red liquid
  let coffeeHoverTimer = null;
  let coffeeFilled = false;

  // Coffee fill CSS
  const coffeeStyle = document.createElement('style');
  coffeeStyle.textContent = `
    .coffee-canvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
      border-radius: inherit;
    }
  `;
  document.head.appendChild(coffeeStyle);

  // Use event delegation with mouseenter/mouseleave simulation via pointer tracking
  let coffeeAnimId = null;
  let coffeeDraining = false;
  let coffeeCanvas = null;
  let coffeeFillLevel = 0;

  function setupCoffeeEgg() {
    const card = document.getElementById('egg-coffee');
    if (!card || card.dataset.eggBound) return;
    card.dataset.eggBound = 'true';

    card.addEventListener('mouseenter', () => {
      if (coffeeDraining) return;
      coffeeHoverTimer = setTimeout(() => fillCoffee(card), 3000);
    });

    card.addEventListener('mouseleave', () => {
      if (coffeeHoverTimer) {
        clearTimeout(coffeeHoverTimer);
        coffeeHoverTimer = null;
      }
      if (coffeeFilled) {
        drainCoffee(card);
      }
    });
  }

  function drawWaves(ctx, w, h, level, t) {
    ctx.clearRect(0, 0, w, h);
    const baseY = h - level * h;
    const isLight = document.documentElement.dataset.theme === 'light';

    for (let layer = 0; layer < 2; layer++) {
      const amplitude = layer === 0 ? 6 : 4;
      const frequency = layer === 0 ? 0.02 : 0.03;
      const speed = layer === 0 ? t * 2 : -t * 1.5;
      const offset = layer === 0 ? 0 : 2;
      const alpha = layer === 0
        ? (isLight ? 0.12 : 0.25)
        : (isLight ? 0.08 : 0.15);

      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x++) {
        const y = baseY + offset
          + Math.sin(x * frequency + speed) * amplitude
          + Math.sin(x * frequency * 0.6 + speed * 0.7 + 1.3) * amplitude * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const r1 = isLight ? '194, 34, 59' : '230, 57, 70';
      const r2 = isLight ? '122, 21, 37' : '139, 26, 43';
      const grad = ctx.createLinearGradient(0, baseY, 0, h);
      grad.addColorStop(0, `rgba(${r1}, ${alpha})`);
      grad.addColorStop(1, `rgba(${r2}, ${alpha + 0.1})`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function fillCoffee(card) {
    coffeeFilled = true;
    coffeeDraining = false;

    if (coffeeCanvas) coffeeCanvas.remove();
    const canvas = document.createElement('canvas');
    canvas.className = 'coffee-canvas';
    card.appendChild(canvas);
    coffeeCanvas = canvas;
    const ctx = canvas.getContext('2d');

    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    let t = 0;
    const startTime = performance.now();
    const fillDuration = 10000;

    if (coffeeAnimId) cancelAnimationFrame(coffeeAnimId);

    function draw(now) {
      if (coffeeDraining) return;
      t += 0.025;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / fillDuration, 1);
      coffeeFillLevel = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      drawWaves(ctx, w, h, coffeeFillLevel, t);

      if (progress < 1) {
        coffeeAnimId = requestAnimationFrame(draw);
      } else {
        // Keep waves moving after full
        function idle() {
          if (coffeeDraining) return;
          t += 0.025;
          drawWaves(ctx, w, h, coffeeFillLevel, t);
          coffeeAnimId = requestAnimationFrame(idle);
        }
        coffeeAnimId = requestAnimationFrame(idle);
      }
    }

    coffeeAnimId = requestAnimationFrame(draw);
  }

  function drainCoffee(card) {
    coffeeDraining = true;
    if (coffeeAnimId) cancelAnimationFrame(coffeeAnimId);
    if (!coffeeCanvas) return;

    const ctx = coffeeCanvas.getContext('2d');
    const w = coffeeCanvas.width / (window.devicePixelRatio || 1);
    const h = coffeeCanvas.height / (window.devicePixelRatio || 1);
    let t = 0;

    function drain() {
      t += 0.04;
      coffeeFillLevel -= 0.02; // drain fast

      if (coffeeFillLevel <= 0) {
        coffeeFillLevel = 0;
        ctx.clearRect(0, 0, w, h);
        coffeeCanvas.remove();
        coffeeCanvas = null;
        coffeeFilled = false;
        coffeeDraining = false;
        return;
      }

      drawWaves(ctx, w, h, coffeeFillLevel, t);
      coffeeAnimId = requestAnimationFrame(drain);
    }

    coffeeAnimId = requestAnimationFrame(drain);
  }

  // Re-bind when panels render (MutationObserver)
  new MutationObserver(() => setupCoffeeEgg()).observe(document.getElementById('app'), { childList: true, subtree: true });
  setupCoffeeEgg();

  async function captureWebcamBackground() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      await video.play();

      // Wait a frame for the camera to warm up
      await new Promise(r => setTimeout(r, 500));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      // Stop the camera
      stream.getTracks().forEach(t => t.stop());

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Create or update the background element
      let bg = document.getElementById('webcam-bg');
      if (!bg) {
        bg = document.createElement('div');
        bg.id = 'webcam-bg';
        bg.style.cssText = `
          position: fixed; inset: 0; z-index: -2;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity 1.5s ease;
        `;
        document.body.appendChild(bg);
      }

      const isLight = document.documentElement.dataset.theme === 'light';
      bg.style.backgroundImage = `url(${dataUrl})`;
      bg.style.filter = isLight ? 'brightness(0.85) saturate(0.4)' : 'brightness(0.15) saturate(0.6)';
      requestAnimationFrame(() => { bg.style.opacity = '1'; });

      // Hide the mesh gradient
      const mesh = document.querySelector('.mesh-gradient');
      if (mesh) mesh.style.opacity = '0';

    } catch (e) {
      // Camera denied or unavailable — silently ignore
    }
  }
})();
