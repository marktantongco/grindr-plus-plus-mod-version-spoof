import { chromium } from 'playwright';
const b = await chromium.launch({args:['--enable-webgl','--use-gl=swiftshader']});
const c = await b.newContext({viewport:{width:1920,height:1080}});
const p = await c.newPage();
await p.goto('http://localhost:3100/',{waitUntil:'networkidle'});
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(() => {
  const copy = document.querySelector('.hero__copy');
  const h1 = document.querySelector('h1');
  const cs = getComputedStyle(copy);
  const hs = getComputedStyle(h1);
  const cv = document.querySelector('canvas');
  const f = document.querySelector('.hero__figure');
  return {
    copyAlignContent: cs.alignContent,
    copyRows: cs.gridTemplateRows,
    copyH: copy.getBoundingClientRect().height,
    copyT: copy.getBoundingClientRect().top,
    h1Text: h1.textContent,
    h1Font: hs.fontFamily, h1Size: hs.fontSize, h1WordSpacing: hs.wordSpacing, h1LetterSpacing: hs.letterSpacing,
    h1TextAlign: hs.textAlign,
    figW: f.getBoundingClientRect().width, figH: f.getBoundingClientRect().height,
    canvasW: cv ? cv.getBoundingClientRect().width : null, canvasH: cv ? cv.getBoundingClientRect().height : null,
    canvasCssH: cv ? getComputedStyle(cv).height : null,
  };
}, null), null, 1));
await b.close();
