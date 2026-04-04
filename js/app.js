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
    hackerEl.style.cssText = `
      position: fixed; inset: 0; z-index: -2;
      background: #000; overflow: hidden;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; line-height: 1.6;
      color: #0f0; padding: 20px;
      opacity: 0; transition: opacity 1s ease;
      white-space: pre; pointer-events: none;
    `;
    document.body.appendChild(hackerEl);
    requestAnimationFrame(() => { hackerEl.style.opacity = '0.2'; });

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

    for (let layer = 0; layer < 2; layer++) {
      const amplitude = layer === 0 ? 6 : 4;
      const frequency = layer === 0 ? 0.02 : 0.03;
      const speed = layer === 0 ? t * 2 : -t * 1.5;
      const offset = layer === 0 ? 0 : 2;
      const alpha = layer === 0 ? 0.25 : 0.15;

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

      const grad = ctx.createLinearGradient(0, baseY, 0, h);
      grad.addColorStop(0, `rgba(230, 57, 70, ${alpha})`);
      grad.addColorStop(1, `rgba(139, 26, 43, ${alpha + 0.1})`);
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

      bg.style.backgroundImage = `url(${dataUrl})`;
      bg.style.filter = 'brightness(0.15) saturate(0.6)';
      requestAnimationFrame(() => { bg.style.opacity = '1'; });

      // Hide the mesh gradient
      const mesh = document.querySelector('.mesh-gradient');
      if (mesh) mesh.style.opacity = '0';

    } catch (e) {
      // Camera denied or unavailable — silently ignore
    }
  }
})();
