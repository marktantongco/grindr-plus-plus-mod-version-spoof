# GrindrPlus fork lineage — librarian findings (condensed EN, ses_df4042c4bffd1hQj00VS8FoEOw, 2026-11-24)

Method: README/releases originals + GitHub REST API + shallow-clone grep; inferences explicitly labeled. Full KR original available in session transcript.

## Lineage tree (verified)
```
ElJaviLuki/GrindrPlus (2021, ORIGINAL, GPL-3.0, ★227, last release 2023-05, commits to 2024-09, dormant)
    │  "completely rewritten version of ElJaviLuki's original mod"
    ▼
R0rt1z2/GrindrPlus (rewrite, GPL-3.0 (old_base branch unlicensed), ★553, EOL 2026-04-04, ARCHIVED 2026-05-18 — PairIP)
    ├─ official GitHub fork ──► gustarmartins/GrindrPlus (GPL-3.0, ★59, v5.0.1-26.0.1 released 2026-05-31, commits to 2026-11-12)
    └─ declared lineage ──────► fatterdev/grindr-plus-plus (GPL-3.0, ★14, v5.0.0-dev released 2026-11-12, commits to 2026-11-18, ACTIVE)
                                   └── grindr-plus-plus-mt (THIS fork; + gustarmartins v5.0.1 hooks credit, commit c43f6c4)
```
- Only gustarmartins is an official GitHub fork (parent: R0rt1z2). R0rt1z2→fatterdev lineage is declared in README/releases, not GitHub fork metadata.
- All four: SPDX GPL-3.0 (R0rt1z2 exempts `old_base` only). Shared credits across 3 repos: rhunk/SnapEnhance partial code, VendettaManager.
- fatterdev README: "Credit lineage if you ship a derivative; do not present this tree as the archived GrindrPlus project."
- URL per repo: github.com/ElJaviLuki/GrindrPlus · github.com/R0rt1z2/GrindrPlus · github.com/gustarmartins/GrindrPlus · github.com/fatterdev/grindr-plus-plus (+ /releases/tags per report)

## Technical comparison (project-documented facts)
| | ElJaviLuki | R0rt1z2 | gustarmartins | fatterdev |
|---|---|---|---|---|
| Approach | Xposed (LSPosed/LSPatch) | same | same | **rootless LSPatch clone (`com.grindrapp.android.plus`) + libxposed API 102 (Vector)** |
| Released Grindr target | 9.9.1 (master 24.12.0 unreleased) | 25.20.0 (master 26.0.1 unreleased) | **26.0.1** | **26.16.1** (26.23.0+ PairIP SIGSEGV "not working") |
| Version spoof | version.json → AppConfiguration.b/c/z | version.json → `.d` + UA `grindr3/` rewrite | **version_spoof.json remote auto-update** → `.d` + UA rewrite (currently serves 26.24.0/195444) | latest_play.json + **mapping-pack field-name resolve** |
| JWT | pass-through re-injection only (`Authorization: Grindr3 $token`) | same | same | same — **no JWT forgery in any of the four** |
| Flag override | local hardcoded flags + `z4.h` hook | `q30.f` hook (client) | `q30.f` hook + **`/v3/assignment` HTTP response rewrite (AssignmentsInterceptor — ONLY in this fork)** | mapping-pack flag hook + clone reCAPTCHA flags off |
| PairIP | none | **cause of EOL** | unmarked | `PairIpEarlyBypass` + install-availability matrix |

Version-gate behavior: ElJaviLuki hard-disables on mismatch; R0rt1z2/gustarmartins pin per-release base APK; fatterdev removes hard gate via soft-fail mapping packs ("an unknown host never aborts the module").

## Feature claims (as each project's README states them — phrase as claims on the page)
Chat: command console `/help`, video calls in new chats, hide chat indicators, delete messages regardless of age · Media: unlimited expiring photos, view all received albums, screenshots · Global: ban details, spoof Android ID, reduced analytics, dev features, disable forced updates · Profiles/Location: BMI, boost indicator, copy ID, accurate distance, hidden server fields, teleport/spoof/saved locations · Premium-tier unlocks claimed: unlimited cascade, Explore Mode, advanced filters, zero third-party ads, saved phrases, no boost upsell, hide own views, incognito (partial/unstable per fatterdev known-issues).
Known limits (fatterdev): Incognito unstable; "Viewed Me" is server-side, NOT modifiable; Boost/Roaming disabled by default; chat filters moved server-side "won't work at all" (R0rt1z2 v4.6.0 note).

## D-13 (spoof datum, refinement of D-03)
Page spoof datum stays **26.24.0/195444** — baked in the mt tree (`hooks/DisableUpdates.kt:52`) AND matching gustarmartins' remote `version_spoof.json`. **Footnote required for honesty:** upstream fatterdev's availability matrix marks 26.23.0 PairIP "not working" and 26.24.0 `pairip: true, morphe: untested` (install-availability.json); the mt fork's own build/RELEASE-NOTES-v5.0.1-26.24.0.md documents its working custom build. Phrase as "this fork's build", never as upstream-endorsed.

## D-14 (§3 comparison honesty rules)
1. Mod-column facts = "as the project claims" phrasing; server-enforced items (Viewed Me, incognito-full, chat filters) rendered as limitations, consistent with D-04.
2. Xtra-tier column: the lineage research covers what mods UNLOCK (proxy for tier features) but contains no primary source for Grindr's official tier limits → Xtra facts must be phrased "as described by the mod projects" OR sourced from Grindr's public tier page before claiming specifics. No invented messaging limits.
3. Credit block: lineage tree above + shared credits (SnapEnhance, VendettaManager) + GPL-3.0 all four; must NOT present the tree as the archived GrindrPlus project (fatterdev's explicit condition).
