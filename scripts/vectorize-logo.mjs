// Traces the gold artwork of public/images/logo.png into vector paths and writes:
//   public/images/logo.svg        : full sticker (cream disc + gold art), original colors
//   public/images/logo-gold.svg   : gold art only, transparent background
// Re-run after replacing logo.png: `npm run vectorize:logo`
import sharp from "sharp";
import potrace from "potrace";
import { writeFile } from "node:fs/promises";

const SRC = "public/images/logo.png";
const SCALE = 2; // trace at 2x for smoother curves
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;

// "goldness" = warm saturation (R-B). Cream background ≈ 23-33.
// Two tones: solid gold (strong) and light gold (translucent wings, highlights).
// The double ring is redrawn as clean vector circles, so it is masked out of the trace.
const RING_CUTOFF = 540; // px from centre (source scale)
const C = W / 2;
const inButterfly = (x, y) => x > 800 && x < 1150 && y > 230 && y < 600;
async function traceBand(test) {
  const mask = Buffer.alloc(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const inside = Math.hypot(x - C, y - C) < RING_CUTOFF;
    const sat = data[i * 3] - data[i * 3 + 2];
    mask[i] = inside && test(sat, inButterfly(x, y)) ? 0 : 255; // black = traced
  }
  const png = await sharp(mask, { raw: { width: W, height: H, channels: 1 } })
    .resize(W * SCALE, H * SCALE, { kernel: "lanczos3" }).blur(0.8).png().toBuffer();
  return new Promise((res, rej) =>
    potrace.trace(png, { threshold: 128, turdSize: 10, optTolerance: 0.3, alphaMax: 1.1 }, (err, svg) => {
      if (err) return rej(err);
      res([...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1].replace(/\d+\.\d+/g, (n) => String(Math.round(+n)))).join(" "));
    })
  );
}
// butterfly: keep only crisp gold outlines in the solid layer, wings go to the pale layer
const solid = await traceBand((s, bf) => s > (bf ? 88 : 62));
const light = await traceBand((s) => s > 40);
const pathD = solid + light;

const VB = W * SCALE;
const defs = `<defs>
    <linearGradient id="lpc-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8E6A2E"/>
      <stop offset=".28" stop-color="#D9B26A"/>
      <stop offset=".45" stop-color="#F3DDA6"/>
      <stop offset=".62" stop-color="#B8893F"/>
      <stop offset=".82" stop-color="#E2C07C"/>
      <stop offset="1" stop-color="#8E6A2E"/>
    </linearGradient>
    <radialGradient id="lpc-cream" cx=".45" cy=".4" r=".7">
      <stop offset="0" stop-color="#F6EDE0"/>
      <stop offset="1" stop-color="#EADCC6"/>
    </radialGradient>
  </defs>`;
const ring = (r, w) => `<circle cx="${VB / 2}" cy="${VB / 2}" r="${r * SCALE}" fill="none" stroke="url(#lpc-gold)" stroke-width="${w * SCALE}"/>`;
const art = [
  `<path fill="#EEDCB6" fill-rule="evenodd" d="${light}"/>`,
  `<path fill="url(#lpc-gold)" fill-rule="evenodd" d="${solid}"/>`,
  ring(589, 7),
  ring(566, 2.5),
].join("\n  ");
const head = (extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB} ${VB}" role="img" aria-label="La Peau by Chloe"${extra}>\n  <title>La Peau by Chloe</title>\n  ${defs}\n  `;

await writeFile("public/images/logo.svg",
  head() + `<circle cx="${VB / 2}" cy="${VB / 2}" r="${VB / 2 - 24}" fill="url(#lpc-cream)"/>\n  ${art}\n</svg>\n`);
await writeFile("public/images/logo-gold.svg", head() + art + "\n</svg>\n");
console.log("wrote logo.svg + logo-gold.svg,", Math.round(pathD.length / 1024), "KB of path data");
