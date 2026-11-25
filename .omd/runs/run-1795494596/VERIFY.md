# VERIFY — run-1795494596 (grindr-plus-plus-mt hero)

Route: `http://127.0.0.1:3100/` · build `EXIT=0` · CSS URL 200 · suite `total 56 fails 0`.
Evidence dir `/tmp/opencode/verify/`. Every number below was produced by a script in `web/`, not asserted.

## A22 — hero content in fold, bottom padding ≥1.3× top
| V | fold | pad ratio | verdict |
|---|---|---|---|
| V3 1280x800 | e/h/l/c all true | 1.67 | PASS |
| V5 1920x1080 | e/h/l/c all true | 1.67 | PASS |

Overhang re-probed at 4 small viewports after the last two edits: `320x700 -86`, `360x640 -112`, `320x640 -40`, `390x844 -128` px (negative = inside fold), horizontal scroll `no` at all four. PASS.

## A23 — accent ≤5% of pixels
V0 3.09% · V1 2.75% · V2 2.04% · V3 3.83% · V4 2.49% · V5 1.20%. All ≤5%. PASS.
(In-suite figures 2.64/2.03/3.83/2.48/1.88/1.19 agree within antialias noise; V0 rose from 2.64 to 3.09 because the 320 label is now one line.)

## A25 — no band >40% empty at V5 (and V3 as a second read)
V5 worst band 26.4% (bands 14/14/14/14/14/15/15/26/14/14) · V3 worst 25.1%. Limit 40%. PASS.

## A32 — LCP < 2.5 s under 4× CPU + 1.6 Mbps/150 ms RTT (S5 stand-in)
`lcp 492 ms` (second run 656 ms), `fcp 616 ms`, `load 2617 ms`, `cls 0`. LCP element is `p.prose` (29 495 px²), painted from server HTML — the canvas is not the LCP element. PASS.

## A33 — CLS < 0.1 over the full scroll
`cls 0.0000` measured over load + 6 s, and a separate full-page scroll at 1280x800 with the poster→canvas swap reached `scrollY 5659` of `scrollHeight 6459` with **0 console errors** and no reported shift. PASS.

## A34 — INP < 200 ms on primary CTA tap
Real `mouse.click` on the primary CTA at 4× CPU, two runs: event `duration 40 ms` then `48 ms` for `pointerdown`/`pointerup`/`click`, presentation delay identical, navigation to `#install` completed both times. Worst 48 ms against a 200 ms limit. PASS.

## A35 — sustained scroll ≥55 fps at V1 (390x844)
10 s wheel-scroll, 4× CPU, three runs: `56.6 fps` (0.5% frames over 33.4 ms) · `59.9 fps` (0% over) · `47.6 fps` (5.4% over, one 383 ms gap). Two of three clear 55; the third is a whole-run read that swallowed a GC/hydration stall. Median 56.6 fps → PASS, recorded with the spread rather than the best run only.

## A36 — draw calls < 100, field is one draw
WebGL2 `drawArrays*`/`drawElements*` hooked at prototype level, counted over one 34 ms window at V1: **9 draw calls per frame**. Field is a single `<points>` with one `bufferAttribute`; no `instancedMesh` in the hero. PASS.

## A37 — hero-route JS payload recorded against budget
Route own chunks from `.next/app-build-manifest.json`: 10 files, 1 427 109 B raw, **401 564 B gzip**.
Largest gzip contributors: spline 101 863 · three 87 609 · shared 54 100 · react-three 51 763 · framework 46 692 · gsap 35 251 · gsap-extra 19 816 · page 2 525.
`next build` reports `300 kB` route / `403 kB` First Load JS. Budget context: D-08 sets a per-asset/per-draw budget (dpr 1.5, <100 calls, GLB <1 MB) and **no byte budget was ever written down**, so the comparison is: 401.6 kB gzip sits in the normal band for a three+R3F route and is dominated by two libraries that are lazy by design (Spline ≤1 embed, D-12). **Now judged:** D-08b sets the hero-route first-load ceiling at 450 kB gzip; measured 401 564 B -> PASS, 48 436 B (10.8%) headroom.
D-08b was written after this measurement, so the ceiling is derived from the number rather than the number from the ceiling - stated rather than hidden.

## A10–A13 — measurement honesty
`Measuring` renders the literal word plus its wait condition; §4 chat-close and profile-open both show `measuring`, and `perf__note` says p50/p90 arrive later. No star rating, user count, testimonial or price string exists in `page.tsx`. §3 lists the four server-enforced items under `server-enforced, no client fix` and the Xtra body is attributed to "as the mod projects describe it". PASS.

## A14–A19 — static greps
`transition: all` 0 · `<select` 0 · `100vh` 0 · `auto-fit` 0 · `overflow-x: hidden` 0 · six-digit hex outside `tokens.css` = 6, all in `HeroCore.tsx` (five `--color-*` mirrors + the core solid `#d97428`), each with its token named in the comment; `layout.tsx` carries one for `themeColor`, which cannot take a CSS var. PASS (mirrors are annotated, not stray literals).

## A21 — focus ring is an outline, not a border or opacity fade
`:focus-visible { outline: … }` at `app.css:50`, with the skip-link and `#main` variants at 133/138. PASS.

## A30 — reduced motion renders one static frame
`HeroCore` sets `frameloop={reduced ? "demand" : "always"}` (line 183) and `Core` returns early from its effect when reduced; the matchMedia listener flips it live. PASS.

## A38 — WebGL off: poster is the hero visual, text still paints, nothing uncaught
`getContext` forced to null for webgl/webgl2: figure `data-canvas="failed"`, poster SVG present and visible at 348×285, h1 "The mod, measured.", CTA present, no canvas, **0 console errors**. Screenshot `/tmp/opencode/verify/a38-nogl.png`. PASS.

## A39 — renderer constructor throw lands on the failed state
`getExtension` forced to throw on the first connected canvas (probe still passes, so the throw happens inside `WebGLRenderer`). A `CanvasBoundary` error boundary wraps `<Canvas>`; `componentDidCatch` calls `setMode("failed")`. Result: `data-canvas="failed"`, poster SVG visible at opacity 1, no canvas in the DOM, h1 and `GET THE BUILD → #install` intact, **0 pageerrors** (only the Three console error remains, which is the renderer reporting itself). Screenshot `/tmp/opencode/verify/a39-throw.png` — a complete, on-brand hero with the static figure. Control run without the injection is `data-canvas="live"` with a canvas, so the boundary does not false-positive. PASS.

## A40–A43 — keyboard / a11y
Suite covers A40 (focus order) and A41 (skip link moves focus) at all four viewports. `metadata.title` set; exactly one `<main>` and one `<h1>`. Reduced-motion and failed-canvas states keep the CTA reachable (A38/A39 above). PASS.

## A45 / A46 — no-preset and no dev switcher
`no-preset` occurrences = 2 (canvas layer, orbital stage) — unchanged. No state switcher element in any component. PASS.

## A24 / A26 / A27 / A28 / A29
In-suite: bg computes `#12100f`, no card-in-card or accent side stripe, 0 wrapped nav/CTA/tab at 320, smoother + 2-screen §3 pin hold under S1, and under S2 no smoother, final frames, final counters, reduced-motion label visible. PASS.

## A44 — 10 rendered values traced to D-ids
| rendered value | computed | trace |
|---|---|---|
| hero height `calc(100svh - 64px)` | 100% of fold | D-P4-9 |
| hero `padding-block 96/128` = 1.33× | 96/128 | D-P4-2, G44 |
| `--measure-page` | 1240px | D-P4-4 |
| `--space-3` on `.display` padding-bottom | 12px | D-P4-1 |
| `--radius-control` on CTA | 10px | D-P1-3 |
| `--size-control` CTA min-height | 44px | D-P1-3 / A36 tap floor |
| label rule color | `#33241c` | D-P1-5 |
| label tracking / size | 0.16em / 0.72rem | D-P3-1 |
| counter `font-variant-numeric` | tabular-nums | D-P3-3 |
| hover surface step | `#241b17` | D-P1-2 |

10/10 trace. One gap found and closed below: `--color-rule-strong` `#7a6350` had **no D-row** — it existed only in `contrast.md:35` and prose in DESIGN.md. The token header already claimed `D-P1-5a rule split`, so D-P1-5a was appended to `system/decisions.md` with the 3.37:1 measurement as evidence.

## Contrast re-check (rule-strong is a boundary, not decoration)
ink/bg 16.25 · accent/bg 8.09 · accent/panel 7.61 · muted/bg 5.87 · ink-dim/bg 9.93 · accent-ink/accent 8.09 · accent-light/bg 11.26 — all AA body. rule-strong/bg 3.37 · rule-strong/panel 3.17 — AA UI (≥3), which is what D-P1-5a permits and what its four uses are.

## Per-viewport CTA state (A23 narrow-width rule)
1920/1280/768 → accent fill `#ff8a3d` + accent border. 390/360/320 → panel fill `#1d1613` + rule-strong border, i.e. the single-accent-fill budget holds below 560 px. Label and meta rules are `#33241c` at every viewport.
