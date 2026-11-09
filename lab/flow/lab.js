// Lab: the Flow Builder walkthrough driven over 1:1 recreations of the Figma frames (frames.html / frames.css).
// The frames stay as designed; this script only toggles states, moves a cursor and draws the payer checkout.
(async function () {
  var root = document.querySelector('[data-lab-flow]');
  if (!root) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vp = root.querySelector('.lab-viewport');
  var stage = root.querySelector('.lab-stage');
  var cursor = root.querySelector('.lab-cursor');
  var caption = root.querySelector('.rd-caption');
  var countEl = root.querySelector('.rd-count');
  var playBtn = root.querySelector('[data-rd="play"]');
  var prevBtn = root.querySelector('[data-rd="prev"]');
  var nextBtn = root.querySelector('[data-rd="next"]');
  var progress = root.querySelector('.rd-progress');

  var doc = document.getElementById('lab-frames').content;
  var base = root.getAttribute('data-base') || '';
  // Frames live in a shadow root so the host page's styles can't reach them: only the Figma values apply.
  var shadow = stage.attachShadow({ mode: 'open' });
  shadow.innerHTML = '<link rel="stylesheet" href="' + base + 'frames.css"><link rel="stylesheet" href="' + base + 'lab.css">' +
    '<style>:host{display:block}.fb-frame{position:absolute;inset:0;margin:0}.lab-backdrop{position:absolute;inset:0}</style>';
  shadow.appendChild(document.importNode(doc.getElementById('fb-flow'), true));
  shadow.appendChild(document.importNode(doc.getElementById('fb-form'), true));
  var backdrop = document.createElement('div');
  backdrop.className = 'lab-backdrop fb-hidden';
  backdrop.appendChild(document.importNode(doc.getElementById('fb-modal'), true));
  shadow.appendChild(backdrop);

  if (base) Array.prototype.forEach.call(shadow.querySelectorAll('img[src^="img/"]'), function (im) { im.setAttribute('src', base + im.getAttribute('src')); });
  function q(s) { return shadow.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(shadow.querySelectorAll(s)); }
  var copyRow = qa('#fb-form .fb-prow').filter(function (r) { return r.textContent.indexOf('Copyable value') >= 0; })[0];
  if (copyRow) copyRow.setAttribute('data-k', 'pal-copy');

  var scale = 1;
  function fit() { scale = vp.clientWidth / 1600; stage.style.transform = 'scale(' + scale + ')'; }
  fit(); window.addEventListener('resize', fit);

  var BRANDS = { blue: ['#3465FF', '#FFFFFF'], green: ['#17746C', '#FFFFFF'], yellow: ['#F5C518', '#4A3A00'], purple: ['#6E4BD8', '#FFFFFF'] };
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function initial() { return { mode: 'flow', wired: false, copy: false, ptab: 'properties', brand: 'blue', dark: false, modal: false, co: 'payment' }; }
  var steps = [
    { cap: 'The flow editor: screens on the left, the flow as a graph, settings of the selected screen on the right. One exit of submit is still loose.',
      act: { k: 'port-submit-failure', to: 'in-failure', apply: function (s) { s.wired = true; } } },
    { cap: 'Every outcome of a backend operation needs a screen. With the last one wired, the check turns green.',
      act: { k: 'mode-form', apply: function (s) { s.mode = 'form'; } } },
    { cap: 'Form mode builds a screen from blocks: a palette, the screen structure and a live preview.',
      act: { k: 'pal-copy', drag: 'body-drop', apply: function (s) { s.copy = true; } } },
    { cap: 'A copyable value dropped into the steps shows up in the checkout.',
      act: { k: 'ptab-theme', apply: function (s) { s.ptab = 'theme'; } } },
    { cap: 'The theme has two independent axes: brand, and light or dark.',
      act: { k: 'sw-yellow', apply: function (s) { s.brand = 'yellow'; } } },
    { cap: 'On a light brand like this yellow, the button text becomes a deep shade of the brand instead of white.',
      act: { k: 'th-dark', apply: function (s) { s.dark = true; } } },
    { cap: 'Dark is the second axis, so ten brands don’t need twenty themes.',
      act: { k: 'preview', apply: function (s) { s.modal = true; } } },
    { cap: 'Preview runs the flow as a payer would, with backend calls simulated.',
      act: { k: 'co-pay', apply: function (s) { s.co = 'pending'; } } },
    { cap: '"Pay" calls submit, and the pending screen waits for the result…',
      act: { wait: 1300, apply: function (s) { s.co = 'success'; } } },
    { cap: '…the success outcome opens the success screen. A new checkout, wired as a graph and built from blocks.' }
  ];
  var LAST = steps.length - 1;
  function stateAt(i) { var s = initial(); for (var j = 0; j < i; j++) steps[j].act.apply(s); return s; }

  function checkout(s, screen, inModal) {
    var b = BRANDS[s.brand];
    var h = '<div class="co' + (s.dark ? ' dark' : '') + '" style="--b:' + b[0] + ';--on:' + b[1] + '">';
    h += '<div class="co-top"><span class="co-logo"><i></i>Northwind</span><span class="co-lang">EN</span></div>';
    if (screen === 'payment') {
      h += '<span class="co-l">Amount to pay</span><div class="co-amt">€ 49.00</div><div class="co-timer">Pay within 14:59</div>';
      h += '<div class="co-f"><span class="co-l">Card number</span><div class="co-in">0000 0000 0000 0000</div></div>';
      h += '<div class="co-row"><div class="co-f"><span class="co-l">Expiry</span><div class="co-in">MM / YY</div></div><div class="co-f"><span class="co-l">CVC</span><div class="co-in">•••</div></div></div>';
      if (s.copy) h += '<div class="co-f' + (shown.copy ? '' : ' lab-new') + '"><span class="co-l">Payment reference</span><div class="co-in copy">NW-48213<span>Copy</span></div></div>';
      h += '<div class="co-pay"' + (inModal ? ' data-k="co-pay"' : '') + '>Pay € 49.00</div><div class="co-cancel">Cancel payment</div>';
    } else if (screen === 'pending') {
      h += '<div class="co-state"><div class="co-spin"></div><b>Waiting for confirmation</b><span>Don’t close this page</span></div>';
    } else {
      h += '<div class="co-state"><div class="co-ok">' + CHECK + '</div><b>Payment complete</b><span>€ 49.00 to Northwind</span></div>';
    }
    return h + '</div>';
  }

  var shown = { wired: false, copy: false, modal: false };
  function on(sel, cond) { qa(sel).forEach(function (e) { e.classList.toggle('is-on', !!cond); }); }
  function hide(sel, cond) { qa(sel).forEach(function (e) { e.classList.toggle('fb-hidden', !!cond); }); }

  function apply(s, ui) {
    ui = ui || {};
    hide('#fb-flow', s.mode !== 'flow');
    hide('#fb-form', s.mode !== 'form');
    on('[data-k="mode-flow"]', s.mode === 'flow');
    on('[data-k="mode-form"]', s.mode === 'form');
    hide('#edge-submit-failure', !s.wired);
    hide('#label-submit-failure', !s.wired);
    var edge = q('#edge-submit-failure');
    if (s.wired && !shown.wired) { edge.classList.remove('lab-draw'); void edge.offsetWidth; edge.classList.add('lab-draw'); }
    q('[data-k="port-submit-failure"]').classList.toggle('lab-loose', !s.wired);
    hide('.fb-valid-ok', !s.wired);
    hide('.fb-valid-err', s.wired);

    qa('#body-items [data-added]').forEach(function (e) { e.remove(); });
    if (s.copy) {
      var it = document.createElement('div');
      it.className = 'fb-pitem' + (shown.copy ? '' : ' lab-new');
      it.setAttribute('data-added', '');
      it.innerHTML = '<img src="' + base + 'img/ic-draggable-16.svg" width="16" height="16" alt=""><div class="fb-pitem__text"><p class="fb-t-b13">Copyable value</p><p class="fb-t-c10">Payment reference</p></div>';
      q('#body-items').appendChild(it);
    }
    q('[data-k="body-drop"]').classList.toggle('lab-drop', !!ui.drop);

    on('[data-k="ptab-properties"]', s.ptab === 'properties');
    on('[data-k="ptab-theme"]', s.ptab === 'theme');
    hide('#ptab-properties-panel', s.ptab !== 'properties');
    hide('#ptab-theme-panel', s.ptab !== 'theme');
    ['blue', 'green', 'yellow', 'purple'].forEach(function (k) { on('[data-k="sw-' + k + '"]', s.brand === k); });
    on('[data-k="th-light"]', !s.dark);
    on('[data-k="th-dark"]', s.dark);

    q('#co-slot').innerHTML = checkout(s, 'payment', false);
    backdrop.classList.toggle('fb-hidden', !s.modal);
    backdrop.classList.toggle('still', shown.modal);
    if (s.modal) {
      q('#co-modal-slot').innerHTML = checkout(s, s.co, true);
      q('#modal-screen').textContent = s.co;
      hide('.fb-entry', s.co !== 'payment');
    }
    shown.wired = s.wired; shown.copy = s.copy; shown.modal = s.modal;
  }

  // ---------- Player ----------
  var idx = 0, playing = false, token = 0, state = initial();
  function updateUI() {
    caption.textContent = steps[idx].cap;
    countEl.textContent = (idx + 1) + ' / ' + steps.length;
    prevBtn.disabled = idx === 0; nextBtn.disabled = idx === LAST;
    Array.prototype.forEach.call(progress.children, function (el, i) { el.className = i < idx ? 'done' : i === idx ? 'cur' : ''; });
    playBtn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>Pause'
      : idx === LAST
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Replay'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>Play';
  }
  function sleep(ms, t) { return new Promise(function (res, rej) { setTimeout(function () { t === token ? res() : rej('stop'); }, ms); }); }
  function find(k) { return qa('[data-k="' + k + '"]').filter(function (e) { return e.getClientRects().length; })[0] || null; }
  function pointOf(el) {
    var v = vp.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - v.left + Math.min(r.width / 2, 40 * scale + 8), y: r.top - v.top + r.height / 2 };
  }
  function moveCursor(el, t) {
    var p = pointOf(el);
    cursor.classList.add('show');
    cursor.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
    return sleep(reduce ? 0 : 380, t);
  }
  function click(el, t) {
    cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
    if (el) { el.classList.add('lab-press'); setTimeout(function () { el.classList.remove('lab-press'); }, 140); }
    return sleep(reduce ? 0 : 120, t);
  }

  async function perform(i, t) {
    var a = steps[i].act, el = a.k ? find(a.k) : null;
    if (el) { await moveCursor(el, t); await click(el, t); }
    if (a.to) { var to = find(a.to); if (to) { await moveCursor(to, t); await click(to, t); } }
    if (a.drag && el) {
      var target = find(a.drag);
      var ghost = document.createElement('div');
      ghost.className = 'lab-ghost'; ghost.innerHTML = el.outerHTML.replace(/data-k="[^"]*"/, '');
      var v = vp.getBoundingClientRect(), r0 = el.getBoundingClientRect();
      ghost.style.transition = 'none';
      ghost.style.transform = 'translate(' + (r0.left - v.left) + 'px,' + (r0.top - v.top) + 'px) scale(' + scale + ')';
      vp.appendChild(ghost);
      apply(state, { drop: true });
      void ghost.offsetWidth; ghost.style.transition = '';
      var r1 = target.getBoundingClientRect();
      ghost.style.transform = 'translate(' + (r1.left - v.left + 16 * scale) + 'px,' + (r1.bottom - v.top - 60 * scale) + 'px) scale(' + scale + ')';
      try { await moveCursor(target, t); await click(null, t); } finally { ghost.remove(); }
    }
    if (a.wait) await sleep(reduce ? 0 : a.wait, t);
    state = stateAt(i + 1);
    apply(state);
  }
  function jump(i) {
    token++; playing = false;
    idx = Math.max(0, Math.min(LAST, i));
    state = stateAt(idx);
    shown = { wired: state.wired, copy: state.copy, modal: state.modal };
    apply(state);
    cursor.classList.remove('show');
    updateUI();
  }
  async function stepForward() {
    if (idx >= LAST) return;
    var t = ++token; playing = false; updateUI();
    try { await perform(idx, t); idx++; updateUI(); } catch (e) { /* interrupted */ }
  }
  async function play() {
    if (idx === LAST) jump(0);
    var t = ++token; playing = true; updateUI();
    try {
      await sleep(300, t);
      while (idx < LAST) { await perform(idx, t); idx++; updateUI(); await sleep(idx === LAST ? 0 : 1000, t); }
      playing = false; updateUI();
      setTimeout(function () { if (t === token) cursor.classList.remove('show'); }, 1200);
    } catch (e) { /* interrupted */ }
  }
  function pause() { token++; playing = false; updateUI(); }

  progress.innerHTML = steps.map(function (_, i) { return '<button type="button" aria-label="Step ' + (i + 1) + '"></button>'; }).join('');
  progress.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(Array.prototype.indexOf.call(progress.children, b)); });
  playBtn.addEventListener('click', function () { playing ? pause() : play(); });
  prevBtn.addEventListener('click', function () { jump(idx - 1); });
  nextBtn.addEventListener('click', stepForward);

  apply(state);
  updateUI();
  var started = false;
  new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.5) { if (!started && !reduce) { started = true; play(); } }
      else if (playing && !e.isIntersecting) pause();
    });
  }, { threshold: [0, 0.5] }).observe(vp);
})();
