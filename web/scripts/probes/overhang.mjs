import { chromium } from 'playwright';
const b=await chromium.launch();
for(const [w,h] of [[320,700],[360,640],[320,640],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
  await p.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});await p.waitForTimeout(900);
  const r=await p.evaluate(()=>{const f=document.querySelector('.hero__figure');const fb=f.getBoundingClientRect();return {over:Math.round(fb.bottom-innerHeight),sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth};});
  console.log(w+'x'+h+' overhang='+r.over+' hscroll='+(r.sw>r.cw?'YES':'no'));
  await p.close();
}
await b.close();
