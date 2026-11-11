// Screen wall as a masonry with weight: full desktop screens span two columns so they keep their weight,
// forms, modals, drawers and phone screens take one. Each next tile drops where it lands highest,
// so the order still reads left to right. Small gaps under a column are closed by letting the tile
// above run a little longer (screens end in white, so that reads as the same screen).
(function () {
  var walls = document.querySelectorAll('.af-wall');
  if (!walls.length) return;

  function info(a) {
    var img = a.querySelector('img');
    var w = +img.getAttribute('width') || img.naturalWidth || 1;
    var h = +img.getAttribute('height') || img.naturalHeight || 1;
    var wide = (w >= 1000 && w / h > 0.6) || w >= 1400; // desktop screens, not tall phone shots
    // Full pages show their top part; narrow drawers are cut so they don't swallow a column.
    return { wide: wide, ar: wide ? Math.max(w / h, 1.2) : Math.max(w / h, 0.46) };
  }

  function layout(wall) {
    var items = Array.prototype.slice.call(wall.children);
    var W = Math.floor(wall.getBoundingClientRect().width);
    if (W < 1) return;
    var gap = W < 640 ? 10 : 16;
    var cols = W >= 1000 ? 4 : W >= 640 ? 3 : 2;
    var cw = (W - gap * (cols - 1)) / cols;
    var tops = [], last = [];
    for (var c = 0; c < cols; c++) { tops.push(0); last.push(null); }

    function place(a, col, span) {
      var inf = a._inf, T = Math.max.apply(null, tops.slice(col, col + span));
      // Close the gap under a shorter column by stretching the tile above it (screens end in white).
      for (var c = col; c < col + span; c++) {
        var hole = T - tops[c], p = last[c];
        if (hole > 0 && p && hole <= p._h * 0.6) { p._h += hole; p.style.height = p._h + 'px'; p.classList.add('pad'); }
      }
      var tw = span * cw + (span - 1) * gap, h = Math.round(tw / inf.ar);
      a._h = h;
      a.classList.remove('pad');
      a.classList.toggle('wide', span === 2);
      a.style.left = Math.round(col * (cw + gap)) + 'px';
      a.style.top = T + 'px';
      a.style.width = Math.round(tw) + 'px';
      a.style.height = h + 'px';
      for (c = col; c < col + span; c++) { tops[c] = T + h + gap; last[c] = a; }
    }

    var queue = items.slice();
    queue.forEach(function (a) { a._inf = a._inf || info(a); });
    while (queue.length) {
      var low = tops.indexOf(Math.min.apply(null, tops));
      // The best pair of columns for a wide screen: the one whose tops are closest.
      var pair = -1, diff = Infinity;
      for (var s = 0; s + 2 <= cols; s++) {
        var d = Math.abs(tops[s] - tops[s + 1]) + Math.max(tops[s], tops[s + 1]) - tops[low];
        if (d < diff) { diff = d; pair = s; }
      }
      var next = queue[0];
      if (!next._inf.wide) { place(queue.shift(), low, 1); continue; }
      if (diff <= cw * 0.25) { place(queue.shift(), pair, 2); continue; }
      // The pair isn't level yet: pull the nearest narrow tile forward into the lowest column.
      var k = -1;
      for (var i = 1; i < queue.length && i < 6; i++) if (!queue[i]._inf.wide) { k = i; break; }
      if (k > 0) place(queue.splice(k, 1)[0], low, 1);
      else place(queue.shift(), pair, 2);
    }
    // Even out the bottom edge: crop the last tile of a long column (screens show their top part)
    // or let a short one run a little longer, whichever target needs the smallest changes.
    var bottoms = tops.map(function (t) { return t - gap; }), bestT = -1, bestCost = Infinity;
    bottoms.forEach(function (T) {
      var cost = 0, ok = true;
      for (var c = 0; c < cols; c++) {
        var p = last[c], d = T - bottoms[c];
        if (!p || !d) continue;
        if (d < 0 ? -d > p._h * 0.35 : d > p._h * 0.3) { ok = false; break; }
        cost += Math.abs(d);
      }
      if (ok && cost < bestCost) { bestCost = cost; bestT = T; }
    });
    if (bestT >= 0) {
      last.forEach(function (p) {
        if (!p || p._done) return;
        var d = bestT - (parseInt(p.style.top, 10) + p._h);
        if (d) { p._h += d; p.style.height = p._h + 'px'; if (d > 0) p.classList.add('pad'); }
        p._done = true;
      });
      last.forEach(function (p) { if (p) p._done = false; });
      tops = tops.map(function () { return bestT + gap; });
    }
    wall.style.height = Math.max(0, Math.max.apply(null, tops) - gap) + 'px';
  }

  Array.prototype.forEach.call(walls, function (wall) {
    wall.classList.add('is-masonry');
    layout(wall);
    var lastW = wall.clientWidth;
    var ro = function () { if (wall.clientWidth !== lastW) { lastW = wall.clientWidth; layout(wall); } };
    if ('ResizeObserver' in window) new ResizeObserver(ro).observe(wall);
    else window.addEventListener('resize', ro);
  });
})();
