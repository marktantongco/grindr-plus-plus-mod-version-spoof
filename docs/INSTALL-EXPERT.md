# Install — expert

Assumes adb, a build toolchain and comfort with `pm`/`logcat`. Two paths:
**consume the release** or **build from source**.

## Constraints

- Host must be Grindr **26.0.1 / 149389**. Other versionCodes need a mapping refresh.
- Signature: `mtantongco.keystore` (alias `mtantongco`, pass `mtantongco`).
  `KeyStoreUtils` keeps the *clone* signing key in the manager's `cacheDir` — it dies
  with an uninstall, so every manager reinstall produces a fresh clone signature.
- Manager uninstall wipes `Android/data/com.grindrplus/`; the config migration also
  rebuilds the hook registry to defaults and drops global keys. Re-apply config after
  any reinstall.

## A. Consume the release

```bash
adb push GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk \
  /storage/emulated/0/Android/data/com.grindrplus/files/mod-v5.0.1-26.0.1.zip
adb push com.grindrapp.android_26.0.1-149389…apkm \
  /storage/emulated/0/Android/data/com.grindrplus/files/grindr-v5.0.1-26.0.1.zip
adb uninstall com.grindrapp.android      # clear stale same-package copies first
adb uninstall com.grindrplus
adb install GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk
adb shell pm grant com.grindrplus android.permission.POST_NOTIFICATIONS
# then drive the manager UI: Install → Understood → Install → confirm system prompt
```

## B. Build from source

```bash
./gradlew :app:assembleRelease -x lint          # ~2 min warm
BT=$ANDROID_HOME/build-tools/35.0.0
$BT/zipalign -f -p 4 app/build/outputs/apk/release/GPlus_*-release.apk aligned.apk
$BT/apksigner sign --ks mtantongco.keystore --ks-pass pass:mtantongco \
  --key-pass pass:mtantongco --out GPlus_tantongco-release.apk aligned.apk
```

Verify before shipping: `unzip -p GPlus_tantongco-release.apk classes3.dex | strings | grep -c experiment_`
should be non-zero.

## Configuration

All per-clone keys live under `clones.<package>` in
`Android/data/com.grindrplus/files/grindrplus.json`.

**Edit procedure (the manager rewrites the file from memory if it is running):**

```bash
adb shell am force-stop com.grindrplus
adb shell am force-stop <clonePkg>
adb pull …/grindrplus.json && <edit> && adb push …/grindrplus.json
adb shell monkey -p <clonePkg> -c android.intent.category.LAUNCHER 1
```

Useful keys:

| Key | Value | Effect |
|---|---|---|
| `android_device_id` | 16 hex | spoofed android_id |
| `experiment_<name>` | `control` / variant | JWT experiment override |
| `feature_flag_<Name>` | `true`/`false` | server feature flag |
| `dump_raw_assignments` | `true` | dump raw assignment/session payloads |
| `hooks["Disable boosting"].enabled` | `false` | enable boost/roam UI |
| `forced_coordinates` | `lat,lon` | location spoof |

## Marker files (no config edit needed)

```bash
touch …/files/<clonePkg>.android_id_regen     # fresh device ID on next start
printf '14.0723,-87.1921' > …/files/<clonePkg>.location
```

## Verification

```bash
adb logcat -d -s GrindrPlus:* | grep -E "experiments rewritten|Disable boosting is disabled"
```

- `Session experiments rewritten: N override(s) applied` = engine live
- `Hook Disable boosting is disabled.` = boost enabled

## Recovery

| Failure | Action |
|---|---|
| Login gate | spoof `26.24.0/195444`; force-stop both apps, open modded app first |
| Banned response in log | rotate device ID marker, relaunch |
| Clone crashes at launch | re-run Install (rebuilds splits) |
| Everything broken | uninstall both, redo section A |

## Hygiene

- One manager per device; two live clones waste storage and confuse log reading
- Keep `mtantongco.keystore` — losing it forces uninstall-before-install forever
- Rotate identity on ban only
