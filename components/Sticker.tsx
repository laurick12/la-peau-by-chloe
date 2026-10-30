import type { Product } from "@/data/products";

/** Per-product "recommended" sticker line for the proof of concept. */
const STICKERS: Record<string, { top: string; bottom: string }> = {
  "original-raw-shea-butter": { top: "Chloe", bottom: "Recommends" },
  "unscented-whipped-shea-butter": { top: "Eczema-Prone", bottom: "Pick" },
  "vanilla-coconut-whipped-shea": { top: "Customer", bottom: "Favorite" },
  "floral-jasmine-whipped-shea": { top: "Most", bottom: "Romantic" },
  "cedarwood-amber-whipped-shea": { top: "For Him", bottom: "Pick" },
};

export function Sticker({ product, size = 92 }: { product: Product; size?: number }) {
  const s = STICKERS[product.slug] ?? { top: "Chloe", bottom: "Recommends" };
  return (
    <span
      className="sticker"
      aria-label={`${s.top} ${s.bottom}`}
      style={{ width: size, height: size, fontSize: size / 7.6 }}
    >
      <span className="sticker__star" aria-hidden />
      <span className="sticker__text">
        <span>{s.top}</span>
        <strong>★</strong>
        <span>{s.bottom}</span>
      </span>
    </span>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {[0, 1].map((half) => (
          <div className="marquee__half" key={half}>
            {row.map((t, i) => (
              <span key={i} className="marquee__item">
                {t} <span className="marquee__dot">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
