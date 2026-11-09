import puppeteer from 'puppeteer-core';
const B = 'http://localhost:8794/site/lab/zam/chat.html';
const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await br.newPage();
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
for (const s of ['group', 'cards', 'ask', 'digest']) {
  await p.goto(`${B}?shot=${s}`, { waitUntil: 'networkidle0' });
  await p.screenshot({ path: `shots/phone-chat-${s}.png` });
}
await br.close();
