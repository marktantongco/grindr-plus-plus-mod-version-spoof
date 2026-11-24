# GPlus v5.0.1-26.24.0 spoof (mtantongco)

**Module** `5.0.1-26.0.1_ab40f4a` · **Host** Grindr `26.0.1 / 149389` · **Signature** `mtantongco`
**APK** `GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk`

Built on `gustarmartins/GrindrPlus` v5.0.1 (`c43f6c4`) with the fork's spoof defaults and
`AssignmentsInterceptor` JWT experiment engine. Not affiliated with Grindr LLC. GPL-3.0.

---

## What changed in this build

### 1. Album loading: `v1` → `v2` + real HTTP status handling

`UnlimitedAlbums.handleGetAlbum` requested `GET https://grindr.mobi/v1/albums/{albumId}` and
parsed the body **regardless of status code**. The v1 endpoint answers `404` with a bare
integer body on albums the viewer is not entitled to, so `JSONObject("404")` threw:

```
Error parsing album content: Value 404 of type java.lang.Integer cannot be converted to JSONObject
  at UnlimitedAlbums.parseAlbumContent(UnlimitedAlbums.kt:446)
  at UnlimitedAlbums.handleGetAlbum$lambda$8(UnlimitedAlbums.kt:379)
```

That error was swallowed by the outer `catch`, which fell back to the local album DB — where
the album is not present either (`Album <id> not found in database`) — so the chat album
rendered blank and slow, retrying on every open.

Three coordinated fixes, all in `UnlimitedAlbums.kt`:

| Line | Before | After |
|---|---|---|
| ~374 | `v1/albums/$albumId` | `v2/albums/$albumId` |
| ~376 | parse any non-empty body | `if (code in 200..299 && body non-empty)` else DB fallback |
| ~397 | `if (!originalResult.isSuccess()) return originalResult` (aborts DB fallback on 404) | guard removed — DB fallback now runs on 404 |
| ~488 | `loge("Album object not found")` then fall through | `return fetchAlbumFromDatabase(...)` |

The `v2` endpoint is the one the app itself calls (`handleGetAlbum` hook target
`v2/albums/{albumId}`), so the forged payload now comes from the same shape the client
expects. HTTP failures are logged with the status code instead of masquerading as parse errors.

**Verified on device:** `Initialized hook: Unlimited albums` after install; the `v1`
`Value 404` stack traces stop recurring on the new module.

### 2. Carry-over from the fork base (unchanged, restated for completeness)

* Spoof defaults compiled to `26.24.0 / 195444` — clears the Nov-2026 "Update Required" login gate and survives a manager config wipe.
* `AssignmentsInterceptor` rewrites the session JWT `experiments` map from `experiment_<name>` config keys. Proven: `Session experiments rewritten: 4 override(s) applied`.
* `mtantongco` signature — uninstall any other GrindrPlus signature before installing.

---

## Install

```bash
# 1. both apps force-stopped first — the manager rewrites grindrplus.json while running
adb shell am force-stop com.grindrplus
adb shell am force-stop com.grindrapp.android

# 2. install over the existing clone (same mtantongco signature)
adb install -r GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk

# 3. re-open the manager, Install → use the existing host bundle, then launch
adb shell monkey -p com.grindrapp.android -c android.intent.category.LAUNCHER 1
```

Full walkthroughs: [docs/INSTALL-BEGINNER.md](docs/INSTALL-BEGINNER.md) ·
[docs/INSTALL-EXPERT.md](docs/INSTALL-EXPERT.md)

---

## Known state at release

| Item | State |
|---|---|
| Album loading | endpoint + status fix shipped; blank/slow retry loop removed |
| Location spoofer + Always Online | enabled together, stable on `ab40f4a` |
| `Always Online` first run | logs `Cascade fetch failed: HTTP 401` until the session token refreshes — self-clears |
| Assignments interceptor | **off** by default in this build's pushed config; enable when you want experiments forced |
| `feature_flag_ComposeRework` | `on` (album UI rework path); set `off` to test the pre-rework path |

Server-enforced and still unfixed client-side: "Viewed Me", true incognito, message-send
entitlement, age verification. See [docs/SUPERPOWERS.md](docs/SUPERPOWERS.md).

---

## Checksums

```
APK    GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk
md5    cf1b492996ba055e5aae330f7b269ec2
sha1   c021e210b9278303fa9230f92c61e740a08e3e84
sha256 19e0f2c7905aa06dc8831e5dccd469962c9390910581616aea348ff1db49ae64
signer CN=mtantongco, OU=GPlus, O=mtantongco, C=PH
cert   SHA-256 cafb0888b63cf7b39ec58083cb0da060ad0641a95bda605049517dac1afe76be
```

Host bundle: `com.grindrapp.android_26.0.1-149389_4arch_7dpi_15lang_6fdec45ac310df6a13d0957e00497841_apkmirror.com.apkm`
