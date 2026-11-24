import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
const d = await p.evaluate(()=>{
  const f=document.querySelector('.hero__figure');
  const r=f.getBoundingClientRect();
  const svg=f.querySelector('svg');
  const sr=svg?svg.getBoundingClientRect():null;
  const cs=getComputedStyle(f);
  return {figTop:Math.round(r.top),figBottom:Math.round(r.bottom),figH:Math.round(r.height),svgH:sr?Math.round(sr.height):null,svgTop:sr?Math.round(sr.top):null,display:cs.display,overflow:cs.overflow};
});
console.log(JSON.stringify(d));
await b.close();
