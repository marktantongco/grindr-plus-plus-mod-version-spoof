import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
const m = await p.evaluate(() => {
  const q = s => document.querySelector(s);
  const h = q('.hero');
  const c = getComputedStyle(h);
  const fig = q('.hero__figure');
  const f = getComputedStyle(fig);
  return {
    heroPad: c.paddingBlock, heroGap: c.rowGap, heroRows: c.gridTemplateRows, heroH: h.getBoundingClientRect().height,
    figMax: f.maxHeight, figAr: f.aspectRatio, figH: fig.getBoundingClientRect().height,
    sheets: [...document.styleSheets].map(s => { try { return [...s.cssRules].filter(r => r.conditionText).map(r => r.conditionText).join('|'); } catch { return 'x'; } }),
  };
});
console.log(JSON.stringify(m));
await b.close();
