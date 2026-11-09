// Phone (or desktop, with "device": "desktop", "w", "h") walkthrough: real screens driven by a cursor. Same controls as the other case demos.
// Config lives in <script type="application/json"> inside [data-phone-demo]:
// { "base": "img/x/", "screens": { "id": ["file", heightPt] }, "steps": [{ "cap": "...", "show": "id", "scroll": 0, "tap": [x, y] }] }
// A step's show/scroll is the state the walkthrough moves to when that step is played; tap (in screen pt) happens first.
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('[data-phone-demo]'), function (root) {
    var cfg = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vp = root.querySelector('.pd-viewport');
    var caption = root.querySelector('.rd-caption'), countEl = root.querySelector('.rd-count');
    var playBtn = root.querySelector('[data-rd="play"]'), prevBtn = root.querySelector('[data-rd="prev"]'), nextBtn = root.querySelector('[data-rd="next"]');
    var progress = root.querySelector('.rd-progress');

    var W = cfg.w || 375, desktop = cfg.device === 'desktop';
    if (desktop) root.classList.add('pd-desktop');
    var html = '<div class="pd-phone"><div class="pd-stage" style="aspect-ratio:' + W + ' / ' + (cfg.h || 812) + '">';
    Object.keys(cfg.screens).forEach(function (id) {
      html += '<div class="pd-screen" data-s="' + id + '"><img src="' + cfg.base + cfg.screens[id][0] + '" alt="" decoding="async"></div>';
    });
    html += '<div class="pd-cursor"><span class="pd-ring"></span></div></div></div>';
    vp.innerHTML = html;
    var stage = vp.querySelector('.pd-stage'), cursor = vp.querySelector('.pd-cursor');
    Array.prototype.forEach.call(stage.querySelectorAll('img'), function (im) { if (im.decode) im.decode().catch(function () {}); });
    var scale = 1;
    function fit() { scale = stage.clientWidth / W; stage.style.setProperty('--k', scale); }
    fit(); window.addEventListener('resize', function () { fit(); render(stateAt(idx)); });

    var steps = cfg.steps, LAST = steps.length - 1;
    function stateAt(i) { var s = { show: steps[0].show, scroll: 0 }; for (var j = 1; j <= i; j++) { if (steps[j].show) { s.show = steps[j].show; s.scroll = 0; } if (steps[j].scroll !== undefined) s.scroll = steps[j].scroll; } return s; }
    function render(s) {
      Array.prototype.forEach.call(stage.querySelectorAll('.pd-screen'), function (el) {
        var on = el.getAttribute('data-s') === s.show;
        el.classList.toggle('on', on);
        if (on) el.querySelector('img').style.transform = 'translateY(' + (-s.scroll * scale) + 'px)';
      });
    }
    var idx = 0, playing = false, token = 0;
    function sleep(ms, t) { return new Promise(function (res, rej) { setTimeout(function () { t === token ? res() : rej('stop'); }, reduce ? 0 : ms); }); }
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
    async function perform(i, t) {
      var st = steps[i + 1];
      if (st.tap) {
        cursor.classList.add('show');
        cursor.style.transform = 'translate(' + st.tap[0] * scale + 'px,' + st.tap[1] * scale + 'px)';
        await sleep(560, t);
        cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
        await sleep(260, t);
      } else cursor.classList.remove('show');
      render(stateAt(i + 1));
      await sleep(st.show ? 500 : 950, t);
    }
    function jump(i) { token++; playing = false; idx = Math.max(0, Math.min(LAST, i)); render(stateAt(idx)); cursor.classList.remove('show'); updateUI(); }
    async function stepForward() { if (idx >= LAST) return; var t = ++token; playing = false; updateUI(); try { await perform(idx, t); idx++; updateUI(); } catch (e) {} }
    async function play() {
      if (idx === LAST) jump(0);
      var t = ++token; playing = true; updateUI();
      try {
        await sleep(500, t);
        while (idx < LAST) { await sleep(2200, t); await perform(idx, t); idx++; updateUI(); }
        playing = false; updateUI();
        setTimeout(function () { if (t === token) cursor.classList.remove('show'); }, 1200);
      } catch (e) {}
    }
    function pause() { token++; playing = false; updateUI(); }
    progress.innerHTML = steps.map(function (_, i) { return '<button type="button" aria-label="Step ' + (i + 1) + '"></button>'; }).join('');
    progress.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(Array.prototype.indexOf.call(progress.children, b)); });
    playBtn.addEventListener('click', function () { playing ? pause() : play(); });
    prevBtn.addEventListener('click', function () { jump(idx - 1); });
    nextBtn.addEventListener('click', stepForward);
    render(stateAt(0)); updateUI();
    var started = false;
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) { if (!started && !reduce) { started = true; play(); } }
        else if (playing && !e.isIntersecting) pause();
      });
    }, { threshold: [0, 0.5] }).observe(vp);
  });
})();
