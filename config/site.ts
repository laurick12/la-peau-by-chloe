export const siteConfig = {
  name: "La Peau by Chloe",
  tagline: "Pure shea for sensitive skin",
  description:
    "100% natural, small-batch shea butter crafted for sensitive skin. Every ingredient is one you can read, pronounce, and trust.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@lapeaubychloe.com",
  instagram: "https://instagram.com/lapeaubychloe",
  location: "Charlotte, NC",
  /** "svg" while using generated placeholders, "jpg" once real photography is in /public/images */
  imageExt: process.env.NEXT_PUBLIC_IMAGE_EXT ?? "jpg",
} as const;

export const paymentConfig = {
  cashApp: {
    cashtag: process.env.NEXT_PUBLIC_CASHAPP_CASHTAG ?? "$LaPeauByChloe",
  },
  zelle: {
    recipient: process.env.NEXT_PUBLIC_ZELLE_RECIPIENT ?? "payments@lapeaubychloe.com",
    name: process.env.NEXT_PUBLIC_ZELLE_NAME ?? "La Peau by Chloe",
  },
  /** Orders paid by CashApp / Zelle are held this long before being released */
  manualPaymentWindowHours: 24,
} as const;

export function siteImage(name: string) {
  return `/images/site/${name}.${siteConfig.imageExt}`;
}

/**
 * Pre-generated WebP variants, e.g. hero-desktop-1920.webp. These are served
 * as plain static files (no Next.js optimizer round-trip, no per-request
 * transform cost), so pages pass explicit widths + srcSet instead of
 * relying on the optimizer. Regenerate with the script in
 * docs/image-pipeline.md if a source photo is replaced.
 */
export function siteImageWebp(name: string, width: number) {
  return `/images/site/${name}-${width}.webp`;
}
export function siteImageSrcSet(name: string, widths: number[]) {
  return widths.map((w) => `${siteImageWebp(name, w)} ${w}w`).join(", ");
}
