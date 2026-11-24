import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
const d = await p.evaluate(()=>{
  const el=document.querySelector('.hero');
  const cs=getComputedStyle(el);
  const hits=[];
  for (const sheet of document.styleSheets) {
    let rules; try{rules=sheet.cssRules}catch{continue}
    for (const r of rules) {
      if (!r.selectorText) continue;
      if (!/\.hero(\b|[^_-])/.test(r.selectorText)) continue;
      if (!/display|height|grid/.test(r.cssText)) continue;
      try{ if(el.matches(r.selectorText)) hits.push(r.cssText.slice(0,160)); }catch{}
    }
  }
  return {display:cs.display, height:cs.height, hits};
});
console.log(JSON.stringify(d,null,1));
await b.close();
