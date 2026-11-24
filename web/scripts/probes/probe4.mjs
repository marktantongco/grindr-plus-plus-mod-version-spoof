import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const d = await p.evaluate(()=>{
  const el=document.querySelector('.hero');
  const cs=getComputedStyle(el);
  const sheets=[...document.styleSheets].map(s=>({href:s.href, n:(()=>{try{return s.cssRules.length}catch(e){return 'BLOCKED'}})()}));
  return {cls:el.className, display:cs.display, height:cs.height, rows:cs.gridTemplateRows, sheets};
});
console.log(JSON.stringify(d,null,1));
await b.close();
