# grindr-plus-plus-mt Design System

<!-- design-md:section experience -->
## 1. Experience

**Scope.** One public, single-page, scroll-native landing for `grindr-plus-plus-mt`, an
open-source client fork of Grindr. One route, seven beats, no auth, no app shell.

**Primary task.** Convince a technical visitor in one screen that this fork is real,
measured, and safe to install — then hand them the build link.

**Stance.** A dark instrument panel that lights one reading at a time. The page
*instruments* the fork; it does not decorate it. Every claim is a lit indicator; every
unmeasured thing stays dark with its lamp unlit instead of showing a guessed number.

**Principles.**

- **P1 The lit indicator, not the spotlight.** Accent is a signal on four carriers only
  (lit core, active lock-on rule, completed marker, one CTA); ≤5% accent coverage per
  viewport; no gradient backgrounds. *Sacrifice:* the page reads under-decorated and
  refuses full-bleed accent washes.
- **P2 Honest absence is a designed state.** An unmeasured datum renders as an unlit lamp
  plus the literal word `measuring` plus the condition it waits on. *Sacrifice:* the
  performance section ships visibly incomplete until re-measurement lands.
- **P3 One device per section.** Hero core → floating slabs → orbital system → dial and
  counters → horizontal drawer → vertical rule → quiet close. *Sacrifice:* no reusable
  card motif; each section costs its own geometry.
- **P4 Scroll is the projector.** Parallax is depth ordering; pinning is spent on exactly
  one section. *Sacrifice:* the reduced-motion path must be authored, not inherited.

**Direction.** Dark, monospaced, instrument-like, with a single warm ember accent.

<!-- design-md:section foundations -->
## 2. Foundations

All values live in `system/tokens.css` and carry a decision id from `system/decisions.md`.
Contrast is measured in `system/contrast.md` (WCAG relative luminance, reproducible).

**Color.** Single dark theme. Base `--color-bg #12100f`; plate `--color-panel #1d1613`;
raised plate `--color-panel-raised #241b17` (lightness step, never a shadow). Ink
`#f4ece6`, dim ink `#cbb8ac`, muted `#a08b7f`, accent `#ff8a3d`, accent light `#ffb887`,
accent ink `#12100f`. `#000`/`#fff` never used as a base.

Two rule tokens, deliberately split: `--color-rule #33241c` (1.27:1) for decorative
hairlines and inset dividers; `--color-rule-strong #7a6350` (3.37:1) for any boundary a
user must perceive — control borders, plate edges that are the affordance, focus-adjacent
borders. Measured text pairs: ink on bg 16.25:1, muted on bg 5.87:1, accent on bg 8.09:1,
bg on accent 8.09:1 — all clear 4.5:1 body.

**Accent budget.** Four carriers only (D-P1-6). Accent fills always pair with
`--color-accent-ink` (D-P1-7).

**Space.** 4pt scale, role-named `--space-1..12` (4 → 192px). No off-scale value. Page
gutter `clamp(20px, 5vw, 72px)`; page measure 1240px. Section air is authored, not
uniform: hero bottom ≥1.3× top, a 1.5-screen void before the centrepiece, `--space-8/9`
between other sections.

**Shape.** Three radii only: panel 14px, control 10px, pill 999px. Radius never signals
state.

**Elevation.** Rest and hover are token pairs (panel / panel-raised + rule / rule-strong).
No improvised shadows, no accent side stripes, no card-in-card.

**Motion.** `--ease` (power2.out equivalent), `--dur-reveal .6s`, `--dur-micro .18s`.
Scrubbed ranges delegate to scroll. Banned: `transition: all`, bounce easing, layout
property animation, focus-ring fade-in, hover stacks of three or more effects.

**Reduced motion.** `prefers-reduced-motion: reduce` ⇒ ScrollSmoother is never created,
pins resolve to the final frame, the core renders a static frame, counters jump to their
final value, and a visible label says motion is reduced.

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

**Roles.** `display` (monospace, 700, clamp 2.6→5.2rem, tracking −0.03em, line-height
1.02) · `title` (monospace 600) · `body` (system sans, line-height 1.55, measure 62ch) ·
`label` (monospace 500, 0.72rem, uppercase, tracking 0.16em, muted).

Two families only, both local stacks — no webfont request, no italic display, no third
face. Monospace is the display, label and all-numeric face because the subject is an
instrument; sans is body only. All counters use `tabular-nums`. Display headings carry
`overflow-wrap: anywhere; min-width: 0`; no all-caps display under line-height 1.0.

**Assets.** Abstract UI and real-time 3D only — no product screenshots (licence status
unresolved), no stock photography, no emoji. The mark is a 24×24 inline SVG coordinate
crosshair in brackets, `currentColor`, `aria-hidden`, paired with the wordmark. All 3D
geometry is procedural (no GLB above 1MB); textures are generated sprites.

<!-- design-md:section components-states -->
## 4. Components & States

Anatomy, states and accessibility contracts are inherited from the preset catalog; only
token slots are derived. Full specs in `system/components.md`.

| component | preset | states |
|---|---|---|
| Masthead | P-FN-08 | default, link hover, focus-visible |
| Hero block | P-FN-09 | default, reduced-motion |
| Orbital stage | no-preset (3D scene) | dim, locked, passed, reduced-motion |
| Stat block | P-PR-68 | default, measuring, reduced-motion |
| Feature card | P-PR-60 outlined | default only |
| Install step | P-FN-07 | pending, completed |
| Measuring state | P-PR-65 | default |
| Credit block | P-FN-10 | default, link hover, focus-visible |
| Skip link | P-PR-46 | hidden, focus-visible |
| Button / link | P-PR-01 contract | default, hover, focus-visible, active, disabled |

Buttons: primary = accent fill + accent-ink text; secondary = panel + rule-strong border;
text link = ink with accent underline on hover only. One primary per screen. Focus is a
2px accent outline at 2px offset, instant, `:focus-visible` only. Disabled = panel-raised +
dim ink + `cursor: not-allowed` + native attribute — never opacity alone.

The orbital stage is `no-preset` because a card grid would collapse three tiers into the
forbidden equal-tile pattern. Its DOM is an ordered list of three segments and remains the
source of truth with the canvas off; the canvas is `aria-hidden`.

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

Declared grammar: **scroll narrative** (one page, seven beats, heights in `svh`).
Per-section composition and reverse-count checks in `system/layout-grammar.md`.

Ultra-wide strategy: left-max with a right support column on hero, performance and credit;
full-track only for the pinned centrepiece. No viewport may carry >40% unjustified void.
Grid tracks are `minmax(0, 1fr)`; page-level `overflow-x: clip`.

Breakpoints authored, not `auto-fit`: 1 column under 640, 2 from 640, the pinned stage and
hero support figure engage from 1024. Minimum width 320px with no horizontal scroll; 200%
reflow preserves task order. Hit targets ≥44px everywhere. Code blocks may scroll inside
their own box; the page may not.

Platform adaptations: touch drops the pointer-fine tilt; the WebGL canvas has a server-
rendered poster fallback that is also the LCP element; no ScrollSmoother on reduced motion
or on coarse pointers.

<!-- design-md:section content-locales -->
## 6. Content & Locales

Voice: technical-luxe, confident, no fluff. Short declaratives, no exclamation marks, no
"revolutionary/seamless/powerful". A claim without a source is demoted to a measuring
state rather than softened. Second person only in the install section.

Single locale, English. Full string inventory in `system/content.md`; every string is
authored there and consumed verbatim.

Honesty contract: server-enforced features (Viewed Me, true incognito, message-send
entitlement, age verification) appear under `server-enforced, no client fix` as
limitations, never as features. The spoofed version renders as `26.24.0 / 195444` with the
footnote that upstream marks 26.23.0+ PairIP untested, phrased as *this fork's build*.
Xtra-tier specifics are attributed to the mod projects, not invented. Fork credit and
`GPL-3.0` render verbatim from `NOTICE`. No user counts, ratings, testimonials or prices
are claimed.

<!-- design-md:section governance -->
## 7. Governance

**Authority order:** brand prompt-facts (palette, fonts, radius 14, easing, 4.5:1) →
repository facts (`NOTICE`, `README` matrix, `docs/SUPERPOWERS.md`) → decisions in
`system/decisions.md` → this document → code. A code value with no decision id is a
regression.

**Provenance classes used:** prompt-fact, repository-fact, agent-proposed-greenfield-
decision, unresolved.

**Unknown-absence rule.** Unmeasured data renders as a measuring node (unlit lamp +
`measuring` + condition). Unknowns are enumerated in `system/unknowns.md` and may not be
silently dropped. A filled node keeps its condition text and sample count. `p50`/`p90` may
not appear until at least 20 samples per transition exist; until then the single sample is
labelled as a sample and an upper bound.

**Exceptions.** Two rule tokens exist by design (decorative vs perceptible boundary). The
orbital stage is the only `no-preset` component. No third button variant is permitted.

**Unresolved decisions carried forward:** legality of shipping Grindr UI screenshots (none
shipped); any Xtra-tier fact not stated by the mod repositories.

---

*Manually authored (omd CLI and controller helpers are not installed on this machine) —
readable and portable, but **not** compiler-bound: no manifest, no binding hashes, no
`design-md:claim` markers, and no Bound-Proof claim.*
