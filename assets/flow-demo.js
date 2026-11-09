// Checkout flow builder walkthrough. Layout follows the Flow Builder screens: Screens list, graph canvas, inspector;
// Form mode with palette, structure, live checkout and properties/theme; Preview as a modal.
// Same player model as rule-demo.js: every state is derived from the steps; Play animates a cursor between them.
(function () {
  document.querySelectorAll('[data-flow-demo]').forEach(init);

  function init(root) {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stage = root.querySelector('.fd-stage');
    var app = root.querySelector('.fd-app');
    var cursor = root.querySelector('.fd-cursor');
    var caption = root.querySelector('.rd-caption');
    var countEl = root.querySelector('.rd-count');
    var playBtn = root.querySelector('[data-rd="play"]');
    var prevBtn = root.querySelector('[data-rd="prev"]');
    var nextBtn = root.querySelector('[data-rd="next"]');
    var progress = root.querySelector('.rd-progress');

    var CW = 600, CH = 400, NW = 132;
    var NODES = {
      payment: { x: 16, y: 40, tag: 'entry', rows: [{ t: 'Choose a payment method' }, { t: 'pay', port: 'pay' }] },
      submit: { x: 196, y: 40, op: true, rows: [{ t: 'success', port: 'success' }, { t: 'pending', port: 'pending' }, { t: 'failure', port: 'failure' }] },
      success: { x: 410, y: 14, rows: [{ t: 'success · no actions' }] },
      pending: { x: 410, y: 96, tag: 'poll', rows: [{ t: 'Waiting for confirmation' }] },
      failure: { x: 410, y: 178, rows: [{ t: 'Payment declined' }, { t: 'retry', port: 'retry' }] },
      any: { x: 196, y: 286, title: 'From any screen', grey: true, rows: [{ t: 'cancel', port: 'cancel' }, { t: 'timeout', port: 'timeout' }] },
      canceled: { x: 410, y: 268, rows: [{ t: 'canceled · no actions' }] },
      expired: { x: 410, y: 336, rows: [{ t: 'expired · no actions' }] }
    };
    var EDGE = { 'payment.pay': 'submit', 'submit.success': 'success', 'submit.pending': 'pending', 'submit.failure': 'failure', 'failure.retry': 'payment', 'any.cancel': 'canceled', 'any.timeout': 'expired' };
    var SCREENS = [['payment', 'Choose a payment method', 'entry'], ['pending', 'Waiting for confirmation', 'poll'], ['success', 'Payment complete', ''], ['failure', 'Payment declined', ''], ['canceled', 'Payment canceled', ''], ['expired', 'Time is up', '']];
    var BRANDS = { blue: { b: '#483EF0', on: '#FFFFFF' }, green: { b: '#17746C', on: '#FFFFFF' }, yellow: { b: '#F5C518', on: '#4A3A00' }, purple: { b: '#6E4BD8', on: '#FFFFFF' } };
    var ICON = {
      back: '<svg class="fd-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
      eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
      save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
      relayout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/></svg>',
      chev: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#8A8A94" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
      restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
    };

    function initial() {
      return { mode: 'flow', wired: ['payment.pay', 'submit.success', 'submit.pending', 'failure.retry', 'any.cancel', 'any.timeout'],
        body: ['Card'], ptab: 'properties', brand: 'blue', dark: false, modal: false, co: 'payment' };
    }

    var steps = [
      { cap: 'The flow editor: screens on the left, the flow as a graph in the middle, settings of the selected screen on the right. One exit is still loose.',
        act: { k: 'port-submit.failure', to: 'in-failure', apply: function (s) { s.wired.push('submit.failure'); } } },
      { cap: 'Every outcome of a backend operation needs a screen. With the last one wired, the checks turn green.',
        act: { k: 'mode-form', apply: function (s) { s.mode = 'form'; } } },
      { cap: 'Form mode builds the selected screen from blocks: a palette, the screen structure and a live preview.',
        act: { k: 'pal-phone', drag: 'body-drop', label: 'Phone', apply: function (s) { s.body.push('Phone'); } } },
      { cap: 'A phone field dropped into the steps shows up in the checkout.',
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
      { cap: '…the success outcome opens the success screen. A new checkout, wired as a graph and built from blocks instead of drawn screen by screen.' }
    ];
    var LAST = steps.length - 1;

    function stateAt(i) { var s = initial(); for (var j = 0; j < i; j++) steps[j].act.apply(s); return s; }
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function issues(s) { return Object.keys(EDGE).filter(function (p) { return s.wired.indexOf(p) < 0; }).length; }

    // ---------- Rendering ----------
    function seg(items, on, cls) {
      return '<div class="fd-seg ' + (cls || '') + '">' + items.map(function (it) {
        return '<span' + (it[0] ? ' data-k="' + it[0] + '"' : '') + (it[1] === on ? ' class="on"' : '') + '>' + it[1] + '</span>';
      }).join('') + '</div>';
    }
    function topHTML() {
      return '<div class="fd-top">' + ICON.back + '<div class="fd-title"><b>Promo checkout</b><span>promo-checkout · 6 screens</span></div><div class="fd-spacer"></div>' +
        '<span class="fd-btn" data-k="preview">' + ICON.eye + 'Preview</span><span class="fd-btn primary fd-save">' + ICON.save + 'Save</span></div>';
    }
    function barHTML(s) {
      var n = issues(s);
      var h = '<div class="fd-bar">' + seg([['mode-flow', 'Flow'], ['mode-form', 'Form'], ['', 'Component catalog']], s.mode === 'form' ? 'Form' : 'Flow');
      if (s.mode === 'form') h += seg([['', 'All methods'], ['', 'Card']], 'All methods', 'fd-hide-sm');
      else h += seg([['', 'Flowchart'], ['', 'Graph']], 'Flowchart', 'fd-hide-sm') + '<span class="fd-btn fd-hide-sm">' + ICON.relayout + 'Re-layout</span>';
      h += '<div class="fd-spacer"></div><span class="fd-check ' + (n ? 'bad' : 'ok') + '">' + (n ? ICON.warn + n + (n === 1 ? ' ERROR' : ' ERRORS') : ICON.check + 'NO ERRORS') + '</span></div>';
      return h;
    }
    function li(label, sub, opts) {
      opts = opts || {};
      return '<div class="fd-li' + (opts.sel ? ' sel' : '') + (opts.enter ? ' enter' : '') + '"' + (opts.k ? ' data-k="' + opts.k + '"' : '') + '>' +
        (opts.sq ? '<i class="sq"></i>' : '<span class="fd-grip"></span>') + '<div>' + esc(label) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>' + (opts.tag ? '<span class="tag">' + opts.tag + '</span>' : '') + '</div>';
    }
    function field(label, value, sel) {
      return '<div class="fd-field' + (sel ? ' sel' : '') + '"><div>' + (label ? '<small>' + esc(label) + '</small>' : '') + '<span' + (value ? '' : ' style="color:#8A8A94"') + '>' + esc(value || 'Value') + '</span></div>' + (sel ? ICON.chev : '') + '</div>';
    }

    function portY(n, i) { return n.y + 24 + i * 15 + 7.5; }
    var drawn = {};
    function canvasHTML(s) {
      var paths = '';
      Object.keys(EDGE).forEach(function (p) {
        if (s.wired.indexOf(p) < 0) return;
        var parts = p.split('.'), n = NODES[parts[0]], t = NODES[EDGE[p]];
        var i = n.rows.map(function (r) { return r.port; }).indexOf(parts[1]);
        var x1 = n.x + NW, y1 = portY(n, i), x2 = t.x, y2 = t.y + 12, d, lx, ly;
        if (x2 < x1) { d = 'M' + x1 + ' ' + y1 + ' H' + (x1 + 18) + ' V4 H' + (x2 - 10) + ' V' + y2 + ' H' + x2; lx = (x1 + x2) / 2 + 60; ly = 4; }
        else { d = 'M' + x1 + ' ' + y1 + ' C' + (x1 + 40) + ' ' + y1 + ', ' + (x2 - 40) + ' ' + y2 + ', ' + x2 + ' ' + y2; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2; }
        paths += '<path' + (drawn[p] ? '' : ' class="new"') + ' d="' + d + '"/>';
        var w = parts[1].length * 4.6 + 10;
        paths += '<rect x="' + (lx - w / 2) + '" y="' + (ly - 6.5) + '" width="' + w + '" height="13" rx="3"/><text x="' + lx + '" y="' + (ly + 3) + '" text-anchor="middle">' + parts[1] + '</text>';
      });
      var h = '<div class="fd-canvas"><div class="fd-scale"><svg class="fd-edges" viewBox="0 0 ' + CW + ' ' + CH + '">' + paths + '</svg>';
      Object.keys(NODES).forEach(function (id) {
        var n = NODES[id];
        var into = Object.keys(EDGE).some(function (p) { return EDGE[p] === id; });
        h += '<div class="fd-node' + (n.op ? ' op' : '') + (id === 'payment' ? ' sel' : '') + '" style="left:' + n.x + 'px;top:' + n.y + 'px">';
        h += '<div class="fd-nh">' + (into ? '<span class="fd-in" data-k="in-' + id + '"></span>' : '') + '<i' + (n.grey ? ' style="background:#8A8A94"' : '') + '></i>' + esc(n.title || id) + (n.tag ? '<em>' + n.tag + '</em>' : '') + '</div><div class="fd-rows">';
        n.rows.forEach(function (r) {
          var pid = id + '.' + r.port;
          h += '<div class="fd-row' + (r.port ? '' : ' muted') + '">' + esc(r.t) + (r.port ? '<b class="fd-out' + (s.wired.indexOf(pid) >= 0 ? '' : ' loose') + '" data-k="port-' + pid + '"></b>' : '') + '</div>';
        });
        h += '</div></div>';
      });
      h += '</div><div class="fd-zoom"><span>+</span><span>−</span></div></div>';
      return h;
    }

    function flowHTML(s) {
      var h = '<div class="fd-flow"><div class="fd-pane fd-screens"><div class="fd-ph">Screens<span class="fd-btn">+ Screen</span></div><div class="fd-search">' + ICON.search + 'Search screens</div>';
      h += '<div class="fd-card"><div class="fd-ch">Shared · 6</div>' + SCREENS.map(function (sc, i) { return li(sc[0], sc[1], { sq: true, sel: i === 0, tag: sc[2] }); }).join('') + '</div></div>';
      h += canvasHTML(s);
      h += '<div class="fd-pane right fd-insp"><div class="fd-tabs3"><span class="on">Screen</span><span>Transition</span><span>Operations</span></div>';
      h += '<div class="fd-card"><div class="fd-ch">General</div><div style="padding-top:7px">' + field('Screen id', 'payment') + field('Kind', 'form — fields', true) + field('', 'Method (canvas group)') + '</div></div>';
      h += '<div class="fd-card"><div class="fd-toggle">Status polling<i></i></div></div>';
      h += '<div class="fd-card"><div class="fd-ch">Texts</div><div style="padding-top:7px">' + field('Title', 'Choose a payment method') + '</div></div>';
      h += '<div class="fd-card"><div class="fd-ch">Actions (footer) · 2<span>Add</span></div>' + li('Pay', 'pay · primary') + li('Cancel payment', 'cancel · link') + '</div></div></div>';
      return h;
    }

    var shownPhone = false;
    function checkoutHTML(s, extraK) {
      var br = BRANDS[s.brand];
      var h = '<div class="fd-co' + (s.dark ? ' dark' : '') + '" style="--b:' + br.b + ';--on:' + br.on + '">';
      h += '<div class="fd-co-top"><span class="logo"><i></i>Northwind</span><span class="lang">EN</span></div>';
      if (s.co === 'payment' || !s.modal) {
        h += '<div class="fd-amt-l">Amount to pay</div><div class="fd-amt">€ 49.00</div><div class="fd-timer">Pay within 14:59</div>';
        h += '<div class="fd-f"><label>Card number</label><div>0000 0000 0000 0000</div></div><div class="fd-f2"><div class="fd-f"><label>Expiry</label><div>MM / YY</div></div><div class="fd-f"><label>CVC</label><div>•••</div></div></div>';
        if (s.body.indexOf('Phone') >= 0) h += '<div class="fd-f' + (shownPhone ? '' : ' enter') + '"><label>Phone number</label><div>+48 ___ ___ ___</div></div>';
        h += '<div class="fd-pay"' + (extraK ? ' data-k="co-pay"' : '') + '>Pay € 49.00</div><div class="fd-cancel">Cancel payment</div>';
      } else if (s.co === 'pending') {
        h += '<div class="fd-state"><div class="fd-spin"></div><b>Waiting for confirmation</b><span>Don’t close this page</span></div>';
      } else {
        h += '<div class="fd-state"><div class="fd-ok">' + ICON.check + '</div><b>Payment complete</b><span>€ 49.00 to Northwind</span></div>';
      }
      return h + '</div>';
    }

    function formHTML(s, ui) {
      var h = '<div class="fd-form"><div class="fd-subbar"><span class="fd-btn">← Back to flow</span><b>Screen payment</b><span class="mut">Choose a payment method</span></div><div class="fd-form-cols">';
      h += '<div class="fd-pane fd-palette"><div class="fd-ph">Palette</div><div class="fd-card"><div class="fd-ch">Ready-made blocks</div>' + li('Card', 'number, expiry, CVC') + li('Card without CVV', 'number, expiry') + '</div>';
      h += '<div class="fd-card"><div class="fd-ch">Fields</div>' + li('Phone', 'mask and prefix', { k: 'pal-phone' }) + li('Text input', 'payment code') + li('Copyable value', 'payment details') + li('Details card', 'rows + badge') + '</div></div>';
      h += '<div class="fd-pane fd-structure"><div class="fd-ph">Screen structure</div><div class="fd-card"><div class="fd-ch">Header · shared<span>Add</span></div>' + li('Amount') + li('Language switcher', 'en') + li('Timer', '900 s') + '</div>';
      h += '<div class="fd-card' + (ui.drop ? ' drop' : '') + '" data-k="body-drop"><div class="fd-ch">Body · steps<span>Add</span></div>' + li('Card', 'ready-made block') + (s.body.indexOf('Phone') >= 0 ? li('Phone', 'field', { enter: !shownPhone }) : '') + '</div>';
      h += '<div class="fd-card"><div class="fd-ch">Footer · buttons<span>Add</span></div>' + li('Pay', 'primary') + li('Cancel payment', 'link') + '</div></div>';
      h += '<div class="fd-preview-area">' + checkoutHTML(s, false) + '</div>';
      h += '<div class="fd-pane right fd-props"><div class="fd-tabs2"><span data-k="ptab-properties"' + (s.ptab === 'properties' ? ' class="on"' : '') + '>Properties</span><span data-k="ptab-theme"' + (s.ptab === 'theme' ? ' class="on"' : '') + '>Theme</span></div>';
      if (s.ptab === 'properties') {
        h += '<div class="fd-card"><div class="fd-ch">Step title</div><div style="padding-top:7px">' + field('EN', 'Card details') + '</div></div>';
        h += '<div class="fd-card"><div class="fd-ch">Step description</div><div style="padding-top:7px">' + field('EN', '') + '</div></div>';
      } else {
        h += '<div class="fd-card"><div class="fd-ch">Brand</div><div class="fd-theme"><span class="lbl">Accent colour</span><div class="fd-swatches">' +
          Object.keys(BRANDS).map(function (k) { return '<span data-k="sw-' + k + '" style="background:' + BRANDS[k].b + '"' + (s.brand === k ? ' class="on"' : '') + '></span>'; }).join('') + '</div></div></div>';
        h += '<div class="fd-card"><div class="fd-ch">Mode</div><div class="fd-theme">' + seg([['th-light', 'Light'], ['th-dark', 'Dark']], s.dark ? 'Dark' : 'Light', 'full') + '</div></div>';
      }
      h += '</div></div></div>';
      return h;
    }

    function modalHTML(s, isNew) {
      return '<div class="fd-overlay' + (isNew ? '' : ' still') + '"><div class="fd-modal"><div class="fd-mh"><b>Preview</b><span>Click through the flow as a payer. Backend calls are simulated.</span></div>' +
        '<div class="fd-mscreen"><span>Screen<b>' + s.co + '</b></span>' + (s.co === 'payment' ? '<em>ENTRY</em>' : '') + '</div>' +
        '<div class="fd-mbody">' + checkoutHTML(s, true) + '</div>' +
        '<div class="fd-mf"><span class="fd-btn">' + ICON.restart + 'Start over</span><span class="fd-btn primary">Close preview</span></div></div></div>';
    }

    function fitCanvas() {
      var c = app.querySelector('.fd-canvas'), sc = c && c.querySelector('.fd-scale');
      if (!sc) return;
      var w = c.clientWidth, hgt = c.clientHeight;
      var k = Math.min((w - 16) / CW, (hgt - 16) / CH, 1.3);
      sc.style.transform = 'translate(' + (w - CW * k) / 2 + 'px,' + (hgt - CH * k) / 2 + 'px) scale(' + k + ')';
    }

    var modalShown = false;
    function render(s, ui) {
      ui = ui || {};
      app.innerHTML = topHTML() + barHTML(s) + '<div class="fd-main">' + (s.mode === 'form' ? formHTML(s, ui) : flowHTML(s)) + '</div>' + (s.modal ? modalHTML(s, !modalShown) : '');
      if (s.mode !== 'form') fitCanvas();
      s.wired.forEach(function (p) { drawn[p] = true; });
      if (s.body.indexOf('Phone') >= 0) shownPhone = true;
      modalShown = s.modal;
    }

    // ---------- Player ----------
    var idx = 0, playing = false, token = 0, state = initial();
    initial().wired.forEach(function (p) { drawn[p] = true; });

    function updateUI() {
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

    function sleep(ms, t) { return new Promise(function (res, rej) { setTimeout(function () { t === token ? res() : rej('stop'); }, ms); }); }
    function find(k) { var el = stage.querySelector('[data-k="' + k + '"]'); return el && el.getClientRects().length ? el : null; }
    function pointOf(el) {
      var sr = stage.getBoundingClientRect(), er = el.getBoundingClientRect();
      return { x: er.left - sr.left + Math.min(er.width / 2, 40), y: er.top - sr.top + er.height / 2 };
    }
    function moveCursor(el, t) {
      var p = pointOf(el);
      cursor.classList.add('show');
      cursor.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
      return sleep(reduce ? 0 : 380, t);
    }
    function click(el, t) {
      cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
      if (el) { el.classList.add('fd-press'); setTimeout(function () { el.classList.remove('fd-press'); }, 140); }
      return sleep(reduce ? 0 : 120, t);
    }

    async function perform(i, t) {
      var a = steps[i].act, el = a.k ? find(a.k) : null;
      if (el) { await moveCursor(el, t); await click(el, t); }
      if (a.to) { var to = find(a.to); if (to) { await moveCursor(to, t); await click(to, t); } }
      if (a.drag && el) {
        var target = find(a.drag);
        if (target) {
          var ghost = document.createElement('div');
          ghost.className = 'fd-ghost'; ghost.textContent = a.label;
          var p0 = pointOf(el);
          ghost.style.transition = 'none';
          ghost.style.transform = 'translate(' + (p0.x + 8) + 'px,' + (p0.y + 6) + 'px)';
          stage.appendChild(ghost);
          render(state, { drop: true });
          target = find(a.drag);
          void ghost.offsetWidth; ghost.style.transition = '';
          var p1 = pointOf(target);
          ghost.style.transform = 'translate(' + (p1.x + 8) + 'px,' + (p1.y + 6) + 'px)';
          try { await moveCursor(target, t); await click(null, t); } finally { ghost.remove(); }
        }
      }
      if (a.wait) await sleep(reduce ? 0 : a.wait, t);
      state = stateAt(i + 1);
      render(state);
    }

    function jump(i) {
      token++; playing = false;
      idx = Math.max(0, Math.min(LAST, i));
      state = stateAt(idx);
      drawn = {}; state.wired.forEach(function (p) { drawn[p] = true; });
      shownPhone = state.body.indexOf('Phone') >= 0;
      modalShown = state.modal;
      render(state);
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
        while (idx < LAST) {
          await perform(idx, t);
          idx++; updateUI();
          await sleep(idx === LAST ? 0 : 1000, t);
        }
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
    window.addEventListener('resize', fitCanvas);

    render(state);
    updateUI();

    var started = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.5) {
            if (!started && !reduce) { started = true; play(); }
          } else if (playing && !en.isIntersecting) {
            pause();
          }
        });
      }, { threshold: [0, 0.5] }).observe(stage);
    }
  }
})();
