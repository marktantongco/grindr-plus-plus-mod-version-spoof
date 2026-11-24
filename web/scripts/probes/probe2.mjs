import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const hero = document.querySelector(".hero");
  const hcs = getComputedStyle(hero);
  return {
    sizeControl: cs.getPropertyValue("--size-control"),
    space1: cs.getPropertyValue("--space-1"),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    htmlBg: getComputedStyle(document.documentElement).backgroundColor,
    heroPadTop: hcs.paddingTop,
    heroPadBottom: hcs.paddingBottom,
    heroPadBlock: hcs.paddingBlock,
    btnH: document.querySelector(".btn--primary").getBoundingClientRect().height,
    sheets: Array.from(document.styleSheets).map(s => s.href || "inline").slice(0,6),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
