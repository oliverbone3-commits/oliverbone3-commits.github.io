// Screenshots of the Sofy prototype from file:// in headless Chrome.
//   node tools/shoot.mjs board            -> board.png (whole board, 1x)
//   node tools/shoot.mjs screens [scale]  -> shots/<key>.jpg, one per .screen (default 2x)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer-core'); }
catch { puppeteer = require(process.env.HOME + '/.npm/_npx/8b4cb255bb85bc41/node_modules/puppeteer-core'); }
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL0 = 'file://' + encodeURI(DIR) + '/index.html';
const mode = process.argv[2] || 'board';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
if (mode === 'board') {
  await page.setViewport({ width: 2840, height: 1000, deviceScaleFactor: +(process.argv[3] || 1) });
  await page.goto(URL0, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: process.argv[4] || DIR + '/board.png', fullPage: true });
} else {
  const scale = +(process.argv[3] || 2);
  fs.mkdirSync(DIR + '/shots', { recursive: true });
  await page.setViewport({ width: 402, height: 874, deviceScaleFactor: scale });
  await page.goto(URL0, { waitUntil: 'networkidle0' });
  const keys = await page.$$eval('.screen', els => els.map(e => [...e.classList].find(c => c.startsWith('s-'))).filter(Boolean).map(c => c.slice(2)));
  for (const k of keys) {
    await page.goto(URL0 + '?shot=' + k, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: `${DIR}/shots/${k}.jpg`, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 402, height: 874 } });
  }
  console.log(keys.join(' '));
}
await browser.close();
