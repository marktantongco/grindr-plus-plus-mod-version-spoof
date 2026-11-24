import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const fig = document.querySelector('.hero__figure');
  const h = document.querySelector('.hero');
  const out = [];
  out.push(['base', h.getBoundingClientRect().height, getComputedStyle(h).paddingBlock, getComputedStyle(h).gridTemplateRows, fig.getBoundingClientRect().height, getComputedStyle(fig).maxHeight]);
  // force the mobile hero rules by hand to see whether the padding change is what matters
  h.style.paddingBlock = '64px 96px';
  h.style.gap = '24px';
  fig.style.maxHeight = 'none';
  out.push(['forced', h.getBoundingClientRect().height, getComputedStyle(h).paddingBlock, getComputedStyle(h).gridTemplateRows, fig.getBoundingClientRect().height]);
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
