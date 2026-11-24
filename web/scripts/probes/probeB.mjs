import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
console.log(JSON.stringify(await p.evaluate(() => {
  const h1 = document.querySelector('h1');
  const cs = getComputedStyle(h1);
  const r = h1.getBoundingClientRect();
  return { ff: cs.fontFamily, ws: cs.wordSpacing, ls: cs.letterSpacing, wrap: cs.textWrap, h: r.height, w: r.width, lh: cs.lineHeight, fs: cs.fontSize };
})));
await b.close();
