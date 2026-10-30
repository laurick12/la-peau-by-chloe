# Muse Prompts: Final Photography for La Peau by Chloe

Use these in Muse (Meta's image generator) when you're ready to replace the
proof-of-concept placeholders with final photos. Global rules first, then
one prompt per shot. All 30 files swap `.svg` → `.jpg` with
`NEXT_PUBLIC_IMAGE_EXT=jpg`.

## Global background / style block (paste before every prompt)

> Warm, high-end clean-beauty product photography on a seamless warm cream
> plaster background (#F4ECDF, never pure white). Soft diffused window
> daylight from the left, gentle long shadow, warm low-contrast color grade,
> creamy highlights. Minimal natural props only: oatmeal linen, raw wood,
> travertine stone. Same short amber-glass-and-cream jar with round gold
> "LA PEAU by Chloe" logo label facing camera, lid wiped clean. Jar kept
> inside the central 80% of frame. Photorealistic, 4:5 portrait where noted.

## Proof-of-concept reuse map (ship with 8, shoot 30 later)

The current placeholders already reuse images so the concept reads complete:
`main` → cards, PDP hero, cart/checkout thumbs · `texture` → card hover,
PDP gallery · `open`/`ingredients`/`lifestyle` → PDP gallery ·
`hero-desktop` → homepage collage main · `hero-mobile` → collage small +
mobile · `ingredients-story` → ingredients split · `founder` → story split.

## Product prompts (1600×2000, 4:5: one per product, adapt per shot)

1. **Original Raw** (`original-raw-shea-butter/main`): "[GLOBAL]. Single closed
   jar centered, eye-level straight-on packshot, raw shea nuts and a block of
   raw unrefined shea at the base, nothing else in frame."
2. **Unscented Whipped** (`unscented-whipped-shea-butter/main`): "[GLOBAL].
   Single closed jar, eye-level packshot, small glass dropper bottle of jojoba
   oil and a cotton boll beside it."
3. **Vanilla & Coconut** (`vanilla-coconut-whipped-shea/main`): "[GLOBAL].
   Single closed jar, eye-level packshot, vanilla bean pods and half a coconut
   with flakes at the base."
4. **Floral Jasmine** (`floral-jasmine-whipped-shea/main`): "[GLOBAL]. Single
   closed jar, eye-level packshot, fresh white jasmine flowers and a few
   almonds scattered at the base."
5. **Cedarwood & Amber** (`cedarwood-amber-whipped-shea/main`): "[GLOBAL].
   Single closed jar, eye-level packshot, cedar bark chips and dark amber resin
   pieces on a small slate tile, masculine mood, slightly darker grade."

Per-shot variations: **texture** = "extreme 45° macro of the butter swirl
filling the frame (raw = dense/grainy; whipped = airy peaks), no jar" ·
**open** = "top-down 90° overhead, open jar with wooden lid resting beside it,
product surface visible" · **ingredients** = "top-down flat lay, closed jar
surrounded by its raw ingredients listed above" · **lifestyle** = "close-up of
the butter being massaged into skin in warm daylight (range of skin tones
across the collection; men's = beard/jaw)".

## Site prompts

- **hero-desktop** (2400×1200, 2:1): "[GLOBAL]. Grouping of all five jars on
  the RIGHT two-thirds, scoop of whipped butter and raw shea nuts in front,
  LEFT 40% empty warm cream space for headline."
- **hero-mobile** (1080×1350, 4:5): same scene recomposed vertically, jars
  centered filling the frame.
- **ingredients-story** (1600×1200, 4:3): "top-down flat lay of raw ingredients
  only, shea nuts, shea block, coconut, jojoba dropper, vanilla, jasmine,
  cedar, no jars."
- **founder** (1200×1500, 4:5): "hands whipping shea butter in a ceramic bowl,
  warm candid kitchen light, cream apron."
- **local** (1600×1200, 4:3): "kraft paper bag with round gold logo sticker
  holding two jars, Charlotte-area doorstep."

## Status (v3 photo pass)

Seven photoreal images are now in the site (`assets/source-photos/*.webp` are the unlabeled
originals). The original logo is stamped onto each blank jar label with
`node scripts/stamp-logo.mjs <src> <out> cx,cy,r` so its colors stay exactly as designed -
generate jars with a **plain blank round cream label** and stamp afterwards; never let the
image model draw the logo.

Still reused (shoot dedicated versions when you can): per-product `open`, `ingredients`
(both reuse `main`), `texture` and `lifestyle` (one shared whipped-texture shot), and
`founder`/`local` (crops of existing shots).
