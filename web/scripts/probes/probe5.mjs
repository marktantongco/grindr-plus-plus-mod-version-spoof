import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
for (const [w,h] of [[1920,1080],[1440,900],[1280,800],[768,1024],[390,844],[320,720]]) {
  const c = await b.newContext({viewport:{width:w,height:h}});
  const p = await c.newPage();
  await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  const d = await p.evaluate(()=>{
    const g=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {t:Math.round(r.top),b:Math.round(r.bottom),h:Math.round(r.height)}};
    const hero=document.querySelector('.hero').getBoundingClientRect();
    return {heroH:Math.round(hero.height), heroB:Math.round(hero.bottom), copy:g('.hero__copy'), fig:g('.hero__figure'), meta:g('.hero__meta'), inner:innerHeight, sw:document.documentElement.scrollWidth};
  });
  console.log(w+'x'+h, JSON.stringify(d));
  await c.close();
}
await b.close();
