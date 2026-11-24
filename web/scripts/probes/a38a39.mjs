import { chromium } from 'playwright';
const b=await chromium.launch();
// A38: force WebGL off
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push('PE:'+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE:'+m.text())});
await p.addInitScript(()=>{const g=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,o){if(t==='webgl'||t==='webgl2'||t==='experimental-webgl')return null;return g.call(this,t,o);};});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const a38=await p.evaluate(()=>({poster:!!document.querySelector('img[data-poster],.hero__figure img'),h1:(document.querySelector('h1')||{}).textContent?.slice(0,30),cta:!!document.querySelector('.hero__actions a'),canvas:!!document.querySelector('canvas')}));
console.log('A38 '+JSON.stringify({...a38,errs}));
await p.close();
// A39: force renderer throw
const p2=await b.newPage({viewport:{width:390,height:844}});const e2=[];p2.on('pageerror',e=>e2.push('PE:'+e.message));
await p2.addInitScript(()=>{const g=HTMLCanvasElement.prototype.getContext;let n=0;HTMLCanvasElement.prototype.getContext=function(t,o){const r=g.call(this,t,o);if((t==='webgl2'||t==='webgl')&&r&&n===0){n++;const P=Object.getPrototypeOf(r);const orig=P.getParameter;P.getParameter=function(x){if(x===7938)throw new Error('forced');return orig.call(this,x);};}return r;};});
await p2.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});await p2.waitForTimeout(1500);
const a39=await p2.evaluate(()=>({cta:!!document.querySelector('.hero__actions a'),h1:!!document.querySelector('h1'),usable:document.documentElement.scrollHeight>800}));
console.log('A39 '+JSON.stringify({...a39,errs:e2}));
await b.close();
