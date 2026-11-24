import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
const d = await p.evaluate(()=>{
  const f=document.querySelector('.hero__figure'), cs=getComputedStyle(f);
  const h=document.querySelector('.hero'), hs=getComputedStyle(h);
  const cp=document.querySelector('.hero__copy'), cps=getComputedStyle(cp);
  return {fig:{ar:cs.aspectRatio,h:cs.height,maxH:cs.maxHeight,alignSelf:cs.alignSelf,display:cs.display},
          hero:{rows:hs.gridTemplateRows,align:hs.alignItems,h:hs.height},
          copy:{h:cps.height,alignContent:cps.alignContent},
          figRect:f.getBoundingClientRect().height, copyRect:cp.getBoundingClientRect().height};
});
console.log(JSON.stringify(d,null,1));
await b.close();
