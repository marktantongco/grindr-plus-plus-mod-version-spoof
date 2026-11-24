import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h] of [[390,844],[320,700],[360,640]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(700);
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const copy = q('.hero__copy');
    return {
      vh: innerHeight,
      kids: [...copy.children].map(k => [k.className || k.tagName, Math.round(k.getBoundingClientRect().height)]),
      copyH: Math.round(copy.getBoundingClientRect().height),
      figH: Math.round(q('.hero__figure').getBoundingClientRect().height),
      figB: Math.round(q('.hero__figure').getBoundingClientRect().bottom),
      prose: getComputedStyle(q('.prose')).fontSize,
      h1: getComputedStyle(q('h1')).fontSize,
    };
  });
  console.log(w + 'x' + h, JSON.stringify(m));
  await p.close();
}
await b.close();
