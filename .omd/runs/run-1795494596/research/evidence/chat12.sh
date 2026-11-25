#!/usr/bin/env bash
# Timestamped profile/chat entry harness, v12.
#
# v11 measured latency with `screencap` bursts: ~315-450 ms per frame, so the tap->chat number had a
# 1-frame (~400 ms) resolution and every result was a loose upper bound. v12 replaces the burst with a
# detached `screenrecord` at 30 fps (33 ms resolution) and derives latency from the frame index.
#
# Facts carried from v11 (all measured on device):
#  * A tap on the first Browse-grid tile (200,822) opens a PROFILE first; if that tile is a conversation
#    the chat follows ~1.4 s later. Profile frames classify `other` (fill 1100, gl 0).
#  * `screenrecord` must run detached (`setsid nohup ... &`) inside the device shell or the file is never
#    finalised. The clip starts ~0.5 s before the tap; the tap frame is recovered from the last settled
#    `grid` frame in the clip, not from wall-clock.
#  * BACK from ChatActivityV2 closes the whole chat, so samples are relaunched rather than backed out.
#  * A chat can self-close a few frames after opening; that is a real app behaviour, not a capture fault.
#  * Classifier cls.py -> chat / profile / media / grid / other.
#
# Geometry: 1224x2700. Grid tile (200,822). Nav row y=2558. Held taps only.
set -u
DEV=${DEV:-AE6RUT4710003613}
OUT=${OUT:-/home/x1/.cache/gpp-work/perf2/timed12}
N=${N:-4}
SECS=${SECS:-6}
TILEX=200; TILEY=822
LAUNCH='com.grindrapp.android/.HomeActivityOriginal'
HERE=$(cd "$(dirname "$0")" && pwd)
rm -rf "$OUT"; mkdir -p "$OUT"

fg() { adb -s "$DEV" shell dumpsys activity activities 2>/dev/null | grep -m1 topResumedActivity; }
shot() { adb -s "$DEV" exec-out screencap -p 2>/dev/null; }
held() { adb -s "$DEV" shell input swipe "$1" "$2" "$1" "$2" 200; }
cls() { python3 "$HERE/cls.py" "$1" 2>/dev/null | awk '{print $NF}'; }

settle() { # $1=dir $2=tag $3=max polls ; succeeds when rows 2450..2650 are identical twice
  local d=$1 tag=$2 max=${3:-8} prev="" cur=""
  for p in $(seq 1 "$max"); do
    shot > "$d/${tag}_$p.png"
    cur=$(python3 - "$d/${tag}_$p.png" <<'PY'
import sys
from PIL import Image
try:
    print(hash(Image.open(sys.argv[1]).convert('L').crop((0,2450,1224,2650)).tobytes()))
except Exception:
    print('bad')
PY
)
    if [ -n "$prev" ] && [ "$cur" = "$prev" ]; then
      hits=$(( ${hits:-0} + 1 ))
      [ "$hits" -ge 2 ] && { cp "$d/${tag}_$p.png" "$d/${tag}.png"; return 0; }
    else
      hits=0
    fi
    prev=$cur
  done
  cp "$d/${tag}_${max}.png" "$d/${tag}.png" 2>/dev/null; return 1
}

launch() {
  for a in 1 2 3 4 5 6; do
    adb -s "$DEV" shell am force-stop com.grindrapp.android >/dev/null 2>&1; sleep 0.8
    adb -s "$DEV" shell am start -S -W -n "$LAUNCH" >/dev/null 2>&1
    for b in $(seq 1 12); do
      sleep 0.7
      case "$(fg)" in *com.grindrapp.android*) sleep 3; return 0 ;; esac
    done
  done
  return 1
}

for i in $(seq 1 "$N"); do
  d="$OUT/s$i"; mkdir -p "$d"
  echo "=== sample $i ==="
  if ! launch; then echo "  skip: could not get the app to the foreground"; continue; fi

  # --- gate 0: a populated grid is required; an empty filter grid has no tile to tap ---
  empty() { # $1=frame -> 0 if the tile band is near-black
    python3 - "$1" <<'PYE'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
band = [sum(im.getpixel((x, y))[0] for x in range(0, 1224, 20)) // 62 for y in range(700, 1400, 100)]
print(1 if sum(band) / len(band) < 12 else 0)
PYE
  }
  for a in 1 2 3; do
    for t in 1 2 3 4; do
      settle "$d" grid 6
      c0=$(cls "$d/grid.png")
      [ -n "$c0" ] && break
      sleep 1
    done
    [ "$(empty "$d/grid.png")" = 1 ] || break
    echo "  empty grid, recovering"
    adb -s "$DEV" shell input tap 460 488   # Online chip
    sleep 3
    adb -s "$DEV" shell input tap 980 2392  # RETRY in the red bar
    sleep 5
  done

  # --- gate: classify the landing state ---
  c=$(cls "$d/grid.png"); [ -n "$c" ] || c=other
  # A chat landing is recoverable: BACK returns to the grid, so re-settle instead of wasting the sample.
  if [ "$c" = chat ]; then
    echo "  landed in a chat, backing out"
    adb -s "$DEV" shell input keyevent KEYCODE_BACK >/dev/null 2>&1
    sleep 2
    settle "$d" grid 8
    c=$(cls "$d/grid.png"); [ -n "$c" ] || c=other
  fi
  echo "  state=$c"
  case "$c" in
    grid)    TX=$TILEX; TY=$TILEY ;;
    profile) TX=1079;   TY=2558   ;;
    chat)    TX=0;      TY=0      ;;
    *) echo "  skip: unclassifiable landing state ($c)"; continue ;;
  esac
  cp "$d/grid.png" "$d/pre.png"
  [ "$c" = chat ] && { echo "  skip: already in a chat (no transition)"; echo chat-noop > "$d/verdict.txt"; continue; }

  # --- burst: detached screenrecord, tap ~0.5 s in ---
  adb -s "$DEV" shell pkill -f screenrecord >/dev/null 2>&1
  adb -s "$DEV" shell "rm -f /sdcard/$i.mp4; setsid nohup screenrecord --time-limit $SECS --bit-rate 8000000 /sdcard/$i.mp4 >/dev/null 2>&1 &"
  sleep 0.5
  held "$TX" "$TY"
  # wait for screenrecord to finalise the moov atom (process exit), not a fixed sleep
  for w in $(seq 1 $((SECS * 4 + 20))); do
    sleep 0.5
    [ "$(adb -s "$DEV" shell 'ps -A 2>/dev/null | grep -c "[s]creenrecord"' | tr -d '
')" = 0 ] && break
  done
  if [ "$(adb -s "$DEV" shell 'ps -A 2>/dev/null | grep -c "[s]creenrecord"' | tr -d '\r')" != 0 ]; then
    echo "  watchdog: killing stuck screenrecord"
    adb -s "$DEV" shell pkill -f screenrecord
    sleep 1
  fi
  sleep 0.5
  adb -s "$DEV" pull "/sdcard/$i.mp4" "$d/clip.mp4" >/dev/null 2>&1
  ffmpeg -v error -i "$d/clip.mp4" -vf fps=30 "$d/f_%04d.png" 2>/dev/null
  nf=$(ls "$d"/f_*.png 2>/dev/null | wc -l)
  echo "  frames=$nf"
  [ "$nf" -gt 20 ] || { echo "  skip: short clip"; echo short > "$d/verdict.txt"; continue; }

  python3 - "$d" <<'PY' > "$d/latency.txt" 2>&1
import sys, os, glob, importlib.util
spec = importlib.util.spec_from_file_location('c', os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), '..', 'cls.py'))
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
d = sys.argv[1]
fs = sorted(glob.glob(os.path.join(d, 'f_*.png')))
seq = [m.classify(f) for f in fs]
open(os.path.join(d, 'seq.txt'), 'w').write('\n'.join('%d %s' % (i + 1, s) for i, s in enumerate(seq)))
# tap frame = last `grid` frame in the last grid run before any non-grid
# The clip opens on a stale frame, settles to grid, then the tap drives a long non-grid run.
# Anchor = the grid frame immediately before the LONGEST non-grid run (the tap response).
runs = []
i = 0
while i < len(seq):
    if seq[i] != 'grid':
        j = i
        while j < len(seq) and seq[j] != 'grid': j += 1
        runs.append((j - i, i, j))
        i = j
    else:
        i += 1
if not runs:
    print('tap=none onset=none chat=none end=%s' % seq[-1]); raise SystemExit
_, rs, re_ = max(runs)
last_grid = rs - 1 if rs > 0 else 0
onset = rs
chat = next((k for k in range(rs, len(seq)) if seq[k] == 'chat'), None)
fps = 30.0
fmt = lambda k: 'none' if k is None else '%.0f' % ((k - last_grid) * 1000.0 / fps)
print('tap_frame=%d onset=%sms chat=%sms end=%s' % (last_grid + 1, fmt(onset), fmt(chat), seq[-1]))
PY
  cat "$d/latency.txt"
  e=$(awk -F'end=' '/end=/{print $2}' "$d/latency.txt")
  echo "$e" > "$d/verdict.txt"
done
