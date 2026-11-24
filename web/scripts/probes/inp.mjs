import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const cdp=await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await p.addInitScript(()=>{
  window.__evt=[];
  new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__evt.push({n:e.name,d:Math.round(e.duration),p:Math.round(e.processingStart),s:Math.round(e.startTime)});}}).observe({type:'event',buffered:true,durationThreshold:16});
  window.__paint=[];
  new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__paint.push({n:e.name,t:Math.round(e.startTime)});}}).observe({type:'paint',buffered:true});
});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
// scroll to CTA row, then tap it for real
await p.evaluate(()=>document.querySelector('.hero__actions')?.scrollIntoView({block:'center'}));
await p.waitForTimeout(600);
const box=await p.evaluate(()=>{const a=document.querySelector('.hero__actions a'); if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,tag:a.tagName,href:a.getAttribute('href')};});
console.log('TARGET='+JSON.stringify(box));
if(box){ await p.mouse.click(box.x,box.y); }
await p.waitForTimeout(1500);
const r=await p.evaluate(()=>({evt:window.__evt,paint:window.__paint}));
console.log('EVENTS='+JSON.stringify(r.evt));
console.log('PAINTS='+JSON.stringify(r.paint));
const clicks=r.evt.filter(e=>e.n==='click'||e.n==='pointerup');
console.log('CLICK_PRESENTATION_DELAY_MS='+(clicks.length?clicks.map(c=>c.d).join(','):'none'));
console.log('URL='+p.url());
await b.close();
