import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
const d = await p.evaluate(()=>{
  const f=document.querySelector('.hero__figure');
  const r=f.getBoundingClientRect();
  const inner=f.firstElementChild, ir=inner?inner.getBoundingClientRect():null;
  const cv=f.querySelector('canvas'), cr=cv?cv.getBoundingClientRect():null;
  return {fig:{t:Math.round(r.top),b:Math.round(r.bottom),h:Math.round(r.height),w:Math.round(r.width)},
          firstChild:inner?{cls:inner.className,h:Math.round(ir.height),w:Math.round(ir.width)}:null,
          canvas:cr?{h:Math.round(cr.height),w:Math.round(cr.width),top:Math.round(cr.top)}:null};
});
console.log(JSON.stringify(d,null,1));
await b.close();
