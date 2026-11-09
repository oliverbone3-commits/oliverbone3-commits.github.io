/* Snapshots: two strips of earlier work running against each other.
   Base drift + a push from page scroll (scrolling up reverses the strips), slight skew at speed. */
(() => {
  const rows = [...document.querySelectorAll('.sn-row')];
  if (!rows.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const BASE = 80;          // px per second
  let boost = 0;            // signed, from scroll velocity
  let lastY = scrollY, visible = false, last = 0;

  const strips = rows.map(row => {
    const track = row.querySelector('.sn-track');
    const originals = [...track.children];
    return { row, track, originals, dir: Number(row.dataset.dir) || 1, x: 0, w: 0, hover: 0, slow: 1 };
  });

  function measure() {
    for (const s of strips) {
      s.track.querySelectorAll('[data-clone]').forEach(n => n.remove());
      s.w = s.track.scrollWidth;                       // one set incl. trailing gap
      const need = Math.ceil((innerWidth * 2) / Math.max(s.w, 1));
      for (let i = 0; i < need; i++) for (const n of s.originals) {
        const c = n.cloneNode(true); c.dataset.clone = ''; c.setAttribute('aria-hidden', 'true');
        c.querySelector('img')?.setAttribute('alt', '');
        s.track.appendChild(c);
      }
    }
  }

  for (const s of strips) {
    s.row.addEventListener('pointerenter', () => { s.hover = 1; });
    s.row.addEventListener('pointerleave', () => { s.hover = 0; });
  }

  addEventListener('scroll', () => {
    const dy = scrollY - lastY; lastY = scrollY;
    boost = Math.max(-14, Math.min(14, boost + dy * 0.06));
  }, { passive: true });

  function frame(t) {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    boost *= Math.pow(0.04, dt);                       // ease back to drift
    const push = 1 + Math.abs(boost);
    const sign = boost < -0.6 ? -1 : 1;                // scrolling up turns the strips around
    for (const s of strips) {
      s.slow += ((s.hover ? 0.15 : 1) - s.slow) * Math.min(1, dt * 6);
      s.x += s.dir * sign * BASE * push * s.slow * dt;
      const w = s.w || 1;
      const x = ((s.x % w) + w) % w;
      const skew = Math.max(-5, Math.min(5, boost * 0.45 * s.dir));
      s.track.style.transform = `translate3d(${-x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    }
    if (visible) requestAnimationFrame(frame); else last = 0;
  }

  new IntersectionObserver(([e]) => {
    const was = visible; visible = e.isIntersecting;
    if (visible && !was) requestAnimationFrame(frame);
  }).observe(document.querySelector('.snaps'));

  const start = () => { measure(); for (const s of strips) s.x = s.dir < 0 ? 0 : s.w * 0.37; };
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });
  // Lazy images change widths only if aspect-ratio failed; re-measure once they load.
  document.querySelectorAll('.sn img').forEach(img => img.complete || img.addEventListener('load', () => { clearTimeout(rt); rt = setTimeout(measure, 150); }, { once: true }));
})();
