// SmartPill flow: one story through the live prototype screens (index.html).
// Each step = caption + action; Prev/Next rebuild state instantly.
// Embed protocol (same as WeatherWell/Radar): ?embed, the page posts {ww:'play'|'pause'|'theme'}.
(function () {
  var stage = document.getElementById('stage');
  var cursor = stage.querySelector('.fl-cursor'), toast = stage.querySelector('.fl-toast');
  var caption = document.querySelector('.fl-caption'), countEl = document.querySelector('.fl-count');
  var progress = document.querySelector('.fl-progress');
  var playBtn = document.querySelector('[data-fl="play"]'), prevBtn = document.querySelector('[data-fl="prev"]'), nextBtn = document.querySelector('[data-fl="next"]');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var embed = /[?&]embed/.test(location.search), started = false;
  if (embed) document.body.classList.add('fl-embed');
  var ready = false, wantPlay = false;
  // The phone follows the page theme: the case page posts {ww:'theme'}; on its own, ?dark.
  var dark = /[?&]dark/.test(location.search);
  // Phone theme is separate from the page chrome: the page theme sets both, the toggle in the bar only the phone.
  var themeBtn = document.querySelector('[data-fl="theme"]');
  function setDark(on) {
    dark = on; document.body.classList.toggle('fl-pdark', on);
    stage.querySelectorAll(':scope > .screen').forEach(function (s) { s.classList.toggle('dark', on); });
    if (themeBtn) { themeBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); themeBtn.setAttribute('aria-label', on ? 'Light phone' : 'Dark phone'); }
  }
  if (themeBtn) themeBtn.addEventListener('click', function () { setDark(!dark); });
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.ww === undefined) return;
    if (e.data.ww === 'theme') { document.body.classList.toggle('fl-dark', !!e.data.dark); setDark(!!e.data.dark); document.documentElement.style.colorScheme = e.data.scheme || (e.data.dark ? 'dark' : 'light'); }
    if (e.data.ww === 'play') { wantPlay = true; if (ready && !started && !reduce) { started = true; play(); } }
    if (e.data.ww === 'pause') { wantPlay = false; if (playing) pause(); }
  });
  var src, S = {}, token = 0, idx = 0, playing = false, instant = false, busy = false;
  // ?slow=4 plays everything 4× slower (for checking transitions frame by frame).
  var K = +(location.search.match(/[?&]slow=([\d.]+)/) || [])[1] || 1;
  document.documentElement.style.setProperty('--k', K);
  var SEL = { welcome: '.welcome', perm: '.perm', plus: '.plus', add: '.add:not(.sched)', sched: '.sched', today: '.today', lock: '.lock', det: '.det', hist: '.hist' };

  function sleep(ms, t) { return new Promise(function (res, rej) { if (instant) return res(); setTimeout(function () { t === token ? res() : rej('stop'); }, reduce ? 0 : ms * K); }); }
  // Two animation frames, with a timer fallback: a background tab may never deliver rAF, and the flow must not stall.
  function frame() { return new Promise(function (r) { if (instant) return r(); var done = false, go = function () { if (!done) { done = true; r(); } }; requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 80); }); }
  function show(el) { el.classList.remove('fl-hidden'); }
  function hide(el) { el.classList.add('fl-hidden'); el.classList.remove('fl-top', 'fl-back'); el.style.transform = ''; el.style.opacity = ''; }

  function build() {
    Array.prototype.slice.call(stage.children).forEach(function (n) { if (n !== cursor && n !== toast) n.remove(); });
    Object.keys(SEL).forEach(function (k) {
      var el = src.querySelector('.board .screen' + SEL[k]).cloneNode(true);
      el.classList.add('fl-hidden'); stage.insertBefore(el, cursor); S[k] = el;
    });
    var edge = document.createElement('div'); edge.className = 'fl-edge'; S.today.appendChild(edge);
    var off = document.createElement('div'); off.className = 'fl-off'; stage.insertBefore(off, cursor); S.off = off;
    ['det', 'hist'].forEach(function (k) { var n = S[k].querySelector('.status .num'); if (n) n.textContent = '14:01'; });
    S.add.querySelector('.field .inp').firstChild.textContent = '';
    S.lock.classList.add('fl-quiet');
    todayState('added');
    setDark(dark);
    show(S.welcome);
    cursor.classList.remove('show'); toast.classList.remove('on');
  }
  // Today has two moments in the story: right after adding (9:42, Metformin next at 14:00) and after the 14:00 dose.
  function todayState(mode) {
    var T = S.today, met = T.querySelector('.fl-met');
    if (!met) {
      var now = T.querySelector('.now');
      var pbox = now.querySelector('.pbox').outerHTML;
      met = document.createElement('div'); met.className = 'card dose fl-met';
      met.innerHTML = '<div class="row">' + pbox + '<div class="grow"><div class="ttl">Metformin</div><div class="meta">500 mg · after lunch</div></div><span class="fl-end"></span></div>';
      now.replaceWith(met);
      var t = T.querySelectorAll('.sec')[1].querySelector('.t'); t.textContent = 'Afternoon'; t.classList.remove('coral');
    }
    var end = met.querySelector('.fl-end'), arc = T.querySelectorAll('.ring circle')[1], n = T.querySelector('.ring .lbl > div').firstChild;
    if (mode === 'added') {
      T.querySelector('.status .num').textContent = '9:42';
      end.innerHTML = '<span class="todo"></span>';
      arc.setAttribute('stroke-dasharray', '90.5 226.2'); n.textContent = '2';
      T.querySelector('.sum .big').innerHTML = 'Next: Metformin<br>at 14:00';
    } else {
      T.querySelector('.status .num').textContent = '14:00';
      end.innerHTML = '<span class="taken-t num">14:00</span>' + T.querySelector('.dose .done').outerHTML;
      arc.setAttribute('stroke-dasharray', '135.7 226.2'); n.textContent = '3';
      T.querySelector('.sum .big').innerHTML = 'Afternoon done,<br>two this evening';
    }
  }
  function k() { return stage.getBoundingClientRect().width / 402; }
  async function tap(sel, t, quiet) {
    var el = typeof sel === 'string' ? stage.querySelector(sel) : sel;
    if (!el) { console.warn('no target', sel); return; }
    if (instant) return;
    var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(), q = k();
    cursor.classList.add('show');
    cursor.style.transform = 'translate(' + ((r.left + r.width / 2 - s.left) / q) + 'px,' + ((r.top + r.height / 2 - s.top) / q) + 'px)';
    await sleep(420, t);
    cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
    if (!quiet) { el.classList.add('fl-tapped'); setTimeout(function () { el.classList.remove('fl-tapped'); }, 260 * K); }
    await sleep(160, t);
  }
  function prep(el, css) { el.style.transition = 'none'; for (var p in css) el.style[p] = css[p]; show(el); void el.offsetWidth; el.style.transition = ''; }
  function toastMsg(text) {
    if (instant) return;
    toast.lastChild.textContent = text; toast.classList.add('on');
    setTimeout(function () { toast.classList.remove('on'); }, 1700 * K);
  }
  // Push: the new screen slides in with a shadow, the old one drifts left and dims.
  async function push(from, to, t) {
    prep(to, { transform: 'translateX(100%)' }); to.classList.add('fl-top');
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(-28%)'; from.classList.add('fl-back');
    await sleep(460, t);
    hide(from); to.classList.remove('fl-top');
  }
  async function pop(from, to, t) {
    prep(to, { transform: 'translateX(-28%)' }); to.classList.add('fl-back'); from.classList.add('fl-top');
    await frame();
    to.style.transform = ''; to.classList.remove('fl-back'); from.style.transform = 'translateX(100%)';
    await sleep(460, t);
    hide(from);
  }
  async function fade(from, to, t) {
    prep(to, { opacity: '0' }); to.classList.add('fl-top');
    await frame(); to.style.opacity = '1';
    await sleep(320, t);
    hide(from); to.classList.remove('fl-top'); to.style.opacity = '';
  }
  // Full-screen cover (paywall): up from the bottom, the screen below dims.
  async function cover(from, to, t) {
    prep(to, { transform: 'translateY(100%)' }); to.classList.add('fl-top');
    await frame();
    to.style.transform = ''; from.classList.add('fl-back');
    await sleep(520, t);
    hide(from); to.classList.remove('fl-top');
  }
  // Dismiss down, revealing `under` (which takes the place of what was below).
  async function uncover(from, under, t) {
    prep(under, {}); under.classList.add('fl-back'); from.classList.add('fl-top');
    await frame();
    from.style.transform = 'translateY(100%)'; under.classList.remove('fl-back');
    await sleep(520, t);
    hide(from);
  }
  // The phone goes to sleep and wakes on the alert: screen off → lock screen → the alert drops in.
  async function toLock(from, t) {
    S.off.classList.add('on');
    await sleep(380, t);
    hide(from); show(S.lock);
    await sleep(500, t);
    S.off.classList.remove('on');
    await sleep(450, t);
    S.lock.classList.remove('fl-quiet');
    await sleep(600, t);
  }
  // Taken → the lock screen slides away and Today is already up to date.
  async function unlock(t) {
    todayState('taken');
    prep(S.today, { transform: 'scale(.94)' }); S.today.classList.add('fl-back');
    S.lock.classList.add('fl-top');
    await frame();
    S.lock.style.transform = 'translateY(-100%)'; S.today.style.transform = ''; S.today.classList.remove('fl-back');
    await sleep(520, t);
    hide(S.lock);
    toastMsg('Metformin taken · 14:00');
    await sleep(300, t);
  }
  async function type(el, text, t) {
    var node = el.firstChild;
    for (var i = 1; i <= text.length; i++) { node.textContent = text.slice(0, i); await sleep(85, t); }
  }
  function scroll(scr, y) { var c = scr.querySelector('.content'); if (c) c.style.transform = y ? 'translateY(' + (-y) + 'px)' : ''; scr.classList.toggle('fl-scrolled', !!y); }

  var steps = [
    { cap: 'SmartPill opens with one promise: the right pill at the right time.', run: async function () {} },
    { cap: 'Onboarding asks for the one permission that matters: critical alerts.', run: async function (t) {
        await tap('.welcome .btn.pri', t); await push(S.welcome, S.perm, t); } },
    { cap: 'Then Plus, once: three free days and a clear yearly price. No countdowns.', run: async function (t) {
        await tap('.perm .btn.pri', t); await cover(S.perm, S.plus, t); } },
    { cap: 'Straight to the first medication. No name, no age, no account.', run: async function (t) {
        await tap('.plus .cta .btn.pri', t); await uncover(S.plus, S.add, t); } },
    { cap: 'A name, a strength, a form. The colour helps you spot the right pill.', run: async function (t) {
        await tap(S.add.querySelector('.field'), t, true); await type(S.add.querySelector('.field .inp'), 'Metformin', t); await sleep(250, t); } },
    { cap: 'Then when: twice a day, after a meal, with a critical alert.', run: async function (t) {
        await tap('.add:not(.sched) .cta .btn.pri', t); await push(S.add, S.sched, t); } },
    { cap: 'It lands on Today: Metformin is next, at 14:00.', run: async function (t) {
        await tap('.sched .cta .btn.pri', t); await uncover(S.sched, S.today, t); toastMsg('Metformin added · next at 14:00'); await sleep(400, t); } },
    { cap: '14:00. The phone is on silent, and the reminder still rings.', run: async function (t) {
        await sleep(500, t); await toLock(S.today, t); } },
    { cap: 'One tap on the lock screen marks the dose as taken.', run: async function (t) {
        await tap('.lock .nacts .go', t); await unlock(t); } },
    { cap: 'Today shows what is done and what is left for the evening.', run: async function (t) {
        scroll(S.today, 236); await sleep(700, t); } },
    { cap: 'Each medication keeps its record: on time, pills left, the last 30 days.', run: async function (t) {
        await tap(S.today.querySelector('.fl-met .row'), t); await push(S.today, S.det, t); } },
    { cap: 'History shows the whole month at a glance.', run: async function (t) {
        await tap('.det .nav .gbtn', t); await pop(S.det, S.today, t);
        await tap(S.today.querySelector('[data-tab="history"]'), t); await fade(S.today, S.hist, t); } }
  ];
  var LAST = steps.length - 1;

  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>Play';
  var PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>Pause';
  var REPLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Replay';
  function ui() {
    caption.textContent = steps[idx].cap;
    countEl.textContent = (idx + 1) + ' / ' + steps.length;
    prevBtn.disabled = idx === 0; nextBtn.disabled = idx === LAST;
    Array.prototype.forEach.call(progress.children, function (b, i) { b.className = i < idx ? 'done' : i === idx ? 'cur' : ''; });
    playBtn.innerHTML = playing ? PAUSE : idx === LAST ? REPLAY : PLAY;
  }
  async function jump(i) {
    token++; busy = false; playing = false; idx = Math.max(0, Math.min(LAST, i));
    stage.classList.add('fl-instant'); instant = true; build();
    for (var j = 0; j <= idx; j++) await steps[j].run(token);
    instant = false; void stage.offsetWidth; stage.classList.remove('fl-instant');
    cursor.classList.remove('show'); ui();
  }
  async function forward(t) { busy = true; try { await steps[idx + 1].run(t); } finally { busy = false; } idx++; ui(); }
  async function next() { if (idx >= LAST) return; if (busy || playing) return jump(idx + 1); var t = ++token; playing = false; ui(); try { await forward(t); } catch (e) {} }
  async function play() {
    if (idx === LAST) await jump(0);
    var t = ++token; playing = true; ui();
    try {
      await sleep(400, t);
      while (idx < LAST) { await sleep(1700, t); await forward(t); }
      playing = false; ui();
      setTimeout(function () { if (t === token) cursor.classList.remove('show'); }, 1200);
    } catch (e) {}
  }
  function pause() { token++; playing = false; ui(); }

  progress.innerHTML = steps.map(function (_, i) { return '<button type="button" aria-label="Step ' + (i + 1) + '"></button>'; }).join('');
  progress.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(Array.prototype.indexOf.call(progress.children, b)); });
  playBtn.addEventListener('click', function () { playing ? pause() : play(); });
  prevBtn.addEventListener('click', function () { jump(busy ? idx : idx - 1); });
  nextBtn.addEventListener('click', next);

  // On a server take the live index.html; from disk (file://) use the snapshot in screens.js.
  var load = location.protocol === 'file:' && window.SP_SCREENS ? Promise.resolve(window.SP_SCREENS)
    : fetch('index.html').then(function (r) { if (!r.ok) throw r.status; return r.text(); }).catch(function () { return window.SP_SCREENS; });
  load.then(function (html) {
    src = new DOMParser().parseFromString(html, 'text/html');
    // Screen-level styles live in index.html's <head>; bring them along.
    src.querySelectorAll('head style').forEach(function (s) { document.head.appendChild(s.cloneNode(true)); });
    build(); ui();
    var at = +(location.hash.match(/^#(\d+)$/) || [])[1];
    if (at) { jump(at - 1); started = true; }  // #N opens step N, paused (for screenshots)
    if (!at && !embed && !reduce && !/[?&]paused/.test(location.search)) { started = true; play(); }
    ready = true; if (wantPlay && !started && !reduce) { started = true; play(); }
  });
})();
