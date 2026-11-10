# Image pipeline

Photos are **not** sent through the Next.js image optimizer. The optimizer
transforms each image on the first request for a given width, so a cold
first visit paid a 3-5s transform for almost every photo (measured
2026-11-10: cold mobile load ~3.9s, warm reload ~0.3s).

Instead, photos are pre-sized at build time and served as plain static
files:

- `scripts/generate-webp.py` writes `<name>-<width>.webp` next to each
  source JPG (run from the repo root; requires Pillow).
- Code references those files directly with explicit `srcSet` — see
  `siteImageWebp` / `siteImageSrcSet` in `config/site.ts` and
  `productImageWebp` / `productImageSrcSet` in `data/products.ts`.
- `components/ProductImage.tsx` serves `.webp` (and `.svg`) `unoptimized`,
  so nothing goes through the optimizer.

## Widths (match how each image is actually displayed)

| Image | Widths | Why |
| --- | --- | --- |
| Product photos (main, texture, lifestyle, ingredients, open) | 400, 800, 1200 | Cards ~160-400px, PDP main ~600px, DPR up to 2x |
| hero-desktop | 640, 1080, 1920, 2400 | Full-width, DPR up to 2x on large screens |
| hero-mobile | 640, 828, 1080 | Full-width phones |
| founder, ingredients-story | 640, 1080, 1600 | 50vw split sections, DPR up to 2x |

The hero is a single `<picture>` in `app/page.tsx`: the browser picks
mobile or desktop by viewport, so only one hero downloads per device
(the old code rendered both with `priority` and downloaded both).

## Caching

`staticwebapp.config.json` gives `/images/*` a 1-year immutable cache.
**If you replace a photo, rename it** (or bump the width suffix) — a
same-named file will stay cached in repeat visitors' browsers for up to
a year.

## What was removed (2026-11-10)

- The generated `.svg` placeholders (~17MB) — the site ships real
  photography now; the `NEXT_PUBLIC_IMAGE_EXT=svg` fallback is gone.
- Unused files: `logo.png` (2MB), `logo-jar.png`, `logo-gold.svg`,
  `local.jpg`. `logo.svg` is the only logo (SVGO'd, 278KB -> 101KB).
- `og-image.jpg` stays as JPG: social scrapers want JPG/PNG.
- Hover texture images load only after the first hover on a product
  card (`components/ProductCard.tsx`), not on first paint.
