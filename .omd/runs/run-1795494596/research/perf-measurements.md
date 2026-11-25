# UI transition latency measurement — Android device AE6RUT4710003613

**Status: PARTIAL / INCOMPLETE.** Timebox was 20 minutes. The target device went offline
(`adb devices` empty) before N=5 was reached for any transition. Only ONE transition
observation is defensible. No numbers below are invented; missing measurements are marked
as such. No app, account, or device setting was modified.

## 1. Method actually used

- `adb devices`: device AE6RUT4710003613 initially online and authorized.
- `adb shell pm list packages | grep -i grindr`: `com.grindrplus`,
  `com.grindrapp.android`, `com.grindrapp.android.one` were present.
  (`pm list packages -3` under this shell raised a SecurityException for user 100; the
  plain list still enumerated the three packages.)
- Versions from `dumpsys package`: official `com.grindrapp.android` 26.0.1,
  `com.grindrapp.android.one` 26.0.1, mod `com.grindrplus` 5.0.1-26.0.1_ab40f4a.
- Foreground at start: `mCurrentFocus=... com.grindrapp.android/.HomeActivityOriginal`
  (but `topResumedActivity` was Termux — the device was shared and another agent was
  driving Termux concurrently; screenshots show live shell commands appearing).
- Interaction: `adb exec-out screencap -p` + `read` to find the Inbox tab (x≈1080,y≈2546),
  the first conversation row (x≈612,y≈974), chat back arrow (x≈74,y≈197), and chat
  profile/name area (x≈200,y≈197). `uiautomator dump` confirmed bounds
  ('Navigate up' [0,123][148,271], 'Chat: 👀 V' [253,139][340,197]).
- Capture: `adb shell 'screenrecord --size 408x900 --bit-rate 8000000 --time-limit 4 ...'`
  with an on-device `sleep 1.2; input tap x y` between recording start and stop;
  `adb pull`, then `ffprobe` frame PTS and `ffmpeg` frame extraction on host; frames
  were inspected as contact sheets and classified by visible screen contents.
- **Granularity:** screenrecord output at reduced size showed ~16–17 ms frame intervals
  in bursts, but with gaps up to ~1.1 s caused by the recorder/encoder. Effective
  resolution of a transition is bounded by the surrounding frame gap, not by the
  average FPS. Tap time in the video is inferred from the screen state, not from a
  device-side monotonic clock; therefore only the *interval between the last old-screen
  frame and the first new-screen frame* is reported (an upper bound).

### Captures rejected as invalid (not used in any number)
- First batch `a1..a5`, `b1..b5` (full-resolution 1224x2700 recording): contact sheets
  show the **launcher / Termux / a system "Setting Manager" dialog**, not Grindr.
  Foreground changed between `am start`, the tap, and the recording because another
  actor was concurrently interacting with the same device. These files are kept under
  `/home/x1/.cache/gpp-work/perfwork/` for audit but contribute no measurements.
- Second batch (cycle 1 onward): `a1.mp4`, `b1.mp4`, `c1.mp4` at 13:41 local were again
  Termux captures (keyboard visible); after cycle 1 `adb` reported "no devices/emulators
  found" and the device stayed offline. N=5 was not reached.

## 2. Per-app availability and what was actually exercised

| Package | Version | Present | Logged-in screen available | Measured |
|---|---|---|---|---|
| `com.grindrapp.android` (official) | 26.0.1 | yes | yes — Browse, Inbox with real conversations, ChatActivityV2; already logged in | 1 observation (chat open) |
| `com.grindrapp.android.one` | 26.0.1 | yes | not opened (timebox + device loss) | none |
| `com.grindrplus` (mod) | 5.0.1-26.0.1_ab40f4a | yes | not opened (timebox + device loss) | none |

The goal allowed "up to two" apps; only the official app was reachable in the time
available. Absence of measurements for the other two is an honest gap, not a claim that
their UI is unmeasurable.

## 3. Raw trial table

Transition (a) open chat from Inbox — official app, capture `test.mp4` (13:41-ish local),
reduced-size recording, frame PTS from ffprobe, frames classified visually:

| Trial | Last Inbox frame (s) | First fully rendered chat frame (s) | Interval (ms) |
|---|---|---|---|
| a-valid-1 | 1.416078 | 1.448367 | **32.3** |

Additional context from the same capture: the visible sequence was Termux frames up to
0.71 s, Inbox frames 0.73–1.416 s, chat screen (header '👀 V', message bubbles,
'Say something…' composer) from 1.448 s onward. The preceding frame gap is 1.105 s
(0.261544 → 1.366978), so the *tap itself* is not time-resolved; the 32.3 ms figure is
only the last-inbox → first-chat frame delta, with ~17 ms frame cadence in that window.
Do not read it as a precise end-to-end tap→render latency.

| Transition | Raw values (ms) | N |
|---|---|---|
| (b) close chat back to Inbox | no valid capture | 0 |
| (c) open profile view from chat | no valid capture | 0 |

An earlier manual UIA check confirmed that tapping the chat name at (200,197) did
navigate away from `ChatActivityV2` (focus returned to `HomeActivityOriginal` on one
attempt), but no valid timed recording exists, so no latency value is reported.

## 4. p50 / p90 summary

| App | Transition | N | p50 | p90 |
|---|---|---|---|---|
| `com.grindrapp.android` | (a) open chat from list | 1 | 32.3 ms (single sample, not a percentile) | n/a — undefined for N=1 |
| `com.grindrapp.android` | (b) close chat to list | 0 | no data | no data |
| `com.grindrapp.android` | (c) open profile from chat | 0 | no data | no data |
| `com.grindrapp.android.one` | (a)/(b)/(c) | 0 | no data | no data |
| `com.grindrplus` | (a)/(b)/(c) | 0 | no data | no data |

p50/p90 with the requested N=5 could not be computed. Reporting p50=p90=32.3 ms from a
single sample would be misleading, so it is explicitly not done.

## 5. Limitations

1. **Shared device / concurrency:** Termux was resumed and receiving typed shell input
   while measurements were running; Grindr was repeatedly backgrounded. This is the
   main reason most captures show the wrong app.
2. **Device loss:** adb went offline mid-batch and did not return within the timebox;
   trials 2–5 for every transition and both other apps were never collected.
3. **Frame-timing bound:** screenrecord PTS is not a reliable tap clock. The one reported
   value is a frame-delta upper bound within a ~17 ms cadence window, preceded by a
   ~1.1 s encoder gap; sub-frame precision is not claimed.
4. **Visual classification:** "fully rendered" was judged from downscaled frame sheets
   (chat header + message bubbles + composer visible). Late-arriving images may have
   changed after the first classified frame.
5. **Restoration not possible:** the device was offline at the end, so the app could not
   be returned to the conversation-list screen. Last verified app state before loss was
   `HomeActivityOriginal` (in tab state not confirmed).
6. No app, account, or device setting was changed. All interactions were taps/observations
   inside already-installed, already-logged-in apps plus `am start` of an existing activity.

## 6. Artifacts

- Raw captures and frame sheets: `/home/x1/.cache/gpp-work/perfwork/`
  (`test.mp4`, `ft/`, `sheet_test.png`, invalid batches `a?.mp4`, `b?.mp4`, `c1.mp4`,
  `frames/`, `fr2/`).
- Device: AE6RUT4710003613 (offline at end of run).
