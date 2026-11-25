# DECISION TABLE — derivation from P1–P4 (run-1795494596)

Every row: id · decision · evidence · preset anchor. No row may be consumed by
tokens/specs/code without an id (GS7). Brand facts (palette, fonts, radius 14,
power2.out/0.6s, 4.5:1) come from `task.md` prompt-facts; they are *given*, so their
ids exist only to carry the derivation of **how they are applied**, not to re-derive
hex values.

## A. Surface, shape, elevation

| id | decision | evidence |
|---|---|---|
| D-P1-1 | Surface genre = **hairline-rule on matte plates**. Rules are `--color-rule` at 1px; plates are `--color-panel` with `--radius-panel: 14px`. No shadowed tiles, no no-radius plates — one genre, every surface. | P1 (accent is signal ⇒ boundaries must be drawn by rules, not by shadow bloom); VQC §2 pick-one |
| D-P1-2 | Elevation states are token pairs, not improvised shadows: rest = panel + rule, hover = panel-raised + rule-strong. Dark surfaces rise by *lightness step* (C40), never by shadow addition. | P1; VQC §2 elevation tokens |
| D-P1-3 | Radius scale is 3 steps only: `--radius-panel: 14px` (cards/plates) · `--radius-control: 10px` (buttons, inputs, chips) · `--radius-pill: 999px` (badge/status dot only). Radius never signals state. | P1 (state is light/rule, not shape); brand radius 14 fixed |
| D-P1-4 | No accent side stripes (G5) and no card-in-card (G4). Nested grouping is a rule inset, never a second plate. | P1; slop G4/G5 |

## B. Color, density, accent budget

| id | decision | evidence |
|---|---|---|
| D-P1-5 | Palette is the 6 locked brand colors + one derived rule color + one derived surface step. All authored in OKLCH with hex fallback; `#000`/`#fff` never appear as base (G7). | brand prompt-fact; G7; VQC §1 |
| D-P1-5a | Rule split inside the `--color-rule` family: `--color-rule #33241c` (1.27:1) is decorative hairlines only; `--color-rule-strong #7a6350` (3.37:1 on bg, 3.17:1 on panel) is required for every boundary that is itself the affordance — control borders, hover boundaries, plate edges. | P1; contrast.md row 35; G40 3:1 UI floor |
| D-P1-6 | Accent (`--color-accent`) is permitted on exactly four carriers: (1) the lit 3D core emissive, (2) the active lock-on label rule, (3) a completed install marker, (4) the single primary CTA. Total accent coverage per viewport ≤5% (G23). | P1 |
| D-P1-7 | `--color-accent-ink` (#12100f) is the only text color allowed *on* an accent fill; accent is never used as a large text color on bg without a contrast measurement. | P1; G40/C45 |
| D-P1-8 | Every text/surface pair is measured and recorded in `system/contrast.md`; body ≥4.5:1, large/UI ≥3:1. Muted (`#a08b7f`) on bg is 5.6:1 — usable for captions, forbidden for anything under 12px. | brand palette; G40 |
| D-P1-9 | Dark sections never reuse light tokens: the page is single-theme dark, so the flip pair is `--color-ink` / `--color-ink-dim` and borders flip to `--color-rule-strong` (G41). | G41/C39 |

## C. Typography

| id | decision | evidence |
|---|---|---|
| D-P3-1 | Roles: `display` (ui-monospace, 700, clamp 2.6→5.2rem, tracking −0.03em, lh 1.02) · `title` (ui-monospace 600) · `body` (ui-sans-serif, lh 1.55, measure 62ch) · `label` (ui-monospace 500, 0.72rem, uppercase, tracking 0.16em, muted). | brand fonts; P3 (each role has one job); VQC §1 |
| D-P3-2 | Exactly two families. Monospace is the *display + label + all numeric* face because the subject is an instrument; sans is body only. No third face, no italic display (G37/G38a). | P1/P3; brand prompt-fact |
| D-P3-3 | All numbers that can change render `font-variant-numeric: tabular-nums` so counters do not jitter. | P2 (measured values must read as readings) |
| D-P3-4 | Display headings get `overflow-wrap: anywhere; min-width: 0`; no all-caps display under lh 1.0 (G51/G55). | G51/G55 |

## D. Space & density

| id | decision | evidence |
|---|---|---|
| D-P4-1 | 4pt scale with role names (`--space-1..12` = 4/8/12/16/24/32/48/64/96/128/160/192). No off-scale value anywhere (G24). | P4; G24 |
| D-P4-2 | Section air is *not* uniform: hero bottom ≥1.3× top (G44); the void before §3 is 1.5 screens of pure bg; other section gaps are `--space-8`/`--space-9`. | P4; storyboard density budget |
| D-P4-3 | Density is authored per section, not global: §5 drawer and §6 timeline are compact (`--space-4` internal), §1/§3 are airy (`--space-7`). | P3 |
| D-P4-4 | Viewport gutter is one clamp token `--gutter: clamp(20px, 5vw, 72px)`; content max is `--measure-page: 1240px`. No full-bleed pill at the screen edge (C7). | VQC §1; C7 |

## E. Motion

| id | decision | evidence |
|---|---|---|
| D-P4-5 | Motion tokens: `--ease: power2.out` · `--dur-reveal: 0.6s` · `--dur-micro: 0.18s`. Discrete reveals use them; scrubbed ranges delegate to scroll (no duration). | brand prompt-fact; P4 |
| D-P4-6 | Banned: `transition: all` (G10), bounce/overshoot (G12), layout-property animation (G14), focus-ring fade-in (G15), hover stacks of 3+ effects (G13). Hover changes surface only. | P1; G10/G12/G13/G14/G15 |
| D-P4-7 | `prefers-reduced-motion: reduce` ⇒ ScrollSmoother is not created, all pins resolve to final frame, the core loop renders its static frame, counters jump to final value, and a visible label states that motion is reduced. | P4; G27; D-09 |
| D-P4-8 | 3D parallax tilt is gated to `@media (hover:hover) and (pointer:fine)`. | VQC §3 |

## F. Layout grammar

| id | decision | evidence |
|---|---|---|
| D-P3-5 | The page is **one scroll narrative** (declared grammar). Per-section composition is authored in the storyboard; content counts are reverse-checked: §5 drawer has 8 items (≥8 required), §3 has exactly 3 bodies, §6 has 5 steps, §7 has 2 links. | P3; GS5/GS6 |
| D-P3-6 | Ultra-wide strategy = **left max with a right support column** on §1/§4/§7 (never centred stack, G6) and **full-track** only for the pinned §3 stage. No viewport may carry >40% unjustified void (GS5). | GS5; VQC §4 |
| D-P3-7 | Grid tracks are `minmax(0,1fr)`; `overflow-x: clip` on the page (G34/G50). | G34/G50 |
| D-P3-8 | Chrome is canonical and asymmetric: masthead = mark + wordmark + one status line + one CTA; footer = brand column wide, link columns narrow (not 4 equal columns, G42/G43). | G42/G43; P-FN-08/P-FN-10 |

## G. Content & honesty

| id | decision | evidence |
|---|---|---|
| D-P2-1 | Missing measurement renders `<Measuring/>`: an unlit lamp + the literal word `measuring` + the condition it waits on. Never a placeholder digit (D-15). | P2 |
| D-P2-2 | The one real sample is labelled in-place: `32.3 ms · single sample · frame-delta upper bound`, never presented as an average. | P2; D-15 |
| D-P2-3 | Server-enforced items (Viewed Me, true incognito, send entitlement, age verification) render under a `server-enforced` heading as limitations (D-04). | P2; D-04 |
| D-P2-4 | Spoof version renders as `26.24.0 / 195444` with the PairIP footnote (D-13); fork credit renders verbatim from `NOTICE` + `GPL-3.0` (D-14). | P2; D-13/D-14 |
| D-P2-5 | Copy register: user language only; no `data.json`/`products.length`/framework names in visible copy except where the stack *is* the subject (§2) (GS4). | P2; GS4/VQC §5b |

## H. Component anchors (GS8)

| id | decision | evidence |
|---|---|---|
| D-P1-10 | Component presets are taken from the catalog, anatomy kept, only token slots derived: masthead `P-FN-08`, footer `P-FN-10`, hero `P-FN-09`, cards `P-PR-60` (outlined variant only), badge/status `P-PR-61`, stat block `P-PR-68`, separator `P-PR-66`, drawer as tabs-free horizontal track (`P-FN-04` chips for filter role is *not* used), skip link `P-PR-46`, measuring state `P-PR-65` skeleton contract, install list `P-FN-07` row padding. | P3; GS8 |
| D-P1-11 | `no-preset` is recorded for exactly two things: (a) the fixed WebGL canvas layer (not a DOM component), (b) the pinned 3-segment orbital stage (a 3D scene, not a card grid — `P-PR-60` would collapse it into the forbidden 3-column tile). | GS8; D-02 |

## I. Folds (assumptions a1–a8 from art-direction, now resolved)

| id | assumption | resolution |
|---|---|---|
| D-P3-9 | a1 (LC codex absent) | resolved: §6 of the skill's visual contract substitutes for LC-n; cited directly in specs |
| D-P1-12 | a2 ("matte panel" is an interpretation) | resolved as D-P1-1: matte is *chosen* via P1, not claimed as observed brand fact |
| D-P1-13 | a3 (no product screenshots) | resolved: abstract UI + R3F only; screenshot slot left out entirely |
| D-P3-10 | a4 (3D is legitimate on tech pages) | resolved: P3 makes it structural (each section = new device), not decorative |
| D-P1-14 | a5 (instance counts 160/240/320) | resolved: tiered by `PerformanceMonitor` class — low 160 / mid 240 / high 320 |
| D-P1-15 | a6 (blur overlay instead of DoF) | resolved: adopted only if post-processing is later added; default no DoF |
| D-P1-16 | a7 (glow restraint) | resolved as D-P1-6 accent budget |
| D-P4-9 | a8 (vh numbers are proposals) | resolved: section heights are authored in `svh` and confirmed by 1440/390 capture, not asserted |
