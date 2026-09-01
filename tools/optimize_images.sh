#!/usr/bin/env bash
# Regenerate optimized web images from the source PNGs in images/.
# Requires: cwebp, magick (ImageMagick). Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."
IMG=images

echo "==> Screenshots (cap1-3): resize to 900px tall, WebP q82"
for n in 1 2 3; do
  cwebp -quiet -q 82 -resize 0 900 "$IMG/cap$n.png" -o "$IMG/cap$n.webp"
done

echo "==> Rocket / plate art: WebP at display size"
cwebp -quiet -q 85 -resize 0 260 "$IMG/landing.png" -o "$IMG/landing.webp"
cwebp -quiet -q 88 "$IMG/pirate.png"                 -o "$IMG/pirate.webp"

echo "==> Trailer poster (video facade)"
if [ -f "$IMG/MAIN.png" ]; then
  cwebp -quiet -q 76 -resize 640 0 "$IMG/MAIN.png" -o "$IMG/video-thumb.webp"
else
  echo "   (skipped: images/MAIN.png not found)"
fi

echo "==> Favicons from favicon.png (512x512)"
magick "$IMG/favicon.png" -resize 32x32   "$IMG/favicon-32.png"
magick "$IMG/favicon.png" -resize 180x180 "$IMG/apple-touch-icon.png"
magick "$IMG/favicon.png" -resize 192x192 -strip -quality 90 "$IMG/icon-192.png"
magick "$IMG/favicon.png" -resize 512x512 -strip -quality 90 "$IMG/icon-512.png"

echo "==> Open Graph image (1200x630)"
FONT_B="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_R="/System/Library/Fonts/Supplemental/Arial.ttf"
[ -f "$FONT_B" ] || FONT_B="$(magick -list font | awk -F'family: ' '/family:/{print $2; exit}')"
[ -f "$FONT_R" ] || FONT_R="$FONT_B"
magick -size 1200x630 \
  gradient:'#0b1220-#060A12' \
  \( "$IMG/cap1.png" -resize x520 \) -gravity east -geometry +90+0 -composite \
  \( "$IMG/favicon.png" -resize 96x96 \) -gravity northwest -geometry +70+70 -composite \
  -font "$FONT_B" -pointsize 74 -fill '#FFA07A' -gravity northwest \
  -annotate +185+82 'Simon in Space' \
  -font "$FONT_R" -pointsize 33 -fill '#d0d0d0' -gravity northwest \
  -annotate +72+220 'Challenge your memory across the cosmos.' \
  -annotate +72+270 'A space-themed Simon memory game for Android.' \
  -strip -quality 82 "$IMG/og-image.jpg"
rm -f "$IMG/og-image.png"

echo "==> Done. Sizes:"
ls -lh "$IMG"/*.webp "$IMG"/favicon-32.png "$IMG"/apple-touch-icon.png "$IMG"/icon-192.png "$IMG"/icon-512.png "$IMG"/og-image.jpg

cat <<'NOTE'

Source PNGs (cap*.png, landing.png, pirate.png, favicon.png) are kept as the
editable originals but are NOT referenced by index.html anymore.
NOTE
