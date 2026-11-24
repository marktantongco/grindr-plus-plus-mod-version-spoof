import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const h = document.querySelector('.hero');
  const cs = getComputedStyle(h);
  const copy = document.querySelector('.hero__copy');
  const ccs = getComputedStyle(copy);
  const kids = [...copy.children].map(k => [k.tagName, k.className, Math.round(k.getBoundingClientRect().height)]);
  return {
    heroH: h.getBoundingClientRect().height,
    pad: cs.paddingBlock, gap: cs.rowGap, rows: cs.gridTemplateRows, height: cs.height, box: cs.boxSizing,
    copyH: copy.getBoundingClientRect().height, copyRows: ccs.gridTemplateRows, copyPad: ccs.paddingBlock,
    kids,
    sumKids: kids.reduce((a, k) => a + k[2], 0),
    innerH: h.clientHeight - 64 - 96,
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
