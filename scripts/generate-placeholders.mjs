#!/usr/bin/env node
/**
 * Proof-of-concept editorial placeholders, v2.
 * Warm organic style: terracotta/sand grounds, arch frames, gold-foil-look
 * labels with the real La Peau by Chloe logo composited onto every jar.
 * Replace with real photography per docs/IMAGE_GUIDE.md (same names, .jpg).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const logoB64 = readFileSync(join(root, "logo-jar.png")).toString("base64");
const LOGO = `data:image/png;base64,${logoB64}`;

const products = [
  { slug: "original-raw-shea-butter", name: "Original Raw Shea", bg: "#E4CDA8", ground: "#C99B6A", butter: "#EFE0C2", prop: "shea", sticker: "Most Pure" },
  { slug: "unscented-whipped-shea-butter", name: "Unscented Whipped", bg: "#EFE3D2", ground: "#D8BE9C", butter: "#FBF6EC", prop: "cotton", sticker: "Eczema-Prone Pick" },
  { slug: "vanilla-coconut-whipped-shea", name: "Vanilla & Coconut", bg: "#EACFA4", ground: "#C68B4E", butter: "#F6EBD6", prop: "vanilla", sticker: "Customer Favorite" },
  { slug: "floral-jasmine-whipped-shea", name: "Floral Jasmine", bg: "#EDD9CE", ground: "#C49A8B", butter: "#F8F1EC", prop: "jasmine", sticker: "Most Romantic" },
  { slug: "cedarwood-amber-whipped-shea", name: "Cedarwood & Amber", bg: "#D3B48F", ground: "#8A5F3C", butter: "#EADCC4", prop: "cedar", sticker: "For Him" },
];

const shots = ["main", "texture", "open", "ingredients", "lifestyle"];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function propsSvg(prop, w, h) {
  if (prop === "vanilla")
    return `<ellipse cx="${w * 0.16}" cy="${h * 0.8}" rx="90" ry="34" fill="#6B4A2E" transform="rotate(-24 ${w * 0.16} ${h * 0.8})"/><ellipse cx="${w * 0.84}" cy="${h * 0.78}" rx="110" ry="80" fill="#fff" opacity=".85"/><path d="M${w * 0.76} ${h * 0.78} q 60 -70 160 0" stroke="#8A5F3C" stroke-width="6" fill="none"/>`;
  if (prop === "jasmine")
    return [0.14, 0.2, 0.82, 0.87].map((x, i) => `<g transform="translate(${w * x},${h * (0.72 + (i % 2) * 0.08)})"><circle r="26" fill="#fff" opacity=".95"/><circle r="9" fill="#E8B93E"/></g>`).join("");
  if (prop === "cedar")
    return `<rect x="${w * 0.08}" y="${h * 0.78}" width="180" height="40" rx="8" fill="#5E4028" transform="rotate(-12 ${w * 0.08} ${h * 0.78})"/><rect x="${w * 0.78}" y="${h * 0.8}" width="150" height="34" rx="8" fill="#5E4028" transform="rotate(10 ${w * 0.78} ${h * 0.8})"/>`;
  if (prop === "cotton")
    return `<circle cx="${w * 0.15}" cy="${h * 0.78}" r="52" fill="#fff" opacity=".9"/><circle cx="${w * 0.85}" cy="${h * 0.8}" r="44" fill="#fff" opacity=".9"/>`;
  return `<ellipse cx="${w * 0.14}" cy="${h * 0.8}" rx="46" ry="38" fill="#7A5230"/><ellipse cx="${w * 0.86}" cy="${h * 0.79}" rx="60" ry="26" fill="#EFE0C2" stroke="#B8893F" stroke-width="4"/>`;
}

function jarSvg(cx, cy, s, butter, open) {
  const w = 340 * s, h = 250 * s, lid = 84 * s;
  const logoSize = w * 0.62;
  if (open) {
    return `
      <ellipse cx="${cx}" cy="${cy + 130 * s}" rx="${w * 0.66}" ry="${20 * s}" fill="#000" opacity=".14"/>
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${20 * s}" fill="#FFFDF8"/>
      <rect x="${cx - w / 2 - 8 * s}" y="${cy + h / 2 - 10 * s}" width="${w + 16 * s}" height="26" rx="8" fill="#B8893F"/>
      <ellipse cx="${cx}" cy="${cy - h / 2 + 6 * s}" rx="${w * 0.46}" ry="${34 * s}" fill="${butter}"/>
      <path d="M${cx - w * 0.26} ${cy - h / 2 + 6 * s} q ${w * 0.13} ${-w * 0.14} ${w * 0.26} 0 t ${w * 0.26} 0" fill="none" stroke="#fff" stroke-width="${9 * s}" stroke-linecap="round" opacity=".9"/>
      <image href="${LOGO}" x="${cx - logoSize / 2}" y="${cy - logoSize / 2 + 20 * s}" width="${logoSize}" height="${logoSize}"/>`;
  }
  return `
    <ellipse cx="${cx}" cy="${cy + h / 2 + 22 * s}" rx="${w * 0.62}" ry="${18 * s}" fill="#000" opacity=".14"/>
    <rect x="${cx - w / 2 - 7 * s}" y="${cy - h / 2 - lid}" width="${w + 14 * s}" height="${lid}" rx="${12 * s}" fill="#2F2620"/>
    <rect x="${cx - w / 2 - 7 * s}" y="${cy - h / 2 - lid}" width="${w + 14 * s}" height="${lid / 3}" rx="${12 * s}" fill="#B8893F"/>
    <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${20 * s}" fill="#FFFDF8"/>
    <rect x="${cx - w * 0.4}" y="${cy - h * 0.32}" width="${w * 0.8}" height="${h * 0.64}" fill="${butter}" opacity=".5"/>
    <image href="${LOGO}" x="${cx - logoSize / 2}" y="${cy - logoSize / 2 + 10 * s}" width="${logoSize}" height="${logoSize}"/>`;
}

function frame(w, h, bg, ground, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7EEDF"/><stop offset=".62" stop-color="${bg}"/><stop offset="1" stop-color="${ground}"/></linearGradient>
    <clipPath id="arch"><path d="M60 1250 L60 520 Q60 160 ${w / 2} 120 Q${w - 60} 160 ${w - 60} 520 L${w - 60} 1250 Z"/></clipPath>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <ellipse cx="${w * 0.5}" cy="${h * 0.16}" rx="${w * 0.42}" ry="150" fill="#fff" opacity=".18"/>
  <g clip-path="url(#arch)">
    <rect x="60" y="100" width="${w - 120}" height="1180" fill="#FBF3E4"/>
    ${inner}
  </g>
  <path d="M60 1250 L60 520 Q60 160 ${w / 2} 120 Q${w - 60} 160 ${w - 60} 520 L${w - 60} 1250 Z" fill="none" stroke="#8E6A2E" stroke-width="6"/>
  <rect x="${w - 330}" y="80" width="250" height="250" rx="125" fill="#2F2620" transform="rotate(10 ${w - 205} 205)"/>
  <text x="${w - 205}" y="190" text-anchor="middle" font-family="Helvetica,Arial" font-size="34" font-weight="bold" fill="#F4ECDF" letter-spacing="3" transform="rotate(10 ${w - 205} 205)">PROOF</text>
  <text x="${w - 205}" y="232" text-anchor="middle" font-family="Helvetica,Arial" font-size="30" fill="#E8B93E" letter-spacing="2" transform="rotate(10 ${w - 205} 205)">OF CONCEPT</text>
</svg>`;
}

function write(rel, content) {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

for (const p of products) {
  const W = 1600, H = 2000;
  for (const key of shots) {
    let inner;
    if (key === "texture")
      inner = `<rect x="60" y="100" width="${W - 120}" height="1180" fill="${p.butter}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-60 ${420 + i * 200} q 420 -150 830 0 t 900 0" fill="none" stroke="#fff" stroke-width="46" opacity=".6"/>`).join("")}<ellipse cx="1150" cy="420" rx="180" ry="60" fill="#fff" opacity=".35"/>`;
    else if (key === "ingredients")
      inner = `<rect x="60" y="100" width="${W - 120}" height="1180" fill="#F3E7D2"/>${propsSvg(p.prop, W, H - 700)}${jarSvg(W / 2, 760, 1.9, p.butter, false)}`;
    else if (key === "lifestyle")
      inner = `<rect x="60" y="100" width="${W - 120}" height="1180" fill="${p.ground}"/><ellipse cx="${W / 2}" cy="880" rx="480" ry="330" fill="#E8B98A" opacity=".8"/><ellipse cx="${W / 2}" cy="820" rx="330" ry="200" fill="${p.butter}"/>${jarSvg(W / 2, 950, 1.4, p.butter, true)}`;
    else inner = `${propsSvg(p.prop, W, H - 700)}${jarSvg(W / 2, key === "main" ? 740 : 780, key === "main" ? 2.5 : 1.9, p.butter, key === "open")}`;
    write(`products/${p.slug}/${key}.svg`, frame(W, H, p.bg, p.ground, inner));
  }
}

const site = [
  { name: "hero-desktop", w: 2400, h: 1200 },
  { name: "hero-mobile", w: 1080, h: 1350 },
  { name: "ingredients-story", w: 1600, h: 1200 },
  { name: "founder", w: 1200, h: 1500 },
  { name: "local", w: 1600, h: 1200 },
];
for (const s of site) {
  const inner = `<rect x="0" y="0" width="${s.w}" height="${s.h}" fill="#F3E7D2"/>${propsSvg("shea", s.w, s.h + 500)}${jarSvg(s.w * 0.68, s.h * 0.55, s.w / 1600, "#F6EBD6", false)}<image href="${LOGO}" x="${s.w * 0.06}" y="${s.h * 0.12}" width="${s.w * 0.2}" height="${s.w * 0.2}"/>`;
  write(`site/${s.name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}"><rect width="100%" height="100%" fill="#EAD9BC"/>${inner}<rect x="${s.w - 230}" y="60" width="180" height="180" rx="90" fill="#2F2620" transform="rotate(10 ${s.w - 140} 150)"/><text x="${s.w - 140}" y="140" text-anchor="middle" font-family="Helvetica,Arial" font-size="26" font-weight="bold" fill="#F4ECDF" transform="rotate(10 ${s.w - 140} 150)">PROOF</text><text x="${s.w - 140}" y="170" text-anchor="middle" font-family="Helvetica,Arial" font-size="22" fill="#E8B93E" transform="rotate(10 ${s.w - 140} 150)">OF CONCEPT</text></svg>`);
}
console.log("Editorial POC placeholders written.");
