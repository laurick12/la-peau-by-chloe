# Image Guide: La Peau by Chloe

Every image slot on the site already has a placeholder at its final path. To go live with real photography:

1. Shoot / generate each image below at the listed size.
2. Export as **JPG, sRGB, quality ~80, under ~500 KB** (Next.js will further optimize to AVIF/WebP).
3. Save it with the **exact same file name**, swapping `.svg` → `.jpg` (e.g. `public/images/products/original-raw-shea-butter/main.jpg`).
4. Set `NEXT_PUBLIC_IMAGE_EXT=jpg` in `.env.local` / your host’s env vars and redeploy.

> Replace all images in one go, the site uses a single extension setting for every product and site image.

---

## Global style rules (apply to every shot)

| Rule | Spec |
|---|---|
| Background | Seamless warm cream, matching brand color **#F4ECDF** (cream paper, linen, or plaster). No pure white. |
| Light | Soft, diffused daylight from the left (window + diffuser). Gentle shadow, no harsh highlights. |
| Props | Minimal & natural only: linen, raw wood, travertine/stone, dried botanicals, raw ingredients. Gold accents echo the logo. |
| Color grade | Warm, slightly low-contrast, creamy highlights. Keep consistent across all 5 products. |
| Packaging | Same jar style for all 5; label facing camera, lid wiped clean, no fingerprints. |
| Safe zone | Keep the product inside the central 80%, cards crop slightly at small sizes. |
| Skin | For on-skin shots, feature a range of skin tones across the collection. |

---

## Product images: 25 total (5 per product)

**All product images: 1600 × 2000 px (4:5 portrait).**

| File | Angle | What to show | Where it’s used |
|---|---|---|---|
| `main` | Straight-on, eye level (0°), centered | Closed jar, label facing camera, on cream seamless, soft shadow. Clean packshot, nothing else in frame. | Product cards, PDP main image, cart & checkout thumbnails, Google Shopping |
| `texture` | 45° macro, close crop | The butter itself: a spatula swirl or finger swipe showing texture (raw = dense/grainy; whipped = airy peaks). Fill the frame. | Card **hover** image, PDP gallery |
| `open` | Top-down, 90° overhead | Open jar with lid resting beside it, product surface visible, 1–2 props. | PDP gallery |
| `ingredients` | Top-down 90° or 45° flat lay | Jar surrounded by its actual raw ingredients (see list below). | PDP gallery |
| `lifestyle` | Natural, close-up | Product being applied to skin, hands, forearm, shoulder, or (men’s) beard/jaw. Warm natural light. | PDP gallery |

### Ingredient props per product

| Product folder | Ingredient flat lay props | Lifestyle suggestion |
|---|---|---|
| `original-raw-shea-butter` | Raw shea nuts, a block of raw unrefined shea, wooden scoop | Hands rubbing a scoop to melt it |
| `unscented-whipped-shea-butter` | Shea nuts, jojoba in glass dropper bottle, cotton | Gentle application on inner arm / elbow crease |
| `vanilla-coconut-whipped-shea` | Vanilla bean pods, halved coconut, coconut flakes | Applying to shoulder / collarbone |
| `floral-jasmine-whipped-shea` | Fresh or dried jasmine flowers, almonds, dropper bottle | Applying to wrist / neck |
| `cedarwood-amber-whipped-shea` | Cedar wood chips or bark, benzoin/amber resin pieces, dark slate | Male hand applying to beard or forearm |

---

## Site images: 5 total

| File | Size (px) | Ratio | What to show | Composition notes |
|---|---|---|---|---|
| `site/hero-desktop` | **2400 × 1200** | 2:1 | All 5 jars grouped, or 2–3 jars with a scoop of whipped butter and raw shea nuts | **Keep the left 40% empty** (headline sits there). Subject on the right two-thirds. |
| `site/hero-mobile` | **1080 × 1350** | 4:5 | Same scene, recomposed vertically | Shown directly below the headline on phones, subject centered, fill the frame. |
| `site/ingredients-story` | **1600 × 1200** | 4:3 | Flat lay of raw ingredients only: shea nuts, shea block, coconut, jojoba, vanilla, jasmine, cedar | Top-down, no jars, this is the “clean ingredients” story. |
| `site/founder` | **1200 × 1500** | 4:5 | Chloe whipping butter in a bowl, or a warm portrait with product | Natural, candid. Hands-only works if you prefer not to show a face. |
| `site/local` | **1600 × 1200** | 4:3 | A hand-off: kraft bag with logo sticker, or jars on a Charlotte-area doorstep | Optional today, reserved for a future local-delivery banner. |

## Already done for you

| File | Size | Source |
|---|---|---|
| `public/images/logo.png` | 1254 × 1254 | Your master logo |
| `public/images/logo-mark.png` | 256 × 256 | Header / footer logo (`npm run optimize:logo`) |
| `app/icon.png`, `app/apple-icon.png` | 256 / 180 | Browser favicon & iPhone home-screen icon |
| `public/images/site/og-image.jpg` | 1200 × 630 | Social-share card (logo on cream). Replace with a styled product shot whenever you like. |

## Nice to have (later)

- A **transparent-background PNG** of the logo (and a one-color gold or dark version) for crisp use on photos.
- **Short looping video** (5–8 s, 1080 × 1350, MP4/WebM) of a spatula whipping butter, great for the hero or Instagram.
