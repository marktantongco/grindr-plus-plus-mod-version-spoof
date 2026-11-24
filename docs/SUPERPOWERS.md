# Superpowers

Five client-side primitives this fork exposes, ranked by leverage. All operate
**below** the app and **above** the server.

> Two entitlement axes exist. (a) What the *client believes* — roles, feature
> flags, experiments. (b) What the *server bills* — HTTP 402 `tiered_feature`.
> Everything here works on axis (a); axis (b) yields only to region spoofing.
> Always ask which axis a broken feature lives on before touching it.

## 1. Device identity rotation

```
touch …/files/<clonePkg>.android_id_regen   # arm
# restart app → module generates a fresh 16-hex android_id and consumes the marker
```

A banned device is a device fingerprint the server already scored. Rotation gives
it a new one. Verified: `8813eb1a31524a1e` → `e5d29dac22464f4e`.
Rotate **on ban**, not on schedule — a rotating fingerprint reads as a farm.

## 2. JWT experiment override

`AssignmentsInterceptor` rewrites the `experiments` map inside `/v8/sessions`
claims before the client parses it. One config line per experiment:

```json
"experiment_explore-paywall-profiles": "control",
"experiment_limiting_chat_credits_from_unlimited_to_5_for_xtra_users_in_explore": "control"
```

Signature is preserved (payload re-encoded; the client does not verify the
resource-token signature). Proven: `Session experiments rewritten: 4 override(s) applied`.
Discover candidates with `dump_raw_assignments: true` — raw payloads land in the log.

## 3. Feature-flag console

`core/FeatureDefinitions.kt` holds ~100 server flags. Each is forceable per clone
via `feature_flag_<Name>` (`true`/`false`), e.g. `feature_flag_ComposeRework: false`
reverts the album UI to the pre-rework path. Unreleased features ship disabled by
flag; the client renders whatever the flag says.

## 4. Retrofit response forging

`RetrofitUtils.hookService` + `createSuccess` let any service method return a
locally-forged `Success`. `UnlimitedAlbums` uses it for album payloads;
`BanManagement` for the login result. Extend it to any endpoint to build a local
entitlements layer.

`UnlimitedAlbums` doubles as the reference failure path: it calls `v2/albums/{albumId}`
(the app's own endpoint — `v1` answers a bare `404` body that breaks `JSONObject`),
gates parsing on `code in 200..299`, and falls back to the local album DB rather than
returning the untouched error.

## 5. Geographic tier bypass

```
printf '14.0723,-87.1921' > …/files/<clonePkg>.location   # Honduras
# revert: 0.0,0.0 or delete the file
```

Honduras/Nigeria get `UnlimitedExpiringPhotos`, `UnsendMessage` and album-share
entitlements on free accounts (HTTP 402 tier). Verified in the session JWT.

## Supporting surfaces

- **Chat terminal** — `/`-prefixed commands routed through `CommandHandler`
- **Multi-clone** — manager suffixes `.one`, `.two`… each with its own device ID and config
- **Local media capture** — expiring media saved to `filesDir/saved_media/{images,videos}`

## Verified vs. not

| Working (device-verified) | Working (code-verified only) | Server-enforced, no client fix |
|---|---|---|
| identity rotation, experiment override, roles spoof, expiring-media save, album forge path, boost/WS toggles | flag console, terminal commands, multi-clone | "Viewed Me", true incognito, message-send entitlement, age verification |
