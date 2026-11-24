import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const cw = document.documentElement.clientWidth;
  return Array.from(document.querySelectorAll("*")).filter((e) => {
    const r = e.getBoundingClientRect();
    return r.right > cw + 1 && r.width > 0;
  }).slice(0, 12).map((e) => `${e.tagName}.${e.className}:${Math.round(e.getBoundingClientRect().right)}`);
});
console.log(r.join("\n"));
await b.close();
