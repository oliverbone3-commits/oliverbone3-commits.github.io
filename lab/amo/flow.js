// AMO flow: plays a scripted path through the live prototype screens (index.html)
// with iOS-like transitions. Same player and embed contract as WeatherWell (?embed, postMessage {ww: 'play' | 'pause' | 'theme'}).
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
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.ww === undefined) return;
    if (e.data.ww === 'theme') { document.body.classList.toggle('fl-dark', !!e.data.dark); document.documentElement.style.colorScheme = e.data.scheme || (e.data.dark ? 'dark' : 'light'); }
    if (e.data.ww === 'play') { wantPlay = true; if (ready && !started && !reduce) { started = true; play(); } }
    if (e.data.ww === 'pause') { wantPlay = false; if (playing) pause(); }
  });
  var src, S = {}, token = 0, idx = 0, playing = false, instant = false, busy = false;
  var KEYS = ['lock', 'widget', 'deckA', 'deckB', 'viewer', 'land', 'story', 'zoom', 'artist', 'discover', 'studio'];
  var MONKEY = '1702px 1271px'; // the detail in the zoom image (2300 px wide)

  function sleep(ms, t) { return new Promise(function (res, rej) { if (instant) return res(); setTimeout(function () { t === token ? res() : rej('stop'); }, reduce ? 0 : ms); }); }
  // Two frames, with a timer as a fallback: rAF stops in background tabs and the flow must not hang there.
  function frame() { return new Promise(function (r) { if (instant) return r(); var done = false, go = function () { if (!done) { done = true; r(); } }; requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 60); }); }
  function q(el, sel) { return el.querySelector(sel); }
  function qa(el, sel) { return Array.prototype.slice.call(el.querySelectorAll(sel)); }
  function set(el, prop, v) { el.style.transition = 'none'; el.style[prop] = v; }
  function settle(els) { els.forEach(function (e) { void e.offsetWidth; e.style.transition = ''; }); }

  function build() {
    Array.prototype.slice.call(stage.children).forEach(function (n) { if (n !== cursor && n !== toast) n.remove(); });
    KEYS.forEach(function (k) {
      var el = src.querySelector('.screen.s-' + k).cloneNode(true);
      window.amoChrome(el);
      el.classList.add('fl-hidden'); stage.insertBefore(el, cursor); S[k] = el;
    });
    var layer = document.createElement('div'); layer.className = 'fl-sheet';
    var share = src.querySelector('.screen.s-share');
    layer.appendChild(q(share, '.dim').cloneNode(true)); layer.appendChild(q(share, '.sheet').cloneNode(true));
    stage.insertBefore(layer, cursor); S.sheet = layer;
    S.land.classList.add('fl-land');
    S.lock.classList.add('fl-pre'); S.lock.classList.remove('fl-hidden');
    stage.classList.remove('fl-rot');
    cursor.classList.remove('show'); toast.classList.remove('on');
  }
  function k() { return stage.getBoundingClientRect().width / 402; }
  function at(x, y) { cursor.classList.add('show'); cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
  function center(el) {
    var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(), z = k();
    return [(r.left + r.width / 2 - s.left) / z, (r.top + r.height / 2 - s.top) / z];
  }
  async function tap(sel, t, quiet) {
    var el = typeof sel === 'string' ? stage.querySelector(sel) : sel;
    if (!el) { console.warn('no target', sel); return; }
    if (instant) return;
    var c = center(el); at(c[0], c[1]);
    await sleep(420, t);
    cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
    if (!quiet) { el.classList.add('fl-tapped'); setTimeout(function () { el.classList.remove('fl-tapped'); }, 260); }
    await sleep(160, t);
  }
  function rectIn(el, r0) {
    var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(), z = k();
    var x = (r.left - s.left) / z, y = (r.top - s.top) / z, w = r.width / z, h = r.height / z;
    return 'inset(' + y + 'px ' + (402 - x - w) + 'px ' + (874 - y - h) + 'px ' + x + 'px round ' + (r0 || 34) + 'px)';
  }
  // A screen grows out of the element that was tapped (notification, card).
  async function grow(from, to, t, r0) {
    set(to, 'clipPath', rectIn(from, r0)); to.classList.add('fl-veil'); to.classList.remove('fl-hidden');
    settle([to]); await frame();
    to.style.clipPath = 'inset(0px 0px 0px 0px round 56px)'; to.classList.remove('fl-veil');
    await sleep(480, t);
    to.style.clipPath = '';
  }
  async function shrink(scr, into, t) {
    set(scr, 'clipPath', 'inset(0px 0px 0px 0px round 56px)'); settle([scr]);
    scr.classList.add('fl-veil'); await sleep(90, t);
    scr.style.clipPath = rectIn(into);
    await sleep(380, t);
    scr.classList.add('fl-hidden'); scr.classList.remove('fl-veil'); scr.style.clipPath = '';
  }
  async function push(from, to, t) {
    set(to, 'transform', 'translateX(100%)'); to.classList.remove('fl-hidden'); settle([to]);
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(-28%)';
    await sleep(440, t);
    from.classList.add('fl-hidden'); from.style.transform = '';
  }
  async function pop(from, to, t) {
    set(to, 'transform', 'translateX(-28%)'); to.classList.remove('fl-hidden'); settle([to]);
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(100%)';
    await sleep(440, t);
    from.classList.add('fl-hidden'); from.style.transform = '';
  }
  async function tab(from, to, t) {
    set(to, 'opacity', '0'); to.classList.remove('fl-hidden'); settle([to]);
    await frame(); to.style.opacity = '1';
    await sleep(380, t);
    from.classList.add('fl-hidden'); to.style.opacity = '';
  }
  // Deck: the artist card slides out to the left, the first artwork takes the middle.
  async function swipe(t) {
    var A = S.deckA, B = S.deckB, a = qa(A, '.dcard'), b = qa(B, '.dcard');
    var chrome = Array.prototype.filter.call(B.children, function (n) { return !n.classList.contains('dcard'); });
    if (!instant) { at(330, 450); await sleep(450, t); }
    b.forEach(function (c) { set(c, 'transform', 'translateX(330px)'); });
    chrome.forEach(function (c) { c.style.visibility = 'hidden'; });
    set(B, 'background', 'transparent'); B.classList.remove('fl-hidden');
    settle(b.concat([B]));
    await frame();
    a.forEach(function (c) { c.style.transform = 'translateX(-330px)'; });
    b.forEach(function (c) { c.style.transform = ''; });
    if (!instant) at(70, 450);
    await sleep(560, t);
    chrome.forEach(function (c) { c.style.visibility = ''; });
    B.style.background = '';
    A.classList.add('fl-hidden'); a.forEach(function (c) { set(c, 'transform', ''); }); settle(a);
  }
  function scrollStory(y) {
    qa(S.story, ':scope > .page, :scope > .hero, :scope > .hot').forEach(function (n) { n.style.transform = y ? 'translateY(' + (-y) + 'px)' : ''; });
  }
  async function zoomIn(t) {
    var Z = S.zoom, img = q(Z, '.zoom img');
    img.style.transformOrigin = MONKEY; set(img, 'transform', 'scale(.32)');
    set(Z, 'opacity', '0'); Z.classList.add('fl-pre'); Z.classList.remove('fl-hidden');
    settle([img, Z]); await frame();
    Z.style.opacity = '1'; img.style.transform = ''; Z.classList.remove('fl-pre');
    await sleep(850, t);
  }
  async function zoomOut(t) {
    S.zoom.style.opacity = '0'; await sleep(320, t);
    S.zoom.classList.add('fl-hidden'); S.zoom.style.opacity = '';
  }
  async function goHome(from, t) {
    var W = S.widget;
    if (!instant) { at(201, 866); await sleep(420, t); at(201, 640); }
    set(W, 'transform', 'scale(1.08)'); W.classList.remove('fl-hidden'); settle([W]);
    from.classList.add('fl-app'); await frame();
    from.style.transform = 'scale(.3) translateY(400px)'; from.style.opacity = '0'; W.style.transform = '';
    await sleep(560, t);
    from.classList.add('fl-hidden'); from.classList.remove('fl-app'); from.style.transform = ''; from.style.opacity = '';
  }
  // Viewer: double-tap zooms into the dots, a drag looks around.
  async function viewerZoom(t) {
    var art = q(S.viewer, '.vw-art');
    if (!instant) { at(250, 470); await sleep(420, t); cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click'); await sleep(180, t); cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click'); }
    art.style.transformOrigin = '62% 72%'; art.style.transform = 'scale(2.8)';
    await sleep(900, t);
    if (!instant) at(150, 420);
    art.style.transform = 'translate(90px, 40px) scale(2.8)';
    await sleep(900, t);
  }
  async function rotate(on, t) {
    var art = q(S.viewer, '.vw-art');
    cursor.classList.remove('show');
    if (on) { art.style.transform = ''; await sleep(500, t); S.land.classList.remove('fl-hidden'); }
    stage.classList.toggle('fl-rot', on);
    await sleep(900, t);
    if (!on) S.land.classList.add('fl-hidden');
  }
  // Swipe up on Story: the story slides over the painting, which settles at the top.
  async function storyUp(t) {
    var St = S.story, page = q(St, ':scope > .page'), lift = qa(St, ':scope > .hero, :scope > .hot');
    var btn = q(S.viewer, '.vw-story');
    if (!instant) { var c = center(btn); at(c[0], c[1]); await sleep(450, t); at(c[0], 420); }
    set(page, 'transform', 'translateY(620px)'); lift.forEach(function (n) { set(n, 'opacity', '0'); });
    set(St, 'background', 'transparent'); St.classList.remove('fl-hidden'); settle([page, St].concat(lift)); await frame();
    page.style.transform = ''; lift.forEach(function (n) { n.style.opacity = ''; });
    await sleep(650, t);
    S.viewer.classList.add('fl-hidden'); St.style.background = '';
  }
  function showToast() { if (instant) return; toast.classList.add('on'); setTimeout(function () { toast.classList.remove('on'); }, 1500); }

  var steps = [
    { cap: '8:30, the time picked in the onboarding quiz.', run: async function () {} },
    { cap: 'Today\'s five arrive as a push.', run: async function (t) { S.lock.classList.remove('fl-pre'); await sleep(600, t); } },
    { cap: 'Tap it: Today opens on the artist of the day.', run: async function (t) {
        var n = q(S.lock, '.notif'); await tap(n, t, true); await grow(n, S.deckA, t, 26); S.lock.classList.add('fl-hidden'); } },
    { cap: 'Swipe for the artworks. Five a day, free.', run: async function (t) { await swipe(t); } },
    { cap: 'Tap the card: the painting opens whole, on black.', run: async function (t) {
        var c = q(S.deckB, '.dcard:not(.side)'); await tap(c, t, true); await grow(c, S.viewer, t); } },
    { cap: 'Double-tap to see the dots up close, drag to look around.', run: async function (t) { await viewerZoom(t); } },
    { cap: 'Turn the phone and the painting fills the screen.', run: async function (t) { await rotate(true, t); await sleep(600, t); } },
    { cap: 'Back upright. Swipe up for the story.', run: async function (t) { await rotate(false, t); await storyUp(t); } },
    { cap: 'One line, the facts, then three things to look at.', run: async function (t) { scrollStory(150); await sleep(650, t); } },
    { cap: 'Tap a number: the painting zooms in to the detail.', run: async function (t) {
        await tap(qa(S.story, '.hot')[1], t, true); await zoomIn(t); } },
    { cap: 'Who painted it: a short life and the works in order.', run: async function (t) {
        await tap(q(S.zoom, '.toolbar .circle-btn'), t); await zoomOut(t);
        scrollStory(0); await sleep(500, t);
        await tap(q(S.story, '.page .sub'), t); await push(S.story, S.artist, t); } },
    { cap: 'Keep it close: wallpaper, watch face or HD.', run: async function (t) {
        await tap(q(S.artist, '.toolbar .circle-btn'), t); await pop(S.artist, S.story, t);
        await tap(qa(S.story, '.pill-group button')[1], t); S.sheet.classList.add('on'); await sleep(520, t); } },
    { cap: 'One tap, and Seurat is the wallpaper.', run: async function (t) {
        await tap(q(S.sheet, '.list .item'), t); S.sheet.classList.remove('on'); await sleep(350, t); showToast(); await sleep(400, t); } },
    { cap: 'Back to Today. Discover starts from the movements picked in the quiz.', run: async function (t) {
        await tap(q(S.story, '.toolbar .circle-btn'), t); await shrink(S.story, q(S.deckB, '.dcard:not(.side)'), t);
        await tap(qa(S.deckB, '.tabs .tab')[1], t); await tab(S.deckB, S.discover, t); } },
    { cap: 'Studio: new artists next to the classics.', run: async function (t) {
        await tap(qa(S.discover, '.tabs .tab')[2], t); await tab(S.discover, S.studio, t); } },
    { cap: 'And every day the widget shows a new painting. No text. People loved it most.', run: async function (t) {
        await goHome(S.studio, t); await sleep(400, t); } }
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

  // On a server take the live index.html; from disk (file://) fetch is blocked, so use the snapshot in screens.js.
  var load = location.protocol === 'file:' && window.AMO_SCREENS ? Promise.resolve(window.AMO_SCREENS)
    : fetch('index.html').then(function (r) { if (!r.ok) throw r.status; return r.text(); }).catch(function () { return window.AMO_SCREENS; });
  load.then(function (html) {
    src = new DOMParser().parseFromString(html, 'text/html');
    var defs = src.querySelector('body > svg'); if (defs) document.body.insertBefore(defs, document.body.firstChild);
    build(); ui();
    if (!embed && !reduce && !/[?&]paused/.test(location.search)) { started = true; play(); }
    ready = true; if (wantPlay && !started && !reduce) { started = true; play(); }
  });
})();
