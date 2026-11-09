// Zam flow: one evening of a foreman, told through the Telegram chat (chat.html) and the real app screens (img/app-*.jpg).
// Each step = caption + action; Prev/Next rebuild state instantly.
// Embed protocol (same as SmartPill/WeatherWell): ?embed, the page posts {ww:'play'|'pause'|'theme'}.
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
  var src, S = {}, M = {}, token = 0, idx = 0, playing = false, instant = false, busy = false;
  var K = +(location.search.match(/[?&]slow=([\d.]+)/) || [])[1] || 1;
  document.documentElement.style.setProperty('--k', K);

  function sleep(ms, t) { return new Promise(function (res, rej) { if (instant) return res(); setTimeout(function () { t === token ? res() : rej('stop'); }, reduce ? 0 : ms * K); }); }
  function frame() { return new Promise(function (r) { if (instant) return r(); var done = false, go = function () { if (!done) { done = true; r(); } }; requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 80); }); }
  function show(el) { el.classList.remove('fl-hidden'); }
  function hide(el) { el.classList.add('fl-hidden'); el.classList.remove('fl-top', 'fl-back'); el.style.transform = ''; el.style.opacity = ''; }
  function wait(el) { el.classList.add('fl-wait'); return el; }
  function time(scr, t) { scr.querySelector('.status span').textContent = t; }

  function chat(id) {
    var el = src.getElementById(id).cloneNode(true);
    el.removeAttribute('id'); el.classList.add('screen', 'fl-hidden');
    stage.insertBefore(el, cursor); return el;
  }
  function app(name, hots) {
    var el = document.createElement('div'); el.className = 'screen app fl-hidden';
    el.innerHTML = '<div class="sb"><span>20:15</span><span>5G <i></i></span></div><img src="img/app-' + name + '.jpg" alt="">' +
      Object.keys(hots).map(function (k) { return '<i class="hot" data-h="' + k + '" style="left:' + hots[k][0] + 'px;top:' + hots[k][1] + 'px"></i>'; }).join('');
    stage.insertBefore(el, cursor); return el;
  }
  // Tab bar of the app: Sites · Purchases · Search · To sort · More
  var TABS = { sites: [39, 812], purchases: [117, 812], sort: [273, 812] };

  function build() {
    Array.prototype.slice.call(stage.children).forEach(function (n) { if (n !== cursor && n !== toast) n.remove(); });
    // The crew chat: Igor and Sasha so far, no reactions yet
    S.group = chat('group'); time(S.group, '16:02');
    var g = S.group.querySelector('.feed').children;
    M.igor = g[1]; M.photo = g[2]; M.receipt = wait(g[3]); g[5].remove(); g[4].remove();
    S.group.querySelectorAll('.react').forEach(wait);
    // The private chat with Zam: cards, then questions, then the evening summary
    S.dm = chat('cards'); time(S.dm, '16:02');
    var feed = S.dm.querySelector('.feed'), d = Array.prototype.slice.call(feed.children);
    M.fwd = d[1]; M.card1 = d[2]; M.kb1 = d[3]; M.voice = d[4]; M.card2 = d[5]; M.kb2 = d[6];
    d.slice(1).forEach(wait);
    var a = Array.prototype.slice.call(src.getElementById('ask').querySelector('.feed').children).map(function (n) { return n.cloneNode(true); });
    M.q2 = a[4]; M.a2 = a[5]; M.kbA2 = a[6]; M.q1 = a[1]; M.a1 = a[2]; M.kbA1 = a[3];
    [M.q2, M.a2, M.kbA2, M.q1, M.a1, M.kbA1].forEach(function (n) { feed.appendChild(wait(n)); });
    var s = Array.prototype.slice.call(src.getElementById('digest').querySelector('.feed').children).map(function (n) { return n.cloneNode(true); });
    M.sum = s[1]; M.kbS = s[2]; M.ask2 = s[3]; M.kbS2 = s[4];
    [M.sum, M.kbS, M.ask2, M.kbS2].forEach(function (n) { n.querySelectorAll('time').forEach(function (x) { x.textContent = '20:30'; }); feed.appendChild(wait(n)); });
    // The app, opened from the chat
    S.purch = app('purchases', TABS); S.home = app('home', TABS); S.inbox = app('inbox', TABS);
    show(S.group);
    cursor.classList.remove('show'); toast.classList.remove('on');
  }
  async function reveal(el, t, gap) {
    el.classList.remove('fl-wait'); el.classList.remove('fl-new'); void el.offsetWidth; el.classList.add('fl-new');
    await sleep(gap == null ? 450 : gap, t);
  }
  async function react(row, t) { var r = row.querySelector('.react'); if (r) r.classList.remove('fl-wait'); await sleep(320, t); }
  function k() { return stage.getBoundingClientRect().width / 390; }
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
    await sleep(180, t);
  }
  function button(kb, text) { return Array.prototype.find.call(kb.querySelectorAll('span'), function (b) { return b.textContent.indexOf(text) >= 0; }); }
  function prep(el, css) { el.style.transition = 'none'; for (var p in css) el.style[p] = css[p]; show(el); void el.offsetWidth; el.style.transition = ''; }
  function toastMsg(text) {
    if (instant) return;
    toast.lastChild.textContent = text; toast.classList.add('on');
    setTimeout(function () { toast.classList.remove('on'); }, 1700 * K);
  }
  async function push(from, to, t) {
    prep(to, { transform: 'translateX(100%)' }); to.classList.add('fl-top');
    await frame();
    to.style.transform = ''; from.style.transform = 'translateX(-28%)'; from.classList.add('fl-back');
    await sleep(460, t);
    hide(from); to.classList.remove('fl-top');
  }
  async function fade(from, to, t) {
    prep(to, { opacity: '0' }); to.classList.add('fl-top');
    await frame(); to.style.opacity = '1';
    await sleep(300, t);
    hide(from); to.classList.remove('fl-top'); to.style.opacity = '';
  }
  // The Mini App opens over the chat like a sheet and closes back down
  async function cover(from, to, t) {
    prep(to, { transform: 'translateY(100%)' }); to.classList.add('fl-top');
    await frame();
    to.style.transform = ''; from.classList.add('fl-back');
    await sleep(520, t);
    hide(from); to.classList.remove('fl-top');
  }
  async function uncover(from, under, t) {
    prep(under, {}); under.classList.add('fl-back'); from.classList.add('fl-top');
    await frame();
    from.style.transform = 'translateY(100%)'; under.classList.remove('fl-back');
    await sleep(520, t);
    hide(from);
  }
  async function save(kb, msg, t) { await tap(button(kb, 'Save'), t); kb.classList.add('fl-gone'); toastMsg(msg); await sleep(400, t); }

  var steps = [
    { cap: 'The Bakery crew writes in its site chat, the way it always has.', run: async function () {} },
    { cap: 'Zam reads along and stays silent. 👌 means the message is filed.', run: async function (t) {
        await react(M.igor, t); await react(M.photo, t); } },
    { cap: 'A receipt photo goes in like any other message. Nobody fills in a form.', run: async function (t) {
        await reveal(M.receipt, t, 700); await react(M.receipt, t); } },
    { cap: 'Money is never saved quietly: the receipt reaches the foreman as a card.', run: async function (t) {
        await sleep(300, t); await push(S.group, S.dm, t);
        await reveal(M.fwd, t, 600); await reveal(M.card1, t, 250); await reveal(M.kb1, t, 200); } },
    { cap: 'One tap to save it, or Fix if the bot read something wrong.', run: async function (t) {
        await save(M.kb1, 'Expense saved · Bakery', t); } },
    { cap: 'A voice note becomes a purchase, and the card shows what the bot heard.', run: async function (t) {
        time(S.dm, '16:05'); await reveal(M.voice, t, 900); await reveal(M.card2, t, 250); await reveal(M.kb2, t, 200); } },
    { cap: 'Saved to the Cottage’s purchases.', run: async function (t) {
        await save(M.kb2, 'Purchase saved · Cottage', t); } },
    { cap: 'Evening. Instead of scrolling every chat, the foreman asks.', run: async function (t) {
        time(S.dm, '20:14'); await reveal(M.q2, t, 900); await reveal(M.a2, t, 250); await reveal(M.kbA2, t, 200); } },
    { cap: 'Answers come only from saved records, with the source.', run: async function (t) {
        await reveal(M.q1, t, 900); await reveal(M.a1, t, 250); await reveal(M.kbA1, t, 200); } },
    { cap: 'The app opens right inside Telegram: every purchase, by site and date.', run: async function (t) {
        await tap(button(M.kbA1, 'Open all purchases'), t); await cover(S.dm, S.purch, t); } },
    { cap: 'Sites: what to buy, what the bot wasn’t sure about, what didn’t add up.', run: async function (t) {
        await tap(S.purch.querySelector('[data-h="sites"]'), t, true); await fade(S.purch, S.home, t); } },
    { cap: 'To sort: one tap picks the site or the type the bot couldn’t guess.', run: async function (t) {
        await tap(S.home.querySelector('[data-h="sort"]'), t, true); await fade(S.home, S.inbox, t); } },
    { cap: 'Later in the evening: one summary of the day and at most five questions.', run: async function (t) {
        await sleep(300, t); await uncover(S.inbox, S.dm, t); time(S.dm, '20:30');
        await reveal(M.sum, t, 500); await reveal(M.kbS, t, 300); await reveal(M.ask2, t, 250); await reveal(M.kbS2, t, 200); } },
    { cap: 'Igor’s ladder becomes a purchase. Tomorrow the crew just writes again.', run: async function (t) {
        await tap(button(M.kbS, 'Purchase'), t); M.kbS.classList.add('fl-gone'); toastMsg('Ladder added · Bakery purchases'); await sleep(400, t); } }
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
  // The caption changes as the step starts, so it describes what is happening on screen.
  async function forward(t) { busy = true; caption.textContent = steps[idx + 1].cap; try { await steps[idx + 1].run(t); } finally { busy = false; } idx++; ui(); }
  async function next() { if (idx >= LAST) return; if (busy || playing) return jump(idx + 1); var t = ++token; playing = false; ui(); try { await forward(t); } catch (e) {} }
  async function play() {
    if (idx === LAST) await jump(0);
    var t = ++token; playing = true; ui();
    try {
      await sleep(400, t);
      while (idx < LAST) { await sleep(1800, t); await forward(t); }
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

  // On a server take the live chat.html; from disk (file://) or if the fetch fails, the snapshot in screens.js.
  var load = location.protocol === 'file:' && window.ZAM_SCREENS ? Promise.resolve(window.ZAM_SCREENS)
    : fetch('chat.html').then(function (r) { if (!r.ok) throw r.status; return r.text(); }).catch(function () { return window.ZAM_SCREENS; });
  load.then(function (html) {
    src = new DOMParser().parseFromString(html, 'text/html');
    // chat.html's styles and icon symbols come along; the player's own body styles stay on top (.fl-body beats body)
    src.querySelectorAll('head style').forEach(function (s) { document.head.appendChild(s.cloneNode(true)); });
    var sym = src.querySelector('body > svg'); if (sym) document.body.appendChild(sym.cloneNode(true));
    build(); ui();
    var at = +(location.hash.match(/^#(\d+)$/) || [])[1];
    if (at) { jump(at - 1); started = true; }
    if (!at && !embed && !reduce && !/[?&]paused/.test(location.search)) { started = true; play(); }
    ready = true; if (wantPlay && !started && !reduce) { started = true; play(); }
  });
})();
