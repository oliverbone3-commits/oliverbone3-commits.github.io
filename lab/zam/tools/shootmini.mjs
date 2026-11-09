// Screenshot the real Zam app in English (tr.js) at 2x, light and dark, desktop and phone.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const BASE = 'http://localhost:5173/';
const OUT = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',') : null;
fs.mkdirSync(OUT, { recursive: true });
const TR = fs.readFileSync(new URL('./tr.js', import.meta.url), 'utf8');
const b = '038054fc-dca4-4a9c-a267-768252b4c851';
const DOC = '266fd975-e0b7-4c84-b55b-14c2be91220a';
const q = encodeURIComponent('клей');
const shots = [
  ['home', '#/'], ['site', `#/p/${b}`], ['doc', `#/p/${b}/docs/_/${DOC}?hl=${q}`], ['purchases', '#/purchases'],
  ['inbox', '#/inbox'], ['search', `#/search?q=${q}`], ['expenses', `#/p/${b}/expenses`], ['ai', '#/ai'], ['messages', `#/p/${b}/messages`],
];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.evaluateOnNewDocument(TR);
const missed = new Set();
for (const [dev, vp] of [['mini', { width: 390, height: 797, deviceScaleFactor: 3, isMobile: true, hasTouch: true }]]) {
  await page.setViewport(vp);
  for (const theme of ['light']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await page.evaluate(() => { localStorage.setItem('zam.onboarding.v1', 'done'); localStorage.setItem('sidebar.project', '038054fc-dca4-4a9c-a267-768252b4c851'); });
    for (const [name, r] of shots) {
      if (only && !only.includes(name)) continue;
      await page.goto(BASE + r, { waitUntil: 'networkidle0' });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 700));
      await page.evaluate(() => window.__zamTr && window.__zamTr());
      (await page.evaluate(() => { const o = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const t = w.currentNode.nodeValue.trim(); if (/[А-Яа-яЁё]/.test(t)) o.push(t); } return o; })).forEach(s => missed.add(s));
      await page.screenshot({ path: `${OUT}/${dev}-${name}-${theme}.png` });
    }
  }
}
await browser.close();
console.log('missed:', JSON.stringify([...missed]));
