# PHILOSOPHY — grindr-plus-plus-mt landing (run-1795494596)

## Stance

> **A dark instrument panel that lights up one reading at a time.**
> The page does not decorate a fork; it *instruments* it — every claim is a lit
> indicator, every unmeasured thing stays dark with its lamp unlit rather than
> showing a guessed number.

Derived from the mission voice (`technical-luxe, confident, no fluff`) and from the
single hard structural fact of the subject: this is an open-source fork whose whole
argument is "the stock client, rewired" — so the page's own form is a rewired
instrument, not a brochure.

## Principles (each with its sacrifice — GS7 requires falsifiability)

**P1 — The lit indicator, not the spotlight.**
Accent is a *signal*: it appears only where a state is asserted (a lit core, an
active lock-on, a completed marker, one CTA). Backgrounds are never gradients.
- Buys: the eye is routed to the one thing that is true right now; dark keeps the
  page reading as instrument glass.
- Sacrifices: no full-bleed hero wash, no accent-filled cards, no colored section
  bands; the page looks "under-decorated" next to marketing sites. That is the point.

**P2 — Honest absence is a designed state.**
A datum we have not measured renders as an unlit lamp with the word `measuring`,
never as a plausible digit.
- Buys: the one real number we have (32.3 ms, N=1) is credible because its
  neighbours are visibly empty.
- Sacrifices: the performance section cannot use the visual rhythm of three filled
  big numbers until re-measurement lands; a first-time reader sees blanks.

**P3 — One device per section, no repeated vocabulary.**
Hero = volumetric core · Stack = floating slabs · Centre = orbital system ·
Performance = dial + counters · Features = horizontal drawer · Install = vertical
rule · Credit = quiet close.
- Buys: each section says a new sentence; the centre is provably the centre.
- Sacrifices: no reusable "card" motif to speed the build; every section costs its
  own geometry and its own scroll choreography.

**P4 — Scroll is the projector, not a decoration.**
Parallax (data-speed) is depth ordering, and pinning is reserved for exactly one
section — the centrepiece.
- Buys: the film reads as one camera move; the peak earns its 2 screens.
- Sacrifices: no ScrollSmoother under `prefers-reduced-motion` (jumps to the final
  frame instead), so the reduced-motion path must be authored, not inherited.

## What this philosophy forbids outright

- Icon-above-headline 3-column tiles (G3) — the feature drawer is text + status line.
- Uniform section padding — the void before the peak is 1.5 screens, elsewhere 0.4–0.8.
- Any invented statistic, star rating, user count, or price.
- Spline or a stock photo in the hero; hero is procedural R3F with a poster fallback.
- `#000` / `#fff` bases and purple→cyan gradient headlines (G2/G7).

## Traceability rule

Every token and component value in `system/decisions.md` carries a `D-P<n>-<m>` id
that cites one of P1–P4. A value with no D-id may not be written into tokens, specs,
or code (GS7).
