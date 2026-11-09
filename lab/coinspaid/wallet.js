/* CoinsPaid web wallet — web version.
   Routes: #/dashboard  #/history  #/address-book
   Drawer params: ?coin=BTC[&view=send|receive|exchange]  ?tx=ID  ?contact=ID  ?new=1 */
(function () {
  'use strict';

  /* ---------- icons ---------- */
  var P = {
    wallet: '<path d="M19 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-4a2 2 0 0 0 0 4h4v2a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"/>',
    swap: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
    swapv: '<path d="M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v14H6.5A2.5 2.5 0 0 0 4 19.5zm0 0A2.5 2.5 0 0 0 6.5 22H20v-5"/><path d="M9 7h7"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
    up: '<path d="M7 17 17 7M8 7h9v9"/>',
    down: '<path d="M17 7 7 17M16 17H7V8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    chevr: '<path d="m9 6 6 6-6 6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    edit: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
    xcirc: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    bank: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
    store: '<path d="M3 9 4.5 4h15L21 9M3 9v11h18V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'
  };
  function I(n, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + P[n] + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- data ---------- */
  var COINS = {
    BTC: { name: 'Bitcoin', glyph: '₿', bg: '#FFF1DE', fg: '#F7931A', rate: 15820.40, bal: 0.14365051, dp: 8, nets: ['BTC'] },
    ETH: { name: 'Ethereum', glyph: 'Ξ', bg: '#ECEEFA', fg: '#5B6BC0', rate: 487.30, bal: 2.06866115, dp: 8, nets: ['ERC20'] },
    USDT: { name: 'Tether', glyph: '₮', bg: '#E0F4EE', fg: '#26A17B', rate: 0.8235, bal: 1250.00, dp: 2, nets: ['TRC20', 'ERC20'] },
    BCH: { name: 'Bitcoin Cash', glyph: '₿', bg: '#E6F6E4', fg: '#3DAA34', rate: 228.40, bal: 3.96401004, dp: 8, nets: ['BCH'] },
    ADA: { name: 'Cardano', glyph: '₳', bg: '#E6ECFA', fg: '#2A55C9', rate: 0.1312, bal: 1520.00, dp: 2, nets: ['ADA'] },
    DOGE: { name: 'Dogecoin', glyph: 'Ð', bg: '#FBF3D9', fg: '#B8962E', rate: 0.003871, bal: 16884.42, dp: 2, nets: ['DOGE'] }
  };
  var ORDER = ['BTC', 'ETH', 'USDT', 'BCH', 'ADA', 'DOGE'];
  var NETS = {
    BTC: { name: 'Bitcoin', coin: 'BTC', fee: 0.00004200, re: /^(bc1[a-z0-9]{25,62}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/, ex: 'bc1q…' },
    ERC20: { name: 'Ethereum (ERC-20)', coin: 'ETH', fee: 0.00210000, re: /^0x[a-fA-F0-9]{40}$/, ex: '0x…' },
    TRC20: { name: 'Tron (TRC-20)', coin: 'USDT', fee: 1, re: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, ex: 'T…' },
    BCH: { name: 'Bitcoin Cash', coin: 'BCH', fee: 0.00000500, re: /^(bitcoincash:)?[qp][a-z0-9]{41}$/, ex: 'bitcoincash:q…' },
    ADA: { name: 'Cardano', coin: 'ADA', fee: 0.17, re: /^addr1[a-z0-9]{50,110}$/, ex: 'addr1…' },
    DOGE: { name: 'Dogecoin', coin: 'DOGE', fee: 1, re: /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/, ex: 'D…' }
  };
  var CATS = ['Friends', 'Family', 'Work', 'Bills', 'Exchanges'];
  var COLORS = ['blue', 'green', 'orange', 'pink', 'violet', 'gray'];
  var PICK = ['user', 'heart', 'briefcase', 'home', 'star', 'cart', 'bank', 'globe'];
  var CICONS = ['user', 'heart', 'briefcase', 'home', 'star', 'cart', 'coffee', 'plane', 'gift', 'bank', 'store', 'globe'];

  var contacts = [
    { id: 'alex', name: 'Alex', icon: 'user', color: 'blue', cat: 'Friends', addrs: [{ net: 'BTC', a: 'bc1q9h6tz8k3x0v4l2m7p5r8e3w6n1c9s4d2f7g0ya' }, { net: 'ERC20', a: '0x7a3F2b91C04e8D5a6F1c3B7e9D0a4C2f8E6b1D93' }] },
    { id: 'mia', name: 'Satoshi', icon: 'heart', color: 'pink', cat: 'Family', addrs: [{ net: 'BTC', a: 'bc1qxk2m8n4p6r0t3v5w7y9z1a3c5e7g9j2l4n6q8s' }] },
    { id: 'rent', name: 'Rent', icon: 'home', color: 'orange', cat: 'Bills', addrs: [{ net: 'TRC20', a: 'TQ4h3Gm8Xk2pV9sLw7Rz5Nc1Bd6Fj3Ty8a' }] },
    { id: 'nord', name: 'Nord Studio', icon: 'briefcase', color: 'violet', cat: 'Work', addrs: [{ net: 'ERC20', a: '0x3C9e4D1a7B2f6E8c0A5d9F3b1E7c2D4a6B8f0E51' }, { net: 'TRC20', a: 'TXm2Lk8Pq4Wr6Ys1Bv3Nc5Hd7Fg9Jk2ZeR' }] },
    { id: 'tom', name: 'Worm Wasser', icon: 'coffee', color: 'green', cat: 'Friends', addrs: [{ net: 'DOGE', a: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L' }] },
    { id: 'exch', name: 'Exchange deposit', icon: 'bank', color: 'gray', cat: 'Exchanges', addrs: [{ net: 'BTC', a: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' }, { net: 'ERC20', a: '0x9F1b6A2c8E4d0B7f3C5a1E9d2B6c4A8f0D3e7C25' }] },
    { id: 'lena', name: 'Carl Johnes', icon: 'gift', color: 'pink', cat: 'Friends', addrs: [{ net: 'ADA', a: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x' }] },
    { id: 'shop', name: 'Hardware shop', icon: 'store', color: 'blue', cat: 'Bills', addrs: [{ net: 'BCH', a: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a' }] }
  ];
  var mine = [
    { coin: 'BTC', net: 'BTC', label: 'Main', a: 'bc1qm4r7t2x9k5v8n3p6w1z0c4e7g2j5l8q3s6u9y2', tx: 18 },
    { coin: 'BTC', net: 'BTC', label: 'Salary', a: 'bc1qa8d3f6h9k2m5p8s1v4x7z0b3e6g9j2l5n8q1t4', tx: 6 },
    { coin: 'ETH', net: 'ERC20', label: 'Main', a: '0x5E2a8C4f1B9d7A3e6C0b2D8f4A1c9E7b3D5f0A16', tx: 11 },
    { coin: 'USDT', net: 'TRC20', label: 'Main', a: 'TPj7Kq3Mw9Xr2Ys5Bv8Nc1Hd4Fg6Jk7ZeR', tx: 9 },
    { coin: 'USDT', net: 'ERC20', label: 'Trading', a: '0x2B7d4E9a1C6f3A8e0D5b2C9f7E4a1B6d3C8e0F72', tx: 3 },
    { coin: 'BCH', net: 'BCH', label: 'Main', a: 'bitcoincash:qr6m7j9kn2p4s8u0w3y5z1b7d9f2h4k6m8q0t3v5', tx: 2 },
    { coin: 'ADA', net: 'ADA', label: 'Main', a: 'addr1q8z3k5m7p9r2t4v6x8z0b2d4f6h8k0m2p4r6t8v0x2z4b6d8f0h2k4m6p8r0t2v4x6z8b0d2f', tx: 2 },
    { coin: 'DOGE', net: 'DOGE', label: 'Main', a: 'DQ8kN2pR4tV6xZ9bC1eG3jL5nP7rT9vX2z', tx: 4 }
  ];

  // Transactions. t: in | out | ex ; s: ok | pend | fail ; d: 'YYYY-MM-DD HH:MM'
  var txs = [
    { id: 't01', t: 'in', coin: 'BTC', amt: 0.02500000, s: 'pend', d: '2020-12-07 10:41', from: 'bc1q7f3k9m2p5r8t1v4x6z0b3d5g8j1l4n7q0s2u5w', conf: 1, need: 3 },
    { id: 't02', t: 'out', coin: 'USDT', amt: 420.00, s: 'ok', d: '2020-12-07 09:15', to: 'rent', net: 'TRC20' },
    { id: 't03', t: 'ex', coin: 'BTC', amt: 0.01000000, to2: 'ETH', amt2: 0.32456120, s: 'ok', d: '2020-12-06 18:22' },
    { id: 't04', t: 'out', coin: 'BTC', amt: 0.01250000, s: 'ok', d: '2020-12-06 14:02', to: 'alex', net: 'BTC', note: 'Dinner + tickets' },
    { id: 't05', t: 'in', coin: 'ETH', amt: 0.85000000, s: 'ok', d: '2020-12-05 11:30', from: 'nord', net: 'ERC20', note: 'Invoice #42' },
    { id: 't06', t: 'out', coin: 'DOGE', amt: 2500.00, s: 'fail', d: '2020-12-04 20:47', to: 'tom', net: 'DOGE', reason: 'Network fee was too low. Nothing left your wallet.' },
    { id: 't07', t: 'in', coin: 'BTC', amt: 0.05000000, s: 'ok', d: '2020-12-04 09:05', from: 'mia', net: 'BTC' },
    { id: 't08', t: 'out', coin: 'ETH', amt: 0.40000000, s: 'ok', d: '2020-12-03 16:40', toAddr: '0x8D2c6F0a4B1e9C7d3A5f8E2b6D0c4A9e1F7b3C66', net: 'ERC20' },
    { id: 't09', t: 'ex', coin: 'USDT', amt: 300.00, to2: 'BCH', amt2: 1.08144201, s: 'ok', d: '2020-12-02 13:12' },
    { id: 't10', t: 'in', coin: 'USDT', amt: 1500.00, s: 'ok', d: '2020-12-01 10:00', from: 'nord', net: 'TRC20', note: 'November' },
    { id: 't11', t: 'out', coin: 'BCH', amt: 0.25000000, s: 'ok', d: '2020-11-30 15:55', to: 'shop', net: 'BCH' },
    { id: 't12', t: 'in', coin: 'ADA', amt: 1520.00, s: 'ok', d: '2020-11-29 12:31', from: 'lena', net: 'ADA' },
    { id: 't13', t: 'out', coin: 'BTC', amt: 0.03000000, s: 'ok', d: '2020-11-27 19:20', to: 'exch', net: 'BTC' },
    { id: 't14', t: 'in', coin: 'DOGE', amt: 19384.42, s: 'ok', d: '2020-11-25 08:48', from: 'tom', net: 'DOGE' },
    { id: 't15', t: 'out', coin: 'ETH', amt: 0.12000000, s: 'ok', d: '2020-11-22 21:03', to: 'alex', net: 'ERC20' },
    { id: 't16', t: 'in', coin: 'BTC', amt: 0.08000000, s: 'ok', d: '2020-11-18 10:14', from: 'exch', net: 'BTC' },
    { id: 't17', t: 'ex', coin: 'ETH', amt: 0.50000000, to2: 'USDT', amt2: 295.12, s: 'ok', d: '2020-11-15 17:36' },
    { id: 't18', t: 'out', coin: 'USDT', amt: 420.00, s: 'ok', d: '2020-11-07 09:10', to: 'rent', net: 'TRC20' }
  ];
  var TODAY = '2020-12-07';

  /* ---------- formatting ---------- */
  function fmt(n, dp) { return n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }); }
  function eur(n) { return '€' + fmt(n, 2); }
  function amt(coin, n) { return fmt(n, COINS[coin].dp) + ' ' + coin; }
  function total() { return ORDER.reduce(function (s, c) { return s + COINS[c].bal * COINS[c].rate; }, 0); }
  function short(a) { return a.length > 20 ? a.slice(0, 10) + '…' + a.slice(-6) : a; }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayLabel(d) {
    var day = d.slice(0, 10);
    if (day === TODAY) return 'Today';
    if (day === '2020-12-06') return 'Yesterday';
    return +day.slice(8) + ' ' + MON[+day.slice(5, 7) - 1] + (day.slice(0, 4) === TODAY.slice(0, 4) ? '' : ' ' + day.slice(0, 4));
  }
  function dt(d) { return +d.slice(8, 10) + ' ' + MON[+d.slice(5, 7) - 1] + ', ' + d.slice(11); }
  function cico(c, cls) { return '<img class="cico' + (cls ? ' ' + cls : '') + '" src="' + window.COIN_ICONS[c] + '" alt="' + c + '" width="40" height="40">'; }
  function av(ct, cls) { return '<span class="av c-' + ct.color + (cls ? ' ' + cls : '') + '">' + I(ct.icon) + '</span>'; }
  function contact(id) { return contacts.filter(function (c) { return c.id === id; })[0]; }
  function contactByAddr(a) { return contacts.filter(function (c) { return c.addrs.some(function (x) { return x.a === a; }); })[0]; }

  function txParty(x) {
    if (x.t === 'ex') return { title: 'Exchange ' + x.coin + ' → ' + x.to2, sub: 'Inside the wallet' };
    var id = x.t === 'in' ? x.from : x.to, ct = id && contact(id);
    if (ct) return { title: (x.t === 'in' ? 'From ' : 'To ') + ct.name, sub: ct.cat, ct: ct };
    var a = x.toAddr || x.from;
    return { title: (x.t === 'in' ? 'From ' : 'To ') + short(a), sub: 'Not in address book', addr: a };
  }
  function txIcon(x) {
    if (x.s === 'fail') return '<span class="ti fail">' + I('x') + '</span>';
    if (x.t === 'in') return '<span class="ti in">' + I('down') + '</span>';
    if (x.t === 'ex') return '<span class="ti ex">' + I('swap') + '</span>';
    return '<span class="ti out">' + I('up') + '</span>';
  }
  function txAmt(x, ctx) {
    if (x.t === 'ex' && ctx === x.coin) return { main: '\u2212' + amt(x.coin, x.amt), sub: '+' + amt(x.to2, x.amt2), pos: false };
    if (x.t === 'ex') return { main: '+' + amt(x.to2, x.amt2), sub: '\u2212' + amt(x.coin, x.amt), pos: true };
    var sign = x.t === 'in' ? '+' : '\u2212';
    return { main: sign + amt(x.coin, x.amt), sub: eur(x.amt * COINS[x.coin].rate), pos: x.t === 'in' && x.s !== 'fail', void: x.s === 'fail' };
  }
  function statusChip(s) {
    if (s === 'ok') return '<span class="chip ok">Completed</span>';
    if (s === 'pend') return '<span class="chip pend">Pending</span>';
    return '<span class="chip fail">Failed</span>';
  }
  function txTitle(x) {
    var p = txParty(x);
    if (p.ct) return p.ct.name;
    if (x.t === 'ex') return 'Exchange ' + x.coin + ' \u2192 ' + x.to2;
    return x.t === 'in' ? 'Received' : 'Sent';
  }
  function txLead(x) {
    var p = txParty(x);
    if (!p.ct) return txIcon(x);
    var cls = x.s === 'fail' ? 'fail' : x.t, ic = x.s === 'fail' ? 'x' : x.t === 'in' ? 'down' : 'up';
    return '<span class="avb">' + av(p.ct) + '<span class="bd ' + cls + '">' + I(ic) + '</span></span>';
  }
  function txRow(x, showStatus, timeOnly, ctx, opTitle) {
    var a = txAmt(x, ctx);
    var st = x.s === 'pend' ? ' · <em class="pend">Pending ' + x.conf + '/' + x.need + '</em>' : x.s === 'fail' ? ' · <em class="fail">Failed</em>' : '';
    var sub = (timeOnly ? x.d.slice(11) : dt(x.d)) + (opTitle && x.net ? ' · ' + NETS[x.net].name.replace(/ \(.*/, '') : '') + (showStatus ? st : '');
    return '<button class="tx' + (route.q.tx === x.id ? ' on' : '') + '" data-go="tx" data-id="' + x.id + '">' + txLead(x) +
      '<span class="tt"><b>' + esc(opTitle ? (x.t === 'in' ? 'Received' : 'Sent') : txTitle(x)) + '</b><span>' + sub + '</span></span>' +
      '<span class="ta"><b class="' + (a.pos ? 'pos' : '') + (a.void ? ' void' : '') + '">' + a.main + '</b><span>' + a.sub + '</span></span></button>';
  }

  /* ---------- routing ---------- */
  var route = { page: 'dashboard', q: {} };
  function parse() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('?'), page = parts[0] || 'dashboard', q = {};
    (parts[1] || '').split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); q[p[0]] = decodeURIComponent(p[1] || ''); });
    if (['dashboard', 'history', 'address-book'].indexOf(page) < 0) page = 'dashboard';
    route = { page: page, q: q };
  }
  function go(page, q) {
    var s = Object.keys(q || {}).filter(function (k) { return q[k] != null && q[k] !== ''; }).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&');
    var h = '#/' + page + (s ? '?' + s : '');
    if (/[?&]embed/.test(location.search)) { history.replaceState(null, '', h); parse(); render(); } else location.hash = h;
  }
  function setQ(q) { go(route.page, q); }

  /* ---------- UI state ---------- */
  var ui = {
    hType: 'all', hCoin: 'all', hStatus: 'all', hRange: '30', hSearch: '',
    abTab: 'contacts', abCat: 'All', abSearch: '',
    form: null, send: null, ex: null, hinted: false
  };

  /* ---------- shell ---------- */
  var $app = document.getElementById('app');
  $app.innerHTML =
    '<nav class="rail" aria-label="Main">' +
      '<svg class="mark" viewBox="0 0 36 36" aria-label="CoinsPaid"><circle cx="18" cy="18" r="17" fill="#fff"/><path d="M24.5 12.2A8.6 8.6 0 1 0 24.5 23.8" fill="none" stroke="#111417" stroke-width="4.2" stroke-linecap="round"/><circle cx="18" cy="18" r="3" fill="#111417"/></svg>' +
      '<a href="#/dashboard" data-nav="dashboard">' + I('wallet') + '<span class="tip">Wallet</span></a>' +
      '<a href="#/history" data-nav="history">' + I('clock') + '<span class="tip">History</span></a>' +
      '<a href="#/address-book" data-nav="address-book">' + I('book') + '<span class="tip">Address book</span></a>' +
      '<span class="off" aria-disabled="true">' + I('sliders') + '</span>' +
      '<span class="sp"></span>' +
      '<a href="#/history" data-nav="bell">' + I('bell') + '<span class="dot">1</span><span class="tip">1 pending transfer</span></a>' +
      '<span class="me">DK</span>' +
    '</nav>' +
    '<main class="main" id="main"></main>' +
    '<div class="scrim" id="scrim"></div>' +
    '<aside class="drawer" id="drawer" aria-label="Details"></aside>' +
    '<div class="toast" id="toast"></div>';
  var $main = document.getElementById('main'), $drawer = document.getElementById('drawer'), $scrim = document.getElementById('scrim'), $toast = document.getElementById('toast');

  var toastT;
  function toast(msg) { $toast.innerHTML = I('check', 's') + esc(msg); $toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { $toast.classList.remove('on'); }, 2200); }

  /* ---------- charts ---------- */
  function smooth(pts) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }
  function balanceChart() {
    var T = total();
    var raw = [4210, 4180, 4350, 4290, 4520, 4610, 4480, 4700, 4890, 4820, 4760, 4950, 5120, 5080, 5240, 5190, 5310, 5280, 5350, 5420, 5380, 5460, 5410, 5520, 5490, 5440, 5500, 5430, 5460, T];
    var W = 440, H = 150, min = 3800, max = 6000;
    var pts = raw.map(function (v, i) { return [i * W / (raw.length - 1), H - (v - min) / (max - min) * H]; });
    var line = smooth(pts);
    var grid = [4000, 5000, 6000].map(function (v) { var y = H - (v - min) / (max - min) * H; return '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#EEF0F2"/><text x="' + (W + 6) + '" y="' + (y + 4) + '">' + (v / 1000) + 'k</text>'; }).join('');
    var xl = [['8 Nov', 0], ['18 Nov', 10], ['28 Nov', 20], ['7 Dec', 29]].map(function (l) { return '<text x="' + (l[1] * W / 29) + '" y="' + (H + 18) + '" text-anchor="' + (l[1] === 29 ? 'end' : l[1] ? 'middle' : 'start') + '">' + l[0] + '</text>'; }).join('');
    var last = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + (W + 24) + ' ' + (H + 22) + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1F5CFF" stop-opacity=".14"/><stop offset="1" stop-color="#1F5CFF" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<path d="' + line + ' L' + W + ',' + H + ' L0,' + H + 'Z" fill="url(#ga)"/>' +
      '<path d="' + line + '" fill="none" stroke="#1F5CFF" stroke-width="2"/>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="4" fill="#fff" stroke="#1F5CFF" stroke-width="2"/>' + xl + '</svg>';
  }
  function flowChart() {
    // Two wavy lines, the way the 2020 dashboard showed activity: received and sent per day, in EUR.
    var days = ['29', '30', '1', '2', '3', '4', '5', '6', '7'];
    var inn = [90, 85, 60, 70, 210, 120, 330, 60, 140], out = [100, 60, 40, 50, 60, 110, 95, 130, 100];
    var W = 440, H = 150, max = 360;
    function line(arr) { return smooth(arr.map(function (v, k) { return [k * W / (arr.length - 1), H - v / max * H]; })); }
    var grid = [0, 100, 200, 300].map(function (v) { var y = H - v / max * H; return '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#EEF0F2"/><text x="' + (W + 6) + '" y="' + (y + 4) + '">' + v + '</text>'; }).join('');
    var xl = days.map(function (d, k) { return '<text x="' + (k * W / (days.length - 1)) + '" y="' + (H + 18) + '" text-anchor="middle">' + d + '</text>'; }).join('');
    return '<svg viewBox="0 0 ' + (W + 30) + ' ' + (H + 22) + '" preserveAspectRatio="none">' + grid +
      '<path d="' + line(out) + '" fill="none" stroke="#1F5CFF" stroke-width="2"/><path d="' + line(inn) + '" fill="none" stroke="#7CC251" stroke-width="2"/>' + xl + '</svg>';
  }

  /* ---------- pages ---------- */
  function pageDashboard() {
    var T = total(), sel = route.q.coin;
    var coins = ORDER.map(function (c, i) {
      var k = COINS[c];
      return '<button class="card coin' + (sel === c ? ' on' : '') + (!ui.hinted && i === 0 && !sel ? ' hint' : '') + '" data-go="coin" data-id="' + c + '">' + cico(c) +
        '<span class="nm"><b>' + k.name + '</b><span>' + c + '</span></span>' +
        '<span class="am"><b>' + amt(c, k.bal) + '</b><span>' + eur(k.bal * k.rate) + '</span></span>' + I('chevr', 's chev') + '</button>';
    }).join('');
    var recent = txs.slice(0, 5).map(function (x) { return txRow(x, true); }).join('');
    return '<div class="page">' +
      '<div class="ph"><div><h1 class="num">' + eur(T) + '</h1><div class="sub num">≈ ' + fmt(T / COINS.BTC.rate, 8) + ' BTC · 6 currencies</div></div>' +
      '<div class="act"><button class="btn sec" data-go="flow" data-flow="receive">' + I('down', 's') + 'Receive</button><button class="btn pri" data-go="flow" data-flow="send">' + I('up', 's') + 'Send</button></div></div>' +
      '<div class="charts">' +
        '<div class="card chart"><div class="h"><b>Balance</b><span class="legend">30 days, EUR</span></div>' + balanceChart() + '</div>' +
        '<div class="card chart"><div class="h"><b>Activity</b><span class="legend"><span><i style="background:#7CC251"></i>In</span><span><i style="background:#1F5CFF"></i>Out</span></span></div>' + flowChart() + '</div>' +
      '</div>' +
      '<div class="sec-t"><h2>Wallet balances</h2></div>' +
      '<div class="coins">' + coins + '</div>' +
      '<div class="sec-t"><h2>Recent activity</h2><a class="link" href="#/history">All history ' + I('chevr', 's') + '</a></div>' +
      '<div class="card txl">' + recent + '</div>' +
    '</div>';
  }

  function filteredTx() {
    var s = ui.hSearch.trim().toLowerCase();
    var minDay = { '7': '2020-12-01', '30': '2020-11-07', '90': '2020-09-08' }[ui.hRange];
    return txs.filter(function (x) {
      if (ui.hType !== 'all' && x.t !== ui.hType) return false;
      if (ui.hCoin !== 'all' && x.coin !== ui.hCoin && x.to2 !== ui.hCoin) return false;
      if (ui.hStatus !== 'all' && x.s !== ui.hStatus) return false;
      if (x.d.slice(0, 10) < minDay) return false;
      if (s) {
        var p = txParty(x), hay = (p.title + ' ' + (x.from || '') + ' ' + (x.toAddr || '') + ' ' + hash(x) + ' ' + x.coin + ' ' + (x.note || '')).toLowerCase();
        if (p.ct) hay += ' ' + p.ct.addrs.map(function (a) { return a.a; }).join(' ').toLowerCase();
        if (hay.indexOf(s) < 0) return false;
      }
      return true;
    });
  }
  function sel(id, val, opts) {
    return '<span class="sel"><select data-f="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' + I('chev', 's') + '</span>';
  }
  function pageHistory() {
    var list = filteredTx(), last = '', groups = '';
    list.forEach(function (x) {
      var day = dayLabel(x.d);
      if (day !== last) { groups += (last ? '</div>' : '') + '<div class="day">' + day + '</div><div class="card txl">'; last = day; }
      groups += txRow(x, true, true);
    });
    if (last) groups += '</div>';
    return '<div class="page">' +
      '<div class="ph"><div><h1>History</h1><div class="sub">All currencies</div></div>' +
      '<div class="act"><button class="btn sec" data-act="export">Export CSV</button></div></div>' +
      '<div class="toolbar">' +
        '<label class="search">' + I('search', 's') + '<input data-f="hSearch" placeholder="Name, address or ID" value="' + esc(ui.hSearch) + '"></label>' +
        '<span class="cats">' + [['all', 'All'], ['in', 'Received'], ['out', 'Sent'], ['ex', 'Exchanged']].map(function (o) { return '<button data-seg="hType" data-v="' + o[0] + '"' + (ui.hType === o[0] ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join('') + '</span>' +
        sel('hCoin', ui.hCoin, [['all', 'All currencies']].concat(ORDER.map(function (c) { return [c, COINS[c].name]; }))) +
        sel('hStatus', ui.hStatus, [['all', 'Any status'], ['ok', 'Completed'], ['pend', 'Pending'], ['fail', 'Failed']]) +
        sel('hRange', ui.hRange, [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days']]) +
      '</div>' +
      (list.length ? '<div class="hist">' + groups + '</div>' :
        '<div class="card"><div class="empty"><b>Nothing matches these filters</b>Try another currency or a longer period. <button class="link" data-act="reset-h">Reset filters</button></div></div>') +
      '<div style="margin-top:12px;color:var(--ink-3);font-size:13px">' + list.length + ' of ' + txs.length + ' transactions</div>' +
    '</div>';
  }

  function pageAddressBook() {
    var tab = ui.abTab;
    var head = '<div class="ph"><div><h1>Address book</h1><div class="sub">' + contacts.length + ' contacts</div></div>' +
      '<div class="act"><button class="btn pri" data-go="new">' + I('plus', 's') + (tab === 'contacts' ? 'Add contact' : 'New address') + '</button></div></div>' +
      '<div class="tabs"><button data-tab="contacts"' + (tab === 'contacts' ? ' class="on"' : '') + '>Contacts<span>' + contacts.length + '</span></button><button data-tab="mine"' + (tab === 'mine' ? ' class="on"' : '') + '>My addresses<span>' + mine.length + '</span></button></div>';
    if (tab === 'mine') {
      var rows = mine.map(function (m) {
        return '<tr data-go="coin" data-id="' + m.coin + '" data-view="receive" data-net="' + m.net + '"><td><div class="who">' + cico(m.coin, 'sm') + '<div><b>' + esc(m.label) + '</b><span>' + COINS[m.coin].name + ' · ' + NETS[m.net].name + '</span></div></div></td>' +
          '<td><span class="addr">' + esc(short(m.a)) + '</span></td><td class="muted">' + m.tx + ' transfers</td>' +
          '<td class="r"><button class="mini-send" data-copy="' + esc(m.a) + '">' + I('copy', 's') + 'Copy</button></td></tr>';
      }).join('');
      return '<div class="page">' + head +
        '<p style="margin:-4px 0 16px;color:var(--ink-2);font-size:13px">One wallet, several addresses: give a different one to each payer, and nobody sees your whole history on the blockchain.</p>' +
        '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>Label</th><th>Address</th><th>Used</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    }
    var s = ui.abSearch.trim().toLowerCase();
    var list = contacts.filter(function (c) {
      if (ui.abCat !== 'All' && c.cat !== ui.abCat) return false;
      if (s && (c.name + ' ' + c.addrs.map(function (a) { return a.a; }).join(' ')).toLowerCase().indexOf(s) < 0) return false;
      return true;
    });
    var lastOf = function (c) { var t = txs.filter(function (x) { return x.to === c.id || x.from === c.id; })[0]; return t ? t.d : ''; };
    list.sort(function (a, b) { return lastOf(b) < lastOf(a) ? -1 : lastOf(b) > lastOf(a) ? 1 : 0; });
    var cur = route.q.contact;
    var rows2 = list.map(function (c) {
      var lastTx = txs.filter(function (x) { return x.to === c.id || x.from === c.id; })[0];
      return '<tr data-go="contact" data-id="' + c.id + '"' + (cur === c.id ? ' class="on"' : '') + '><td><div class="who">' + av(c) + '<div><b>' + esc(c.name) + '</b><span class="addr">' + esc(short(c.addrs[0].a)) + (c.addrs.length > 1 ? ' +' + (c.addrs.length - 1) : '') + '</span></div></div></td>' +
        '<td><span class="chip cat">' + c.cat + '</span></td>' +
        '<td><div style="display:flex;gap:4px">' + c.addrs.map(function (a) { return '<span title="' + NETS[a.net].name + '">' + cico(netIcon(a.net), 'sm') + '</span>'; }).join('') + '</div></td>' +
        '<td class="muted">' + (lastTx ? dayLabel(lastTx.d) : '—') + '</td>' +
        '<td class="r"><button class="mini-send" data-go="send-to" data-id="' + c.id + '">' + I('up', 's') + 'Send</button></td></tr>';
    }).join('');
    return '<div class="page">' + head +
      '<div class="toolbar"><label class="search">' + I('search', 's') + '<input data-f="abSearch" placeholder="Name or address" value="' + esc(ui.abSearch) + '"></label>' +
      '<div class="cats">' + ['All'].concat(CATS).map(function (c) { return '<button data-cat="' + c + '"' + (ui.abCat === c ? ' class="on"' : '') + '>' + c + '</button>'; }).join('') + '</div></div>' +
      '<div class="card" style="overflow:hidden">' + (list.length ? '<table class="tbl"><thead><tr><th>Contact</th><th style="width:130px">Category</th><th style="width:130px">Networks</th><th style="width:130px">Last transfer</th><th style="width:110px"></th></tr></thead><tbody>' + rows2 + '</tbody></table>' :
        '<div class="empty"><b>No contacts here yet</b>Add one, or save an address straight from a transaction in History.</div>') + '</div></div>';
  }

  /* ---------- drawers ---------- */
  // One pattern for objects (balance, contact, transaction, receive address): action tiles under the head.
  // Forms (send, exchange, new contact) keep one primary button in the footer.
  function acts(list) {
    return '<div class="acts" style="grid-template-columns:repeat(' + list.length + ',1fr)">' + list.map(function (a) {
      return '<button ' + a[2] + '><span class="ci' + (a[3] ? ' ' + a[3] : '') + '">' + I(a[0]) + '</span>' + a[1] + '</button>';
    }).join('') + '</div>';
  }
  function dh(title, back) {
    return '<div class="dh">' + (back ? '<button class="icon-btn flat" data-back="' + back + '" aria-label="Back">' + I('back') + '</button>' : '') + '<h3>' + title + '</h3><button class="icon-btn flat" data-close aria-label="Close">' + I('x') + '</button></div>';
  }
  function drawerCoin(c) {
    var k = COINS[c], view = route.q.view;
    if (view === 'send') return drawerSend(c);
    if (view === 'receive') return drawerReceive(c);
    if (view === 'exchange') return drawerExchange(c);
    var list = txs.filter(function (x) { return x.coin === c || x.to2 === c; });
    return dh(k.name) + '<div class="db">' +
      '<div class="bal-head">' + cico(c, 'lg') + '<div class="lbl">Balance</div><div class="v">' + amt(c, k.bal) + '</div><div class="e">' + eur(k.bal * k.rate) + ' · 1 ' + c + ' = ' + eur(k.rate) + '</div></div>' +
      acts([['up', 'Send', 'data-view="send"'], ['down', 'Receive', 'data-view="receive"'], ['swap', 'Exchange', 'data-view="exchange"']]) +
      '<div class="d-sub"><span>History</span><a class="link" href="#/history" data-hcoin="' + c + '">All</a></div>' +
      (list.length ? '<div class="box txl">' + list.map(function (x) { return txRow(x, true, false, c); }).join('') + '</div>' : '<div class="empty" style="padding:24px 0">No transfers yet</div>') +
    '</div>';
  }

  /* ---------- networks helpers ---------- */
  function netCoins(nk) { return nk === 'ERC20' ? ['ETH', 'USDT'] : nk === 'TRC20' ? ['USDT'] : [NETS[nk].coin]; }
  function detect(a) { a = (a || '').trim(); return Object.keys(NETS).filter(function (nk) { return NETS[nk].re.test(a); })[0]; }
  function addrFor(ct, coin) { return ct.addrs.filter(function (a) { return netCoins(a.net).indexOf(coin) >= 0; }); }
  function feeOf(coin, nk) {
    if (nk === 'TRC20') return { coin: 'USDT', fee: 1, time: '~1 min' };
    if (nk === 'ERC20' && coin === 'USDT') return { coin: 'USDT', fee: 2.5, time: '~5 min' };
    if (nk === 'ERC20') return { coin: 'ETH', fee: 0.0021, time: '~5 min' };
    return { coin: coin, fee: NETS[nk].fee, time: nk === 'BTC' ? '~30 min' : '~10 min' };
  }
  function netIcon(nk) { return nk === 'ERC20' ? 'ETH' : nk === 'TRC20' ? 'TRX' : nk; }
  function netChip(nk) { return '<span class="net-chip">' + cico(netIcon(nk), 'xs') + NETS[nk].name + '</span>'; }

  /* ---------- currency first: Send / Receive from the overview ---------- */
  function drawerPick(flow) {
    var ct = route.q.to && contact(route.q.to), rows;
    if (ct) {
      rows = [];
      ct.addrs.forEach(function (a) { netCoins(a.net).forEach(function (c) { rows.push({ c: c, net: a.net, a: a.a }); }); });
      rows = rows.map(function (r) {
        return '<button class="pick" data-go="coin" data-id="' + r.c + '" data-view="send" data-to="' + ct.id + '" data-net="' + r.net + '" data-from="pick">' + cico(r.c) +
          '<span class="tt"><b>' + COINS[r.c].name + '</b><span>' + netChip(r.net) + '</span></span><span class="ta"><b>' + amt(r.c, COINS[r.c].bal) + '</b><span>' + eur(COINS[r.c].bal * COINS[r.c].rate) + '</span></span>' + I('chevr', 's chev') + '</button>';
      }).join('');
      return dh('Send to ' + esc(ct.name.split(' ')[0])) + '<div class="db"><div class="ct-mini">' + av(ct) + '<span><b>' + esc(ct.name) + '</b><span>' + ct.addrs.length + ' saved address' + (ct.addrs.length > 1 ? 'es' : '') + '</span></span></div>' +
        '<div class="d-sub"><span>What do you send?</span></div><div class="box txl">' + rows + '</div>' +
        '<p class="fine">Only currencies ' + esc(ct.name.split(' ')[0]) + ' has an address for. An ERC-20 address takes both ETH and USDT.</p></div>';
    }
    rows = ORDER.map(function (c) {
      var k = COINS[c], dis = flow === 'send' && !k.bal;
      return '<button class="pick" data-go="coin" data-id="' + c + '" data-view="' + flow + '" data-from="pick"' + (dis ? ' disabled' : '') + '>' + cico(c) +
        '<span class="tt"><b>' + k.name + '</b><span>' + (k.nets.length > 1 ? k.nets.length + ' networks: ' + k.nets.map(function (n) { return NETS[n].name.replace(/ \(.*/, '') ; }).join(', ') : NETS[k.nets[0]].name + ' network') + '</span></span>' +
        '<span class="ta"><b>' + amt(c, k.bal) + '</b><span>' + eur(k.bal * k.rate) + '</span></span>' + I('chevr', 's chev') + '</button>';
    }).join('');
    return dh(flow === 'send' ? 'Send' : 'Receive') + '<div class="db"><div class="d-sub"><span>' + (flow === 'send' ? 'Which currency do you send?' : 'Which currency do you receive?') + '</span></div><div class="box txl">' + rows + '</div></div>';
  }

  function sendState(c) {
    if (!ui.send || ui.send.coin !== c) {
      ui.send = { coin: c, to: route.q.to || null, net: route.q.net || null, addr: '', amount: '', step: 'form', note: '' };
      var ct0 = ui.send.to && contact(ui.send.to);
      if (ct0 && !ui.send.net) { var m0 = addrFor(ct0, c); if (m0.length === 1) ui.send.net = m0[0].net; }
    }
    return ui.send;
  }
  function drawerSend(c) {
    var st = sendState(c), k = COINS[c], ct = st.to && contact(st.to);
    var manual = !ct && st.addr.trim(), det = manual && detect(st.addr);
    var okManual = det && k.nets.indexOf(det) >= 0;
    var net = ct ? st.net : okManual ? det : null;
    var dest = ct && net ? addrFor(ct, c).filter(function (a) { return a.net === net; })[0].a : okManual ? st.addr.trim() : null;
    var back = route.q.from === 'pick' ? 'pick' : 'coin';
    var n = parseFloat(st.amount) || 0, F = net ? feeOf(c, net) : { coin: c, fee: 0 };
    var tooMuch = n + (F.coin === c ? F.fee : 0) > k.bal;
    if (st.step === 'done') {
      return dh('Send ' + c) + '<div class="db"><div class="done"><div class="ok">' + I('check', 'l') + '</div><h4>Sent</h4><p>' + amt(c, n) + ' to ' + esc(ct ? ct.name : short(dest)) + '</p><p style="margin-top:6px;color:var(--ink-3);font-size:13px">' + NETS[net].name + ' network, usually ' + F.time.replace('~', '') + ' to confirm.</p></div></div>' +
        '<div class="df"><button class="btn sec full" data-act="send-again">Done</button></div>';
    }
    if (st.step === 'review') {
      return dh('Check and confirm', 'send-form') + '<div class="db">' +
        '<div class="tx-head"><div class="lbl">You send</div><div class="v">' + amt(c, n) + '</div><div class="e">' + eur(n * k.rate) + '</div></div>' +
        '<div class="d-sub"><span>To</span></div>' +
        '<div class="to-sel rcpt">' + (ct ? av(ct) : '<span class="av c-gray">' + I('globe') + '</span>') + '<span class="t"><b>' + (ct ? esc(ct.name) : 'New address') + '</b><span class="addr-line">' + (st.full ? '<code>' + esc(dest.match(/.{1,4}/g).join(' ')) + '</code>' : '<code class="ends"><b>' + esc(dest.slice(0, 8)) + '</b>\u2026<b>' + esc(dest.slice(-6)) + '</b></code>') + '<button class="link" data-act="full-addr">' + (st.full ? 'Hide' : 'Show all') + '</button></span></span></div>' +
        '<div class="sum">' +
          '<div><span>Network</span><b>' + NETS[net].name + '</b></div>' +
          '<div><span>' + (ct ? esc(ct.name.split(' ')[0]) + ' gets' : 'Recipient gets') + '</span><b>' + amt(c, n) + '</b></div>' +
          '<div><span>Network fee</span><b>' + amt(F.coin, F.fee) + '</b></div>' +
          (st.note ? '<div><span>Note</span><b>' + esc(st.note) + '</b></div>' : '') +
          '<div class="tot"><span>Total</span><b>' + (F.coin === c ? amt(c, n + F.fee) : amt(c, n) + ' + ' + amt(F.coin, F.fee)) + '</b></div>' +
        '</div>' +
        (ct ? '' : '<div class="note">' + I('alert', 's') + '<span>This address is not in your address book. Transfers can’t be reversed: compare the first and last 4 characters with the ones you were given.</span></div>') +
      '</div><div class="df"><button class="btn pri full" data-act="send-confirm">Send ' + (F.coin === c ? amt(c, n + F.fee) : amt(c, n)) + '</button></div>';
    }

    var who;
    if (ct && net) {
      who = '<div class="to-sel">' + av(ct) + '<span class="t"><b>' + esc(ct.name) + '</b><span class="addr">' + esc(short(dest)) + '</span></span><button class="icon-btn flat" data-act="clear-to" aria-label="Change recipient">' + I('x', 's') + '</button></div>';
    } else if (okManual) {
      who = '<div class="to-sel"><span class="av c-gray">' + I('globe') + '</span><span class="t"><b>New address</b><span class="addr">' + esc(short(dest)) + '</span></span><button class="icon-btn flat" data-act="clear-to" aria-label="Change recipient">' + I('x', 's') + '</button></div>';
    } else {
      var q = st.addr.trim().toLowerCase(), rows = [], without = 0;
      contacts.forEach(function (x) {
        if (ct && x.id !== ct.id) return;
        var aa = addrFor(x, c);
        if (!aa.length) { without++; return; }
        if (q && !det && x.name.toLowerCase().indexOf(q) < 0) return;
        if (aa.length === 1) rows.push('<button class="pick" data-pick="' + x.id + '|' + aa[0].net + '">' + av(x) + '<span class="tt"><b>' + esc(x.name) + '</b><span>' + netChip(aa[0].net) + '<span class="addr">' + esc(aa[0].a.slice(0, 6) + '\u2026' + aa[0].a.slice(-4)) + '</span></span></span>' + I('chevr', 's chev') + '</button>');
        else rows.push('<div class="pick multi">' + av(x) + '<span class="tt"><b>' + esc(x.name) + '</b><span class="nets">' + aa.map(function (a) { return '<button class="net-chip btn-chip" data-pick="' + x.id + '|' + a.net + '">' + cico(netIcon(a.net), 'xs') + NETS[a.net].name + '</button>'; }).join('') + '</span></span></div>');
      });
      var msg = '';
      if (manual && det && !okManual) {
        var other = netCoins(det).filter(function (x) { return x !== c; });
        msg = '<div class="msg bad">' + I('alert', 's') + '<span>This is a ' + NETS[det].name + ' address. ' + c + ' can’t go there' + (other.length ? '. <button class="link" data-go="coin" data-id="' + other[0] + '" data-view="send" data-paste="' + esc(st.addr.trim()) + '" style="font-size:12px">Send ' + other[0] + ' instead</button>' : '.') + '</span></div>';
      } else if (manual && !det && st.addr.trim().length > 12) msg = '<div class="msg bad">' + I('alert', 's') + 'Not a ' + k.nets.map(function (x) { return NETS[x].name; }).join(' or ') + ' address</div>';
      var looksAddr = st.addr.trim().length > 20;
      who = '<div class="in-w"><input data-s="addr" placeholder="Search contacts or paste a ' + c + ' address" value="' + esc(st.addr) + '" autocomplete="off" spellcheck="false"><span class="tail">' + (st.addr ? '<button data-act="clear-addr" aria-label="Clear">' + I('x', 's') + '</button>' : '<button data-act="paste" title="Paste">Paste</button><button title="Scan QR">' + I('scan', 's') + '</button>') + '</span></div>' + msg +
        (looksAddr ? '' : (ct ? '<div class="d-sub" style="margin-top:16px"><span>Which of ' + esc(ct.name.split(' ')[0]) + '’s addresses?</span></div>' : '<div class="d-sub" style="margin-top:16px"><span>Contacts with a ' + c + ' address</span></div>') +
        (rows.length ? '<div class="box txl">' + rows.join('') + '</div>' : '<div class="empty" style="padding:16px 0">No contacts match</div>') +
        (without && !ct ? '<p class="fine">' + without + ' contacts have no ' + c + ' address and are hidden.</p>' : ''));
    }
    var ready = net && dest;
    return dh('Send ' + c, back) + '<div class="db">' +
      '<div class="step-head">' + cico(c, 'sm') + '<span><b>' + k.name + '</b></span></div>' +
      '<div class="field"><div class="lb"><span>To</span></div>' + who + '</div>' +
      (ready ?
        '<div class="field"><div class="lb"><span>Network</span><span>' + (ct ? 'Saved with the contact' : 'Detected from the address') + '</span></div><div class="net-line">' + netChip(net) + '<span>' + F.time + ' to confirm</span></div></div>' +
        '<div class="field"><div class="lb"><span>Amount</span><span>Available ' + amt(c, k.bal) + '</span></div>' +
          '<div class="amount"><div class="row"><input data-s="amount" inputmode="decimal" placeholder="0.00" value="' + esc(st.amount) + '"><span class="cur">' + c + '</span></div>' +
          '<div class="sub"><span>≈ ' + eur(n * k.rate) + '</span><span><button data-amt=".25">25%</button> &nbsp; <button data-amt=".5">50%</button> &nbsp; <button data-amt="1">Max</button></span></div></div>' +
          (tooMuch ? '<div class="msg bad">' + I('alert', 's') + 'More than you have, including the network fee</div>' : '') +
        '</div>' +
        '<div class="field"><label>Note for yourself <span>Optional</span></label><input data-s="note" placeholder="What is it for" value="' + esc(st.note) + '"></div>' +
        '<div class="sum"><div><span>' + (ct ? esc(ct.name.split(' ')[0]) + ' gets' : 'Recipient gets') + '</span><b>' + amt(c, n) + '</b></div><div><span>Network fee</span><b>' + amt(F.coin, F.fee) + '</b></div><div class="tot"><span>Total</span><b>' + (F.coin === c ? amt(c, n + F.fee) : amt(c, n) + ' + ' + amt(F.coin, F.fee)) + '</b></div></div>'
      : '') +
    '</div>' + (ready ? '<div class="df"><button class="btn pri full" data-act="send-review"' + (n > 0 && !tooMuch ? '' : ' disabled') + '>Review</button></div>' : '');
  }

  function qr(seed) {
    var N = 25, s = 0, cells = '';
    for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    function finder(x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#101316"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#101316"/>'; }
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      if ((x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)) continue;
      if (rnd() > .52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg class="qr" viewBox="0 0 ' + N + ' ' + N + '" shape-rendering="crispEdges"><g fill="#101316">' + cells + '</g>' + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + '</svg>';
  }
  function drawerReceive(c) {
    var k = COINS[c], net = route.q.net && k.nets.indexOf(route.q.net) >= 0 ? route.q.net : k.nets[0];
    var opts = mine.filter(function (m) { return m.coin === c && m.net === net; });
    var idx = Math.min(+(route.q.addr || 0), opts.length - 1), m = opts[idx], F = feeOf(c, net);
    var back = route.q.from === 'pick' ? 'pick' : 'coin';
    return dh('Receive ' + c, back) + '<div class="db">' +
      '<div class="step-head">' + cico(c, 'sm') + '<span><b>' + k.name + '</b></span></div>' +
      (k.nets.length > 1 ? '<div class="field"><div class="lb"><span>Network</span><span>The sender must pick the same one</span></div><div class="net-cards">' + k.nets.map(function (nk) { var f = feeOf(c, nk); return '<button data-rnet="' + nk + '"' + (nk === net ? ' class="on"' : '') + '>' + cico(netIcon(nk), 'sm') + '<span><b>' + NETS[nk].name + '</b><span>Sender fee ~' + fmt(f.fee, f.fee % 1 ? 1 : 0) + ' ' + f.coin + '</span></span></button>'; }).join('') + '</div></div>' : '') +
      '<div class="note" style="margin:0 0 18px">' + I('alert', 's') + '<span>Send only ' + c + ' on the ' + NETS[net].name + ' network to this address. Anything else sent here can\u2019t be recovered.</span></div>' +
      (opts.length > 1 ? '<div class="field"><div class="lb"><span>Your address</span><span>' + opts.length + ' on this network</span></div><div class="seg" style="width:100%">' + opts.map(function (o, i) { return '<button style="flex:1" data-raddr="' + i + '"' + (i === idx ? ' class="on"' : '') + '>' + esc(o.label) + '</button>'; }).join('') + '</div></div>' : '') +
      qr(m.a) +
      '<div class="addr-box"><span style="flex:1">' + esc(m.a) + '</span></div>' +
      '<div style="height:16px"></div>' + acts([['copy', 'Copy', 'data-copy="' + esc(m.a) + '"'], ['ext', 'Share', 'data-act="share"'], ['plus', 'New address', 'data-go="new-mine"']]) +
      '<div class="kv" style="margin-top:14px"><div><span>Label</span><b>' + esc(m.label) + '</b></div><div><span>Received here</span><b>' + m.tx + ' transfers</b></div></div>' +
    '</div>';
  }

  function exState(c) { if (!ui.ex || ui.ex.from !== c) ui.ex = { from: c, to: c === 'ETH' ? 'BTC' : 'ETH', amount: '', step: 'form', t: 30 }; return ui.ex; }
  function drawerExchange(c) {
    var st = exState(c), f = COINS[st.from], t = COINS[st.to], n = parseFloat(st.amount) || 0;
    var rate = f.rate / t.rate * 0.995, get = n * rate, fee = n * f.rate * 0.005;
    if (st.step === 'done') return dh('Exchange') + '<div class="db"><div class="done"><div class="ok">' + I('check', 'l') + '</div><h4>Exchanged</h4><p>' + amt(st.from, n) + ' → ' + amt(st.to, get) + '</p><p style="margin-top:6px;color:var(--ink-3);font-size:13px">Both balances are already updated.</p></div></div><div class="df"><button class="btn sec full" data-act="ex-again">Done</button></div>';
    var too = n > f.bal;
    var opt = function (cur, skip) { return ORDER.filter(function (x) { return x !== skip; }).map(function (x) { return '<option value="' + x + '"' + (x === cur ? ' selected' : '') + '>' + x + '</option>'; }).join(''); };
    return dh('Exchange', 'coin') + '<div class="db">' +
      '<div class="ex-pair"><div class="amount"><div class="lb2"><span>You spend</span><span>Available ' + amt(st.from, f.bal) + '</span></div><div class="row"><input data-e="amount" inputmode="decimal" placeholder="0.00" value="' + esc(st.amount) + '">' + cico(st.from, 'sm') + '<span class="sel"><select data-e="from" style="border:0;background:transparent;padding-left:0;font-weight:600">' + opt(st.from, st.to) + '</select>' + I('chev', 's') + '</span></div>' +
        '<div class="sub"><span>≈ ' + eur(n * f.rate) + '</span><span><button data-eamt=".25">25%</button> &nbsp; <button data-eamt=".5">50%</button> &nbsp; <button data-eamt="1">Max</button></span></div></div>' +
      '<button class="ex-swap" data-act="ex-swap" aria-label="Swap currencies">' + I('swapv', 's') + '</button>' +
        '<div class="amount get"><div class="lb2"><span>You get</span></div><div class="row"><input readonly value="' + (n ? fmt(get, t.dp) : '0.00') + '" style="background:transparent">' + cico(st.to, 'sm') + '<span class="sel"><select data-e="to" style="border:0;background:transparent;padding-left:0;font-weight:600">' + opt(st.to, st.from) + '</select>' + I('chev', 's') + '</span></div>' +
        '<div class="sub"><span>≈ ' + eur(get * t.rate) + '</span></div></div>' +
        (too ? '<div class="msg bad" style="margin-top:6px;font-size:12px;display:flex;gap:6px;color:var(--red)">' + I('alert', 's') + 'More than your ' + st.from + ' balance</div>' : '') + '</div>' +
      '<div class="sum"><div><span>Rate</span><b>1 ' + st.from + ' = ' + fmt(rate, 6) + ' ' + st.to + '</b></div><div><span>Fee 0.5%</span><b>' + amt(st.from, n * 0.005) + '</b></div><div class="tot"><span>You get</span><b>' + amt(st.to, get) + '</b></div></div>' +
      '<div class="quote"><svg class="ring" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#E2E5E9" stroke-width="2.5"/><circle id="qring" cx="10" cy="10" r="8" fill="none" stroke="#1F5CFF" stroke-width="2.5" stroke-dasharray="50.3" stroke-dashoffset="' + (50.3 * (1 - st.t / 30)) + '" transform="rotate(-90 10 10)"/></svg><span id="qtxt">Rate is fixed for ' + st.t + ' s</span></div>' +
    '</div><div class="df"><button class="btn pri full" data-act="ex-go"' + (n > 0 && !too ? '' : ' disabled') + '>Exchange</button></div>';
  }

  function hash(x) { var s = 2166136261, h = ''; for (var i = 0; i < x.id.length; i++) s = Math.imul(s ^ x.id.charCodeAt(i), 16777619) >>> 0; for (var j = 0; j < 64; j++) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; h += '0123456789abcdef'[(s >>> 7) & 15]; } return h; }
  function drawerTx(id) {
    var x = txs.filter(function (t) { return t.id === id; })[0]; if (!x) return '';
    var p = txParty(x), a = txAmt(x), k = COINS[x.coin], h = hash(x);
    var head = '<div class="tx-head">' + txIcon(x).replace('class="ti', 'class="ti') + '<div class="lbl">' + (x.t === 'in' ? 'Received' : x.t === 'out' ? 'Sent' : 'Exchanged') + (p.ct ? (x.t === 'in' ? ' from ' : ' to ') + esc(p.ct.name) : '') + '</div>' +
      '<div class="v' + (a.pos ? ' pos' : '') + '">' + a.main + '</div><div class="e">' + (x.t === 'ex' ? 'for ' + amt(x.coin, x.amt) : '≈ ' + eur(x.amt * k.rate)) + '</div>' + statusChip(x.s) + '</div>';
    var t0 = x.d.slice(11), hh = +t0.slice(0, 2), mm = +t0.slice(3);
    function plus(m) { var t = hh * 60 + mm + m; return ('0' + Math.floor(t / 60) % 24).slice(-2) + ':' + ('0' + t % 60).slice(-2); }
    var steps;
    if (x.t === 'ex') steps = '<div><span class="d">' + I('check') + '</span>Rate fixed<span>' + t0 + '</span></div><div><span class="d">' + I('check') + '</span>Exchanged inside the wallet<span>' + t0 + '</span></div>';
    else if (x.s === 'fail') steps = '<div><span class="d">' + I('check') + '</span>Created<span>' + t0 + '</span></div><div><span class="d x">' + I('x') + '</span>Rejected by the network<span>' + plus(4) + '</span></div>';
    else if (x.s === 'pend') steps = '<div><span class="d">' + I('check') + '</span>Seen in the network<span>' + t0 + '</span></div><div><span class="d p">' + I('clock') + '</span>Confirmations ' + x.conf + ' of ' + x.need + '<span>~' + (x.need - x.conf) * 10 + ' min left</span><span class="bar"><i style="width:' + (x.conf / x.need * 100) + '%"></i></span></div><div><span class="d w"></span>Available to spend<span></span></div>';
    else steps = '<div><span class="d">' + I('check') + '</span>' + (x.t === 'in' ? 'Seen in the network' : 'Sent to the network') + '<span>' + t0 + '</span></div><div><span class="d">' + I('check') + '</span>Confirmed 3 of 3<span>' + plus(27) + '</span></div><div><span class="d">' + I('check') + '</span>' + (x.t === 'in' ? 'Available to spend' : 'Delivered') + '<span>' + plus(27) + '</span></div>';
    var rows = '', parties = '';
    if (x.t === 'ex') {
      rows = '<div><span>Spent</span><b>' + amt(x.coin, x.amt) + '</b></div><div><span>Got</span><b>' + amt(x.to2, x.amt2) + '</b></div><div><span>Rate</span><b>1 ' + x.coin + ' = ' + fmt(x.amt2 / x.amt, 6) + ' ' + x.to2 + '</b></div><div><span>Fee 0.5%</span><b>' + amt(x.coin, x.amt * .005) + '</b></div>';
    } else {
      var net = NETS[x.net || k.nets[0]];
      var my = mine.filter(function (m) { return m.coin === x.coin; })[0].a;
      var other = p.ct ? p.ct.addrs.filter(function (z) { return z.net === (x.net || k.nets[0]); })[0] || p.ct.addrs[0] : null;
      var otherA = other ? other.a : p.addr;
      var other = [p.ct ? av(p.ct) : '<span class="av c-gray">' + I('globe') + '</span>', p.ct ? esc(p.ct.name) : 'Unknown address', otherA];
      var myM = mine.filter(function (m) { return m.coin === x.coin && (!x.net || m.net === x.net); })[0] || mine.filter(function (m) { return m.coin === x.coin; })[0];
      my = myM.a;
      var me = ['<span class="av c-gray">' + I('wallet') + '</span>', 'My wallet · ' + esc(myM.label), my];
      var party = function (lbl, v) { return '<div class="pt"><span class="pl">' + lbl + '</span>' + v[0] + '<span class="t"><b>' + v[1] + '</b><code>' + esc(v[2].slice(0, 8)) + '\u2026' + esc(v[2].slice(-6)) + '</code></span><button class="icon-btn flat" data-copy="' + esc(v[2]) + '" aria-label="Copy address">' + I('copy', 's') + '</button></div>'; };
      parties = '<div class="parties">' + party('From', x.t === 'in' ? other : me) + party('To', x.t === 'in' ? me : other) + '</div>';
      rows = '' +
        '<div><span>Network</span><b>' + net.name + '</b></div>' +
        (x.t === 'out' ? '<div><span>Network fee</span><b>' + (x.coin === 'USDT' ? '1.00 USDT' : amt(net.coin, net.fee)) + '</b></div>' : '') +
        '<div><span>Rate then</span><b>1 ' + x.coin + ' = ' + eur(k.rate) + '</b></div>' +
        '<div><span>Transaction ID</span><b class="hash"><code>' + h.slice(0, 10) + '…' + h.slice(-6) + '</code><button data-copy="' + h + '" aria-label="Copy">' + I('copy', 's') + '</button><button data-act="explorer" aria-label="Open in explorer">' + I('ext', 's') + '</button></b></div>';
    }
    rows += '<div><span>Date</span><b>' + dayLabel(x.d) + ', ' + t0 + '</b></div>' + (x.note ? '<div><span>Note</span><b>' + esc(x.note) + '</b></div>' : '');
    var reason = x.reason ? '<div class="note" style="margin:0 0 18px;background:var(--red-soft);color:#9B1C1F">' + I('alert', 's') + '<span>' + esc(x.reason) + '</span></div>' : '';
    var t = [];
    if (x.t === 'ex') t = [['swap', 'Exchange again', 'data-go="coin" data-id="' + x.coin + '" data-view="exchange"'], ['copy', 'Copy ID', 'data-copy="' + h + '"']];
    else {
      var again = x.t === 'in' ? 'Send back' : x.s === 'fail' ? 'Try again' : 'Send again';
      t.push(p.ct ? ['up', again, 'data-go="send-to" data-id="' + p.ct.id + '" data-coin="' + x.coin + '" data-tx="' + x.id + '"'] : ['up', again, 'data-go="coin" data-id="' + x.coin + '" data-view="send" data-paste="' + esc(p.addr) + '"']);
      t.push(p.ct ? ['user', 'Contact', 'data-go="contact" data-id="' + p.ct.id + '"'] : ['plus', 'Save address', 'data-go="new" data-addr="' + esc(p.addr) + '" data-net="' + (x.net || k.nets[0]) + '"']);
      t.push(['ext', 'Explorer', 'data-act="explorer"']);
    }
    return dh('Transaction') + '<div class="db">' + head + acts(t) + '<div class="steps">' + steps + '</div>' + reason + parties + '<div class="kv">' + rows + '</div></div>';
  }

  function drawerContact(id) {
    var c = contact(id); if (!c) return '';
    var list = txs.filter(function (x) { return x.to === id || x.from === id; });
    var sent = list.filter(function (x) { return x.t === 'out' && x.s === 'ok'; }).reduce(function (s, x) { return s + Math.round(x.amt * COINS[x.coin].rate * 100) / 100; }, 0);
    return dh('Contact') +
      '<div class="db"><div class="ct-head">' + av(c, 'lg') + '<h4>' + esc(c.name) + '</h4><span class="chip cat">' + c.cat + '</span></div>' +
      acts([['up', 'Send', 'data-go="send-to" data-id="' + c.id + '"'], ['edit', 'Edit', 'data-act="edit"'], ['trash', 'Delete', 'data-act="delete"', 'danger']]) +
      '<div class="d-sub"><span>Addresses</span><span style="font-weight:500;color:var(--ink-3)">' + c.addrs.length + '</span></div>' +
      '<div class="addr-list">' + c.addrs.map(function (a) { return '<div class="addr-item">' + cico(netIcon(a.net), 'sm') + '<div><b>' + NETS[a.net].name + '</b><code>' + esc(a.a.slice(0, 10)) + '\u2026' + esc(a.a.slice(-8)) + '</code></div><button class="icon-btn flat" data-copy="' + esc(a.a) + '" aria-label="Copy">' + I('copy', 's') + '</button></div>'; }).join('') + '</div>' +
      '<div class="d-sub"><span>Transfers</span><span style="font-weight:500;color:var(--ink-3)">Sent ' + eur(sent) + ' in total</span></div>' +
      (list.length ? '<div class="box txl">' + list.map(function (x) { return txRow(x, true, false, null, true); }).join('') + '</div>' : '<div class="empty" style="padding:20px 0">No transfers yet</div>') +
    '</div>';
  }

  function formState() {
    if (!ui.form) ui.form = { name: '', icon: 'user', color: 'blue', cat: 'Friends', net: route.q.net || 'BTC', addr: route.q.addr || '', note: '' };
    return ui.form;
  }
  function drawerNew() {
    var f = formState(), a = f.addr.trim(), det = a && detect(a);
    if (det && !f.netManual) f.net = det;
    var ok = a && NETS[f.net].re.test(a), dup = a && contactByAddr(a);
    if (dup && dup.id === f.editId) dup = null;
    var msg = '';
    if (dup) msg = '<div class="msg bad">' + I('alert', 's') + 'Already saved as “' + esc(dup.name) + '”</div>';
    else if (ok) msg = '<div class="msg ok">' + I('check', 's') + NETS[f.net].name + ' address' + (f.net === 'ERC20' ? ', works for ETH and USDT' : '') + '</div>';
    else if (det) msg = '<div class="msg bad">' + I('alert', 's') + '<span>This is a ' + NETS[det].name + ' address. <button class="link" data-fnet="' + det + '" style="font-size:12px">Use ' + NETS[det].name + '</button></span></div>';
    else if (a.length > 4) msg = '<div class="msg bad">' + I('alert', 's') + 'Not an address we recognise. Check it was copied in full.</div>';
    else msg = '<div class="msg info">Paste it, and we’ll recognise the network.</div>';
    var can = f.name.trim() && ok && !dup;
    var netKeys = ['BTC', 'ERC20', 'TRC20', 'BCH', 'ADA', 'DOGE'];
    return dh(f.editId ? 'Edit contact' : 'New contact') + '<div class="db">' +
      '<div class="field"><label>Name</label><input data-n="name" placeholder="Who is it" value="' + esc(f.name) + '" autocomplete="off"></div>' +
      '<div class="field' + (msg.indexOf('bad') > 0 ? ' err' : '') + '"><label>Wallet address</label><div class="in-w"><input data-n="addr" placeholder="Paste or scan an address" value="' + esc(f.addr) + '" autocomplete="off" spellcheck="false" style="font-family:var(--mono);font-size:13px"><span class="tail">' + (f.addr ? '<button data-act="fclear" aria-label="Clear">' + I('x', 's') + '</button>' : '<button data-act="fpaste">Paste</button><button title="Scan QR">' + I('scan', 's') + '</button>') + '</span></div>' + msg + '</div>' +
      '<div class="field"><div class="lb"><span>Network</span><span>' + (det && !f.netManual ? 'Detected from the address' : 'Choose one') + '</span></div><div class="net-pick">' + netKeys.map(function (nk) { var co = netIcon(nk); return '<button data-fnet="' + nk + '"' + (f.net === nk && (a || f.netManual) ? ' class="on"' : '') + (det && det !== nk && !f.netManual ? ' disabled' : '') + '>' + cico(co, 'sm') + '<b>' + NETS[nk].name + '</b></button>'; }).join('') + '</div></div>' +
      '<div class="field"><div class="lb"><span>Icon</span></div><div class="icon-row">' + PICK.map(function (ic) { return '<button data-ficon="' + ic + '"' + (f.icon === ic ? ' class="on c-' + f.color + '"' : '') + ' aria-label="' + ic + '">' + I(ic) + '</button>'; }).join('') + '</div></div>' +
      '<div class="field"><div class="lb"><span>Colour</span></div><div class="swatches">' + COLORS.map(function (c) { return '<button class="sw-' + c + (f.color === c ? ' on' : '') + '" data-fcolor="' + c + '" aria-label="' + c + '"></button>'; }).join('') + '</div></div>' +
      '<div class="field"><div class="lb"><span>Category</span></div><div class="cat-pick">' + CATS.map(function (c) { return '<button data-fcat="' + c + '"' + (f.cat === c ? ' class="on"' : '') + '>' + c + '</button>'; }).join('') + '<button data-act="new-cat">' + I('plus', 's') + 'New</button></div></div>' +
      '<div class="field"><label>Note <span>Optional</span></label><input data-n="note" placeholder="Anything to remember" value="' + esc(f.note) + '"></div>' +
    '</div><div class="df"><button class="btn pri full" data-act="save-contact"' + (can ? '' : ' disabled') + '>' + (f.editId ? 'Save changes' : 'Save contact') + '</button></div>';
  }

  /* ---------- render ---------- */
  var exTimer;
  function render(keepFocus) {
    var focus = keepFocus && document.activeElement, fattr = null, pos = 0;
    if (focus && focus.tagName === 'INPUT') { ['data-f', 'data-s', 'data-n', 'data-e'].forEach(function (a) { if (focus.hasAttribute(a)) fattr = [a, focus.getAttribute(a)]; }); pos = focus.selectionStart; }
    var mainScroll = $main.scrollTop, dScroll = ($drawer.querySelector('.db') || {}).scrollTop || 0;
    var pg = route.page;
    $main.innerHTML = pg === 'history' ? pageHistory() : pg === 'address-book' ? pageAddressBook() : pageDashboard();
    $main.scrollTop = mainScroll;
    document.querySelectorAll('.rail a[data-nav]').forEach(function (a) {
      var n = a.getAttribute('data-nav');
      a.classList.toggle('on', n === pg || (n === 'exchange' && route.q.view === 'exchange' && pg === 'dashboard' && false));
    });
    var q = route.q, html = '';
    if (q.coin && COINS[q.coin]) html = drawerCoin(q.coin);
    else if (q.tx) html = drawerTx(q.tx);
    else if (q.contact) html = drawerContact(q.contact);
    else if (q['new']) html = drawerNew();
    else if (q.flow) html = drawerPick(q.flow);
    var open = !!html;
    if (open) { var same = $drawer.getAttribute('data-k') === location.hash.split('&')[0] + (q.view || '') + (q['new'] ? 'n' : ''); $drawer.innerHTML = html; if (keepFocus || same) { var db = $drawer.querySelector('.db'); if (db) db.scrollTop = dScroll; } $drawer.setAttribute('data-k', location.hash.split('&')[0] + (q.view || '') + (q['new'] ? 'n' : '')); }
    $drawer.classList.toggle('on', open); $scrim.classList.toggle('on', open);
    if (fattr) { var el = document.querySelector('[' + fattr[0] + '="' + fattr[1] + '"]'); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) {} } }
    clearInterval(exTimer);
    if (q.view === 'exchange' && ui.ex && ui.ex.step === 'form') exTimer = setInterval(function () { ui.ex.t = ui.ex.t <= 1 ? 30 : ui.ex.t - 1; var r = document.getElementById('qring'), t = document.getElementById('qtxt'); if (r) r.setAttribute('stroke-dashoffset', 50.3 * (1 - ui.ex.t / 30)); if (t) t.textContent = ui.ex.t === 30 ? 'New rate fixed for 30 s' : 'Rate is fixed for ' + ui.ex.t + ' s'; }, 1000);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a, tr[data-go]'); if (!t) { return; }
    if (t.tagName === 'A' && /^#\//.test(t.getAttribute('href') || '') && !t.dataset.go) { e.preventDefault(); if (t.dataset.hcoin) { ui.hCoin = t.dataset.hcoin; ui.hType = 'all'; } var hp = t.getAttribute('href').slice(2).split('?'), hq = {}; (hp[1] || '').split('&').forEach(function (kv) { if (kv) { var p2 = kv.split('='); hq[p2[0]] = p2[1]; } }); ui.send = null; ui.ex = null; go(hp[0], hq); return; }
    var d = t.dataset;
    if (t === $scrim) return;
    if (d.copy != null) { e.stopPropagation(); e.preventDefault(); try { navigator.clipboard.writeText(d.copy); } catch (er) {} toast('Copied'); return; }
    if (d.hcoin) { ui.hCoin = d.hcoin; ui.hType = 'all'; return; }
    if (d.close != null) { ui.form = null; go(route.page, {}); return; }
    if (d.back) {
      if (d.back === 'coin') { ui.send = null; ui.ex = null; go(route.page, { coin: route.q.coin }); }
      if (d.back === 'pick') { ui.send = null; go(route.page, { flow: route.q.view, to: route.q.to }); }
      if (d.back === 'send-form') { ui.send.step = 'form'; render(); }
      return;
    }
    if (d.go) {
      e.preventDefault(); ui.hinted = true;
      if (d.go === 'coin') { ui.send = null; ui.ex = null; go(route.page === 'address-book' && d.view !== 'receive' && !d.to ? 'dashboard' : route.page, { coin: d.id, view: d.view, to: d.to, net: d.net, from: d.from }); if (d.paste && ui.send) { ui.send.addr = d.paste; render(); } else if (d.paste) { sendState(d.id).addr = d.paste; render(); } }
      else if (d.go === 'flow') { ui.send = null; go(route.page, { flow: d.flow }); }
      else if (d.go === 'tx') go(route.page === 'address-book' ? 'history' : route.page, { tx: d.id });
      else if (d.go === 'contact') go('address-book', { contact: d.id });
      else if (d.go === 'new') { ui.form = null; if (route.page !== 'address-book' && !d.addr) { ui.abTab = 'contacts'; } go(d.addr ? route.page : 'address-book', { 'new': 1, addr: d.addr, net: d.net }); }
      else if (d.go === 'new-mine') { toast('New address created'); }
      else if (d.go === 'send-to') {
        var ct = contact(d.id); if (!ct) return;
        ui.send = null; e.stopPropagation();
        if (d.coin) { var tx0 = d.tx && txs.filter(function (z) { return z.id === d.tx; })[0]; go(route.page, { coin: d.coin, view: 'send', to: ct.id, net: tx0 ? tx0.net : null }); return; }
        var combos = []; ct.addrs.forEach(function (a) { netCoins(a.net).forEach(function (c3) { combos.push([c3, a.net]); }); });
        if (combos.length === 1) go(route.page, { coin: combos[0][0], view: 'send', to: ct.id, net: combos[0][1] });
        else go(route.page, { flow: 'send', to: ct.id });
      }
      return;
    }
    if (d.view) { go(route.page, { coin: route.q.coin, view: d.view }); return; }
    if (d.seg) { ui[d.seg] = d.v; render(); return; }
    if (d.tab) { ui.abTab = d.tab; go('address-book', {}); render(); return; }
    if (d.cat) { ui.abCat = d.cat; render(); return; }
    if (d.raddr != null) { go(route.page, { coin: route.q.coin, view: 'receive', net: route.q.net, addr: d.raddr, from: route.q.from }); return; }
    if (d.pick) { var pp = d.pick.split('|'); ui.send.to = pp[0]; ui.send.net = pp[1]; ui.send.addr = ''; render(); return; }
    if (d.rnet) { go(route.page, { coin: route.q.coin, view: 'receive', net: d.rnet, from: route.q.from }); return; }
    if (d.amt) { var k = COINS[ui.send.coin], F0 = feeOf(ui.send.coin, ui.send.net || detect(ui.send.addr) || k.nets[0]), fee = F0.coin === ui.send.coin ? F0.fee : 0; var v = +d.amt === 1 ? k.bal - fee : k.bal * +d.amt; ui.send.amount = String(+v.toFixed(k.dp)); render(); return; }
    if (d.eamt) { var k2 = COINS[ui.ex.from]; ui.ex.amount = String(+(k2.bal * +d.eamt).toFixed(k2.dp)); render(); return; }
    if (d.ficon) { ui.form.icon = d.ficon; render(); return; }
    if (d.fcolor) { ui.form.color = d.fcolor; render(); return; }
    if (d.fcat) { ui.form.cat = d.fcat; render(); return; }
    if (d.fnet) { ui.form.net = d.fnet; ui.form.netManual = !detect(ui.form.addr) || detect(ui.form.addr) !== d.fnet; if (detect(ui.form.addr) === d.fnet) ui.form.netManual = false; render(); return; }
    var act = d.act;
    if (act === 'send-review') { ui.send.step = 'review'; render(); }
    else if (act === 'clear-addr') { ui.send.addr = ''; render(); }
    else if (act === 'fclear') { ui.form.addr = ''; ui.form.netManual = false; render(); }
    else if (act === 'full-addr') { ui.send.full = !ui.send.full; render(); }
    else if (act === 'send-confirm') { ui.send.step = 'done'; render(); }
    else if (act === 'send-again') { ui.send = null; go(route.page, { coin: route.q.coin }); }
    else if (act === 'clear-to') { var keep = route.q.from === 'pick' && route.q.to ? ui.send.to : null; ui.send.to = keep; ui.send.net = null; ui.send.addr = ''; render(); }
    else if (act === 'paste') { var dests = { BTC: 'bc1qz7d4k9m2p6r1t5v8x3b0c7e2g6j9l4n1q5s8u3', ERC20: '0x4A7c2E9b1D6f3C8a0E5d2B9f7A4c1E6b3D8a0F29', TRC20: 'TKr8Wq2Ns5Yv7Bx1Mc4Hd9Fg3Jk6Ze8LpR', BCH: 'bitcoincash:qz8m3k6p9r2t5v8x1b4d7f0h3k6m9p2r5t8v1x4z', ADA: 'addr1qy8ac7qqy0vtulyl7wntmsxc6wex80gvcyjy33qffrhm7sh927ysx5sftuw0dlft05dz3c7revpf7jx0xnlcjz3g69mq4afdhv', DOGE: 'DFr4kN8pQ2tV6xZ9bC3eG5jL7nP1rT4vX6' }; ui.send.addr = dests[COINS[ui.send.coin].nets[0]]; ui.send.to = null; render(); }
    else if (act === 'fpaste') { ui.form.addr = '0x8D2c6F0a4B1e9C7d3A5f8E2b6D0c4A9e1F7b3C66'; ui.form.netManual = false; render(); }
    else if (act === 'ex-swap') { var x = ui.ex.from; ui.ex.from = ui.ex.to; ui.ex.to = x; ui.ex.amount = ''; go(route.page, { coin: ui.ex.from, view: 'exchange' }); }
    else if (act === 'ex-go') { ui.ex.step = 'done'; render(); }
    else if (act === 'ex-again') { ui.ex = null; go(route.page, { coin: route.q.coin }); }
    else if (act === 'save-contact') {
      var f = ui.form, id = 'c' + Date.now();
      if (f.editId) { var ce2 = contact(f.editId); ce2.name = f.name.trim(); ce2.icon = f.icon; ce2.color = f.color; ce2.cat = f.cat; ce2.addrs[0] = { net: f.net, a: f.addr.trim() }; ui.form = null; toast('Changes saved'); go('address-book', { contact: ce2.id }); return; }
      contacts.unshift({ id: id, name: f.name.trim(), icon: f.icon, color: f.color, cat: f.cat, addrs: [{ net: f.net, a: f.addr.trim() }] });
      ui.form = null; ui.abCat = 'All'; ui.abTab = 'contacts'; toast('Contact saved'); go('address-book', { contact: id });
    }
    else if (act === 'reset-h') { ui.hType = 'all'; ui.hCoin = 'all'; ui.hStatus = 'all'; ui.hRange = '30'; ui.hSearch = ''; render(); }
    else if (act === 'export') toast('history-dec-2020.csv downloaded');
    else if (act === 'share') toast('Address and QR ready to share');
    else if (act === 'explorer') toast('Opens in a block explorer');
    else if (act === 'new-cat') toast('Name the new category');
    else if (act === 'edit') { var ce = contact(route.q.contact); ui.form = { editId: ce.id, name: ce.name, icon: ce.icon, color: ce.color, cat: ce.cat, net: ce.addrs[0].net, addr: ce.addrs[0].a, note: '' }; go('address-book', { 'new': 1 }); }
    else if (act === 'delete') toast('Asks before deleting');
  });
  $scrim.addEventListener('click', function () { ui.form = null; go(route.page, {}); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $drawer.classList.contains('on')) { ui.form = null; go(route.page, {}); } });
  document.addEventListener('input', function (e) {
    var el = e.target, d = el.dataset;
    if (d.f) { ui[d.f] = el.value; render(true); }
    else if (d.s) { ui.send[d.s] = el.value; render(true); }
    else if (d.n) { ui.form[d.n] = el.value; if (d.n === 'addr') ui.form.netManual = false; render(true); }
    else if (d.e === 'amount') { ui.ex.amount = el.value; render(true); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target, d = el.dataset;
    if (d.f && el.tagName === 'SELECT') { ui[d.f] = el.value; render(); }
    if (d.e === 'from') { ui.ex.from = el.value; ui.ex.amount = ''; go(route.page, { coin: el.value, view: 'exchange' }); }
    if (d.e === 'to') { ui.ex.to = el.value; render(); }
  });

  window.addEventListener('hashchange', function () { parse(); if (route.q.coin && route.q.view === 'exchange' && !ui.ex) exState(route.q.coin); render(); });

  /* ---------- embed scaling ---------- */
  var embed = /[?&]embed/.test(location.search);
  if (embed) {
    document.documentElement.classList.add('embed');
    var fit = function () { var s = innerWidth / 1280; $app.style.transform = 'scale(' + s + ')'; document.body.style.height = (800 * s) + 'px'; };
    addEventListener('resize', fit); fit();
  }
  // preset states for screenshots: ?state=send-filled | new-filled | exchange-filled
  if (/[?&]shot/.test(location.search)) document.documentElement.classList.add('shot');
  var st = (location.search.match(/state=([\w-]+)/) || [])[1];
  parse();
  if (st === 'send-filled') { sendState('BTC'); ui.send.to = 'alex'; ui.send.net = 'BTC'; ui.send.amount = '0.015'; ui.send.note = 'Concert tickets'; }
  if (st === 'send-wrong') { sendState('BTC'); ui.send.addr = 'TKr8Wq2Ns5Yv7Bx1Mc4Hd9Fg3Jk6Ze8LpR'; }
  if (st === 'new-filled') { formState(); ui.form.name = 'Kate Ivanova'; ui.form.icon = 'star'; ui.form.color = 'violet'; ui.form.cat = 'Friends'; ui.form.addr = '0x8D2c6F0a4B1e9C7d3A5f8E2b6D0c4A9e1F7b3C66'; }
  if (st === 'new-ok') { formState(); ui.form.name = 'Kate Ivanova'; ui.form.icon = 'star'; ui.form.color = 'violet'; ui.form.cat = 'Friends'; ui.form.net = 'BTC'; ui.form.addr = 'bc1qz7d4k9m2p6r1t5v8x3b0c7e2g6j9l4n1q5s8u3'; }
  if (st === 'send-review') { sendState('USDT'); ui.send.to = 'alex'; ui.send.net = 'ERC20'; ui.send.amount = '23'; ui.send.step = 'review'; }
  if (st === 'exchange-filled') { exState('BTC'); ui.ex.amount = '0.05'; }
  if (st === 'hinted') ui.hinted = true;
  render();
})();
