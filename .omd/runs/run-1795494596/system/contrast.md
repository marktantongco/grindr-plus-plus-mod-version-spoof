# Measured contrast (run-1795494596)

Method: WCAG 2.x relative-luminance formula, computed with a script (sRGB → linear,
0.2126/0.7152/0.0722 weights, (L1+0.05)/(L2+0.05)). Reproduce with the same script;
values are deterministic. Thresholds: body text ≥4.5:1, large text (≥24px or ≥18.66px
bold) and UI boundaries/icons ≥3:1 (G40, C45).

## Text pairs — all pass

| pair | ratio | verdict |
|---|---|---|
| ink `#f4ece6` on bg `#12100f` | 16.25:1 | pass (body) |
| ink on panel `#1d1613` | 15.29:1 | pass (body) |
| muted `#a08b7f` on bg | 5.87:1 | pass (body) |
| muted on panel | 5.52:1 | pass (body) |
| accent `#ff8a3d` on bg | 8.09:1 | pass (body) |
| accent on panel | 7.61:1 | pass (body) |
| accent_light `#ffb887` on bg | 11.26:1 | pass (body) |
| bg on accent (accent fill + ink text) | 8.09:1 | pass (body) |
| bg on accent_light | 11.26:1 | pass (body) |

Muted clears body text, so it is NOT restricted to captions — the earlier 12px
restriction in D-P1-8 is lifted and superseded here.

## Rule color — first attempt failed, corrected

The brand-derived `line` `#33241c` measures **1.27:1** on bg and **1.20:1** on panel:
fine as a hairline *decoration*, but a boundary a user must perceive needs 3:1 (G40 UI).

Resolution, two tokens:

| token | value | ratio on bg | ratio on panel | use |
|---|---|---|---|---|
| `--color-rule` | `#33241c` | 1.27:1 | 1.20:1 | decorative hairlines, inset dividers inside plates |
| `--color-rule-strong` | `#7a6350` | 3.37:1 | 3.17:1 | control borders, focus-adjacent borders, plate boundary where the plate is the affordance |

Both values derived, recorded as D-P1-5 addendum. `#8a7360` (4.25:1) was rejected — it
reads as a second muted ink and competes with captions.

## Non-text / UI

- Focus ring: `--color-accent` at 8.09:1 on both surfaces — clears 3:1 by a wide margin.
- Lit-core emissive is decorative 3D, not a boundary; its contrast is not gated, but the
  accent label it carries is.
- Disabled: panel-raised surface + `--color-ink-dim`; disabled never relies on opacity
  alone (G39) — the value pair is measured, not faded.
