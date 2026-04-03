/* ============================================
   CURSOR — Simple modern crosshair
   Red accent, clean, visible
   ============================================ */

const Cursor = (() => {
  let el;
  let mouseX = -100, mouseY = -100;
  let curX = -100, curY = -100;
  let isHovering = false;
  let visible = false;

  function init() {
    if (window.matchMedia('(hover: none)').matches) return;

    el = document.createElement('div');
    el.id = 'custom-cursor';
    document.body.appendChild(el);

    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }

      #custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 99999;
        opacity: 0;
        transition: opacity 200ms ease;
      }

      #custom-cursor::before,
      #custom-cursor::after {
        content: '';
        position: absolute;
        background: #e63946;
        border-radius: 1px;
        transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Horizontal bar */
      #custom-cursor::before {
        width: 24px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* Vertical bar */
      #custom-cursor::after {
        width: 2px;
        height: 24px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* Hover state: slightly bigger, pourpre */
      #custom-cursor.is-hover::before {
        width: 28px;
        height: 2px;
        background: #8b1a2b;
      }
      #custom-cursor.is-hover::after {
        width: 2px;
        height: 28px;
        background: #8b1a2b;
      }

      /* Click state */
      #custom-cursor.is-click::before { width: 12px; }
      #custom-cursor.is-click::after { height: 12px; }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      el.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      visible = true;
      el.style.opacity = '1';
    });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [role="button"], .card, input, textarea') && !isHovering) {
        isHovering = true;
        el.classList.add('is-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, [role="button"], .card, input, textarea') && isHovering) {
        isHovering = false;
        el.classList.remove('is-hover');
      }
    });

    document.addEventListener('mousedown', () => el.classList.add('is-click'));
    document.addEventListener('mouseup', () => el.classList.remove('is-click'));

    animate();
  }

  function animate() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    // Center the 32x32 element on the cursor position
    el.style.transform = `translate(${curX - 16}px, ${curY - 16}px)`;
    requestAnimationFrame(animate);
  }

  return { init };
})();
