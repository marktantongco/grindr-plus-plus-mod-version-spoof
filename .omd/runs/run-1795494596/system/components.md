# COMPONENT SPECS (run-1795494596)

Rule: anatomy, states and accessibility contracts are inherited from the cited preset;
only token slots are derived from D-ids. `no-preset` is declared where the catalog has
nothing that fits (GS8).

## C-1 Masthead — preset `P-FN-08`

Mark = 24×24 inline SVG, a **coordinate crosshair in a bracket** (the instrument's own
reticle; derives from P1 — a mark that *points*). Wordmark `grindr-plus-plus-mt` in the
title role. One status line `spoof 26.24.0` (label role, muted) — a product-specific
element, not the default tagline slot (G42). One CTA `Get the build` (primary).

- Height token `--size-masthead: 64px`; hit ≥44px on the home link; mark `aria-hidden`.
- No hairline-on-scroll second effect: the masthead gains `--color-rule-strong` bottom
  border once scrolled (one device only).
- States: default / link hover (surface `--color-panel`) / `:focus-visible` (accent ring,
  instant). Mobile: mark + wordmark + CTA, status line moves into the hero meta.
- D-ids: D-P1-1, D-P3-1, D-P1-6, D-P4-5.

## C-2 Hero block — preset `P-FN-09`

Anatomy per preset: eyebrow → display → lede → one action → support element. Support
element = the live core figure (not a decorative image). Eyebrow is the label role:
`GPL-3.0 · fork of a fork`. Display is one line at ≥1280 and wraps to two at 390.
`min-height` uses `svh`, **not** `100vh` (G6), and the next section must be visible at
1280×800. Bottom padding ≥1.3× top (G44) = `--space-9` top / `--space-11` bottom.

- Hero text paints from server HTML at `opacity:1`; the canvas fades in *behind* it (D-10).
- One action only (primary `Get the build`); the repo link is a text link (C3).
- Poster fallback `<img>` is the LCP element and carries the same dimensions as the
  canvas box, so the swap does not shift.
- D-ids: D-P3-6, D-P4-2, D-P2-4, D-P1-6.

## C-3 Orbital stage (§3) — **no-preset** (3D scene, not a card grid)

Reason: `P-PR-60` would render three equal cards = the forbidden 3-column tile (G3).
The stage is a pinned 2-screen canvas with three DOM labels pinned over it.

- DOM contract: `<section aria-labelledby>` → `h2` → ordered `<ol>` of 3 `<li>`, each with
  a term (segment name), one sentence, and a state line. The 3D is `aria-hidden`; the DOM
  list is the source of truth and reads identically with the canvas off.
- Labels are pinned via CSS2D; each carries a 2px accent rule when its lock-on is active
  (accent budget D-P1-6) and muted ink otherwise.
- States per label: `dim` (not yet reached) / `locked` (accent rule, ink text) / `passed`
  (ink-dim). Under reduced motion all three are `locked` and the zenith frame is shown.
- `measuring` slots inside the segment copy use C-7.
- D-ids: D-P3-5, D-P1-6, D-P1-11, D-P2-3, D-P4-7.

## C-4 Stat / counter block (§4) — preset `P-PR-68`

Anatomy per preset: definition line (what the denominator is, user language) → value at
max weight → unit / condition. Values are `tabular-nums`. Definition is never hidden in
an `aria-label`.

- Three blocks: `chat open` · `chat close` · `profile open`.
- Only `chat open` may carry a number, and only as `32.3 ms`; its condition line reads
  `single sample · frame-delta upper bound`. The other two render C-7.
- States: default / measuring / reduced-motion (final value immediately, no count-up).
- D-ids: D-P2-1, D-P2-2, D-P3-3, D-P4-7.

## C-5 Feature drawer card (§5) — preset `P-PR-60` (outlined variant)

One variant page-wide (C24). Media slot is a **1-line status rule**, not an image, so no
aspect ratio is fixed — the card is text-only: name (title role) → one sentence → status
line (label role, `client-side` / `server-enforced`).

- Row order fixed: name → sentence → status. Gaps 4/8/16, not uniform (VQC §5d).
- Whole card is not a link (no per-card destination), so no focus ring on the card; the
  status badge carries the semantic.
- D-ids: D-P1-1, D-P3-1, D-P2-3, D-P1-10.

## C-6 Install step — preset `P-FN-07` (row padding contract)

Ordered list, 5 items. Marker (accent when completed, rule-strong when pending) → step
name → one `<code>` line, selectable and copyable. 4-side padding, negative inline margin
to keep the well alignment, divider inset to content width. The 5th step is a link, not a
command.

- `code` uses the monospace role; `overflow-x: auto` is allowed *inside* the block only
  (page-level horizontal scroll is still banned, G34).
- D-ids: D-P1-1, D-P4-3, D-P3-2, D-P1-6.

## C-7 Measuring state — preset `P-PR-65` (skeleton contract)

Unlit lamp (8px dot, `--color-rule-strong`, `aria-hidden`) + the literal word `measuring`
(label role) + the condition it waits on, e.g. `awaiting re-measure on device`. No digit,
no shimmer bar pretending to be progress.

- Container `aria-busy="true"`; the whole block is not a live region (no churn).
- D-ids: D-P2-1, D-P1-2.

## C-8 Credit block (§7) — preset `P-FN-10` (footer)

Brand column wide, link columns narrow. Verbatim lineage lines from `NOTICE`, then the
`GPL-3.0` line, then the two links (upstream, this fork). Meta line holds the version and
the PairIP footnote.

- Dark surface: inverted token pair only (G41); every line measured in `contrast.md`.
- D-ids: D-P3-8, D-P2-4, D-P1-9.

## C-9 Skip link — preset `P-PR-46`

First focusable element, target `#main`, target `tabindex="-1"`, target ring suppressed.

## C-10 Buttons / links

Primary = accent fill + `--color-accent-ink` text (D-P1-7), `--radius-control`, height
`--size-control: 44px`. Secondary = panel fill + `--color-rule-strong` border. Text link =
ink with an accent underline on hover only. No third variant on the page (C3).

States for all: default / hover (surface step) / `:focus-visible` (2px accent outline,
2px offset, instant) / `:active` (surface step down) / disabled (panel-raised +
ink-dim + `cursor:not-allowed` + native attribute).
