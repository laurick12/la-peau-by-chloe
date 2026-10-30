import { siteConfig } from "@/config/site";

export type SizeId = "4oz" | "8oz" | "16oz";

export type ProductSize = {
  id: SizeId;
  label: string;
  /** Price in cents */
  priceCents: number;
};

export type Ingredient = {
  /** Plain-English name shown first */
  name: string;
  /** INCI / botanical name for full transparency */
  inci: string;
  /** Why it's in the jar */
  purpose: string;
};

export type ImageKey = "main" | "texture" | "open" | "ingredients" | "lifestyle";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  collection: "Essentials" | "Women's Collection" | "Men's Collection";
  filter: "unscented" | "women" | "men";
  tagline: string;
  description: string;
  scent: string;
  texture: string;
  sizes: ProductSize[];
  ingredients: Ingredient[];
  benefits: string[];
  howToUse: string;
  skinNote?: string;
  badges: string[];
  /** Used to tint generated placeholder imagery */
  accent: string;
};

export const IMAGE_KEYS: { key: ImageKey; label: string }[] = [
  { key: "main", label: "Front packshot" },
  { key: "texture", label: "Texture close-up" },
  { key: "open", label: "Open jar, top-down" },
  { key: "ingredients", label: "Ingredient flat lay" },
  { key: "lifestyle", label: "On skin" },
];

/** Every product uses the same three sizes; prices reflect current market rates for small-batch natural shea. */
const sizes = (p4: number, p8: number, p16: number): ProductSize[] => [
  { id: "4oz", label: "4 oz", priceCents: p4 },
  { id: "8oz", label: "8 oz", priceCents: p8 },
  { id: "16oz", label: "16 oz", priceCents: p16 },
];

const shea: Ingredient = {
  name: "Raw unrefined shea butter",
  inci: "Butyrospermum Parkii (Shea) Butter",
  purpose: "Rich in vitamins A & E and fatty acids that soften and protect the skin barrier.",
};
const jojoba: Ingredient = {
  name: "Pure jojoba oil",
  inci: "Simmondsia Chinensis (Jojoba) Seed Oil",
  purpose: "Closely mirrors skin’s natural sebum, so it absorbs without a greasy film.",
};
const coconut: Ingredient = {
  name: "Organic virgin coconut oil",
  inci: "Cocos Nucifera (Coconut) Oil",
  purpose: "Lightens the texture and adds a silky glide.",
};
const vitaminE: Ingredient = {
  name: "Vitamin E (from sunflower)",
  inci: "Tocopherol",
  purpose: "A natural antioxidant that keeps the oils fresh, no synthetic preservatives.",
};

export const products: Product[] = [
  {
    slug: "original-raw-shea-butter",
    name: "The Original Raw Shea Butter",
    shortName: "Original Raw Shea",
    collection: "Essentials",
    filter: "unscented",
    tagline: "100% pure, unrefined shea. One ingredient. Nothing else.",
    description:
      "Hand-sourced Grade A unrefined shea butter in its most honest form. Ivory, naturally nutty, and dense, it melts on contact with skin to deeply nourish dry elbows, knees, hands, hair ends, and anywhere that needs a little extra care.",
    scent: "Natural, soft nutty aroma of raw shea",
    texture: "Firm, rich butter that melts on contact",
    sizes: sizes(1200, 2000, 3400),
    ingredients: [shea],
    benefits: [
      "Single-ingredient, the simplest choice for the most sensitive skin",
      "No added fragrance, essential oils, or preservatives",
      "Seals in moisture on very dry, rough, or cracked areas",
      "Multi-use: body, hands, cuticles, lips, beard, and hair ends",
    ],
    howToUse:
      "Scoop a small amount and warm it between your palms until it melts. Press into damp skin after bathing. A little goes a long way.",
    badges: ["1 Ingredient", "Unscented", "Unrefined"],
    accent: "#E9DCC6",
  },
  {
    slug: "unscented-whipped-shea-butter",
    name: "The Unscented Whipped Shea Butter",
    shortName: "Unscented Whipped Shea",
    collection: "Essentials",
    filter: "unscented",
    tagline: "Ultra-gentle, cloud-soft care for reactive or eczema-prone skin.",
    description:
      "Our gentlest formula. Raw shea is whipped with skin-identical jojoba until it’s light as mousse, so it spreads easily over tender, easily irritated skin without tugging. No scent, no essential oils, just calm, comfortable skin.",
    scent: "Fragrance-free",
    texture: "Light, airy whipped mousse",
    sizes: sizes(1600, 2600, 4200),
    ingredients: [shea, jojoba, vitaminE],
    benefits: [
      "Fragrance-free and essential-oil-free for reactive skin",
      "Whipped texture glides on without rubbing irritated areas",
      "Helps relieve the dryness and tightness associated with eczema-prone skin",
      "Gentle enough for the whole family",
    ],
    howToUse:
      "Smooth a thin layer over clean, slightly damp skin morning and night, or whenever skin feels tight or dry.",
    skinNote:
      "Formulated for sensitive and eczema-prone skin. Not intended to diagnose or treat any medical condition. Consult your doctor for persistent skin concerns.",
    badges: ["Fragrance-Free", "Whipped", "Eczema-Prone Friendly"],
    accent: "#EFE6D8",
  },
  {
    slug: "vanilla-coconut-whipped-shea",
    name: "Women's Collection #1: Vanilla & Coconut",
    shortName: "Vanilla & Coconut",
    collection: "Women's Collection",
    filter: "women",
    tagline: "Warm vanilla bean and creamy coconut, whipped into soft shea.",
    description:
      "A cozy, edible-smelling blend of real vanilla bean extract and organic virgin coconut oil, whipped into raw shea. Leaves skin soft, glowing, and lightly scented, never perfume-strong.",
    scent: "Warm vanilla bean, creamy coconut",
    texture: "Whipped, buttery, fast-absorbing",
    sizes: sizes(1800, 2800, 4600),
    ingredients: [
      shea,
      coconut,
      {
        name: "Natural vanilla bean extract",
        inci: "Vanilla Planifolia Fruit Extract",
        purpose: "Real vanilla for a soft, warm scent, no synthetic fragrance or vanillin.",
      },
      vitaminE,
    ],
    benefits: [
      "Scented only with real vanilla, no synthetic fragrance",
      "Coconut oil gives a silky, non-sticky finish",
      "Lightweight enough for daily, all-over use",
    ],
    howToUse:
      "Massage into skin after your shower, focusing on dry areas. Layer on shoulders and collarbones for a soft glow.",
    skinNote: "Contains coconut. Patch test first if you have known sensitivities.",
    badges: ["Real Vanilla", "Whipped", "No Synthetic Fragrance"],
    accent: "#EBD9BD",
  },
  {
    slug: "floral-jasmine-whipped-shea",
    name: "Women's Collection #2: Floral Jasmine",
    shortName: "Floral Jasmine",
    collection: "Women's Collection",
    filter: "women",
    tagline: "Delicate jasmine, infused with pure botanical oils.",
    description:
      "Soft, romantic, and quietly floral. Raw shea is whipped with jojoba and sweet almond oil, then lightly scented with pure jasmine, a botanical blend that feels like a slow Sunday morning.",
    scent: "Soft white jasmine, light and airy",
    texture: "Whipped, silky, quick-absorbing",
    sizes: sizes(1800, 2800, 4600),
    ingredients: [
      shea,
      jojoba,
      {
        name: "Sweet almond oil",
        inci: "Prunus Amygdalus Dulcis (Sweet Almond) Oil",
        purpose: "A gentle, vitamin-rich oil that leaves skin supple.",
      },
      {
        name: "Pure jasmine flower oil",
        inci: "Jasminum Sambac (Jasmine) Flower Oil",
        purpose: "A botanical floral scent, used at a skin-gentle low level.",
      },
      vitaminE,
    ],
    benefits: [
      "Scented only with pure botanical jasmine",
      "Low essential-oil level chosen with sensitive skin in mind",
      "Almond and jojoba oils for a soft, supple finish",
    ],
    howToUse:
      "Warm a small scoop between palms and smooth over skin. Apply to pulse points for a soft, lingering floral note.",
    skinNote: "Contains sweet almond oil (tree nut). Patch test first if you have known sensitivities.",
    badges: ["Pure Botanical Oils", "Whipped", "No Synthetic Fragrance"],
    accent: "#EADFD6",
  },
  {
    slug: "cedarwood-amber-whipped-shea",
    name: "Men's Collection: Cedarwood & Amber",
    shortName: "Cedarwood & Amber",
    collection: "Men's Collection",
    filter: "men",
    tagline: "A rich, earthy blend for skin and beard.",
    description:
      "Grounded and warm. Raw shea whipped with jojoba, then scented with cedarwood essential oil and natural benzoin resin for a smooth, amber-like depth. Works as a body butter, beard balm, and post-shave soother.",
    scent: "Dry cedarwood, warm resinous amber",
    texture: "Dense whipped butter, absorbs clean",
    sizes: sizes(1800, 2800, 4600),
    ingredients: [
      shea,
      jojoba,
      {
        name: "Cedarwood essential oil",
        inci: "Cedrus Atlantica (Cedarwood) Bark Oil",
        purpose: "A natural woody, grounding scent.",
      },
      {
        name: "Benzoin resin (natural amber note)",
        inci: "Styrax Benzoin Resin Extract",
        purpose: "A tree resin that gives a warm, amber-like depth, no synthetic amber accords.",
      },
      vitaminE,
    ],
    benefits: [
      "Doubles as a beard balm. Softens coarse hair and the skin underneath",
      "Calms the look of post-shave dryness",
      "Scented only with natural essential oils and resin",
    ],
    howToUse:
      "Use a fingertip-sized amount on beard and face after shaving, or all over body after showering.",
    skinNote: "Contains essential oils. Patch test first if you have known sensitivities.",
    badges: ["Natural Essential Oils", "Beard & Body", "No Synthetic Fragrance"],
    accent: "#D9C7AE",
  },
];

/** Things we never use, shown on PDPs and the homepage. */
export const NEVER_INSIDE = [
  "Synthetic fragrance",
  "Parabens",
  "Sulfates",
  "Petroleum & mineral oil",
  "Artificial dyes",
  "Silicones",
  "Fillers",
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getSize(product: Product, sizeId: string) {
  return product.sizes.find((s) => s.id === sizeId);
}

export function productImage(slug: string, key: ImageKey) {
  return `/images/products/${slug}/${key}.${siteConfig.imageExt}`;
}

export function fromPriceCents(product: Product) {
  return Math.min(...product.sizes.map((s) => s.priceCents));
}
