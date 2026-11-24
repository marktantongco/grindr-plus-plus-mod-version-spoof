import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 320, height: 700 } });
await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(() => ({
  mq: matchMedia('(max-height: 760px)').matches,
  vh: innerHeight,
  pad: getComputedStyle(document.querySelector('.hero')).paddingBlock,
}))));
await b.close();
