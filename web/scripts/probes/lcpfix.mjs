import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
const cdp=await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
await p.addInitScript(()=>{
  window.__l=[];
  new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__l.push({t:Math.round(e.startTime),s:Math.round(e.size),el:(e.element&&(e.element.tagName+'.'+(e.element.className||'').slice(0,40)))||null,u:(e.url||'').slice(-40)});}}).observe({type:'largest-contentful-paint',buffered:true});
  window.__fcp=0;
  new PerformanceObserver(l=>{for(const e of l.getEntries()){ if(e.name==='first-contentful-paint') window.__fcp=Math.round(e.startTime); }}).observe({type:'paint',buffered:true});
});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'load'});
await p.waitForTimeout(7000);
const r=await p.evaluate(()=>({fcp:window.__fcp,l:window.__l}));
console.log(JSON.stringify(r,null,1));
await b.close();
