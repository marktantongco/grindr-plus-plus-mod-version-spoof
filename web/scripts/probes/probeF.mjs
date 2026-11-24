import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h] of [[1920,1080],[1440,900],[390,844],[320,700]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const r = e => e ? e.getBoundingClientRect() : null;
    const hero = q('.hero'), fig = q('.hero__figure'), copy = q('.hero__copy');
    const hb = r(hero), fb = r(fig), cb = r(copy);
    return {
      vw: innerWidth, vh: innerHeight,
      heroT: hb?.top, heroH: hb?.height, heroB: hb?.bottom,
      figT: fb?.top, figH: fb?.height, figB: fb?.bottom, figW: fb?.width,
      copyT: cb?.top, copyH: cb?.height, copyB: cb?.bottom,
      docH: document.documentElement.scrollHeight,
      scrollX: document.documentElement.scrollWidth - innerWidth,
      inFold: fb ? Math.max(0, Math.min(fb.bottom, innerHeight) - Math.max(fb.top, 0)) : null,
    };
  });
  console.log(JSON.stringify(m));
  await p.screenshot({ path: `/tmp/opencode/verify/fix-${w}.png`, fullPage: false });
  await p.close();
}
await b.close();
