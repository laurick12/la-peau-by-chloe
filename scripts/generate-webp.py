"""Regenerate the pre-sized WebP variants served as plain static files.

Run from the repo root:  python3 scripts/generate-webp.py

Photos are NOT sent through the Next.js image optimizer (that was the
slow first visit: every image paid a per-request transform). Instead this
script writes <name>-<width>.webp next to each source JPG, and the code
references those files directly with explicit srcSet (see config/site.ts
and data/products.ts). Re-run after replacing a source photo, and delete
any stale widths for a renamed file.

Widths match how each image is actually displayed (see docs/image-pipeline.md).
"""
from PIL import Image
import glob, os

JOBS = []
# products: 5 keys each, widths 400/800/1200 (source 1600w)
for f in sorted(glob.glob('public/images/products/*/*.jpg')):
    JOBS.append((f, [400, 800, 1200]))
# site heroes + story images
for f, ws in [
    ('public/images/site/hero-desktop.jpg', [640, 1080, 1920, 2400]),
    ('public/images/site/hero-mobile.jpg', [640, 828, 1080]),
    ('public/images/site/founder.jpg', [640, 1080, 1600]),
    ('public/images/site/ingredients-story.jpg', [640, 1080, 1600]),
]:
    JOBS.append((f, ws))

total_out = 0
for src, widths in JOBS:
    im = Image.open(src).convert('RGB')
    sw = im.width
    base, _ = os.path.splitext(src)
    for w in widths:
        if w > sw:
            continue
        out = f"{base}-{w}.webp"
        h = round(im.height * w / sw)
        im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=80, method=6)
        total_out += os.path.getsize(out)
print(f"{len(JOBS)} sources -> {len(glob.glob('public/images/**/*.webp', recursive=True))} webp files, {total_out/1024:.0f} KB total")
