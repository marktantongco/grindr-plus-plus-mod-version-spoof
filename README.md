<p align="center"><img src="docs/assets/banner.svg" alt="grindr-plus-plus-mt" width="100%"></p>

# grindr-plus-plus-mt

**A fork of Grindr++ with a version-spoof bake-in, a client-side A/B experiment engine, and a
working unlimited-albums path.**

Signed with `mtantongco`. Built on GrindrPlus v5.0.1 for host **26.0.1 (149389)**.
Not affiliated with Grindr LLC.

> **Fork notice.** This tree descends from
> [fatterdev/grindr-plus-plus](https://github.com/fatterdev/grindr-plus-plus) →
> [R0rt1z2/GrindrPlus](https://github.com/R0rt1z2/GrindrPlus) →
> [ElJaviLuki/GrindrPlus](https://github.com/ElJaviLuki/GrindrPlus), and its hooks come from
> [gustarmartins/GrindrPlus](https://github.com/gustarmartins/GrindrPlus) v5.0.1 (`c43f6c4`).
> Full attribution: [NOTICE](NOTICE). GPL-3.0.

---

## Table of contents

1. [What this fork is](#what-this-fork-is)
2. [What this fork adds](#what-this-fork-adds)
3. [Download and install](#download-and-install)
4. [The config model](#the-config-model)
5. [The one rule](#the-one-rule)
6. [Supported host](#supported-host)
7. [Feature matrix](#feature-matrix)
8. [Known limits](#known-limits)
9. [Signing](#signing)
10. [Building from source](#building-from-source)
11. [Troubleshooting](#troubleshooting)
12. [Docs index](#docs-index)
13. [Licence](#licence)

---

## What this fork is

GrindrPlus is an LSPatch/LSPosed module that hooks the Grindr client. Upstream targets a
specific Grindr build per release. This fork exists to solve three problems upstream does not:

1. **Grindr ships login gates.** The Nov-2026 build refused older clients with an
   "Update Required" wall. A version-spoof pair compiled into the module clears it.
2. **Grindr ships A/B experiments as JWT claims.** Upstream has no way to override them.
   `AssignmentsInterceptor` rewrites the claim map client-side before the app parses it.
3. **Grindr moved the album endpoint.** Upstream's `UnlimitedAlbums` still calls `v1`, which
   answers `404` with a non-JSON body on unentitled albums, so chat albums render blank.

## What this fork adds

| Change | Why | Where |
|---|---|---|
| Spoof defaults **compiled** to `26.24.0 / 195444` | the Nov-2026 login gate; survives a config wipe | `hooks/DisableUpdates.kt:52` |
| `AssignmentsInterceptor` rewrites the session **JWT `experiments`** map | client-side A/B override from config keys | `hooks/AssignmentsInterceptor.kt` |
| Album hook on **`v2/albums/{albumId}`** with real status handling | `v1` returns bare `404`, which broke JSON parsing → blank chat albums | `hooks/UnlimitedAlbums.kt:374` |
| DB fallback on non-2xx instead of aborting | an unentitled album should still render from the local cache | `hooks/UnlimitedAlbums.kt:397` |
| Docs: timeline, superpowers, both install levels, diagrams | the upstream README assumes you already know the mod | `docs/` |

## Download and install

Latest release: **`GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk`** — see
[Releases](../../releases). Release notes for this build:
[RELEASE-NOTES-v5.0.1-26.24.0.md](RELEASE-NOTES-v5.0.1-26.24.0.md).

- **New to this?** → [docs/INSTALL-BEGINNER.md](docs/INSTALL-BEGINNER.md)
- **Have adb?** → [docs/INSTALL-EXPERT.md](docs/INSTALL-EXPERT.md)
- **How it works** → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **What it can do** → [docs/SUPERPOWERS.md](docs/SUPERPOWERS.md)
- **What shipped when** → [docs/RELEASE-TIMELINE.md](docs/RELEASE-TIMELINE.md)

Host bundle (Grindr `26.0.1 / 149389`, 4-arch APKM): install through the manager, or push it
manually if the remote fetch fails.

## The config model

Everything lives in
`/storage/emulated/0/Android/data/com.grindrplus/files/grindrplus.json`, keyed per clone
package:

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

* `hooks` / `tasks` — booleans, mirror the manager toggles **exactly**.
* `feature_flag_<Name>` — `on` / `off` per server flag (~100 defined in `core/FeatureDefinitions.kt`).
* `experiment_<name>` — `control` / treatment, rewritten into the session JWT.
* `android_device_id` — the spoofed device fingerprint; rotate on ban, not on schedule.

The manager **rewrites this file from memory while it runs**, so an edit made with the manager
open is silently lost. See the next section.

## The one rule

Edit config only with **both apps force-stopped**.

```bash
adb shell am force-stop com.grindrplus && adb shell am force-stop <clonePkg>
# edit, push
adb shell monkey -p <clonePkg> -c android.intent.category.LAUNCHER 1
```

A manager uninstall wipes `Android/data/com.grindrplus/` entirely and its config migration
resets every clone customization plus the global spoof and Maps keys — re-apply after any
manager reinstall.

## Supported host

`26.0.1 / 149389` only. Each Grindr bump invalidates obfuscated symbols; hooks soft-fail to a
silent partial rather than crashing. After any update, open **Status Dialog** — a skipped hook
is not a working hook.

## Feature matrix

| Feature | Status | Notes |
|---|---|---|
| Login-gate bypass (spoof `26.24.0`) | works | compiled default, no config needed |
| Device identity rotation | works | `.android_id_regen` marker → fresh ID |
| JWT experiment override | works | `experiment_*` keys, proven `4 override(s) applied` |
| Roles / VIP spoof | works | `Enable unlimited` role injection |
| Expiring-media save | works | lands in `filesDir/saved_media/` |
| Unlimited albums (chat) | works | `v2` endpoint + DB fallback, this build |
| Always Online | works, fragile | needs location; first run logs `HTTP 401` until the token refreshes |
| Location spoofer | works | keep **off** while opening Settings → Terms (legal CDN blocks the spoof) |
| Boosting / keep-alive WS | works | config toggles |
| Assignments interceptor | works, opt-in | **off** in the shipped config |
| "Viewed Me" | server-enforced | no client fix |
| True incognito | server-enforced | no client fix |
| Message-send entitlement | server-enforced | region spoof reaches the 402 tier only |
| Age verification | server-enforced | see the upstream Ofcom notice |

## Known limits

Server-enforced, no client fix: **"Viewed Me"**, true incognito, message-send entitlement, age
verification. Region spoofing (Honduras/Nigeria) is the only lever that reaches the 402 tier —
see [docs/SUPERPOWERS.md](docs/SUPERPOWERS.md#5-geographic-tier-bypass).

## Signing

`mtantongco.keystore` — alias `mtantongco`, pass `mtantongco`. A different signature from
upstream release and debug builds: **uninstall before switching**. Losing this key forces the
uninstall dance on every future build.

## Building from source

```bash
./gradlew assembleRelease        # AGP 8.10.1 / Gradle 8.11.1 / JDK 21
apksigner sign --ks mtantongco.keystore --ks-key-alias mtantongco \
  --out GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk \
  app/build/outputs/apk/release/GPlus_v5.0.1-26.0.1_ab40f4a-release.apk
apksigner verify --print-certs GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk
```

`.github/workflows/build_apk.yml` does the same in CI and uploads the signed APK as an
artifact (plus Telegram when the input is set).

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Update Required" login wall | spoof pair missing from config | confirm `26.24.0 / 195444` in manager Settings |
| Settings → Terms is a black page | location spoofer active during load | disable spoofer, open Terms, re-enable |
| Always Online `HTTP 401` | stale session token | wait for token refresh, or relaunch the clone |
| Always Online `location unavailable` | spoofer off and Android standby | re-enable spoofer or disable the task |
| Chat album blank / slow | old module on the `v1` album path | install this build |
| Crash loop after enabling several hooks | interceptor + Always Online + no location | disable in the reverse order you enabled them |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | different signature installed | `adb uninstall <pkg>`, then install |

Log: `/storage/emulated/0/Android/data/com.grindrplus/files/grindrplus.log`.

## Docs index

| Doc | Contents |
|---|---|
| [INSTALL-BEGINNER](docs/INSTALL-BEGINNER.md) | no-adb path, file manager, checks |
| [INSTALL-EXPERT](docs/INSTALL-EXPERT.md) | adb, split install, config push |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | hook dispatch, spoof layer, experiment engine |
| [DIAGRAM-BYPASS](docs/DIAGRAM-BYPASS.md) | the login-gate decision path |
| [SUPERPOWERS](docs/SUPERPOWERS.md) | the five client-side primitives |
| [RELEASE-TIMELINE](docs/RELEASE-TIMELINE.md) | evidence-backed build history |
| [RELEASE-NOTES-v5.0.1-26.24.0](RELEASE-NOTES-v5.0.1-26.24.0.md) | this build's changes |

## Licence

GPL-3.0 — see [LICENSE](LICENSE). Credit the lineage if you ship a derivative; do not present
this tree as the archived GrindrPlus project.
