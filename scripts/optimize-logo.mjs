#!/usr/bin/env node
/**
 * Builds web-ready brand assets from the master logo (public/images/logo.png):
 *   public/images/logo-mark.png   256×256 header/footer logo
 *   app/icon.png                  256×256 favicon / app icon
 *   app/apple-icon.png            180×180 Apple touch icon
 *   public/images/site/og-image.jpg  1200×630 social share card
 *
 *   npm run optimize:logo   (requires the `sharp` dev dependency)
 */
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public/images/logo.png");
const cream = { r: 244, g: 236, b: 223, alpha: 1 };

mkdirSync(join(root, "public/images/site"), { recursive: true });

await sharp(src).resize(256, 256).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(join(root, "public/images/logo-mark.png"));
await sharp(src).resize(256, 256).png({ compressionLevel: 9, palette: true }).toFile(join(root, "app/icon.png"));
await sharp(src).resize(180, 180).png({ compressionLevel: 9 }).toFile(join(root, "app/apple-icon.png"));

const logo = await sharp(src).resize(520, 520).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: cream } })
  .composite([{ input: logo, top: 55, left: 340 }])
  .jpeg({ quality: 86 })
  .toFile(join(root, "public/images/site/og-image.jpg"));

console.log("Logo assets written.");
