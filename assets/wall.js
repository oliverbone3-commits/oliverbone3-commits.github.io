// Screen wall as justified rows: every row fills the full width, every tile keeps its screen's proportions,
// so a full screen comes out wide, a modal medium and a drawer narrow — and there are no holes.
// Rows are chosen by a small dynamic program so every row lands close to the target height (the last one too).
(function () {
  var walls = document.querySelectorAll('.af-wall');
  if (!walls.length) return;

  function aspect(a) {
    var img = a.querySelector('img');
    var w = +img.getAttribute('width') || img.naturalWidth || 1;
    var h = +img.getAttribute('height') || img.naturalHeight || 1;
    // Tall drawers and panels show their top part, otherwise they would be slivers next to full screens.
    return a.classList.contains('crop') ? 0.62 : Math.max(w / h, 0.62);
  }

  function layout(wall) {
    var items = Array.prototype.slice.call(wall.children);
    var W = Math.floor(wall.getBoundingClientRect().width) - 1; // floor: a rounded-up width would wrap the last tile
    if (W < 1) return;
    var gap = W < 640 ? 10 : 16;
    var target = W < 640 ? 150 : W < 1000 ? 240 : 330;
    var ar = items.map(function (a) { return a._ar || (a._ar = aspect(a)); });
    // Modals and small dialogs float on a well instead of being blown up past their real size.
    items.forEach(function (a) { var img = a.querySelector('img'); var w = +img.getAttribute('width') || 9999, h = +img.getAttribute('height') || 1; if (!a.classList.contains('crop') && w < 1000 && w > h) a.classList.add('small'); });
    var n = items.length, cost = [0], cut = [0];
    // cost[i]: best total for the first i tiles; a row's cost grows with its distance from the target height.
    for (var i = 1; i <= n; i++) {
      cost[i] = Infinity;
      var sum = 0;
      for (var j = i; j >= 1 && i - j < 6; j--) {
        sum += ar[j - 1];
        var h = (W - gap * (i - j)) / sum;
        var d = (h - target) / target, c = cost[j - 1] + d * d * (h < target * 0.55 ? 8 : 1);
        if (c < cost[i]) { cost[i] = c; cut[i] = j - 1; }
      }
    }
    var rows = [];
    for (var k = n; k > 0; k = cut[k]) rows.unshift([cut[k], k]);
    rows.forEach(function (r) {
      var s = 0, m;
      for (m = r[0]; m < r[1]; m++) s += ar[m];
      var h = (W - gap * (r[1] - r[0] - 1)) / s, used = 0;
      for (m = r[0]; m < r[1]; m++) {
        var w = m === r[1] - 1 ? W - used : Math.floor(ar[m] * h);
        items[m].style.width = w + 'px';
        items[m].style.height = Math.round(h) + 'px';
        items[m].style.marginRight = m === r[1] - 1 ? '0' : gap + 'px';
        used += w + gap;
      }
    });
    wall.style.rowGap = gap + 'px';
  }

  Array.prototype.forEach.call(walls, function (wall) {
    wall.classList.add('is-rows');
    layout(wall);
    var last = wall.clientWidth;
    var ro = function () { if (wall.clientWidth !== last) { last = wall.clientWidth; layout(wall); } };
    if ('ResizeObserver' in window) new ResizeObserver(ro).observe(wall);
    else window.addEventListener('resize', ro);
  });
})();
