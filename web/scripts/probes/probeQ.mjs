import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h] of [[1920,1080],[1440,900],[1280,800],[1024,768],[900,800],[390,844],[360,640],[320,700]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const h = document.querySelector('.hero');
    const fig = document.querySelector('.hero__figure');
    const copy = document.querySelector('.hero__copy');
    return {
      vh: innerHeight, heroH: Math.round(h.getBoundingClientRect().height),
      rows: getComputedStyle(h).gridTemplateRows, pad: getComputedStyle(h).paddingBlock,
      copyB: Math.round(copy.getBoundingClientRect().bottom),
      figT: Math.round(fig.getBoundingClientRect().top), figB: Math.round(fig.getBoundingClientRect().bottom),
      figInFold: Math.round(Math.max(0, Math.min(fig.getBoundingClientRect().bottom, innerHeight) - Math.max(fig.getBoundingClientRect().top, 0))),
      sx: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(w+'x'+h, JSON.stringify(m));
  await p.close();
}
await b.close();
