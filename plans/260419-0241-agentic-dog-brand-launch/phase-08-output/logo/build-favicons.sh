#!/usr/bin/env bash
# build-favicons.sh — raster favicon generator for WithAgents brand
# Inputs: favicon.svg (32×32 tuned), logo-mark-index-dark.svg (256×256 full mark)
# Requires: rsvg-convert, magick (ImageMagick 7+)
#
# Outputs (in cwd):
#   favicon-16.png, favicon-32.png, favicon-48.png
#   favicon.ico  (multi-resolution: 16, 32, 48)
#   apple-touch-icon-180.png
#   android-chrome-192.png, android-chrome-512.png

set -euo pipefail

cd "$(dirname "$0")"

# --- Dependency checks ---
missing=0
if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "[build-favicons] MISSING: rsvg-convert (install via 'brew install librsvg')" >&2
  missing=1
fi
if ! command -v magick >/dev/null 2>&1; then
  echo "[build-favicons] MISSING: magick (install via 'brew install imagemagick')" >&2
  missing=1
fi
if [[ $missing -eq 1 ]]; then
  echo "[build-favicons] Aborting — install required tools and retry." >&2
  exit 1
fi

# --- Render small-size PNGs from tuned 32px source ---
echo "[build-favicons] rendering favicon-16.png"
rsvg-convert -w 16  -h 16  favicon.svg -o favicon-16.png
echo "[build-favicons] rendering favicon-32.png"
rsvg-convert -w 32  -h 32  favicon.svg -o favicon-32.png
echo "[build-favicons] rendering favicon-48.png"
rsvg-convert -w 48  -h 48  favicon.svg -o favicon-48.png

# --- Render touch/PWA icons from the full 256 logomark for crispness ---
SRC_FULL="logo-mark-index-dark.svg"
echo "[build-favicons] rendering apple-touch-icon-180.png"
rsvg-convert -w 180 -h 180 "$SRC_FULL" -o apple-touch-icon-180.png
echo "[build-favicons] rendering android-chrome-192.png"
rsvg-convert -w 192 -h 192 "$SRC_FULL" -o android-chrome-192.png
echo "[build-favicons] rendering android-chrome-512.png"
rsvg-convert -w 512 -h 512 "$SRC_FULL" -o android-chrome-512.png

# --- Bundle multi-resolution .ico ---
echo "[build-favicons] assembling favicon.ico (16/32/48)"
magick favicon-16.png favicon-32.png favicon-48.png favicon.ico

echo "[build-favicons] done."
ls -lh favicon.ico favicon-*.png apple-touch-icon-180.png android-chrome-*.png
