// "Gallery" look: live mini visuals on the home case cards.
// Runs only with data-look="gallery". Each visual plays only while it is
// on screen; with reduced motion the static markup stays as it is.
(function () {
  var root = document.documentElement;
  if (root.dataset.look !== 'gallery') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // Runs `loop` while `el` is visible; pauses between iterations when it is not.
  function whileVisible(el, loop) {
    var visible = false, running = false, wake = null;
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && wake) { var w = wake; wake = null; w(); }
      if (visible && !running) { running = true; run(); }
    }, { threshold: 0.35 }).observe(el);
    function gate() { return visible ? Promise.resolve() : new Promise(function (r) { wake = r; }); }
    async function run() { for (;;) { await gate(); await loop(); } }
  }

  // ---------- 1. Checkouts: ten brands, light and dark, one system ----------
  var BRANDS = [
    { b: '#3465FF', on: '#fff', dark: false, lang: 'EN', label: 'Amount to pay', amount: '€ 49.00', btn: 'Pay' },
    { b: '#1DC8FF', on: '#1F1E1D', dark: true, lang: 'PL', label: 'Do zapłaty', amount: '219,00 zł', btn: 'Zapłać' },
    { b: '#17746C', on: '#fff', dark: false, lang: 'ES', label: 'Importe', amount: '$ 1,250', btn: 'Pagar' },
    { b: '#E4572E', on: '#fff', dark: false, lang: 'DE', label: 'Zu zahlen', amount: '89,90 €', btn: 'Bezahlen' },
    { b: '#9B87FF', on: '#1F1E1D', dark: true, lang: 'PT', label: 'Valor a pagar', amount: 'R$ 320,00', btn: 'Pagar' },
    { b: '#D81B60', on: '#fff', dark: false, lang: 'TR', label: 'Ödenecek tutar', amount: '₺ 1.499', btn: 'Öde' },
    { b: '#FFB020', on: '#1F1E1D', dark: true, lang: 'JA', label: 'お支払い金額', amount: '¥ 6,800', btn: '支払う' },
    { b: '#111111', on: '#fff', dark: false, lang: 'FR', label: 'Montant', amount: '25,00 €', btn: 'Payer' },
    { b: '#2BD47D', on: '#1F1E1D', dark: true, lang: 'IT', label: 'Importo', amount: '€ 64,00', btn: 'Paga' },
    { b: '#0A7CFF', on: '#fff', dark: false, lang: 'EN', label: 'Total', amount: '£ 12.50', btn: 'Pay' }
  ];
  var co = document.querySelector('.case .v-checkouts');
  if (co) {
    var cards = Array.prototype.slice.call(co.querySelectorAll('.mini-co'));
    var axes = co.parentNode.querySelectorAll('.v-axes span');
    // Real-looking fields instead of grey bars
    cards.forEach(function (c) {
      var f = c.querySelectorAll('.mc-field');
      if (f[0]) f[0].innerHTML = '<em>4242 4242 4242 4242</em>';
      if (f[1]) f[1].innerHTML = '<em>12 / 28</em><em>CVC</em>';
    });
    var counter = document.createElement('span');
    counter.className = 'v-count';
    if (axes[0]) { axes[0].textContent = 'brand '; axes[0].appendChild(counter); }
    var next = 3, slot = 0;
    function setCounter(n) { counter.textContent = (n % BRANDS.length + 1) + ' / ' + BRANDS.length; }
    setCounter(2);
    function flash(el) { if (!el) return; el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
    function apply(card, br) {
      card.style.setProperty('--b', br.b);
      card.style.setProperty('--on', br.on);
      card.classList.toggle('dark', br.dark);
      card.querySelector('.mc-lang').textContent = br.lang;
      card.querySelector('.mc-label').textContent = br.label;
      card.querySelector('.mc-amount').textContent = br.amount;
      card.querySelector('.mc-btn').textContent = br.btn;
    }
    whileVisible(co, async function () {
      await wait(1700);
      // skip cards hidden by the layout (the third one on phones)
      var shown = cards.filter(function (c) { return c.offsetParent !== null; });
      slot = slot % shown.length;
      var card = shown[slot], br = BRANDS[next];
      var themeFlip = card.classList.contains('dark') !== br.dark;
      card.classList.add('swapping');
      await wait(180);
      apply(card, br);
      card.classList.remove('swapping');
      setCounter(next);
      flash(axes[0]);
      if (themeFlip) flash(axes[1]);
      // press the button once in a while, like a real payment
      if (next % 3 === 0) { await wait(700); card.classList.add('press'); await wait(160); card.classList.remove('press'); }
      next = (next + 1) % BRANDS.length;
      slot = (slot + 1) % shown.length;
    });
  }

  // ---------- 2. Back-office: a misclick vs an explicit, confirmed change ----------
  var flow = document.querySelector('.case .v-flow');
  if (flow) {
    var cols = flow.children;
    var badRows = cols[0].querySelectorAll('.tr:not(.th)');
    var badRow = badRows[2] || badRows[0];
    var badToggle = badRow.querySelector('.toggle');
    var warn = cols[0].querySelector('.warn');
    var goodRow = cols[1].querySelectorAll('.tr:not(.th)')[0];
    var goodBadge = goodRow.querySelector('.badge');
    var dialog = cols[1].querySelector('.dialog');
    var confirmBtn = dialog.querySelector('.row span:last-child');
    flow.classList.add('is-live');
    whileVisible(flow, async function () {
      // Left: the toggle flips by accident, money changes route silently
      await wait(900);
      badRow.classList.add('hover');
      await wait(450);
      badToggle.classList.add('off');
      badRow.classList.remove('hover');
      badRow.classList.add('oops');
      await wait(350);
      warn.classList.add('show');
      await wait(2200);
      warn.classList.remove('show');
      badRow.classList.remove('oops');
      badToggle.classList.remove('off');
      // Right: the same change needs an explicit step and a confirmation
      await wait(500);
      goodRow.classList.add('hover');
      await wait(500);
      dialog.classList.add('show');
      await wait(1500);
      confirmBtn.classList.add('press');
      await wait(200);
      confirmBtn.classList.remove('press');
      dialog.classList.remove('show');
      goodRow.classList.remove('hover');
      goodBadge.textContent = 'Manual';
      goodBadge.classList.add('neutral', 'changed');
      await wait(2200);
      goodBadge.textContent = 'Scheduled';
      goodBadge.classList.remove('neutral', 'changed');
      await wait(400);
    });
  }

  // ---------- 3. Audit: foreign tokens counted down to zero ----------
  // Figures from case-1-ds-audit.md: instances, bindings in Core / product files / slots, raw spacing and radii.
  var START = [9000, 550, 730, 620, 850];
  var MISSED = 2; // product-file bindings: text colours were missed by the first pass
  var audit = document.querySelector('.case .v-audit');
  if (audit) {
    var rows = Array.prototype.slice.call(audit.querySelectorAll('.pass'));
    var nums = rows.map(function (r) { return r.querySelector('.num'); });
    var total = audit.querySelector('.foot span:last-child');
    var foot = audit.querySelector('.foot');
    var left = START.slice();
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    function render() {
      left.forEach(function (v, i) { nums[i].textContent = v === null ? '—' : fmt(v); });
      total.textContent = fmt(left.reduce(function (a, b) { return a + (b || 0); }, 0));
    }
    function reset() {
      left = START.slice();
      rows.forEach(function (r) { r.classList.remove('done', 'active', 'missed-now'); r.classList.add('todo'); });
      foot.classList.remove('done');
      render();
    }
    function countDown(i, ms) {
      return new Promise(function (resolve) {
        if (left[i] === null) { setTimeout(function () { left[i] = 0; render(); resolve(); }, ms); return; }
        var from = left[i], t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / ms);
          left[i] = from * (1 - (1 - Math.pow(1 - k, 3)));
          render();
          if (k < 1) requestAnimationFrame(step); else { left[i] = 0; render(); resolve(); }
        })(t0);
      });
    }
    reset();
    whileVisible(audit, async function () {
      await wait(700);
      for (var i = 0; i < rows.length; i++) {
        if (i === MISSED) continue;
        rows[i].classList.add('active');
        await countDown(i, 900);
        rows[i].classList.remove('active', 'todo');
        rows[i].classList.add('done');
        await wait(150);
      }
      // The first pass is "done", but one row is still dirty
      rows[MISSED].classList.add('missed-now');
      await wait(1400);
      rows[MISSED].classList.add('active');
      await countDown(MISSED, 900);
      rows[MISSED].classList.remove('active', 'todo', 'missed-now');
      rows[MISSED].classList.add('done');
      foot.classList.add('done');
      await wait(3000);
      reset();
    });
  }
})();
