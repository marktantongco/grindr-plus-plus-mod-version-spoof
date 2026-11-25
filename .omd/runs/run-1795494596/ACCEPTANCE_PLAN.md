# ACCEPTANCE PLAN — run-1795494596

Every item is independently reproducible by someone who never read this run's chat.
Verdicts are PASS/FAIL; a FAIL blocks ship. No item may be judged "looks fine".

## 0. How to run

```bash
cd /home/x1/.cache/gpp-work/repo
npm install
npm run build
npm run start -- --port 3100
```

Route under test: `http://localhost:3100/`

## 1. Viewports & states

| # | viewport | notes |
|---|---|---|
| V1 | 390x844 | mobile, coarse pointer |
| V2 | 768x1024 | tablet |
| V3 | 1280x800 | laptop fold — G44 gate |
| V4 | 1440x900 | desktop |
| V5 | 1920x1080 | ultra-wide — GS5 void gate |

| # | state | how to reach |
|---|---|---|
| S1 | default | plain load |
| S2 | prefers-reduced-motion | DevTools rendering emulation |
| S3 | WebGL unavailable | `--disable-webgl` or DevTools override |
| S4 | keyboard only | Tab from document start |
| S5 | slow 4G | DevTools network throttle, cold cache |

## 2. Structural checks (DOM, no vision)

- A1 Page has exactly one `<h1>`; the design document is not served as the page.
- A2 Heading order is `h1` then `h2` x6 then `h3` in sections; no skipped level.
- A3 First focusable element is the skip link; its target exists (`#main`).
- A4 Every image has `alt`; decorative SVGs are `aria-hidden`.
- A5 The orbital stage's 3 segments exist as `<ol><li>` in server HTML and read correctly with JS disabled.
- A6 The NOTICE lineage and the exact string `GPL-3.0` appear in section 7 in server HTML.
- A7 The strings `26.24.0` and `195444` appear together with the PairIP footnote.
- A8 No string from the forbidden list in `system/content.md` appears.

## 3. Honesty checks

- A9 Section 4 shows `32.3 ms` AND `single sample` AND `frame-delta upper bound` together.
- A10 Section 4 chat-close and profile-open render `measuring` — not `0 ms`, not any digit.
- A11 No `p50` or `p90` string is rendered.
- A12 No star rating, user count, testimonial, or price string exists.
- A13 Section 3 lists the four server-enforced items under the limitations heading, and Xtra facts are attributed to the mod projects.

## 4. Token / system fidelity (grep on source and built CSS)

- A14 `grep -rc 'transition: all' src` = 0.
- A15 No six-digit hex outside `src/styles/tokens.css` (G48).
- A16 `grep -rc '<select' src` = 0 (G28).
- A17 `grep -rc '100vh' src` = 0 (G6).
- A18 `grep -rc 'auto-fit' src` = 0 (G50).
- A19 `grep -rc 'overflow-x: hidden' src` = 0 (`clip` only, G34).
- A20 Spot-check 10 classes used in JSX; each resolves to a token or a declared utility.
- A21 No focus ring is implemented via `border` or an opacity transition (G39/G15).

## 5. Visual checks

- A22 At V3 the fold shows eyebrow, h1, lede and the primary action; hero bottom padding >= 1.3x top (G44).
- A23 Accent coverage in each viewport screenshot is <= 5% of pixels (measure with a script over the accent hue range).
- A24 No `#000` or `#fff` base area is visible; bg computes to `#12100f`.
- A25 At V5 no horizontal band is more than 40% empty (GS5).
- A26 No card-in-card and no accent side stripe on any plate (G4/G5).
- A27 At 320px no nav, CTA, or tab label wraps to two lines (G49).

## 6. Motion checks

- A28 Under S1 the hero core animates and the page scrolls smoothly; pinning holds section 3 for 2 screens.
- A29 Under S2 no ScrollSmoother is created, all pins show their final frame, counters show final values, and the reduced-motion label is visible.
- A30 Under S2 the core renders one static frame (no RAF loop), confirmed by a paused performance profile.
- A31 Hover changes surface only (no translate) on buttons, links and cards.

## 7. Performance checks

- A32 Under S5 (mid-range Android or 4x CPU throttle) LCP < 2.5s.
- A33 CLS < 0.1 over the full scroll; the poster to canvas swap causes no shift.
- A34 INP < 200ms on primary CTA tap and on the first drawer drag.
- A35 Sustained scroll at V1 holds >= 55fps (Chrome FPS meter, 10s).
- A36 Draw calls on the fixed canvas < 100; the particle field is a single instanced draw.
- A37 Hero-route JS payload is recorded and compared against the stated budget.

## 8. Fallback checks

- A38 Under S3 the poster is the hero visual, hero text is still painted, and no console error escapes uncaught.
- A39 The renderer constructor is wrapped in try/catch; forcing a throw leaves the page usable.

## 9. Keyboard / a11y

- A40 Under S4 Tab reaches skip link, masthead, CTA, each segment, counters, each card, each step, credit links, in DOM order, with a visible ring at every stop.
- A41 Enter on the skip link moves focus to `main` with no visible box on `main`.
- A42 `document.title` is set; the page has exactly one `<main>` and one `<h1>`.
- A43 Reduced-motion and fallback states never trap focus or hide the CTA.

## 10. Cross-check against the decision ledger

- A44 Sample 10 rendered values; every one traces to a D-id in `system/decisions.md`.
- A45 The two `no-preset` declarations (canvas layer, orbital stage) are still the only ones.
- A46 No developer state switcher is rendered in the product UI (GS3).
