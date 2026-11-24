import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
for (const [w,h,n] of [[1920,1080,'wide'],[390,844,'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `/tmp/opencode/verify/now-${n}.png` });
  await p.close();
}
await b.close();
