// Turns each case card's <dl class="meta"> into chips. Scale is split on " · " into one chip per fact.
(function () {
  try {
    var q = new URLSearchParams(location.search).get('chips');
    if (q) localStorage.setItem('chips', q);
    var v = localStorage.getItem('chips');
    // Icons is the default since 6 Nov; ?chips=<name> tries another variant (site/lab/chips/).
    document.documentElement.dataset.chips = v || 'icons';
  } catch (e) {}
  // Icon by meaning of the fact, so neighbouring chips don't repeat one glyph.
  function iconFor(kind, label, text) {
    if (kind === 'role') return 'user';
    if (kind === 'team') return 'users';
    if (/tool/i.test(label)) return 'code';
    if (/product/i.test(label)) return 'box';
    if (/brand|theme|light\/dark/i.test(text)) return 'palette';
    if (/language/i.test(text)) return 'languages';
    if (/region|countr|market/i.test(text)) return 'globe';
    if (/file|library/i.test(text)) return 'file';
    if (/screen|state/i.test(text)) return 'layout';
    if (/block/i.test(text)) return 'blocks';
    if (/history/i.test(text)) return 'history';
    if (/builder|editor/i.test(text)) return 'blocks';
    return 'layers';
  }
  Array.prototype.forEach.call(document.querySelectorAll('dl.meta'), function (dl) {
    var wrap = document.createElement('div');
    wrap.className = 'chips';
    var dts = dl.querySelectorAll('dt');
    Array.prototype.forEach.call(dts, function (dt) {
      var dd = dt.nextElementSibling; if (!dd) return;
      var label = dt.textContent.trim();
      var kind = /role/i.test(label) ? 'role' : /team/i.test(label) ? 'team' : /scale/i.test(label) ? 'scale' : 'other';
      var parts = kind === 'scale' ? dd.textContent.split(/\s+·\s+/) : [dd.textContent.trim()];
      parts.forEach(function (t, i) {
        var c = document.createElement('span');
        c.className = 'chip chip--' + kind;
        c.setAttribute('data-ic', iconFor(kind, label, t));
        c.innerHTML = (i === 0 ? '<b>' + label + '</b>' : '') + '<span>' + t.replace(/[&<>]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]; }) + '</span>';
        wrap.appendChild(c);
      });
    });
    // One chip per card, picked at random, gets the site's green accent.
    var all = wrap.querySelectorAll('.chip');
    if (all.length) all[Math.floor(Math.random() * all.length)].classList.add('chip--hl');
    dl.replaceWith(wrap);
  });
})();
