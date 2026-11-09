// Next home (site/next.html): rolling numbers and the area tabs.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Odometer: digits roll into place when the number comes into view ----------
  // Every digit becomes a column 0–9; non-digits (→, –, commas, letters) stay static.
  var odos = document.querySelectorAll('[data-odo]');
  if (!reduce && 'IntersectionObserver' in window) {
    odos.forEach(function (el) {
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      var wrap = document.createElement('span');
      wrap.className = 'odo-wrap';
      wrap.setAttribute('aria-hidden', 'true');
      var digits = 0, total = (text.match(/\d/g) || []).length;
      Array.prototype.forEach.call(text, function (ch) {
        if (/\d/.test(ch)) {
          var cell = document.createElement('span');
          cell.className = 'odo';
          var col = document.createElement('span');
          // two full turns for the leading digits, one for the rest, so it feels like a counter
          var turns = digits < total - 2 ? 1 : 2;
          var seq = '';
          for (var t = 0; t < turns; t++) for (var d = 0; d < 10; d++) seq += '<span>' + d + '</span>';
          for (var e = 0; e <= +ch; e++) seq += '<span>' + e + '</span>';
          col.innerHTML = seq;
          col.dataset.to = String(turns * 10 + +ch);
          col.style.setProperty('--d', (digits * 0.06) + 's');
          cell.appendChild(col);
          wrap.appendChild(cell);
          digits++;
        } else {
          wrap.appendChild(document.createTextNode(ch === ' ' ? '\u00a0' : ch)); // flex drops plain spaces
        }
      });
      el.textContent = '';
      el.appendChild(wrap);
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        el.querySelectorAll('.odo > span').forEach(function (col) {
          col.style.transform = 'translateY(-' + (col.dataset.to * 1.12) + 'em)';
        });
      }, { threshold: 0.6 }).observe(el);
    });
  }

  // ---------- Area tabs: auto-advance while on screen, stop once someone picks a tab ----------
  var areas = document.querySelector('[data-areas]');
  if (!areas) return;
  var tabs = Array.prototype.slice.call(areas.querySelectorAll('[role="tab"]'));
  var panes = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  // No auto-advance on narrow screens: panes differ in height and the page would jump under the reader
  var current = 0, auto = !reduce && !matchMedia('(max-width: 900px)').matches, visible = false, t0 = 0, DURATION = 7000, raf = null;

  function show(i, focus) {
    current = i;
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.style.setProperty('--p', '0%');
      panes[k].hidden = !on;
      panes[k].classList.remove('is-on');
    });
    // let the pane render hidden-state first, then play the assembly
    void panes[i].offsetWidth; panes[i].classList.add('is-on');
    if (focus) tabs[i].focus();
    t0 = performance.now();
  }

  function tick(now) {
    raf = null;
    if (!auto || !visible) return;
    var k = Math.min(1, (now - t0) / DURATION);
    tabs[current].style.setProperty('--p', (k * 100) + '%');
    if (k >= 1) show((current + 1) % tabs.length);
    raf = requestAnimationFrame(tick);
  }
  function startTick() { if (auto && visible && !raf) { t0 = performance.now() - (parseFloat(tabs[current].style.getPropertyValue('--p')) || 0) / 100 * DURATION; raf = requestAnimationFrame(tick); } }

  function stopAuto() { auto = false; tabs.forEach(function (t) { t.style.setProperty('--p', '0%'); }); }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { stopAuto(); show(i); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); stopAuto(); show(0, true); return; }
      if (e.key === 'End') { e.preventDefault(); stopAuto(); show(tabs.length - 1, true); return; }
      if (!d) return;
      e.preventDefault(); stopAuto();
      show((i + d + tabs.length) % tabs.length, true);
    });
  });
  // Pause while the reader hovers the content
  areas.addEventListener('mouseenter', function () { visible = false; });
  areas.addEventListener('mouseleave', function () { visible = isIn; startTick(); });

  var isIn = false;
  new IntersectionObserver(function (entries) {
    isIn = entries[0].isIntersecting;
    visible = isIn;
    if (isIn) { if (!panes[current].classList.contains('is-on')) show(current); startTick(); }
  }, { threshold: 0, rootMargin: '-25% 0px -25% 0px' }).observe(areas);

  if (reduce) panes[0].classList.add('is-on');
})();
