// WeatherWell flow: plays a scripted path through the live prototype screens (index.html)
// with iOS-like transitions. Each step = caption + action; Prev/Next rebuild state instantly.
(function () {
  var stage = document.getElementById('stage');
  var cursor = stage.querySelector('.fl-cursor'), toast = stage.querySelector('.fl-toast');
  var caption = document.querySelector('.fl-caption'), countEl = document.querySelector('.fl-count');
  var progress = document.querySelector('.fl-progress');
  var playBtn = document.querySelector('[data-fl="play"]'), prevBtn = document.querySelector('[data-fl="prev"]'), nextBtn = document.querySelector('[data-fl="next"]');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?embed: inside the case page. No autoplay on load; the page sends play/pause when the block scrolls in or out.
  var embed = /[?&]embed/.test(location.search), started = false;
  if (embed) document.body.classList.add('fl-embed');
  var ready = false, wantPlay = false;
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.ww === undefined) return;
    if (e.data.ww === 'theme') { document.body.classList.toggle('fl-dark', !!e.data.dark); document.documentElement.style.colorScheme = e.data.scheme || (e.data.dark ? 'dark' : 'light'); }
    if (e.data.ww === 'play') { wantPlay = true; if (ready && !started && !reduce) { started = true; play(); } }
    if (e.data.ww === 'pause') { wantPlay = false; if (playing) pause(); }
  });
  var src, S = {}, token = 0, idx = 0, playing = false, instant = false, busy = false;

  function sleep(ms, t) { return new Promise(function (res, rej) { if (instant) return res(); setTimeout(function () { t === token ? res() : rej('stop'); }, reduce ? 0 : ms); }); }
  function frame() { return new Promise(function (r) { if (instant) return r(); requestAnimationFrame(function () { requestAnimationFrame(r); }); }); }

  function build() {
    Array.prototype.slice.call(stage.children).forEach(function (n) { if (n !== cursor && n !== toast) n.remove(); });
    ['today', 'detail', 'story', 'week', 'radar'].forEach(function (k) {
      var el = src.querySelector('.screen.s-' + k).cloneNode(true);
      if (k !== 'story' && k !== 'radar') { var edge = document.createElement('div'); edge.className = 'fl-edge'; el.appendChild(edge); }
      el.classList.add('fl-hidden'); stage.insertBefore(el, cursor); S[k] = el;
    });
    var dim = document.createElement('div'); dim.className = 'fl-dim'; stage.insertBefore(dim, cursor); S.dim = dim;
    var layer = document.createElement('div'); layer.className = 'fl-sheet';
    layer.appendChild(src.querySelector('.s-check .sheet').cloneNode(true));
    stage.insertBefore(layer, cursor); S.sheet = layer;
    S.today.classList.remove('fl-hidden');
    cursor.classList.remove('show'); toast.classList.remove('on');
  }
  function scrollTo(scr, y) {
    scr.querySelectorAll(':scope > .large-title, :scope > .content, :scope > .detail-art').forEach(function (n) { n.style.transform = y ? 'translateY(' + (-y) + 'px)' : ''; });
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
    if (!quiet) { el.classList.add('fl-tapped'); setTimeout(function () { el.classList.remove('fl-tapped'); }, 260); }
    await sleep(160, t);
  }
  async function push(from, to, t) {
    to.style.transition = 'none'; to.style.transform = 'translateX(100%)'; to.classList.remove('fl-hidden');
    void to.offsetWidth; to.style.transition = '';
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(-28%)';
    await sleep(420, t);
    from.classList.add('fl-hidden'); from.style.transform = '';
  }
  async function pop(from, to, t) {
    to.style.transition = 'none'; to.style.transform = 'translateX(-28%)'; to.classList.remove('fl-hidden');
    void to.offsetWidth; to.style.transition = '';
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(100%)';
    await sleep(420, t);
    from.classList.add('fl-hidden'); from.style.transform = '';
  }
  function rectIn(card) {
    var r = card.getBoundingClientRect(), s = stage.getBoundingClientRect(), q = k();
    var x = (r.left - s.left) / q, y = (r.top - s.top) / q, w = r.width / q, h = r.height / q;
    return 'inset(' + y + 'px ' + (402 - x - w) + 'px ' + (874 - y - h) + 'px ' + x + 'px round 26px)';
  }
  async function openStory(card, t) {
    var st = S.story;
    st.style.transition = 'none'; st.style.clipPath = rectIn(card); st.classList.add('fl-veil');
    st.classList.remove('fl-hidden'); void st.offsetWidth; st.style.transition = '';
    await frame();
    st.style.clipPath = 'inset(0px 0px 0px 0px round 56px)'; st.classList.remove('fl-veil');
    await sleep(420, t);
    st.style.clipPath = '';
  }
  async function closeStory(card, t) {
    var st = S.story;
    st.style.transition = 'none'; st.style.clipPath = 'inset(0px 0px 0px 0px round 56px)'; void st.offsetWidth; st.style.transition = '';
    st.classList.add('fl-veil', 'fl-veil-out');
    await sleep(90, t);
    st.style.clipPath = rectIn(card);
    await sleep(260, t);
    st.style.opacity = '0';
    await sleep(120, t);
    st.classList.add('fl-hidden'); st.classList.remove('fl-veil', 'fl-veil-out'); st.style.clipPath = ''; st.style.opacity = '';
  }
  async function storyToSheet(t) {
    S.story.classList.add('fl-under'); S.dim.classList.add('on'); S.sheet.classList.add('on');
    await sleep(450, t);
  }
  function setLvl(n, v, word) {
    var card = S.sheet.querySelectorAll('.chk-card')[n];
    card.querySelector('.lvl').setAttribute('data-v', v);
    card.querySelector('.lvl-word').textContent = word;
  }
  async function saveCheckin(t) {
    S.sheet.classList.remove('on'); S.dim.classList.remove('on'); S.story.classList.remove('fl-under');
    var ring = S.today.querySelectorAll('.ring circle')[1];
    ring.setAttribute('stroke-dasharray', '51.7 119.4');
    S.today.querySelector('.ring text').textContent = '13';
    S.today.querySelector('.learn b').textContent = '13 of 30 check-ins';
    await sleep(300, t);
    await closeStory(S.today.querySelector('.insight-hero'), t);
    if (!instant) { toast.classList.add('on'); setTimeout(function () { toast.classList.remove('on'); }, 1500); }
    await sleep(500, t);
  }
  async function tab(from, to, t) {
    to.style.transition = 'none'; to.style.opacity = '0'; to.classList.remove('fl-hidden');
    void to.offsetWidth; to.style.transition = '';
    await frame(); to.style.opacity = '1';
    await sleep(380, t);
    from.classList.add('fl-hidden'); to.style.opacity = '';
  }

  // Radar: the timeline knob runs 3:30 → 5:30; the rain layer itself stays still.
  var rafId = 0;
  function radarLoop() {
    cancelAnimationFrame(rafId);
    var R = S.radar, knob = R.querySelector('.rd-knob'), past = R.querySelector('.rd-past'), bubble = R.querySelector('.rd-bubble');
    var x0 = 82, w = 286, t0 = performance.now(), DUR = 3500;
    function ease(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
    function tick(now) {
      if (R.classList.contains('fl-hidden')) return;
      var p = Math.min(1, (now - t0) / DUR);
      var e = ease(p);
      knob.style.left = (p * 100) + '%'; past.style.width = Math.min(p, .5) * 100 + '%';
      var min = 210 + Math.round(p * 120 / 5) * 5, h = Math.floor(min / 60), m = min % 60;
      bubble.textContent = (p > .48 && p < .52) ? 'Now' : h + ':' + (m < 10 ? '0' : '') + m + ' PM';
      bubble.style.left = (x0 + p * w) + 'px';
      if (p < 1) rafId = requestAnimationFrame(tick);
    }
    if (!reduce) rafId = requestAnimationFrame(tick);
  }

  var steps = [
    { cap: 'Today opens with how you may feel, not with the weather.', run: async function () {} },
    { cap: 'Tap a risk to see what is behind it.', run: async function (t) {
        scrollTo(S.today, 140); await sleep(550, t);
        await tap('.s-today .risk', t); await push(S.today, S.detail, t); } },
    { cap: 'Headache peaks around 6 PM. Falling pressure is the main driver.', run: async function (t) { scrollTo(S.detail, 290); await sleep(500, t); } },
    { cap: 'Then a plan for the day, built around the peak.', run: async function (t) { scrollTo(S.detail, 455); await sleep(500, t); } },
    { cap: 'Back to Today.', run: async function (t) { await tap('.s-detail .toolbar .circle-btn', t); await pop(S.detail, S.today, t); } },
    { cap: 'Every day starts with one short insight, reviewed by a physician.', run: async function (t) {
        var hero = S.today.querySelector('.insight-hero'); await tap(hero, t, true); await openStory(hero, t); } },
    { cap: 'It ends with what helps today and a way to log how you feel.', run: async function (t) {
        await tap('.s-story .story-cta', t); await storyToSheet(t); } },
    { cap: 'Rate what you feel, not what the forecast says.', run: async function (t) {
        await tap(S.sheet.querySelectorAll('.chk-card')[0].querySelectorAll('.lvl i')[2], t); setLvl(0, 2, 'Moderate'); await sleep(300, t); } },
    { cap: 'Four quick scales, under ten seconds.', run: async function (t) {
        await tap(S.sheet.querySelectorAll('.chk-card')[2].querySelectorAll('.lvl i')[1], t); setLvl(2, 1, 'Tired'); await sleep(300, t); } },
    { cap: 'Each check-in makes the outlook more personal.', run: async function (t) {
        await tap(S.sheet.querySelector('.sheet-foot .btn'), t); await saveCheckin(t); } },
    { cap: 'The week ahead, to plan around the hard days.', run: async function (t) {
        await tap(S.today.querySelectorAll('.tab')[1], t); await tab(S.today, S.week, t); } },
    { cap: 'Pressure through the week, and a plan for every day.', run: async function (t) { scrollTo(S.week, 560); await sleep(600, t); } },
    { cap: 'The hard day comes with concrete steps and a reminder.', run: async function (t) { scrollTo(S.week, 880); await sleep(600, t); } },
    { cap: 'And the weather is still one tap away.', run: async function (t) {
        await tap(S.week.querySelectorAll('.tab')[2], t); await tab(S.week, S.radar, t); radarLoop(); await sleep(600, t); } }
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
    if (idx === LAST) radarLoop();
    cursor.classList.remove('show'); ui();
  }
  async function forward(t) { busy = true; try { await steps[idx + 1].run(t); } finally { busy = false; } idx++; ui(); }
  async function next() { if (idx >= LAST) return; if (busy || playing) return jump(idx + 1); var t = ++token; playing = false; ui(); try { await forward(t); } catch (e) {} }
  async function play() {
    if (idx === LAST) await jump(0);
    var t = ++token; playing = true; ui();
    try {
      await sleep(400, t);
      while (idx < LAST) { await sleep(1600, t); await forward(t); }
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

  // On a server take the live index.html; opened from disk (file://) fetch is blocked, so use the snapshot in screens.js.
  var load = location.protocol === 'file:' && window.WW_SCREENS ? Promise.resolve(window.WW_SCREENS)
    : fetch('index.html').then(function (r) { if (!r.ok) throw r.status; return r.text(); }).catch(function () { return window.WW_SCREENS; });
  load.then(function (html) {
    src = new DOMParser().parseFromString(html, 'text/html');
    var defs = src.querySelector('body > svg'); if (defs) document.body.insertBefore(defs, document.body.firstChild);
    build(); ui();
    if (!embed && !reduce && !/[?&]paused/.test(location.search)) { started = true; play(); }
    ready = true; if (wantPlay && !started && !reduce) { started = true; play(); }
  });
})();
