# Reverse-Engineering Toolchain Verdict — OpenGrind

## Framing

OpenGrind is a from-scratch client (Tauri/Rust `src-tauri/src/api/*` — 86 files, Kotlin `src-tauri/android-logic`, TS/Svelte UI) over a **fully documented Grindr HTTP API** (`docs/content/grindr-api/…`, spec v26.22.0, published at `opengrind.org/grindr-api`). Reverse engineering here is **API-spec-driven**, not packer/APK-decompile driven.

Local clone ground truth (measured, not assumed): 4117 archive entries, 3 plain `classes*.dex`, **no packer** (no `libjiagu`, `libDexHelper`, `libshella`, `libmobisec`), 19 Compose version markers, 55 `@Composable`-annotated smali classes, `profileV2` hooks under `com.grindrplus.hooks`. The Grindr Plus module itself has 132 `.kt` hook files and **0** `@Composable` usages — Compose tooling targets the client, not the module.

Conclusion: the stack needs apktool/jadx plus Frida — not unpackers, not Compose tooling.

## Candidate comparison

| Candidate | Role | Verdict |
|---|---|---|
| **`ax/apk.sh`** | Pull APK → join splits (fixes public resource IDs) → apktool decode/build → zipalign → apksigner → frida-gadget patch | **Chosen — ONE integrated backbone** (~3.8k stars, last commit 2026-01-26). Requires a keystore patch: upstream hardcodes `my-new.keystore` (CN=noway / password). |
| **`zinja-coder/jadx-ai-mcp` v6.5.0** | Agent-driven static smali reading | **Chosen co-pilot.** Needs the modified `jadx-ai` fork / `jadx-gui`, not upstream jadx 1.5.1. Ships `jadx-ai-mcp-6.5.0.jar` + `jadx-mcp-server-6.5.0.zip`. |
| `zinja-coder/apktool-mcp-server` | MCP wrapper for apktool | Adjunct — runs alongside the apktool already in use. |
| `apk-mitm` | HTTPS inspection | Adjunct — use only where the API spec is silent. |
| `sam1am/anyapk` | Split installs | Adjunct — matches the 27-APK install flow. |
| `reverse-skill` | 45k-star skill-router pack | Playbook only — thin `skills/apk-reverse/SKILL.md`; not a tool. |
| BlackBox | Unpacker | Rejected — dissolved 2024-04. |
| BlackDex | Unpacker | Rejected — 2022, Android ≤12, and there is no packer to defeat. |
| keyfinder / Diggy | Key/dex utilities | Rejected — both archived 2022. |
| compose-stability-analyzer | Compose tooling | Rejected — IDE/Gradle-only; 0 Compose hooks in the module. |
| `newliver666/apk-reverse` | — | Rejected — 404. |

## Apktool critique

Apktool 3.0.3 is the de-facto backbone — it decoded the live clone into `smali_classes*` and is why the `UnlimitedAlbums.kt` fix could be produced at all. But it is a **single-step tool**: decode ↔ build, nothing more. It does not join splits, does not align, does not sign, and does not inject Frida. `apk.sh` is valuable precisely because it wraps apktool and adds those four steps — the same steps that had to be hand-rolled the hard way (incomplete-rebuild boot crashes from missing `classes.dex`, `resources.arsc`, and `assets/lspatch/so/*/liblspatch.so`). Apktool is necessary but not sufficient; and for OpenGrind's actual work it is **secondary** — the authoritative source is the published API spec, with apktool used only to verify observed hook/smali behavior against the clone.

## Picked stack

Patched `ax/apk.sh` (mtantongco keystore) as the single integrated tool, with `jadx-ai-mcp` for agent-driven static reading. `apk-mitm` and `anyapk` on standby.

## Contrarian alternative (recorded, not adopted)

With a complete API spec, `jadx-ai-mcp` may be unnecessary: plain jadx 1.5.1 plus grep could cover ~90% of the static reading actually performed. Revisit if MCP setup cost outweighs use.

## Verification evidence that drove this work

The foreign-album 404 fix is proven on device: `creating placeholder` is emitted only by `fetchAlbumFromDatabase`, which the new `bodyIsJsonObject` guard routes to. The newest hit is `2026-11-26 00:05:48`, album `182234570`, post-install on the patched clone, whose base APK is byte-identical to the built `clone-patched4.apk`. Root cause was Grindr returning HTTP 2xx with bare body `404` for foreign albums, so the `code in 200..299` gate passed and `JSONObject("404")` threw at `UnlimitedAlbums.kt:446`.

## Follow-ups (not part of this change)

- Mirror `docs/content/grindr-api/` locally from opengrind.org — higher value than deeper APK decompilation.
- An 8th on-device guard hit is nice-to-have, not a gate; the objective is already met.
