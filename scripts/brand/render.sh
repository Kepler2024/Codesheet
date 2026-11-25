#!/usr/bin/env bash
# Regenerate the icon and link-preview images in public/ from public/logo.svg and the HTML
# sources next to this script. Needs Google Chrome (or set CHROME) and Python 3 with Pillow.
# The outputs are committed; run this only after changing the logo or the card.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
public="$root/public"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

shot() { # <url> <width> <height> <out.png> [extra chrome flags...]
  local url="$1" w="$2" h="$3" out="$4"; shift 4
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$w,$h" --virtual-time-budget=2000 "$@" --screenshot="$out" "$url" >/dev/null 2>&1
}

shot "file://$here/card.html" 1200 630 "$public/og.png"
shot "file://$here/card.html?lang=zh" 1200 630 "$public/og-zh.png"
shot "file://$here/touch-icon.html" 180 180 "$public/apple-touch-icon.png"
# Transparent background so the logo's rounded corners stay rounded in favicon.ico.
shot "file://$public/logo.svg" 512 512 "$tmp/logo-512.png" --default-background-color=00000000

python3 - "$tmp/logo-512.png" "$public" <<'PY'
import sys
from PIL import Image
src, public = sys.argv[1], sys.argv[2]
logo = Image.open(src).convert("RGBA")
logo.save(f"{public}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
for name in ("og.png", "og-zh.png", "apple-touch-icon.png"):
    path = f"{public}/{name}"
    Image.open(path).convert("RGB").save(path, optimize=True)
PY

echo "Wrote favicon.ico, apple-touch-icon.png, og.png, og-zh.png to $public"
