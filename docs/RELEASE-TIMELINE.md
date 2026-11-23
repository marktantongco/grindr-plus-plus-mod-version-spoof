# Release timeline

Chronological record of what was measured, built and shipped on this fork.
Each row is evidence-backed (device log, build log, or file hash) — not intent.

| # | Time (2026-11-23) | Event | Evidence |
|---|---|---|---|
| 1 | 09:34 | Audit start: upstream repo, APK payload `AAA-gpp.apk` (dev.fatter.gpp.morphe.payload, 179451 pack), termbin runtime log | `aapt dump badging`, log `trdm` |
| 2 | ~10:00 | Root causes isolated: remote 179451 pack ships `BanManagement.deviceUtility` empty (bundled has `d2b`); hook hard-codes method `"g"`; device-ban fingerprint unverified | pack JSON diff, `BanManagement.kt:96` |
| 3 | 10:12 | GrindrPlus v5.0.1 release APK downloaded, sha256 `2abec437…` verified against release metadata | `sha256sum` |
| 4 | 10:20 | Deep-research lane: Issue #21 confirms Nov-2026 login gate; community fix = spoof `195444` | GitHub issue/comment API |
| 5 | 10:35 | First custom build: smali patch `26.9.1/163471 → 26.24.0/195444`, apktool rebuild, custom keystore | apktool build log |
| 6 | 11:00 | Install: `INSTALL_FAILED_UPDATE_INCOMPATIBLE` traced to stale same-package copy in user 0 | `pm uninstall` success afterwards |
| 7 | 11:20 | LSPatch clone installed (27 splits); login gate cleared — reached `HomeActivityOriginal` | activity dump |
| 8 | 11:30 | Device identity rotation proven: `<clone>.android_id_regen` marker → fresh 16-hex ID `8813eb1a31524a1e` | config `android_device_id` |
| 9 | 11:38 | Assignment dump mode: session JWT decoded — `UnlimitedExpiringPhotos`, `UnsendMessage` granted via Honduras location | raw dump |
| 10 | 11:5x | Honduras/Nigeria tier bypass deployed `14.0723,-87.1921`; later reverted to real location | `forced_coordinates` |
| 11 | 12:20 | Source build pipeline stood up (AGP 8.10.1 / gradle 8.11.1); first build 2m16s | `BUILD SUCCESSFUL` |
| 12 | 12:35 | JWT experiment engine written (`rewriteSessionsExperiments`) + spoof defaults baked in Kotlin | source diff |
| 13 | 12:5x | Reinstall dance with `mtantongco` signature; live clone `com.grindrapp.android` patched `ab40f4a` | embedded module string check |
| 14 | 13:12 | **Engine proven**: `Session experiments rewritten: 4 override(s) applied` | device log |
| 15 | 13:2x | Gallery hygiene: 647 unmodified screenshots 2024-09→2026-08-24 trashed | `ls` counts |

## Version map

| Build | Signature | Module | Status |
|---|---|---|---|
| upstream v5.0.1 (`c43f6c4`) | upstream release key | original hooks | superseded |
| smali patch `26.24.0` | `gppcustom` | + spoof constants | superseded |
| **`ab40f4a` (this fork)** | **`mtantongco`** | + JWT experiment engine, baked spoof | **current** |
