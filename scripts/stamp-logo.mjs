// Stamps the original La Peau logo (exact colors) onto the blank round jar labels
// of AI-generated photos. Usage: node scripts/stamp-logo.mjs <src> <out> cx,cy,r [cx,cy,r ...]
import sharp from "sharp";
const [src, out, ...circles] = process.argv.slice(2);
const logo = "public/images/logo.png";
const base = sharp(src);
const { width, height } = await base.metadata();
const layers = [];
for (const c of circles) {
  const [cx, cy, r] = c.split(",").map(Number);
  const d = Math.round(r * 2);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2 - 1}" fill="#fff"/></svg>`);
  // logo art sits inside its own gold ring at ~97% of canvas; trim so ring meets label edge
  const art = await sharp(logo).extract({ left: 20, top: 20, width: 1214, height: 1214 }).resize(d, d).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  // borrow the photo's own light falloff across the label (relative only, so logo colors stay true)
  const region = sharp(src).extract({ left: Math.round(cx - r), top: Math.round(cy - r), width: d, height: d }).greyscale().blur(6);
  const { channels } = await region.clone().stats();
  const peak = channels[0].max;
  const shade = await region.linear(0.35, 255 - 0.35 * peak).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  layers.push({ input: art, left: Math.round(cx - r), top: Math.round(cy - r) });
  layers.push({ input: shade, left: Math.round(cx - r), top: Math.round(cy - r), blend: "multiply" });
}
await base.composite(layers).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
console.log("wrote", out, width, height);
