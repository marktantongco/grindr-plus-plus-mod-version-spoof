# Install — beginner

No root. No terminal. ~15 minutes. Read every step before starting.

> **This fork is signed differently from upstream.** If any other Grindr mod or
> Grindr Plus manager is installed, uninstall it first — otherwise Android refuses
> the install.

## You need

- Android 12+ phone, ~1 GB free
- Grindr **26.0.1** host bundle (`com.grindrapp.android_26.0.1-149389…apkm`)
- `GPlus_v5.0.1-26.24.0spoof-mtantongco-release.apk` (this fork's manager)
- A second device or a PC for the file transfer

## Steps

1. **Uninstall Grindr and any Grindr mod.** Settings → Apps → Grindr → Uninstall.
   Also check *Secure Folder*, *Parallel Space* and *Private Space* — a hidden copy
   causes `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.
2. **Install the manager APK** from the release page. Allow "install unknown apps"
   when prompted.
3. **Open Grindr Plus** and grant the notification permission.
4. **Copy both files** into
   `Android/data/com.grindrplus/files/` on internal storage, named exactly:
   - `grindr-v5.0.1-26.0.1.zip` (the `.apkm` bundle, renamed)
   - `mod-v5.0.1-26.0.1.zip` (the manager APK, renamed)

   The manager downloads from a third-party mirror that is often down; pre-placing
   the files skips the download entirely.
5. In the manager, open **Install**. Read the dialog, tap **Understood**.
6. Tap **Install**. It extracts, patches all splits, and offers a system installer.
7. When Android says **"Uninstall this app?"** for the stock Grindr, accept.
8. Wait. The app may crash once or twice on first launch — that is normal, relaunch.
9. Log in. The app opens on **Browse**; the version gate does not appear because
   the spoof is compiled in.

## After installing

- Long-press the **Browse** tab → status popup. It should show the mod as alive.
- If profiles render blank, whitelist `cdn.cookielaw.org` in your ad blocker.
- Never update Grindr from the Play Store; re-run **Install** in the manager instead.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | A hidden copy exists — remove it from Secure Folder / Parallel Space |
| Download step fails | You skipped step 4, or a filename is wrong |
| "Update Required" at login | Manager → Settings → spoof name `26.24.0`, code `195444` |
| Instant crash loop | Wrong host version — use exactly 26.0.1 (149389) |

## First-run checklist

- [ ] Browse shows profiles and no third-party ads
- [ ] Long-press Browse shows the status popup
- [ ] Settings shows spoof `26.24.0 / 195444`
