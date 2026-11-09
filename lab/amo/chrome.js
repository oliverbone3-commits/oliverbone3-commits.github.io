// Shared chrome: status bar and tab bar (kept in JS so screens stay readable)
const SB = '<svg class="sb" viewBox="0 0 78 13" width="78" height="13" aria-hidden="true"><g fill="currentColor"><rect x="0" y="9" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="7" rx="1"/><rect x="10" y="3" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="13" rx="1"/><path d="M33 4.2a9.5 9.5 0 0 1 13 0l-1.4 1.5a7.4 7.4 0 0 0-10.2 0Zm2.9 3a5.3 5.3 0 0 1 7.2 0l-1.4 1.5a3.2 3.2 0 0 0-4.4 0Zm3.6 3.9 1.4-1.4-1.4-1.4-1.4 1.4Z"/><rect x="52.5" y=".5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="54.5" y="2.5" width="18" height="8" rx="2"/><rect x="76" y="4.5" width="1.6" height="4" rx=".8" opacity=".4"/></g></svg>';
function amoChrome(root) {
root.querySelectorAll('.status').forEach(s => { s.innerHTML = '<span>' + (s.dataset.t || '') + '</span>' + SB; });
const TABS = [['today', 'i-today', 'Today'], ['discover', 'i-discover', 'Discover'], ['studio', 'i-studio', 'Studio'], ['saved', 'i-saved', 'Collection']];
root.querySelectorAll('.tabs').forEach(n => {
  const on = n.dataset.on;
  n.innerHTML = '<div class="pill glass">' + TABS.map(([k, i, l]) =>
    `<div class="tab${k === on ? ' on' : ''}"><svg><use href="#${i}"/></svg>${l}</div>`).join('') +
    '</div><div class="search glass"><svg><use href="#i-search"/></svg></div>';
});
}
if (!window.AMO_FLOW) amoChrome(document);
