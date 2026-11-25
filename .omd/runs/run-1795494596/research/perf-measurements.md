# UI transition latency — measured on device AE6RUT4710003613

**Status: COMPLETE for chat-open. Profile-open and chat-close: still measuring.**

Every number below comes from a 30 fps `screenrecord` clip captured on the physical device
and is read from the **frame index**, not wall-clock. Nothing is inferred from activity
names. Missing measurements stay marked as measuring; no number is invented.

The first pass in this file was a PARTIAL, sub-frame-limited attempt using `screencap`
bursts at ~315–450 ms resolution. It was superseded. The old method, its rejected
captures, and its single 32.3 ms observation are kept in §6 for audit.

## 1. Result

| Metric | Value | N | Unit of resolution |
|---|---|---|---|
| Chat open — composer painted | **33 ms** (8/8 samples identical) | 8 | one 30 fps frame |
| Chat open — content settled (photo decoded) | **1.68 s** median (1518 / 1551 / 1815 / 5379 ms) | 4 | one 30 fps frame |
| Profile open | measuring | 0 | — |
| Chat close | measuring | 0 | — |

**Composer latency is one frame.** All eight valid samples measured exactly 33 ms, and a
frame-by-frame look confirms it is not a mis-anchor: at +33 ms the chat is fully painted —
name, `Offline ◀ Unknown (hidden)`, the `Say something…` composer pill, and both yellow
action buttons — with only the message area still black. The photo then decodes over the
following ~1.5 s. That is why composer paint and content settle are reported separately
instead of as one number.

## 2. Method

1. `am force-stop` then `am start -S -W -n com.grindrapp.android/.HomeActivityOriginal`.
2. Settle the Browse grid: the bottom band (rows 2450–2650) must hash identically on **two
   consecutive** polls, so a mid-navigation frame cannot become the pre-state.
3. Classify the landing state from that settled frame. `grid` → tap tile (200,822);
   `profile` → tap Inbox (1079,2558); `chat` → press BACK and re-settle instead of
   wasting the sample; anything else → skip.
4. Start a **detached** `screenrecord --time-limit 14 --bit-rate 8000000` (`setsid nohup`
   inside the device shell, or the file is never finalised), tap with a 200 ms held swipe,
   then wait for the recorder process to exit before pulling — a clip pulled early has no
   `moov atom` and ffmpeg rejects it.
5. Extract at `fps=30`, classify every frame, and take the tap frame as the last `grid`
   frame before the **longest non-grid run**. Latency is `(frame index − tap index) × 33 ms`.

### Valid sample

Pre-frame `grid`, an anchor exists, and the final frame is `chat`. 8 of 18 attempts met it.
The 10 rejects: 5 landing on a profile (the tile was not a conversation — the dominant
invalid source), 2 landing in an already-open chat, 1 landing on the photo viewer, and 2
app-launch failures.

### Classifier

`cls.py` scores the composer pill by the position of its bright run, not by fill or
brightness: `chat` = a ≥1000 px bright run in y=2520..2560 with no wide run in
y=2380..2460 (a keyboard-free chat is wide in both bands and is also accepted);
`profile` = a ≥900 px run in the high band with no pill; `media` = high magnitude with no
pill, evaluated after the pill rules; `grid` = near-zero fill. It scores **8/8** on
reference frames, including the black `ChatActivityV2` shell and the grid frame that kept
regressing.

### Geometry

Device 1224×2700. Browse tile (200,822). Nav row y=2558: Browse (0,2495)-(291,2621),
RightNow (312,2495)-(602,2621), Interest (623,2495)-(913,2621), Inbox (934,2495)-(1224,2621).
Taps are 200 ms held swipes; a zero-duration `input tap` is swallowed by the small hit box.

## 3. Environment

- Device AE6RUT4710003613, 1224×2700, USB transport.
- `com.grindrapp.android` (official) 26.0.1, already logged in.
- Autofill set to `null` so Bitwarden/GMS cannot steal focus mid-capture.
- Launcher activity `com.grindrapp.android/.HomeActivityOriginal`; a bare
  `am start -S -W com.grindrapp.android` returns "Activity class does not exist".

## 4. Known limitations

1. **Grid tiles are not all conversations.** A tile tap opens a chat only when the tile is
   a conversation; otherwise it opens a profile. This is app behaviour, not capture error,
   and it is the largest source of rejects. It does not bias the latency of the samples
   that did open, but it makes N slow to grow.
2. **Chat open is non-deterministic.** The harness branches on the landing state because
   the app can land on the grid, a profile, or a chat.
3. **A chat can self-close** a few frames after opening; the clip window covers it.
4. **The photo decode dominates the settle number** and varies with image size, so 1.68 s is
   a median of 4 with a long tail (5379 ms) and not a fixed cost.
5. **Profile-open and chat-close are not measured yet.** One BACK closes the photo viewer
   and a second exits to the launcher, so the close path needs its own harness branch.
6. `uiautomator` exposes only the four nav tabs — the Browse grid is a `ComposeView` with
   no semantics children — so tile bounds cannot be dumped and (200,822) is used as the
   first-tile centre.

## 5. Reproduction

```
cd /home/x1/.cache/gpp-work/perf2
OUT=$PWD/recN N=8 SECS=14 setsid nohup bash chat12.sh > recN.log 2>&1 < /dev/null &
```

Score with `tally.py` (valid rule as above). Evidence copies of the harness, classifier and
tally are in `evidence/`.

## 6. Superseded first pass (audit only)

The earlier attempt captured with `screencap` bursts at ~315–450 ms per frame and recorded
one 32.3 ms observation from a reduced-size clip whose preceding frame gap was 1.105 s.
That figure is a frame-delta upper bound with sub-frame precision unclaimed. It is
superseded by the eight frame-indexed samples above. Its rejected batches showed the
launcher and Termux because another agent was driving the shared device concurrently.
