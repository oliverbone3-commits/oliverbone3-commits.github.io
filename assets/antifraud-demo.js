// Anti-fraud analyst loop: Monitoring → transaction → Cross-check → blacklist → Dictionaries.
// Screens are 2× exports of the Figma frames (fictional data); coordinates below are in 1× design px.
(function () {
  var root = document.querySelector('[data-af-demo]');
  if (!root) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var base = root.getAttribute('data-base') || '';
  var vp = root.querySelector('.af-viewport');
  var caption = root.querySelector('.rd-caption');
  var countEl = root.querySelector('.rd-count');
  var playBtn = root.querySelector('[data-rd="play"]');
  var prevBtn = root.querySelector('[data-rd="prev"]');
  var nextBtn = root.querySelector('[data-rd="next"]');
  var progress = root.querySelector('.rd-progress');

  function img(file, w, alt) { return '<img src="' + base + file + '" width="' + w + '" alt="' + (alt || '') + '" decoding="async">'; }
  vp.innerHTML =
    '<div class="af-stage">' +
      '<div class="af-screen" data-s="monitoring">' + img('monitoring-list.png', 1440) + '</div>' +
      '<div class="af-screen" data-s="full"><div class="af-scroll">' + img('monitoring-full-view.png', 1456) + '</div></div>' +
      '<div class="af-hl" data-h="0"></div><div class="af-hl" data-h="1"></div>' +
      '<div class="af-drawer"><div class="af-scroll">' + img('transaction-details-drawer.png', 448) + '</div></div>' +
    '</div>' +
    '<div class="af-cursor"><svg viewBox="0 0 18 22"><path d="M1 1v17l4.5-4.2 3 6.7 3-1.4-3-6.6H15z" fill="#0C0C0C" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span class="af-ring"></span></div>';
  var stage = vp.querySelector('.af-stage'), cursor = vp.querySelector('.af-cursor');
  // Decode the screens up front so the tall transaction card doesn't flash blank on its first scroll.
  Array.prototype.forEach.call(stage.querySelectorAll('img'), function (im) { if (im.decode) im.decode().catch(function () {}); });
  var scale = 1;
  function fit() { scale = vp.clientWidth / 1456; stage.style.transform = 'scale(' + scale + ')'; }
  fit(); window.addEventListener('resize', fit);

  var FLAGS = [{ x: 330, y: 92, w: 790, h: 30 }, { x: 330, y: 236, w: 790, h: 30 }];
  function initial() { return { screen: 'monitoring', drawer: false, dscroll: 0, scroll: 0, hl: false }; }
  var steps = [
    { cap: 'Monitoring: every payment the rules scored, as it happens. Filters narrow two million events down to the ones that need a person.',
      act: { at: [145, 260], apply: function (s) { s.drawer = true; } } },
    { cap: 'The eye opens the transaction in a drawer over the list: the reaction first, then the payment, customer, device and sanctions. Enough to judge it without leaving the stream.',
      act: { dscroll: 760, apply: function (s) { s.dscroll = 760; } } },
    { cap: 'When one payment needs a closer look, Details opens its full page.',
      act: { dscroll: 0, at: [1340, 36], apply: function (s) { s.dscroll = 0; s.drawer = false; s.screen = 'full'; } } },
    { cap: 'The full page adds which rule fired on which entity, the merchant chain, the rules that ran and the analysts\u2019 history. A section index on the left jumps to any part.',
      act: { scroll: 1900, apply: function (s) { s.scroll = 1900; s.hl = true; } } },
    { cap: 'Values already on a blacklist are marked in place: here the customer ID and the phone. Those are what Cross-check searches by next.' }
  ];
  var LAST = steps.length - 1;
  function stateAt(i) { var s = initial(); for (var j = 0; j < i; j++) steps[j].act.apply(s); return s; }

  function render(s) {
    Array.prototype.forEach.call(stage.querySelectorAll('.af-screen'), function (el) { el.classList.toggle('on', el.getAttribute('data-s') === s.screen); });
    stage.querySelector('.af-screen[data-s="full"] .af-scroll').style.transform = 'translateY(' + (-s.scroll) + 'px)';
    stage.querySelector('.af-drawer .af-scroll').style.transform = 'translateY(' + (-s.dscroll) + 'px)';
    stage.querySelector('.af-drawer').classList.toggle('on', s.drawer);
    Array.prototype.forEach.call(stage.querySelectorAll('.af-hl'), function (el, i) {
      var r = FLAGS[i]; el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
      el.classList.toggle('on', s.hl && s.screen === 'full');
    });
  }

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
  function moveTo(p, t) {
    cursor.classList.add('show');
    cursor.style.transform = 'translate(' + p[0] * scale + 'px,' + p[1] * scale + 'px)';
    return sleep(reduce ? 0 : 520, t);
  }
  function click(t) { cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click'); return sleep(reduce ? 0 : 160, t); }

  async function perform(i, t) {
    var a = steps[i].act;
    if (a.dscroll !== undefined && a.dscroll !== state.dscroll) {
      state.dscroll = a.dscroll; render(state);
      await sleep(reduce ? 0 : 1000, t);
    }
    if (a.scroll !== undefined && a.scroll !== state.scroll) {
      state.scroll = a.scroll; state.hl = false; render(state);
      await sleep(reduce ? 0 : 1000, t);
    }
    if (a.at) { await moveTo(a.at, t); await click(t); }
    if (a.wait) await sleep(reduce ? 0 : a.wait, t);
    state = stateAt(i + 1); render(state);
  }
  function jump(i) {
    token++; playing = false;
    idx = Math.max(0, Math.min(LAST, i));
    state = stateAt(idx); render(state);
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
      await sleep(400, t);
      while (idx < LAST) { await perform(idx, t); idx++; updateUI(); await sleep(idx === LAST ? 0 : 1500, t); }
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

  render(state); updateUI();
  var started = false;
  new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.5) { if (!started && !reduce) { started = true; play(); } }
      else if (playing && !e.isIntersecting) pause();
    });
  }, { threshold: [0, 0.5] }).observe(vp);
})();
