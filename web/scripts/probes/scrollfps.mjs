import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const cdp=await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await p.addInitScript(()=>{window.__f={n:0,max:0,over33:0,last:0};const t=(ts)=>{const f=window.__f;if(f.last){const d=ts-f.last;if(d>f.max)f.max=d;if(d>33.4)f.over33++;}f.last=ts;f.n++;requestAnimationFrame(t);};requestAnimationFrame(t);});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(2000);
await p.evaluate(()=>{window.__f.n=0;window.__f.max=0;window.__f.over33=0;});
const t0=Date.now();
for(let i=0;i<100;i++){ await p.mouse.wheel(0,120); await p.waitForTimeout(100); }
const el=(Date.now()-t0)/1000;
const r=await p.evaluate(()=>window.__f);
console.log(JSON.stringify({sec:+el.toFixed(1),frames:r.n,fps:+(r.n/el).toFixed(1),maxGap:Math.round(r.max),over33:r.over33,dropPct:+((r.over33/r.n)*100).toFixed(1)}));
await b.close();
