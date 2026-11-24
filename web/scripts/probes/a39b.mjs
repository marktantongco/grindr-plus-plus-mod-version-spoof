import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{
  const g=HTMLCanvasElement.prototype.getContext;
  let used=false;
  HTMLCanvasElement.prototype.getContext=function(t,o){
    const r=g.call(this,t,o);
    if(r&&(t==='webgl2'||t==='webgl')&&!used&&this.isConnected){ used=true; r.getExtension=()=>{ throw new Error('forced-renderer-throw'); }; }
    return r;
  };
});
await p.goto('http://127.0.0.1:3100/',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(3000);
const r=await p.evaluate(()=>{const f=document.querySelector('.hero__figure');return {mode:f?f.dataset.canvas:'NOFIGURE',h1:!!document.querySelector('h1'),cta:!!document.querySelector('.hero__actions a'),svg:f?!!f.querySelector('svg'):false,body:document.body.textContent.length};});
console.log(JSON.stringify({...r,errs}));
await p.screenshot({path:'/tmp/opencode/verify/a39-throw.png'});
await b.close();
