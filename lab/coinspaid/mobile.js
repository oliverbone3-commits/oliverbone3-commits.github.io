/* CoinsPaid Wallet — iPhone, 2020: the six screens that have a pair in the App Store listing and the Figma file. */
(function () {
  'use strict';
  var P = {
    wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M16 12h2M3 9h13"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    ex: '<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.6M20 4v4.6h-4.6M20 12a8 8 0 0 1-13.7 5.7L4 15.4M4 20v-4.6h4.6"/>',
    book: '<path d="M2 5c3-1.3 6-1.3 10 1 4-2.3 7-2.3 10-1v14c-3-1.3-6-1.3-10 1-4-2.3-7-2.3-10-1zM12 6v14"/>',
    me: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>', up: '<path d="M12 19V5M5 12l7-7 7 7"/>', down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    edit: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M20 6 9 17l-5-5"/>', shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    chevr: '<path d="m9 6 6 6-6 6"/>', chev: '<path d="m6 9 6 6 6-6"/>', swapv: '<path d="M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4"/>',
    gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
    del: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>', bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>', home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>'
  };
  function I(n, c) { return '<svg class="i' + (c ? ' ' + c : '') + '" viewBox="0 0 24 24">' + P[n] + '</svg>'; }
  function coin(c) { return '<img src="' + window.COIN_ICONS[c] + '" alt="' + c + '">'; }
  function sb() { return '<div class="sb"><span>9:41</span><span class="r"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.5c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.8 10.2 10.2 0 0 0 1.3 3.7l1.2 1.2c1.6-1.5 3.7-2.4 6-2.4zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8.5 4.2a6.8 6.8 0 0 0-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4zm0 3.4c.5 0 1 .2 1.3.5L8.5 11 7.2 9.8c.3-.3.8-.5 1.3-.5z"/></svg><svg width="25" height="12" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor"/></svg></span></div>'; }
  function tabbar(on) { return '<nav class="tabbar">' + [['wallet', 'Wallet'], ['clock', 'Activity'], ['ex', 'Exchange'], ['book', 'Address Book'], ['me', 'Account']].map(function (t) { return '<span' + (t[1] === on ? ' class="on"' : '') + '>' + I(t[0]) + t[1] + '</span>'; }).join('') + '</nav>'; }
  function phone(cls, inner) { return '<div class="phone' + (cls ? ' ' + cls : '') + '">' + sb() + inner + '<div class="home-ind"></div></div>'; }
  function nav(title, sub, left, right) { return '<div class="nav"><span class="ic">' + (left ? I(left) : '') + '</span><span class="t"><b>' + (title || '') + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</span><span class="ic">' + (right || []).map(function (r) { return I(r); }).join('') + '</span></div>'; }
  function crow(c, name, a, e) { return '<div class="coin">' + (c === 'EUR' ? '<span class="fiat">€</span>' : coin(c)) + '<span class="n">' + name + '</span><span class="a"><b>' + a + '</b><span>' + e + '</span></span></div>'; }
  function ct(lead, name, addr, extra) { return '<div class="ct">' + lead + '<span><b>' + name + '</b><span class="ad">' + addr + '</span></span>' + (extra || '<span></span>') + '</div>'; }
  function tx(lead, t, d, a, e, pos) { return '<div class="tx">' + lead + '<span><b>' + t + '</b><span>' + d + '</span></span><span class="a"><b' + (pos ? ' class="pos"' : '') + '>' + a + '</b><span>' + e + '</span></span></div>'; }

  var S = [];

  S.push(['Wallet', phone('',
    nav('', '', null, ['scan', 'filter']) +
    '<div class="total"><b>€47,881.17</b><span>Total balance</span></div>' +
    '<div class="kyc">' + I('shield') + 'Verify your identity<span class="x">' + I('chevr', 's') + '</span></div>' +
    '<div class="tabs3"><span class="on">All</span><span>Crypto</span><span>Fiat</span></div>' +
    crow('BTC', 'Bitcoin', '1.44365051 BTC', '€43,607.78') +
    crow('ETH', 'Ethereum', '0.9018824 ETH', '€3,742.83') +
    crow('ADA', 'Cardano', '100.00 ADA', '€116.62') +
    crow('USDT', 'Tether USD', '45.907587 USDT', '€40.74') +
    crow('EUR', 'Euro', '€100.00', 'Fiat') +
    tabbar('Wallet'))]);

  S.push(['Send Bitcoin', phone('',
    nav('Send Bitcoin', 'Balance: 1.44365051 BTC', 'back') +
    '<div class="amt"><div class="l"><span>Amount + Fee 0.00004 BTC</span><span>€302.11</span></div><div class="r"><span class="c">' + coin('BTC') + 'BTC' + I('chev', 's') + '</span><span class="v">0.01</span></div></div>' +
    '<div class="seg"><span>New Address</span><span class="on">Contact</span></div>' +
    '<div class="search">' + I('search', 's') + 'Search contacts</div>' +
    ct('<span class="ava">S' + coin('BTC') + '</span>', 'Satoshi', '4AG82Ae9HETTs2GBPqHFF9RSZx8bQ1nKc', '<span class="chk">' + I('check') + '</span>') +
    ct('<span class="ava">A' + coin('BTC') + '</span>', 'Alex', 'mhbGQeiiYwE3grYaD1dXLhp81hps5StCoS') +
    ct('<span class="ava">W' + coin('BTC') + '</span>', 'Worm Wasser', '1M6owiVL9pqMompMfan3Zwk3irob79Kvty') +
    '<div class="bottom"><div class="btn">Send</div></div>')]);

  S.push(['Exchange', phone('dark',
    nav('Exchange', 'Balance: 1.44365051 BTC', 'gear', ['scan']) +
    '<div class="ex"><div style="height:18px"></div><div class="l"><span>Spend</span><span>10,731.27 EUR</span></div><div class="r"><span class="c">' + coin('BTC') + 'BTC' + I('chev', 's') + '</span><span class="v cur">1</span></div>' +
    '<hr><div class="sw"><span>' + I('swapv', 's') + '</span></div>' +
    '<div class="l"><span>Get</span><span>10,677.62 EUR</span></div><div class="r"><span class="c">' + coin('ETH') + 'ETH' + I('chev', 's') + '</span><span class="v">32.0092698</span></div>' +
    '<div class="fx"><span>Fee 0.16004635 ETH</span><span>1 BTC = 32.00926982 ETH</span></div></div>' +
    '<div class="kb"><div class="row q"><span>MIN</span><span>HALF</span><span>MAX</span></div>' +
    [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', I('del')]].map(function (r) { return '<div class="row">' + r.map(function (k) { return '<span>' + k + '</span>'; }).join('') + '</div>'; }).join('') +
    '<div class="go"><svg class="ring" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="none" stroke="rgb(255 255 255 / .3)" stroke-width="2.5"/><circle cx="14" cy="14" r="12" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="75.4" stroke-dashoffset="28" transform="rotate(-90 14 14)"/><text x="14" y="17.5" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="Inter">38</text></svg><b>Exchange</b></div></div>')]);

  S.push(['Address Book · My Addresses', phone('',
    nav('Address Book') +
    '<div class="seg" style="margin-top:4px"><span>Contacts</span><span class="on">My Addresses</span></div>' +
    '<div class="search">' + I('search', 's') + 'Search<span class="f">' + I('filter', 's') + '</span></div>' +
    ct('<span class="ava ic">' + I('bolt') + coin('BTC') + '</span>', 'Freelance', '2N8QwhHhqFNVZjToMuAfmFMGaLtUejVaM') +
    ct('<span class="ava ic">' + I('bag') + coin('BTC') + '</span>', 'Secret Project', '2NAJTzWuuaw8xh1Jo2QHNpY5b1gbqAXGY') +
    ct('<span class="ava ic">' + I('home') + coin('BTC') + '</span>', 'Default Address', '2MypGWwczsRKMEcAz7tFKNFgGzwA7594eL') +
    ct('<span class="ava ic">' + I('home') + coin('ETH') + '</span>', 'Default Address', '0x5E2a8C4f1B9d7A3e6C0b2D8f4A1c9E7b3D5f0A16') +
    '<span class="pill">' + I('plus', 's') + 'Add address</span>' +
    tabbar('Address Book'))]);

  S.push(['Contact', phone('',
    nav('', '', 'back', ['edit', 'trash']) +
    '<div class="chead"><span class="ava">W</span><h3>Worm Wasser</h3><p>1M6owiVL9pqMompMfan3Zwk3irob79Kvty</p></div>' +
    '<div style="margin:0 20px 14px"><div class="btn">' + I('up', 's') + 'Send</div></div>' +
    tx('<span class="o in">' + I('down') + '</span>', 'Receive', '25 Jan, 15:20', '+0.04 BTC', '€1,208.40') +
    tx('<span class="o in">' + I('down') + '</span>', 'Receive', '29 Oct 2020, 14:48', '+0.04 BTC', '€439.60') +
    tx('<span class="o out">' + I('up') + '</span>', 'Sent', '29 Oct 2020, 14:48', '−0.04 BTC', '€439.60') +
    tabbar('Address Book'))]);

  S.push(['Activity', phone('',
    '<div class="h1">Activity</div>' +
    '<div class="day">Today</div>' +
    tx('<span class="ava">CJ' + coin('BTC') + '</span>', 'Carl Johnes', '15:20', '−0.035 BTC', '€1,057.39') +
    tx('<span class="o in">' + I('down') + '</span>', 'Receive', '12:04', '+0.035 BTC', '€1,057.39', true) +
    tx('<span class="o sw">' + I('ex') + '</span>', 'Exchange', '09:41', '+1.1203 ETH', '−0.035 BTC') +
    '<div class="day">Yesterday</div>' +
    tx('<span class="o out">' + I('up') + '</span>', 'Sent', '18:32', '−0.035 BTC', '€1,057.39') +
    tx('<span class="o sw">' + I('ex') + '</span>', 'Exchange', '11:15', '+45.90 USDT', '−0.0013 BTC') +
    '<span class="fab">' + I('filter') + '</span>' +
    tabbar('Activity'))]);

  var only = (location.search.match(/only=(\d+)/) || [])[1];
  if (only) { document.getElementById('board').outerHTML = S[only - 1][1]; return; }
  document.getElementById('board').innerHTML = S.map(function (s) { return '<figure>' + s[1] + '<figcaption>' + s[0] + '</figcaption></figure>'; }).join('');
})();
