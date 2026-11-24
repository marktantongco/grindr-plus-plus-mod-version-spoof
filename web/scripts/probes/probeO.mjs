import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h] of [[320,700],[360,640]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(600);
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const c = getComputedStyle(q('.hero'));
    const a = getComputedStyle(q('.hero__actions'));
    const copy = q('.hero__copy');
    return {
      vh: innerHeight, heroH: q('.hero').getBoundingClientRect().height,
      pad: c.paddingBlock, gap: c.rowGap, rows: c.gridTemplateRows,
      actW: q('.hero__actions').getBoundingClientRect().width, actFlexWrap: a.flexWrap,
      actKids: [...q('.hero__actions').children].map(k => Math.round(k.getBoundingClientRect().width)),
      copyW: copy.getBoundingClientRect().width,
      labelW: Math.round(q('.label').getBoundingClientRect().width),
      metaW: Math.round(q('.hero__meta').getBoundingClientRect().width),
      copyH: copy.getBoundingClientRect().height,
    };
  });
  console.log(w+'x'+h, JSON.stringify(m));
  await p.close();
}
await b.close();
