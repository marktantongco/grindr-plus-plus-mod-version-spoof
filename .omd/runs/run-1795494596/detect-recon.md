# DETECT recon — scout report (condensed, ses_df4042c4effefB0Wg37DPoEyjR)

## Stack reality
- Repo = Android Gradle app (`com.grindrplus`, minSdk 26 / target 34, Kotlin 17, versionName `5.0.1-26.0.1_<git>`); release signs via debug config; real keystore `docs/assets/mtantongco.keystore` (alias `mtantongco`, pass documented `docs/INSTALL-EXPERT.md:9`).
- **No web framework exists yet**: `package.json` is 5 lines (`npx serve docs`); zero React/Next/Tailwind; only web = static HTML in `docs/` rendered through `docs/template.html` + `docs/assets/site.css`; deploys: GitHub Pages (`docs/`, `.github/workflows/pages.yml:24`) + Vercel (`vercel.json`).
- **Brand tokens already live** at `docs/index.html:9`: `--bg:#12100f;--panel:#1d1613;--ink:#f4ece6;--muted:#a08b7f;--acc:#ff8a3d;--line:#33241c` → matches mission palette; DESIGN_SYSTEM_DISPOSITION = **establish** (no DESIGN.md, no .omd/config.json, no preferences, no tests).
- HTML generator for docs/*.html not found in repo (gap).

## Fork-credit block source (verbatim-ready)
- `NOTICE:1-10` lineage: fork of fatterdev/grindr-plus-plus ← archived GrindrPlus line; original ElJaviLuki/GrindrPlus; rewrite R0rt1z2/GrindrPlus; upstream hooks credit gustarmartins/GrindrPlus v5.0.1 commit `c43f6c4` (`NOTICE:13-17`); fork additions `NOTICE:19-24`; "**Licence:** GPL-3.0 (unchanged, see LICENSE)" `NOTICE:26-27`. LICENSE = GPL-3.0.

## Content facts for sections
- SUPERPOWERS (docs/SUPERPOWERS.md:11-69): device identity rotation; JWT experiment override; ~100 feature flags (`core/FeatureDefinitions.kt`); Retrofit response forging (`RetrofitUtils.hookService` + `createSuccess`); geo tier bypass; plus chat terminal, multi-clone, local media capture.
- README feature matrix `README.md:125-140`: works client-side vs "server-enforced" (Viewed Me, incognito, send entitlement, age verification) — honesty boundary for landing copy: don't claim server-enforced items as mod features.
- Version spoof: compiled spoof 26.24.0/195444 (`README.md:54-58`, `hooks/DisableUpdates.kt:52`, `docs/assets/schema-config.json:20-21`) **but** `version_spoof.json:2-3` says 26.9.1/163471 → inconsistency to resolve before copy is written; RELEASE-TIMELINE.md:12 records the 26.9.1→26.24.0 bump.

## Config/deploy
- vercel.json: cleanUrls, nosniff + referrer-policy headers, /assets/* cache 86400.
- `spline.json` is NOT Spline-3D config — it's time/id progress rows (semantics uncertain).
- CI: 6 workflows incl. pages.yml (docs deploy), build_apk.yml (LSPatch + sign + Telegram).
- skills/blender-headless: render_headless.py / export_glb.py / run_blender_headless.sh — usable for GLB asset pipeline.

## Decisions for next phases
1. Disposition = **establish** (fresh Core v2 system; adopt mission palette, extend with line #33241c already in docs CSS).
2. PRODUCT_BUILD will scaffold Next.js App Router (likely `web/` or replace docs/ route — decide at plan) — repo has no web build to break.
3. Landing copy honesty: spoof value must match resolved truth; "server-enforced" features must not be claimed as included.
4. Credit block renders NOTICE lineage verbatim.
