# Data inventory — grindr-plus-plus-mt landing (run-1795494596)

Rule: design FROM these sources; never invent a field, count, price, or metric not present here.

## Truth sources (repo)

| Source | What it supplies | Used by section |
|---|---|---|
| `NOTICE:1-27` | Fork lineage verbatim (ElJaviLuki → R0rt1z2 → fatterdev → this fork; gustarmartins v5.0.1 commit c43f6c4) + "GPL-3.0 (unchanged)" | §7 Fork credit (verbatim render) |
| `README.md:54-58`, `docs/assets/schema-config.json:20-21` | Compiled spoof 26.24.0 / 195444 | §1 hero meta, §3 segment facts |
| `README.md:125-140` | Feature matrix: client-side "works" vs "server-enforced" split | §3 + §5 (honesty boundary D-04) |
| `docs/SUPERPOWERS.md:11-69` | Five primitives: device identity rotation, JWT experiment override, ~100 feature flags, Retrofit response forging, geo tier bypass; + chat terminal, multi-clone, local media capture | §5 |
| `docs/RELEASE-TIMELINE.md` | Measured build history dates + version map | §6 install/timeline |
| `manifest.json` | Real APK download URLs (v5.0.0-26.0.1) | §6 install links |
| `news.json` | Changelog items (Telegram dump): AntiBlock, QuickBlock, inbox filters, BMI toggle, UK age-verification notice | §6 timeline / news strip |
| `docs/RELEASE-NOTES-v5.0.1-26.24.0.md` | Current release notes + checksums | §6 |
| `app/build.gradle.kts:12-24` | app identity: com.grindrplus, 5.0.1-26.0.1 | footer/meta |

## 3-segment comparison data (§3) — source status

- **Grindr Free / Grindr Xtra** tier facts: lineage lane complete (research/grindr-plus-lineage.md). Mod-column facts = the four repos' own claims. **Xtra specifics must NOT be invented** — phrase "as described by the mod projects" (D-14) or source Grindr's public tier page first.
- **Mod segment**: from README/SUPERPOWERS claims only, phrased as project claims.
- Latency row: executor returned **PARTIAL honest data** (research/perf-measurements.md): 1 defensible observation — official app chat-open frame-delta upper bound **32.3 ms** (N=1, ~17 ms cadence window; NOT a precise tap→render figure, p50/p90 explicitly not fabricated). Device went offline mid-batch; transitions (b)/(c) and both clone apps unmeasured. §4 renders a "measuring" state for missing slots; re-measurement required before §4 ships real numbers (device was offline + contended by another actor at run end).

## Resolved contradiction (D-03)

`version_spoof.json` (26.9.1/163471) ≠ compiled spoof (26.24.0/195444). Page shows compiled values; version_spoof.json/version.json treated as latest-official tracker outputs. Evidence: README.md:54-58, schema-config.json:20-21.

## Honest-absence ledger (render as visible copy, never invent)

- No user counts, no star-rating claims, no testimonials, no pricing (project is free/GPL) — if a slot expects these, render an explicit "not tracked / n/a" sentence instead.
- Server-enforced features (Viewed Me, incognito, send entitlement, age verification): rendered as limitations, not features (D-04).
- `spline.json` is a time/id table, NOT a Spline scene — no Spline scene asset exists yet; if hero uses Spline, scene must be authored, else hero is procedural R3F (art-director recommendation).
