// Rule builder walkthrough: a scripted, replayable build of one anti-fraud rule.
// Every state is derived from the steps, so Back / jump just recompute; Play animates a cursor between them.
(function () {
  document.querySelectorAll('[data-rule-demo]').forEach(init);

  // data-rule-demo="mini": a compact, looping, control-free version for the case card on the home page.
  function init(root) {
  var mini = root.getAttribute('data-rule-demo') === 'mini';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = root.querySelector('.rd-stage');
  var builder = root.querySelector('.rd-builder');
  var codeEl = root.querySelector('.rd-codepane pre');
  var cursor = root.querySelector('.rd-cursor');
  var caption = root.querySelector('.rd-caption');
  var countEl = root.querySelector('.rd-count');
  var playBtn = root.querySelector('[data-rd="play"]');
  var prevBtn = root.querySelector('[data-rd="prev"]');
  var nextBtn = root.querySelector('[data-rd="next"]');
  var progress = root.querySelector('.rd-progress');
  var continueBtn = root.querySelector('.rd-continue');

  var OPS = ['==', '!=', '>', '<', '>=', '<='];
  var CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  function blank(id, tab) {
    return { id: id, tab: tab, param: null, op: null, value: '', agg: null, aggParam: null, win: tab === 'function' ? 'calendar' : null, unit: null, n: '', where: null, cmpOp: null, cmpVal: '', error: false };
  }
  // The builder has no empty state: the first block starts as a parameter, the next one as a function, joined with AND.
  function initial() { return { blocks: [blank(1, 'parameter')], conn: [], then: null }; }
  function b(s, id) { return s.blocks[id - 1]; }

  // Each step: the caption for the state you see, then the action that leads to the next state.
  var steps = [
    { cap: 'Every rule starts with a condition. The first block compares one field of the payment.',
      act: { k: 'b1-param', menu: ['Amount', 'Currency', 'Card country', 'BIN', 'Email domain'], pick: 0, apply: function (s) { b(s, 1).param = 'Amount'; } } },
    { cap: 'The summary line above the fields reads as a sentence while you fill them in.',
      act: { k: 'b1-op', menu: OPS, pick: 2, apply: function (s) { b(s, 1).op = '>'; } } },
    { cap: 'Operator, then the value.',
      act: { k: 'b1-value', type: '2500', field: [1, 'value'], apply: function (s) { s.conn[0] = 'AND'; s.blocks.push(blank(2, 'function')); } } },
    { cap: '"Amount > 2500". The next block joins with AND and starts as a function: one that looks at the card’s history.',
      act: { k: 'b2-agg', menu: ['Total Sum', 'Count', 'Unique Count', 'Average', 'Max'], pick: 0, apply: function (s) { b(s, 2).agg = 'Total Sum'; } } },
    { cap: 'Total sum of which field?',
      act: { k: 'b2-aggParam', menu: ['Amount', 'Fee', 'Refund amount'], pick: 0, apply: function (s) { b(s, 2).aggParam = 'Amount'; } } },
    { cap: 'What if you try to continue before the time window is set?',
      act: { k: 'continue', apply: function (s) { b(s, 2).error = true; } } },
    { cap: 'The error appears on the block that causes it, not in a banner above a long form.',
      act: { k: 'b2-unit', menu: ['Minute', 'Hour', 'Day', 'Month'], pick: 1, apply: function (s) { b(s, 2).unit = 'Hour'; } } },
    { cap: 'A calendar window by default; now its length.',
      act: { k: 'b2-n', type: '24', field: [2, 'n'], apply: function (s) { b(s, 2).error = false; } } },
    { cap: 'The window is set and the error is gone. Next: which payments count.',
      act: { k: 'b2-where-add', menu: ['Card hash = tx.card hash', 'Customer ID = tx.customer ID', 'Email = tx.email', 'Device ID = tx.device ID'], pick: 0, apply: function (s) { b(s, 2).where = 'card'; } } },
    { cap: 'WHERE narrows it to payments with this card. Last part of the condition: compare the total.',
      act: { k: 'b2-cmpOp', menu: OPS, pick: 2, apply: function (s) { b(s, 2).cmpOp = '>'; } } },
    { cap: 'Above what?',
      act: { k: 'b2-cmpVal', type: '5000', field: [2, 'cmpVal'], apply: function (s) { s.then = { reaction: null, score: '' }; } } },
    { cap: 'The condition is complete. THEN says what happens to a payment that matches it.',
      act: { k: 'then-reaction', menu: ['Approve', 'Pre-auth', 'Decline'], pick: 2, apply: function (s) { s.then.reaction = 'Decline'; } } },
    { cap: 'Decline, with a risk score for the case.',
      act: { k: 'then-score', type: '80', field: ['then', 'score'] } },
    { cap: 'Done: decline a payment over 2,500 if this card has already spent over 5,000 today. The same rule reads as a sentence and as code.' }
  ];
  var LAST = steps.length - 1;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function setField(s, f, v) { if (f[0] === 'then') s.then[f[1]] = v; else b(s, f[0])[f[1]] = v; }
  function stateAt(i) {
    var s = initial();
    for (var j = 0; j < i; j++) {
      var a = steps[j].act;
      if (a.field) setField(s, a.field, a.type);
      if (a.apply) a.apply(s);
    }
    return s;
  }

  // ---------- Rendering ----------
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function menuHTML(k, ui) {
    if (!(ui.menu && ui.menu.k === k)) return '';
    return '<div class="rd-menu' + (ui.menu.hi >= 0 ? ' still' : '') + '">' + ui.menu.options.map(function (o, i) {
      return '<div data-k="menu-' + i + '"' + (ui.menu.hi === i ? ' class="hi"' : '') + '>' + esc(o) + '</div>';
    }).join('') + '</div>';
  }
  function select(k, val, ph, ui) {
    var open = ui.menu && ui.menu.k === k;
    var menu = menuHTML(k, ui);
    return '<div class="rd-select' + (val ? '' : ' ph') + (open ? ' open' : '') + '" data-k="' + k + '"><span>' + esc(val || ph) + '</span>' + CHEVRON + menu + '</div>';
  }
  function input(k, val, ph, ui) {
    var typing = ui.typing === k;
    return '<div class="rd-input' + (val || typing ? '' : ' ph') + (typing ? ' typing' : '') + '" data-k="' + k + '"><span>' + esc(val || (typing ? '' : ph)) + '</span></div>';
  }
  function seg(k, a, bLabel, on) {
    return '<div class="rd-seg"><span data-k="' + k + '-' + a.toLowerCase() + '"' + (on === a.toLowerCase() ? ' class="on"' : '') + '>' + a + '</span>' +
      '<span data-k="' + k + '-' + bLabel.toLowerCase() + '"' + (on === bLabel.toLowerCase() ? ' class="on"' : '') + '>' + bLabel + '</span></div>';
  }
  function bold(v) { return v ? '<b>' + esc(v) + '</b>' : '<b class="muted">Select</b>'; }

  function blockHTML(bl, ui, isNew) {
    var k = 'b' + bl.id, h = '';
    h += '<div class="rd-if' + (bl.error ? ' is-error' : '') + (isNew ? ' rd-enter' : '') + '" data-block="' + bl.id + '">';
    h += '<span class="rd-badge rd-badge-if">IF</span>';
    h += '<div class="rd-card rd-main">';
    h += seg(k + '-tab', 'Function', 'Parameter', bl.tab);
    if (!bl.tab) {
      h += '<div class="rd-summary"><span class="muted">Choose a function or a parameter</span></div>';
    } else if (bl.tab === 'parameter') {
      var sent = [bl.param, bl.op, bl.value].filter(Boolean).join(' ');
      h += '<div class="rd-summary">Parameter : ' + bold(sent) + '</div>';
      h += '<div class="rd-fields">' + select(k + '-param', bl.param, 'Parameter', ui) + select(k + '-op', bl.op, 'Operator', ui) + input(k + '-value', bl.value, 'Value', ui) + '</div>';
    } else {
      var created = bl.win && bl.unit && bl.n ? 'Last ' + bl.n + ' ' + bl.unit.toLowerCase() + (bl.n === '1' ? '' : 's') : '';
      h += '<div class="rd-summary"><div>Aggregation function : ' + bold(bl.agg) + '</div><div>Parameter : ' + bold(bl.aggParam) + '</div><div>Created at : ' + bold(created) + '</div></div>';
      h += '<div class="rd-fields">' + select(k + '-agg', bl.agg, 'Aggregation function', ui) + select(k + '-aggParam', bl.aggParam, 'Parameter', ui);
      h += '<div class="rd-label">Created at</div>' + seg(k + '-win', 'Calendar', 'Rolling', bl.win).replace('rd-seg', 'rd-seg rd-seg-flat');
      h += '<div class="rd-row">' + select(k + '-unit', bl.unit, 'Unit', ui) + input(k + '-n', bl.n, 'Length', ui) + '</div></div>';
      if (bl.error) h += '<div class="rd-err' + (shown.err ? ' still' : '') + '">Specify the creation date restrictions</div>';
    }
    h += '</div>';
    if (bl.tab === 'function') {
      h += '<div class="rd-wherediv"><span class="rd-badge rd-badge-where">WHERE</span></div>';
      h += '<div class="rd-card">';
      if (bl.where) h += '<div class="rd-summary" style="border-top:0">Parameter : <b>Card hash = tx.card hash</b></div>';
      h += '<div class="rd-add' + (bl.where ? '' : ' first') + '" data-k="' + k + '-where-add">' + PLUS + 'Add parameter' + menuHTML(k + '-where-add', ui) + '</div>';
      h += '</div>';
      if (bl.where) {
        var cmp = [bl.cmpOp, bl.cmpVal].filter(Boolean).join(' ');
        h += '<div class="rd-card rd-cmp' + (!shown.cmp ? ' rd-enter' : '') + '"><div class="rd-summary" style="border-top:0">Compare total : ' + bold(cmp) + '</div>';
        h += '<div class="rd-fields"><div class="rd-row">' + select(k + '-cmpOp', bl.cmpOp, 'Operator', ui) + input(k + '-cmpVal', bl.cmpVal, 'Value', ui) + '</div></div></div>';
      }
    }
    h += '</div>';
    return h;
  }

  function connHTML(i, val, isNew) {
    return '<div class="rd-conn' + (isNew ? ' rd-enter' : '') + '"><i></i><div class="rd-andor"><span data-k="conn' + i + '-and"' + (val === 'AND' ? ' class="on"' : '') + '>AND</span><span data-k="conn' + i + '-or"' + (val === 'OR' ? ' class="on"' : '') + '>OR</span></div><i></i></div>';
  }

  function thenHTML(t, ui, isNew) {
    return '<div class="rd-conn"><i></i></div><div class="rd-if' + (isNew ? ' rd-enter' : '') + '"><span class="rd-badge rd-badge-if" style="background:#16161A">THEN</span><div class="rd-card rd-main">' +
      '<div class="rd-summary" style="border-top:0"><div>Reaction : ' + bold(t.reaction) + '</div><div>Score : ' + bold(t.score) + '</div></div>' +
      '<div class="rd-fields"><div class="rd-row">' + select('then-reaction', t.reaction, 'Reaction', ui) + input('then-score', t.score, 'Score', ui) + '</div></div></div></div>';
  }

  var shown = { blocks: 1, then: false, cmp: false, err: false };
  function render(s, ui) {
    ui = ui || {};
    var h = '<div class="rd-col">';
    s.blocks.forEach(function (bl, i) {
      if (i > 0) h += connHTML(i, s.conn[i - 1], i + 1 > shown.blocks);
      h += blockHTML(bl, ui, i + 1 > shown.blocks);
    });
    if (s.then) h += thenHTML(s.then, ui, !shown.then);
    h += '</div>';
    builder.innerHTML = h;
    shown.blocks = s.blocks.length;
    shown.then = !!s.then;
    shown.cmp = s.blocks.some(function (x) { return x.where; });
    shown.err = s.blocks.some(function (x) { return x.error; });
    continueBtn.setAttribute('data-k', 'continue');
    renderCode(s);
  }

  var prevLines = [];
  function lower(v) { return String(v).toLowerCase().replace(/\s+/g, '_'); }
  function codeLines(s) {
    var out = [];
    s.blocks.forEach(function (bl, i) {
      var pre = i === 0 ? 'IF ' : (s.conn[i - 1] || '') + ' ';
      if (bl.tab === 'parameter') {
        out.push(pre + [bl.param ? lower(bl.param) : '', bl.op || '', bl.value].filter(Boolean).join(' '));
      } else if (bl.tab === 'function') {
        var fn = bl.agg ? bl.agg.toUpperCase().replace(/\s+/g, '_') : '';
        out.push(pre + (fn ? fn + '(' + (bl.aggParam ? lower(bl.aggParam) : '') + ')' : ''));
        if (bl.where) out.push('     WHERE card_hash == tx.card_hash');
        if (bl.win && bl.unit && bl.n) out.push('     INTERVAL ' + bl.win + ' ' + bl.n + ' ' + bl.unit.toLowerCase() + 's');
        var cmp = [bl.cmpOp, bl.cmpVal].filter(Boolean).join(' ');
        if (cmp) out[out.length - 1] += ' ' + cmp;
      } else {
        out.push(pre);
      }
    });
    return out;
  }
  function renderCode(s) {
    if (!codeEl) return;
    var lines = codeLines(s);
    var empty = lines.length === 1 && lines[0].trim() === 'IF';
    if (empty) { codeEl.innerHTML = '<span class="muted">IF …</span>'; prevLines = lines; return; }
    codeEl.innerHTML = lines.map(function (l, i) {
      return l !== prevLines[i] ? '<mark>' + esc(l) + '</mark>' : esc(l);
    }).join('\n');
    prevLines = lines;
  }

  // ---------- Player ----------
  var idx = 0, playing = false, token = 0;
  var state = initial();

  function updateUI() {
    if (mini) return;
    caption.textContent = steps[idx].cap;
    countEl.textContent = (idx + 1) + ' / ' + steps.length;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === LAST;
    Array.prototype.forEach.call(progress.children, function (el, i) {
      el.className = i < idx ? 'done' : i === idx ? 'cur' : '';
      el.setAttribute('aria-current', i === idx ? 'step' : 'false');
    });
    playBtn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>Pause'
      : idx === LAST
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Replay'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>Play';
  }

  function sleep(ms, t) {
    return new Promise(function (res, rej) { setTimeout(function () { t === token ? res() : rej('stop'); }, ms); });
  }
  function find(k) { return k === 'continue' ? continueBtn : stage.querySelector('[data-k="' + k + '"]'); }
  function scrollTo(el, t) {
    if (!builder.contains(el)) return Promise.resolve();
    var br = builder.getBoundingClientRect(), er = el.getBoundingClientRect();
    var top = builder.scrollTop + (er.top - br.top) - br.height * 0.32;
    if (Math.abs(top - builder.scrollTop) < 24) return Promise.resolve();
    builder.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    return sleep(reduce ? 0 : 320, t);
  }
  function moveCursor(el, t) {
    var sr = stage.getBoundingClientRect(), er = el.getBoundingClientRect();
    var x = er.left - sr.left + Math.min(er.width / 2, 48), y = er.top - sr.top + er.height / 2;
    cursor.classList.add('show');
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    return sleep(reduce ? 0 : 420, t);
  }
  function click(el, t) {
    cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
    if (el) { el.classList.add('rd-press'); setTimeout(function () { el.classList.remove('rd-press'); }, 140); }
    return sleep(reduce ? 0 : 140, t);
  }

  async function perform(i, t) {
    var a = steps[i].act;
    var el = find(a.k);
    if (el) { await scrollTo(el, t); await moveCursor(el, t); await click(el, t); }
    if (a.menu) {
      render(state, { menu: { k: a.k, options: a.menu, hi: -1 } });
      await sleep(reduce ? 0 : 160, t);
      var opt = find('menu-' + a.pick);
      if (opt) { await moveCursor(opt, t); }
      render(state, { menu: { k: a.k, options: a.menu, hi: a.pick } });
      await click(null, t);
    }
    if (a.type) {
      for (var c = 1; c <= a.type.length; c++) {
        var tmp = clone(state); setField(tmp, a.field, a.type.slice(0, c));
        render(tmp, { typing: a.k });
        await sleep(reduce ? 0 : 75, t);
      }
      await sleep(reduce ? 0 : 120, t);
    }
    state = stateAt(i + 1);
    render(state);
  }

  function jump(i) {
    token++; playing = false;
    idx = Math.max(0, Math.min(LAST, i));
    state = stateAt(idx);
    shown = { blocks: state.blocks.length, then: !!state.then, cmp: true, err: true };
    prevLines = codeLines(state);
    render(state);
    cursor.classList.remove('show');
    builder.scrollTop = builder.scrollHeight;
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
      while (idx < LAST) {
        await perform(idx, t);
        idx++; updateUI();
        await sleep(idx === LAST ? 0 : 1100, t);
      }
      if (mini) { await sleep(2800, t); jump(0); play(); return; }
      playing = false; updateUI();
      setTimeout(function () { if (t === token) cursor.classList.remove('show'); }, 1200);
    } catch (e) { /* interrupted */ }
  }
  function pause() { token++; playing = false; updateUI(); }

  // Progress segments
  if (!mini) {
  progress.innerHTML = steps.map(function (_, i) { return '<button type="button" aria-label="Step ' + (i + 1) + '"></button>'; }).join('');
  progress.addEventListener('click', function (e) {
    var btn = e.target.closest('button'); if (!btn) return;
    jump(Array.prototype.indexOf.call(progress.children, btn));
  });
  playBtn.addEventListener('click', function () { playing ? pause() : play(); });
  prevBtn.addEventListener('click', function () { jump(idx - 1); });
  nextBtn.addEventListener('click', stepForward);
  }

  if (mini && reduce) { jump(LAST); return; }
  render(state);
  updateUI();

  // Start once, when the demo is mostly on screen; pause when it scrolls away.
  var started = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.5) {
          if (!reduce && (!started || (mini && !playing))) { started = true; play(); }
        } else if (playing && !en.isIntersecting) {
          pause();
        }
      });
    }, { threshold: [0, 0.5] }).observe(stage);
  }
  }
})();
