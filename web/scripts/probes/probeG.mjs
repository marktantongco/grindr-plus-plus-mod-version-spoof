import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h] of [[390,844],[320,700]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const st = e => { const c = getComputedStyle(e); return { h: e.getBoundingClientRect().height, pad: c.paddingBlock||c.padding, gap: c.rowGap, rows: c.gridTemplateRows, mt: c.marginTop, mb: c.marginBottom, pt: c.paddingTop, pb: c.paddingBottom }; };
    const hero = q('.hero');
    return {
      vh: innerHeight,
      hero: st(hero),
      copy: st(q('.hero__copy')),
      fig: st(q('.hero__figure')),
      children: [...hero.children].map(c => ({ cls: c.className, ...st(c) })),
    };
  });
  console.log(w, JSON.stringify(m, null, 1));
  await p.close();
}
await b.close();
