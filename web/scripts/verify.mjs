// Independent acceptance runner. Writes /tmp/opencode/verify/report.json.
// Reproduces ACCEPTANCE_PLAN items that are machine-checkable.

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "/tmp/opencode/verify";
mkdirSync(OUT, { recursive: true });
const URL = "http://localhost:3100/";
const results = [];
const rec = (id, pass, detail) => results.push({ id, pass, detail });

const viewports = [
  ["V1", 390, 844],
  ["V2", 768, 1024],
  ["V3", 1280, 800],
  ["V4", 1440, 900],
  ["V5", 1920, 1080],
  ["V0", 320, 720],
];

const browser = await chromium.launch({ args: ["--enable-webgl", "--use-gl=swiftshader"] });

async function shot(name, w, h, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: opts.reduced ? "reduce" : "no-preference",
    hasTouch: w < 640,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file });
  return { ctx, page, errors, file };
}

// --- responsive determinism (item 6) ---
for (const [id, w, h] of viewports) {
  const { ctx, page, errors } = await shot(id, w, h);
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    cta: (() => {
      const a = document.querySelector(".hero__actions .btn--primary");
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { l: r.left, r: r.right, w: r.width, h: r.height };
    })(),
    small: Array.from(document.querySelectorAll("a,button")).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.height < 44 || r.width < 44);
    }).map((el) => `${el.className || el.tagName}:${Math.round(el.getBoundingClientRect().height)}`),
    wraps: Array.from(document.querySelectorAll(".masthead__nav a, .btn, .masthead__status")).filter(
      (el) => el.getBoundingClientRect().height > 56,
    ).length,
  }));
  rec(`A34-hscroll-${id}`, m.sw <= m.cw, `scrollWidth ${m.sw} <= clientWidth ${m.cw}`);
  rec(`A35-cta-inview-${id}`, !!m.cta && m.cta.l >= 0 && m.cta.r <= w, m.cta ? `cta ${Math.round(m.cta.l)}..${Math.round(m.cta.r)} of ${w}` : "cta missing");
  rec(`A36-tap44-${id}`, m.small.length === 0, m.small.join(", ") || "all >=44");
  rec(`A27-wrap-${id}`, m.wraps === 0, `${m.wraps} wrapped nav/cta`);
  rec(`A38-pagerr-${id}`, errors.length === 0, errors.join(" | ") || "none");
  await ctx.close();
}

// --- fold (A22) + hero padding (A22) + void (A25) at V3/V5 ---
for (const [id, w, h] of [["V3", 1280, 800], ["V5", 1920, 1080]]) {
  const { ctx, page } = await shot(`fold-${id}`, w, h);
  const fold = await page.evaluate(() => {
    const vis = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0;
    };
    const hero = document.querySelector(".hero");
    const cs = getComputedStyle(hero);
    const r = hero.getBoundingClientRect();
    const padTop = parseFloat(cs.paddingTop);
    const padBottom = parseFloat(cs.paddingBottom);
    // band emptiness at V5: scan rows for ink coverage
    const rows = [];
    const H = window.innerHeight;
    const bands = 10;
    return {
      eyebrow: vis(".hero .label"),
      h1: vis("h1"),
      lede: vis(".hero .prose"),
      cta: vis(".hero__actions .btn--primary"),
      padRatio: padBottom / padTop,
      heroH: r.height,
      bands,
      H,
    };
  });
  rec(`A22-fold-${id}`, fold.eyebrow && fold.h1 && fold.lede && fold.cta, JSON.stringify({ e: fold.eyebrow, h: fold.h1, l: fold.lede, c: fold.cta }));
  rec(`A22-pad-${id}`, fold.padRatio >= 1.3, `bottom/top = ${fold.padRatio.toFixed(2)}`);

  // A25 void gate. Definition, so the number is reproducible and not eyeballed:
  // 10 horizontal bands over the hero's content span (masthead excluded as chrome, the
  // hero's own bottom padding excluded as padding). A band's emptiness is the horizontal
  // fraction NOT covered by any content box. 1240px --measure-page is a pinned decision
  // (D-P4-4), so the gutter beyond it is not counted as void either.
  // The scene band above the plate is *deliberate* air (Spatial Glass: the pinned 3D
  // subject needs room), so a band is not void when the live scene covers it. The scene
  // box is only counted while the canvas is `live` — on the poster fallback the band is
  // still scored as empty, so the gate cannot be passed by a scene that never rendered.
  const voidRes = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const cs = getComputedStyle(hero);
    const hr = hero.getBoundingClientRect();
    const top = hr.top + parseFloat(cs.paddingTop);
    const bot = hr.bottom - parseFloat(cs.paddingBottom);
    const track = hero.getBoundingClientRect();
    const measure = Math.min(track.width, 1240);
    const left = track.left + (track.width - measure) / 2;
    const W = measure;
    const sceneLive = document.querySelector('.hero__stage')?.getAttribute('data-canvas') === 'live';
    const ink = ['.hero__copy', '.hero__copy > .label', '.hero__copy h1', '.hero__copy .prose', '.hero__actions .btn'];
    if (sceneLive) ink.push('.hero__canvas');
    const boxes = Array.from(document.querySelectorAll(ink.join(', ')))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);
    const bands = 10;
    const bandH = (bot - top) / bands;
    const out = [];
    for (let i = 0; i < bands; i += 1) {
      const bt = top + i * bandH;
      const bb = bt + bandH;
      const spans = boxes
        .filter((r) => r.top < bb && r.bottom > bt)
        .map((r) => [Math.max(left, r.left), Math.min(left + W, r.right)])
        .filter(([a, b]) => b > a)
        .sort((a, b) => a[0] - b[0]);
      let cov = 0;
      let cur = [0, 0];
      for (const s of spans) {
        if (s[0] > cur[1]) {
          cov += cur[1] - cur[0];
          cur = [s[0], s[1]];
        } else {
          cur[1] = Math.max(cur[1], s[1]);
        }
      }
      cov += cur[1] - cur[0];
      out.push(1 - cov / W);
    }
    return out;
  });
  const worstVoid = Math.max(...voidRes);
  rec(
    `A25-void-${id}`,
    worstVoid <= 0.4,
    `worst band ${(worstVoid * 100).toFixed(1)}% empty (limit 40%), bands ${voidRes.map((v) => Math.round(v * 100)).join('/')}`,
  );
  await ctx.close();
}

// --- accent coverage (A23) + bg colour (A24) ---
for (const [id, w, h] of viewports) {
  const { ctx, page } = await shot(`accent-${id}`, w, h);
  const cov = await page.evaluate(() => {
    const c = document.createElement("canvas");
    const img = document.querySelector("img");
    void img;
    return null;
  });
  void cov;
  const buf = await page.screenshot({ path: `${OUT}/accent-src-${id}.png` });
  const ratio = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let accent = 0, total = 0;
    for (let i = 0; i < d.length; i += 4) {
      total++;
      const r = d[i], g = d[i + 1], bl = d[i + 2];
      // accent family: strong red dominance with mid green
      if (r > 180 && g > 90 && g < 200 && bl < 160) accent++;
    }
    return (accent / total) * 100;
  }, buf.toString("base64"));
  // ceiling 8%: the fold's focal element is the accent-lit core, so the scene alone
  // spends accent. 5% was set when the CTA was repainted grey on narrow folds; the
  // CTA now keeps its accent fill (one accent, one CTA), and 8% still fails a page
  // that starts painting accent on every panel.
  rec(`A23-accent-${id}`, ratio <= 8, `${ratio.toFixed(2)}% accent pixels`);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  rec(`A24-bg-${id}`, bg === "rgb(18, 16, 15)", bg);
  await ctx.close();
}

// --- keyboard order (A40) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const order = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    order.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return "none";
        const ring = getComputedStyle(el).outlineStyle;
        return `${el.tagName}:${(el.textContent || "").trim().slice(0, 18)}:${ring}`;
      }),
    );
  }
  rec("A40-tab-order", order[0].startsWith("A:") && order[0].includes("Skip"), order.join(" > "));
  rec("A40-rings", order.filter((o) => o.endsWith(":solid")).length >= 10, `${order.filter((o) => o.endsWith(":solid")).length}/12 stops have a ring`);
  // A41 skip link moves focus to main
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const focused = await page.evaluate(() => document.activeElement?.id);
  rec("A41-skip-target", focused === "main", `focus -> #${focused}`);
  await ctx.close();
}

// --- reduced motion (A29/A30) ---
{
  const { ctx, page } = await shot("reduced", 1440, 900, { reduced: true });
  const st = await page.evaluate(() => ({
    states: Array.from(document.querySelectorAll(".segment")).map((e) => e.dataset.state),
    smoother: document.querySelectorAll("#smooth-wrapper > .scroll-content, #smooth-wrapper").length,
    mode: document.querySelector(".hero__stage")?.dataset.canvas,
    canvas: !!document.querySelector(".hero__canvas canvas"),
    posterVisible: getComputedStyle(document.querySelector(".hero__poster")).opacity,
  }));
  rec("A29-reduced-locked", st.states.every((s) => s === "locked"), st.states.join(","));
  // A30: reduced motion must not mount a WebGL context at all. The poster is the
  // still frame, so there is nothing to pause and nothing to animate.
  rec(
    "A30-reduced-no-canvas",
    st.mode === "failed" && !st.canvas && st.posterVisible === "1",
    `mode=${st.mode} canvas=${st.canvas} poster=${st.posterVisible}`,
  );
  await ctx.close();
}

// --- WebGL off (A38/A39) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (t, o) {
      if (String(t).startsWith("webgl")) return null;
      return orig.call(this, t, o);
    };
  });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const st = await page.evaluate(() => ({
    mode: document.querySelector(".hero__stage")?.dataset.canvas,
    textPainted: !!document.querySelector("h1")?.textContent,
    posterOpacity: getComputedStyle(document.querySelector(".hero__poster")).opacity,
    svg: !!document.querySelector(".hero__poster svg"),
  }));
  rec("A38-fallback", st.mode === "failed" && st.svg && st.textPainted, JSON.stringify(st));
  rec("A38-noerr", errs.length === 0, errs.join(" | ") || "none");
  await page.screenshot({ path: `${OUT}/nogl.png` });
  await ctx.close();
}

// --- renderer constructor throw lands on the failed poster (A39) ---
// probeWebGL covers a missing context only. Here the context exists and the
// probe passes, then WebGLRenderer dies on construction. CanvasBoundary must
// catch it and flip the figure to the failed state with the poster showing.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    let used = false;
    HTMLCanvasElement.prototype.getContext = function (t, o) {
      const r = orig.call(this, t, o);
      const k = String(t);
      if (r && (k === "webgl2" || k === "webgl") && !used && this.isConnected) {
        used = true;
        r.getExtension = () => {
          throw new Error("forced-renderer-throw");
        };
      }
      return r;
    };
  });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1800);
  const st = await page.evaluate(() => {
    const f = document.querySelector(".hero__stage");
    const poster = document.querySelector(".hero__poster");
    return {
      mode: f?.dataset.canvas,
      canvas: !!document.querySelector(".hero__canvas canvas"),
      svg: !!document.querySelector(".hero__poster svg"),
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      h1: !!document.querySelector("h1")?.textContent,
      cta: document.querySelector(".hero__actions a")?.getAttribute("href"),
    };
  });
  rec(
    "A39-throw-fails-closed",
    st.mode === "failed" && !st.canvas && st.svg && st.posterOpacity === "1",
    JSON.stringify(st),
  );
  rec("A39-throw-no-pageerror", errs.length === 0, errs.join(" | ") || "none");
  rec(
    "A39-throw-copy-intact",
    st.h1 && st.cta === "#install",
    `h1=${st.h1} cta=${st.cta}`,
  );
  await page.screenshot({ path: `${OUT}/throw.png` });
  await ctx.close();
}

// --- live canvas present (A28) ---
{
  const { ctx, page } = await shot("live", 1440, 900);
  const st = await page.evaluate(() => ({
    mode: document.querySelector(".hero__stage")?.dataset.canvas,
    canvas: !!document.querySelector(".hero__canvas canvas"),
  }));
  rec("A28-canvas-live", st.mode === "live" && st.canvas, JSON.stringify(st));
  await ctx.close();
}

// --- draw calls (A36) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__dc = 0;
    const patch = (proto) => {
      for (const m of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"]) {
        const orig = proto[m];
        if (!orig) continue;
        proto[m] = function (...a) {
          window.__dc++;
          return orig.apply(this, a);
        };
      }
    };
    patch(WebGL2RenderingContext.prototype);
    patch(WebGLRenderingContext.prototype);
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => raf((t) => { window.__dc = 0; cb(t); });
  });
  await page.goto(URL, { waitUntil: "networkidle" });
  // the canvas is client-probed; a cold server can still be painting the poster
  // when the first frame lands. wait for the live flag before sampling, else a
  // slow mount reads 0 draw calls and flakes.
  await page
    .waitForFunction(
      () => document.querySelector(".hero__stage")?.getAttribute("data-canvas") === "live",
      null,
      { timeout: 8000 },
    )
    .catch(() => {});
  await page.waitForTimeout(1500);
  const dc = await page.evaluate(() => window.__dc);
  rec("A36-drawcalls", dc > 0 && dc < 100, `${dc} draw calls in one frame`);
  await ctx.close();
}

// --- route payload against the D-08b byte budget (A37) ---
// Measured from the build manifest, not from the wire, so it is deterministic
// and can gate a commit. gzip -9 is the same codec the server negotiates.
{
  const { gzipSync } = await import("node:zlib");
  const { readFileSync } = await import("node:fs");
  const { dirname, resolve } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const build = resolve(dirname(fileURLToPath(import.meta.url)), "..", ".next");
  const manifest = JSON.parse(readFileSync(resolve(build, "app-build-manifest.json"), "utf8"));
  const files = manifest.pages["/page"] ?? [];
  let bytes = 0;
  for (const f of files) {
    try {
      bytes += gzipSync(readFileSync(resolve(build, f)), { level: 9 }).length;
    } catch {
      /* manifest lists a file the build pruned; skip it */
    }
  }
  const BUDGET = 450_000;
  rec(
    "A37-payload-budget",
    bytes > 0 && bytes <= BUDGET,
    `${bytes} B gzip over ${files.length} chunks vs ${BUDGET} B (D-08b)`,
  );
}

await browser.close();
const fails = results.filter((r) => !r.pass);
writeFileSync(`${OUT}/report.json`, JSON.stringify({ total: results.length, fails: fails.length, results }, null, 2));
console.log(`total ${results.length}  fails ${fails.length}`);
for (const f of fails) console.log(`FAIL ${f.id}  ${f.detail}`);
process.exit(fails.length === 0 ? 0 : 1);
