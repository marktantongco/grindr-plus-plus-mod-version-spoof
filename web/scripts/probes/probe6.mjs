import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(900);
const d = await p.evaluate(()=>{
  const f=document.querySelector('.hero__figure'), cs=getComputedStyle(f);
  const h=document.querySelector('.hero'), hs=getComputedStyle(h);
  return {figAspect:cs.aspectRatio, figMaxH:cs.maxHeight, figAlignSelf:cs.alignSelf, figH:cs.height, heroRows:hs.gridTemplateRows, heroH:hs.height};
});
console.log(JSON.stringify(d));
await b.close();
