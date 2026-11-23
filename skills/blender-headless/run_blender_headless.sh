#!/usr/bin/env bash
set -euo pipefail
INPUT="${1:-}"
OUTPUT="${2:-/tmp/out.png}"
if [[ -z "$INPUT" ]]; then echo "Usage: $0 input output"; exit 1; fi
blender --background --factory-startup --python render_headless.py -- "$INPUT" "$OUTPUT"
