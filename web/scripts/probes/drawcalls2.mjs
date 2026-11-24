import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
await p.addInitScript(()=>{
  // hook WebGLRenderer.info by wrapping WebGLRenderingContext.prototype.draw* 
  window.__dc={calls:0,tris:0,peak:0};
  const wrap=(proto,name,kind)=>{ if(!proto||!proto[name])return; const orig=proto[name]; proto[name]=function(...a){ window.__dc.calls++; if(kind==='tri'){ window.__dc.tris+= (a[2]?a[2]/3:0); } if(window.__dc.calls>window.__dc.peak) window.__dc.peak=window.__dc.calls; return orig.apply(this,a); }; };
  const reset=()=>{window.__dc.calls=0;};
  window.__reset=reset;
  wrap(WebGL2RenderingContext.prototype,'drawArrays','tri');
  wrap(WebGL2RenderingContext.prototype,'drawElements','tri');
  wrap(WebGL2RenderingContext.prototype,'drawArraysInstanced','tri');
  wrap(WebGL2RenderingContext.prototype,'drawElementsInstanced','tri');
});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(3000);
await p.evaluate(()=>window.__reset());
await p.waitForTimeout(34);
const one=await p.evaluate(()=>window.__dc.calls);
console.log('draw_calls_per_frame='+one);
console.log('peak_window='+await p.evaluate(()=>window.__dc.peak));
await b.close();
