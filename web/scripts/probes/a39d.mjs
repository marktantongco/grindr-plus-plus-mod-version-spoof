import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const logs=[];
p.on('console',m=>logs.push(m.type()+':'+m.text().slice(0,120)));
p.on('pageerror',e=>logs.push('PE:'+e.message.split('\n')[0]));
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
await p.waitForTimeout(2500);
console.log(logs.join('\n'));
await b.close();
