import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(700);
const r = await p.evaluate(() => {
  const h = document.querySelector('.hero');
  const fig = document.querySelector('.hero__figure');
  const copy = document.querySelector('.hero__copy');
  const log = [];
  const snap = t => log.push([t, Math.round(fig.getBoundingClientRect().height), Math.round(h.getBoundingClientRect().height), getComputedStyle(h).gridTemplateRows]);
  snap('base');
  h.style.height = 'auto';
  snap('heroAuto');
  h.style.height = '';
  copy.style.paddingTop = '0px';
  snap('copyPad0');
  copy.style.paddingTop = '';
  fig.style.marginInline = '0';
  snap('noMarginInline');
  fig.style.marginInline = '';
  // does a fixed row instead of 1fr resolve?
  h.style.gridTemplateRows = 'auto 260px';
  snap('fixedRow260');
  return log;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
