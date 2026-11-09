  document.getElementById('themeToggle').addEventListener('click', function () {
    var root = document.documentElement;
    var current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

// Case pages: Skim / Full story switch
(function () {
  var sw = document.querySelector('[data-read-switch]');
  if (!sw) return;
  var article = document.querySelector('.case-body');
  function set(mode) {
    article.dataset.mode = mode;
    sw.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
    try { localStorage.setItem('readMode', mode); } catch (e) {}
  }
  sw.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(b.dataset.mode); });
  var saved = null; try { saved = localStorage.getItem('readMode'); } catch (e) {}
  set(saved === 'skim' ? 'skim' : 'full');
})();

// Mini case dialogs (More work)
(function () {
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    var dlg = document.getElementById(btn.dataset.open);
    if (!dlg || !dlg.showModal) return;
    btn.addEventListener('click', function () { dlg.showModal(); });
    dlg.querySelector('.mini-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) {
      if (e.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
    });
    dlg.addEventListener('close', function () { btn.focus(); });
  });
})();

// Header: visible while scrolling, near the top, on hover or keyboard focus; hides after the page rests
(function () {
  var h = document.querySelector('.header');
  if (!h) return;
  var timer = null, REST = 1200, TOP = 80;
  function show() { h.classList.remove('is-away'); }
  function canHide() { return window.scrollY > TOP && !h.matches(':hover') && !h.contains(document.activeElement); }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { if (canHide()) h.classList.add('is-away'); }, REST);
  }
  window.addEventListener('scroll', function () { show(); schedule(); }, { passive: true });
  // Mouse near the top edge brings it back without scrolling
  document.addEventListener('mousemove', function (e) { if (e.clientY < 72) { show(); schedule(); } }, { passive: true });
  h.addEventListener('mouseleave', schedule);
  h.addEventListener('focusin', show);
  h.addEventListener('focusout', schedule);
  schedule();
})();
