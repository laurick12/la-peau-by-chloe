"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { Sticker } from "@/components/Sticker";
import { fromPriceCents, productImageSrcSet, productImageWebp, type Product } from "@/data/products";
import { formatMoney } from "@/lib/format";

const TILTS = [
  "rotate(-1.6deg)",
  "rotate(1.4deg)",
  "rotate(-1deg)",
  "rotate(1.8deg)",
  "rotate(-1.4deg)",
];

export function ProductCard({
  product,
  priority = false,
  index = 0,
}: {
  product: Product;
  priority?: boolean;
  index?: number;
}) {
  // The hover texture only mounts after the first hover, so it never costs
  // a download on first paint. It stays mounted afterwards, so repeat
  // hovers (and the CSS fade-out) work from the cache.
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card card--editorial"
      style={{ transform: TILTS[index % TILTS.length] }}
      onMouseEnter={() => setHovered(true)}
    >
      <div className="card__media card__media--arch">
        <span className="card__badge">{product.badges[0]}</span>
        <span className="card__sticker">
          <Sticker product={product} size={84} />
        </span>
        <ProductImage
          src={productImageWebp(product.slug, "main", 800)}
          srcSet={productImageSrcSet(product.slug, "main")}
          alt={`${product.name} jar with La Peau by Chloe logo`}
          fill
          sizes="(max-width: 860px) 50vw, 33vw"
          priority={priority}
        />
        {hovered && (
          <ProductImage
            className="card__hover"
            src={productImageWebp(product.slug, "texture", 800)}
            srcSet={productImageSrcSet(product.slug, "texture")}
            alt={`${product.shortName} texture close-up`}
            fill
            sizes="(max-width: 860px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="card__body">
        <div className="card__collection">{product.collection}</div>
        <h3 className="card__title">{product.shortName}</h3>
        <div className="card__price">From {formatMoney(fromPriceCents(product))}</div>
      </div>
    </Link>
  );
}
