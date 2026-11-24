import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
for (const [n,w,h] of [['V5',1920,1080],['V4',1440,900],['V3',1280,800],['V1',390,844]]) {
  const c = await b.newContext({viewport:{width:w,height:h},hasTouch:w<640});
  const p = await c.newPage();
  await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  await p.screenshot({path:'/tmp/opencode/verify/'+n+'.png'});
  await c.close();
}
await b.close();
