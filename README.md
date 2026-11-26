<div align="center">

<img src="docs/assets/banner.svg" alt="grindr-plus-plus-mod-version-spoof" width="100%">

# grindr-plus-plus-mod-version-spoof

**The mod, measured.** A fork of Grindr++ that bakes the version spoof into the build,
rewrites Grindr's own A/B experiments client-side, and fixes the album path upstream
left broken — with numbers from a physical device, not vibes.

`GPL-3.0` · `Kotlin / LSPatch module` · `signed: mtantongco` · `not affiliated with Grindr LLC`

[**Live site**](https://marktantongco.github.io/grindr-plus-plus-mod-version-spoof/) ·
[**Docs**](https://marktantongco.github.io/grindr-plus-plus-mod-version-spoof/ARCHITECTURE.html) ·
[**Releases**](https://github.com/marktantongco/grindr-plus-plus-mod-version-spoof/releases) ·
[**Vercel mirror**](https://web-theta-livid-46.vercel.app)

</div>

---

## Table of contents

| | |
|---|---|
| [0. Start here](#0-start-here) | [6. The config model](#6-the-config-model) |
| [1. Why this fork exists](#1-why-this-fork-exists) | [7. The one rule](#7-the-one-rule) |
| [2. Fork vs. every other option](#2-fork-vs-every-other-option) | [8. Supported host](#8-supported-host) |
| [3. Feature matrix](#3-feature-matrix) | [9. Build from source](#9-build-from-source) |
| [4. What is actually different in this tree](#4-what-is-actually-different-in-this-tree) | [10. Troubleshooting](#10-troubleshooting) |
| [5. Download and install](#5-download-and-install) | [11. Docs index / licence / credit](#11-docs-index--licence--credit) |

---

## 0. Start here

Three paths, pick the one that matches you. **Every path is complete on its own.**

<table>
<tr><td width="33%" valign="top">

### 🧑‍💻 I just want it working

No terminal. ~15 minutes.

→ [INSTALL-BEGINNER](docs/INSTALL-BEGINNER.md)

Files you need are on the [release page](https://github.com/marktantongco/grindr-plus-plus-mod-version-spoof/releases). Uninstall stock Grindr first —
the signature differs.

</td><td width="33%" valign="top">

### 🛠️ I have adb

Scripted, split-install aware, config push included.

→ [INSTALL-EXPERT](docs/INSTALL-EXPERT.md)

Covers the `INSTALL_FAILED_UPDATE_INCOMPATIBLE` dance and stale-copy cleanup.

</td><td width="33%" valign="top">

### 🔬 I want to know how it works

Hook dispatch, the spoof layer, the experiment engine, the album forge.

→ [ARCHITECTURE](docs/ARCHITECTURE.md) · [DIAGRAM](docs/DIAGRAM-BYPASS.md)

Every claim in those docs is traceable to a file and a line.

</td></tr>
</table>

> ⚠️ **Read [The one rule](#7-the-one-rule) before editing config.** The manager rewrites
> the file from memory while it runs; an edit made with the manager open is silently lost.

---

## 1. Why this fork exists

GrindrPlus is an LSPatch/LSPosed module that hooks the Grindr client. Upstream targets one
Grindr build per release and stops there. Three concrete things break that model, and this
fork exists to fix exactly those three:

<table>
<tr><th width="30%">Problem</th><th width="45%">What Grindr does</th><th width="25%">What this fork does</th></tr>
<tr><td><b>The login wall</b></td><td>The Nov-2026 build answers older clients with an <i>"Update Required"</i> wall. Upstream ships a config-time spoof that a config wipe erases.</td><td>A spoof pair <b>compiled into the module</b> (<code>26.24.0 / 195444</code>). Survives a config wipe.</td></tr>
<tr><td><b>Server-owned A/B tests</b></td><td>Experiments arrive as JWT claims in <code>/v8/sessions</code>. Upstream has no override path at all.</td><td><code>AssignmentsInterceptor</code> rewrites the claim map client-side before the app parses it.</td></tr>
<tr><td><b>Blank chat albums</b></td><td>Upstream's <code>UnlimitedAlbums</code> calls <code>v1</code>, which answers a bare <code>404</code> integer body for unentitled and foreign albums. <code>JSONObject("404")</code> throws, album renders empty.</td><td><code>v2</code> endpoint + a <code>bodyIsJsonObject</code> gate + local-DB fallback. Proven on device.</td></tr>
</table>

That is the whole thesis: **client-side levers, applied below the app and above the server,
with a real failure path instead of a happy-path forge.**

And it is measured. On a physical device, the chat composer paints in **33 ms** — one 30 fps
frame, 8 of 8 valid samples — while the photo behind it keeps decoding and settles at a **1.68 s**
median of 4. Those are two numbers because they are two different things, and the page says so
instead of averaging them into one flattering figure. Profile-open and chat-close are still being
captured and render as an empty lamp, never a placeholder digit.

---

## 2. Fork vs. every other option

Read this table before picking a mod. Rows are the options people actually try; columns are
the things that decide whether it survives contact with a real device.

### 2.1 Mods and clients

| Option | Login gate cleared | A/B override | Chat albums | Maintained | Evidence shipped |
|---|---|---|---|---|---|
| **grindr-plus-plus-mod-version-spoof** (this) | ✅ compiled default | ✅ JWT rewrite + flag console | ✅ `v2` + gate + DB fallback | ✅ Nov-2026 | ✅ device log, frame-indexed |
| `fatterdev/grindr-plus-plus` (parent) | ⚠️ config-time only | ❌ | ❌ `v1`, throws on `404` body | ⚠️ | ❌ |
| `gustarmartins/GrindrPlus` v5.0.1 | ⚠️ config-time only | ❌ | ❌ | ❌ frozen at v26.0.1 | ❌ |
| `R0rt1z2/GrindrPlus` | ❌ | ❌ | ❌ | ❌ archived | ❌ |
| `ElJaviLuki/GrindrPlus` (origin) | ❌ | ❌ | ❌ | ❌ archived | ❌ |
| OpenGrind (from-scratch Tauri client) | n/a — not a mod | ❌ no JWT claim access | n/a | ✅ | ✅ API spec published |
| Xtra subscription | ✅ (official) | ❌ | ✅ | ✅ | ❌ |

**Why the fork wins on every row that matters:** it is the only option that both clears the
gate *and* keeps working after the next config wipe, because the spoof is a compiled constant
rather than a JSON key. It is also the only mod that ships a device-verified album fix with the
root cause written down (`200` + body `404`), so the next person can audit it instead of
guessing.

### 2.2 Against a paid subscription

| | Free Grindr | Grindr Xtra | This fork |
|---|---|---|---|
| Cost | 0 | monthly | 0 |
| Chat / browse | ✅ | ✅ | ✅ |
| Daily boost cap | capped | higher | cap untouched (server) |
| Ad slot | ✅ ads | ❌ no ads | ads remain (server-side) |
| Experiment control | ❌ | ❌ | ✅ per-experiment |
| Feature flags | ❌ | ❌ | ✅ ~100 forceable |
| Expiring-media save | ❌ | ✅ | ✅ local capture |
| Albums | 1 path, capped | more | ✅ unlimited, foreign too |
| Composer latency (measured) | — | — | **33 ms** to painted, one 30 fps frame, N=8 of 18 |
| Content settle (measured) | — | — | **1.68 s** median of 4, labelled content not composer |
| "Viewed Me" / incognito / send-entitlement / age check | ❌ | ✅ | ❌ server-enforced |

Honest read: the fork replaces the *client-belief* half of Xtra and cannot touch the
*server-bills* half. [SUPERPOWERS § axes](docs/SUPERPOWERS.md) names that boundary explicitly
instead of hiding it.

### 2.3 Against other fork trees (what you would have to redo)

A fork of upstream inherits four landmines this tree has already cleared:

| Landmine | Cost if you fork upstream instead |
|---|---|
| `v1` album path | every unentitled and foreign album throws `Value 404 … cannot be converted to JSONObject` |
| Config-time spoof | a manager reinstall wipes it and the login wall returns |
| No JSON-object gate | `code in 200..299` passes on a bare `404` body and parsing still throws |
| No DB fallback | a refused album is a blank panel, not a cached one |

### 2.4 Reverse-engineering toolchain verdict

The toolchain was chosen by measurement, not fashion — [RE-TOOLCHAIN-VERDICT](docs/RE-TOOLCHAIN-VERDICT.md)
records the full comparison, including the candidates that were **rejected** and why
(BlackBox dissolved 2024-04, BlackDex caps at Android 12, both key/dex utilities archived 2022,
Compose tooling pointless against 132 `.kt` hook files with 0 `@Composable`).

---

## 3. Feature matrix

| Feature | Status | Notes |
|---|---|---|
| Login-gate bypass (spoof `26.24.0`) | ✅ works | compiled default, no config needed |
| Device identity rotation | ✅ works | `.android_id_regen` marker → fresh 16-hex ID |
| JWT experiment override | ✅ works | `experiment_*` keys, proven `4 override(s) applied` |
| Roles / VIP spoof | ✅ works | `Enable unlimited` role injection |
| Expiring-media save | ✅ works | lands in `filesDir/saved_media/` |
| Unlimited albums (chat, foreign too) | ✅ works | `v2` + JSON-object gate + DB fallback |
| Always Online | ✅ works, fragile | needs location; first run logs `HTTP 401` until token refresh |
| Location spoofer | ✅ works | keep **off** while opening Settings → Terms |
| Boosting / keep-alive WS | ✅ works | config toggles |
| Assignments interceptor | ✅ works, opt-in | **off** in the shipped config |
| "Viewed Me" | 🚫 server-enforced | no client fix |
| True incognito | 🚫 server-enforced | no client fix |
| Message-send entitlement | 🚫 server-enforced | region spoof reaches the 402 tier only |
| Age verification | 🚫 server-enforced | upstream Ofcom notice |

Legend: ✅ client-side and working · 🚫 server decides, no client lever exists.
The 🚫 rows are listed so you never file a bug for something structurally impossible.

---

## 4. What is actually different in this tree

Every row is a file plus a line. Audit any of them.

| Change | Why | Where |
|---|---|---|
| Spoof defaults **compiled** to `26.24.0 / 195444` | the Nov-2026 login gate; survives a config wipe | `hooks/DisableUpdates.kt:52` |
| `AssignmentsInterceptor` rewrites the session JWT `experiments` map | client-side A/B override from config keys | `hooks/AssignmentsInterceptor.kt` |
| Album hook on `v2/albums/{albumId}` with real status handling | `v1` returns bare `404`, which broke JSON parsing → blank chat albums | `hooks/UnlimitedAlbums.kt:374` |
| DB fallback on non-2xx instead of aborting | an unentitled album should still render from the local cache | `hooks/UnlimitedAlbums.kt:397` |
| `bodyIsJsonObject` gate on the album response | Grindr answers some foreign albums `HTTP 200` **and the bare body `404`**, so a 2xx code alone still threw | `hooks/UnlimitedAlbums.kt:383` |
| Same guard re-checked inside `parseAlbumContent` | no other caller can reintroduce the throw | `hooks/UnlimitedAlbums.kt:456` |
| Docs: timeline, superpowers, both install levels, diagrams | upstream README assumes you already know the mod | `docs/` |

---

## 5. Download and install

Latest release: **`GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk`** — see [Releases](https://github.com/marktantongco/grindr-plus-plus-mod-version-spoof/releases).
Release notes: [RELEASE-NOTES-v5.0.1-26.24.0.md](RELEASE-NOTES-v5.0.1-26.24.0.md).

```text
1. Uninstall Grindr and every other mod (check Secure Folder / Parallel Space / Private Space)
2. Install the manager APK from Releases
3. Grant the notification permission
4. Copy the host bundle + manager into Android/data/com.grindrplus/files/
5. Open the manager, let it embed, launch the clone
6. Open Status Dialog — a skipped hook is not a working hook
```

Host bundle: Grindr `26.0.1 / 149389`, 4-arch APKM. Full step detail with checks at
[INSTALL-BEGINNER](docs/INSTALL-BEGINNER.md) or [INSTALL-EXPERT](docs/INSTALL-EXPERT.md).

---

## 6. The config model

Everything lives in
`/storage/emulated/0/Android/data/com.grindrplus/files/grindrplus.json`, keyed per clone package:

```json
{
  "clones": {
    "com.grindrapp.android": {
      "hooks": { "Location spoofer": { "enabled": true } },
      "tasks": { "Always Online": { "enabled": true } },
      "feature_flag_ComposeRework": "on",
      "experiment_explore-paywall-profiles": "control",
      "android_device_id": "e5d29dac22464f4e"
    }
  }
}
```

| Key | Values | Meaning |
|---|---|---|
| `hooks` / `tasks` | booleans | mirror the manager toggles **exactly** |
| `feature_flag_<Name>` | `on` / `off` | one of ~100 flags in `core/FeatureDefinitions.kt` |
| `experiment_<name>` | `control` / treatment | rewritten into the session JWT |
| `android_device_id` | 16 hex | spoofed fingerprint; rotate **on ban**, not on schedule |

---

## 7. The one rule

**Edit config only with both apps force-stopped.** The manager rewrites the file from memory
while it runs.

```bash
adb shell am force-stop com.grindrplus && adb shell am force-stop <clonePkg>
# edit, push
adb shell monkey -p <clonePkg> -c android.intent.category.LAUNCHER 1
```

A manager uninstall wipes `Android/data/com.grindrplus/` entirely, and its config migration
resets every clone customization plus the global spoof and Maps keys — re-apply after any
manager reinstall.

---

## 8. Supported host

`26.0.1 / 149389` only. Every Grindr bump invalidates obfuscated symbols; hooks soft-fail to a
silent partial instead of crashing the host. After any update, open **Status Dialog**.

---

## 9. Build from source

```bash
./gradlew assembleRelease        # AGP 8.10.1 / Gradle 8.11.1 / JDK 21
apksigner sign --ks mtantongco.keystore --ks-key-alias mtantongco \
  --out GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk \
  app/build/outputs/apk/release/GPlus_v5.0.1-26.0.1_ab40f4a-release.apk
apksigner verify --print-certs GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk
```

Signing: keystore `mtantongco.keystore`, alias `mtantongco`, pass `mtantongco`. Different
signature from upstream — **uninstall before switching**. Losing this key forces the uninstall
dance on every future build.

CI: `.github/workflows/build_apk.yml` runs the same pipeline and uploads the signed APK as an
artifact (plus Telegram when the input is set).

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Update Required" login wall | spoof pair missing | confirm `26.24.0 / 195444` in manager Settings |
| Settings → Terms is a black page | spoofer active during load | disable spoofer, open Terms, re-enable |
| Always Online `HTTP 401` | stale session token | wait for refresh or relaunch the clone |
| Always Online `location unavailable` | spoofer off + Android standby | re-enable spoofer or disable the task |
| Chat album blank / slow | old module on `v1`, or no JSON-object gate | install this build |
| Crash loop after enabling several hooks | interceptor + Always Online + no location | disable in reverse order |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | different signature installed | `adb uninstall <pkg>`, then install |

Log: `/storage/emulated/0/Android/data/com.grindrplus/files/grindrplus.log`.

---

## 11. Docs index / licence / credit

| Doc | Contents |
|---|---|
| [INSTALL-BEGINNER](docs/INSTALL-BEGINNER.md) | no-adb path, file manager, checks |
| [INSTALL-EXPERT](docs/INSTALL-EXPERT.md) | adb, split install, config push |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | hook dispatch, spoof layer, experiment engine |
| [DIAGRAM-BYPASS](docs/DIAGRAM-BYPASS.md) | the login-gate decision path |
| [SUPERPOWERS](docs/SUPERPOWERS.md) | the five client-side primitives + the axis boundary |
| [RELEASE-TIMELINE](docs/RELEASE-TIMELINE.md) | evidence-backed build history |
| [RE-TOOLCHAIN-VERDICT](docs/RE-TOOLCHAIN-VERDICT.md) | toolchain comparison, rejections included |

### Credit

This tree descends from [fatterdev/grindr-plus-plus](https://github.com/fatterdev/grindr-plus-plus) →
[R0rt1z2/GrindrPlus](https://github.com/R0rt1z2/GrindrPlus) →
[ElJaviLuki/GrindrPlus](https://github.com/ElJaviLuki/GrindrPlus); hooks come from
[gustarmartins/GrindrPlus](https://github.com/gustarmartins/GrindrPlus) v5.0.1 (`c43f6c4`).
Full attribution: [NOTICE](NOTICE).

### Licence

GPL-3.0 — see [LICENSE](LICENSE). Credit the lineage if you ship a derivative; do not present
this tree as the archived GrindrPlus project.
