// Font lab: a small floating panel to try heading and body fonts.
// Loaded in <head> (not deferred) so a saved choice applies before first paint.
// Active only with the gallery look. Trial fonts come straight from Google Fonts;
// the chosen one is self-hosted (Inter Tight for headings, 6 Nov 2026).
(function () {
  var root = document.documentElement;
  if (root.dataset.look !== 'gallery') return;
  // Hidden since the fonts were chosen: ?fonts=1 turns the panel on, ?fonts=0 off.
  try {
    var fq = new URLSearchParams(location.search).get('fonts');
    if (fq === '1') localStorage.setItem('fontLabOn', '1');
    if (fq === '0') localStorage.removeItem('fontLabOn');
    if (localStorage.getItem('fontLabOn') !== '1') return;
  } catch (e) { return; }

  // q: Google Fonts css2 family spec (axes in Google's required order). fixed: static weight to force.
  var FONTS = {
    'Inter':                 { local: true },
    'Inter Tight':           { local: true },
    'Familjen Grotesk':      { q: 'Familjen+Grotesk:wght@400..700' },
    'Zalando Sans':          { q: 'Zalando+Sans:wght@200..900' },
    'Zalando Sans Expanded': { q: 'Zalando+Sans+Expanded:wght@200..900' },
    'Vend Sans':             { q: 'Vend+Sans:wght@300..700' },
    'Bricolage Grotesque':   { q: 'Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800' },
    'Stack Sans Headline':   { q: 'Stack+Sans+Headline:wght@200..700' },
    'Stack Sans Text':       { q: 'Stack+Sans+Text:wght@200..700' },
    'Instrument Sans':       { q: 'Instrument+Sans:wdth,wght@75..100,400..700' },
    'Schibsted Grotesk':     { q: 'Schibsted+Grotesk:wght@400..900' },
    'Hanken Grotesk':        { q: 'Hanken+Grotesk:wght@100..900' },
    'Host Grotesk':          { q: 'Host+Grotesk:wght@300..800' },
    'Space Grotesk':         { q: 'Space+Grotesk:wght@300..700' },
    'Geist':                 { q: 'Geist:wght@100..900' },
    'Onest':                 { q: 'Onest:wght@100..900' },
    'Mona Sans':             { q: 'Mona+Sans:wdth,wght@75..125,200..900' },
    'Funnel Display':        { q: 'Funnel+Display:wght@300..800' },
    'Funnel Sans':           { q: 'Funnel+Sans:wght@300..800' },
    'Rethink Sans':          { q: 'Rethink+Sans:wght@400..800' },
    'Sora':                  { q: 'Sora:wght@100..800' },
    'Unbounded':             { q: 'Unbounded:wght@200..900' },
    'IBM Plex Sans':         { q: 'IBM+Plex+Sans:wdth,wght@75..100,100..700' },
    'Public Sans':           { q: 'Public+Sans:wght@100..900' },
    'DM Sans':               { q: 'DM+Sans:opsz,wght@9..40,100..1000' },
    'Figtree':               { q: 'Figtree:wght@300..900' },
    'Albert Sans':           { q: 'Albert+Sans:wght@100..900' },
    'Instrument Serif':      { q: 'Instrument+Serif', fixed: '400' },
    'Fraunces':              { q: 'Fraunces:opsz,wght@9..144,100..900' },
    'Newsreader':            { q: 'Newsreader:opsz,wght@6..72,200..800' }
  };
  var HEAD_GROUPS = [
    ['Current', ['Inter Tight', 'Inter', 'Familjen Grotesk']],
    ['Your picks', ['Zalando Sans', 'Zalando Sans Expanded', 'Vend Sans', 'Bricolage Grotesque', 'Stack Sans Headline']],
    ['Grotesks', ['Instrument Sans', 'Schibsted Grotesk', 'Hanken Grotesk', 'Host Grotesk', 'Space Grotesk', 'Geist', 'Onest', 'Mona Sans', 'Funnel Display', 'Rethink Sans']],
    ['More character', ['Sora', 'Unbounded']],
    ['Serif accent', ['Instrument Serif', 'Fraunces', 'Newsreader']]
  ];
  var BODY_GROUPS = [
    ['Current', ['Inter']],
    ['Your picks', ['Zalando Sans', 'Vend Sans', 'Familjen Grotesk', 'Bricolage Grotesque', 'Stack Sans Text']],
    ['Text sans', ['Geist', 'Instrument Sans', 'Onest', 'Hanken Grotesk', 'IBM Plex Sans', 'Public Sans', 'DM Sans', 'Figtree', 'Funnel Sans', 'Mona Sans', 'Albert Sans']]
  ];
  var DEFAULT = { head: 'Inter Tight', body: 'Inter', weight: '', track: '' };
  var KEY = 'fontLab';

  function load() { try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, DEFAULT); } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var linkEl = null;
  function ensureLoaded(names) {
    var q = names.filter(function (n) { return FONTS[n] && !FONTS[n].local; })
                 .filter(function (n, i, a) { return a.indexOf(n) === i; })
                 .map(function (n) { return 'family=' + FONTS[n].q; });
    if (!q.length) return;
    var href = 'https://fonts.googleapis.com/css2?' + q.join('&') + '&display=swap';
    if (linkEl && linkEl.href === href) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
    linkEl = l;
  }

  function apply(s) {
    ensureLoaded([s.head, s.body]);
    root.style.setProperty('--display', '"' + s.head + '", var(--font)');
    if (s.body === 'Inter') {
      root.style.removeProperty('--font');
      root.style.removeProperty('--features');
    } else {
      root.style.setProperty('--font', '"' + s.body + '", -apple-system, system-ui, sans-serif');
      root.style.setProperty('--features', 'normal'); // Inter's cv/ss switches mean other things in other fonts
    }
    var w = s.weight || (FONTS[s.head] && FONTS[s.head].fixed) || '';
    if (w) { root.dataset.hw = ''; root.style.setProperty('--display-weight', w); }
    else { delete root.dataset.hw; root.style.removeProperty('--display-weight'); }
    if (s.track !== '') { root.dataset.ht = ''; root.style.setProperty('--display-track', s.track + 'em'); }
    else { delete root.dataset.ht; root.style.removeProperty('--display-track'); }
  }

  var state = load();
  apply(state);

  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'fl';
    wrap.innerHTML =
      '<button class="fl-toggle" type="button" aria-expanded="false" aria-controls="fl-panel"><b>Aa</b> Fonts</button>' +
      '<div class="fl-panel" id="fl-panel" hidden>' +
        '<label>Headings<select data-k="head"></select></label>' +
        '<label>Body text<select data-k="body"></select></label>' +
        '<div class="fl-row"><span>Heading weight</span><div class="fl-seg" data-k="weight">' +
          ['', '500', '600', '700'].map(function (w) { return '<button type="button" data-v="' + w + '">' + (w || 'Auto') + '</button>'; }).join('') +
        '</div></div>' +
        '<label class="fl-range">Heading tracking <output></output><input type="range" min="-0.05" max="0.02" step="0.005" data-k="track"></label>' +
        '<div class="fl-foot"><button type="button" class="fl-reset">Reset</button><span class="fl-note">Saved in this browser</span></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var panel = wrap.querySelector('.fl-panel');
    var toggle = wrap.querySelector('.fl-toggle');
    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } });

    function fill(sel, groups) {
      sel.innerHTML = groups.map(function (g) {
        return '<optgroup label="' + g[0] + '">' + g[1].map(function (n) { return '<option>' + n + '</option>'; }).join('') + '</optgroup>';
      }).join('');
    }
    var selHead = wrap.querySelector('[data-k="head"]');
    var selBody = wrap.querySelector('[data-k="body"]');
    fill(selHead, HEAD_GROUPS); fill(selBody, BODY_GROUPS);
    var seg = wrap.querySelector('.fl-seg');
    var range = wrap.querySelector('[data-k="track"]');
    var out = wrap.querySelector('.fl-range output');

    function sync() {
      selHead.value = state.head; selBody.value = state.body;
      seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === state.weight)); });
      range.value = state.track === '' ? '-0.02' : state.track;
      out.textContent = state.track === '' ? 'auto' : (+state.track).toFixed(3) + 'em';
    }
    function set(k, v) { state[k] = v; save(state); apply(state); sync(); }

    selHead.addEventListener('change', function () { set('head', selHead.value); });
    selBody.addEventListener('change', function () { set('body', selBody.value); });
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set('weight', b.dataset.v); });
    range.addEventListener('input', function () { set('track', range.value); });
    wrap.querySelector('.fl-reset').addEventListener('click', function () { state = Object.assign({}, DEFAULT); save(state); apply(state); sync(); });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
