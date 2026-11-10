"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { IMAGE_KEYS, productImageSrcSet, productImageWebp, type Product } from "@/data/products";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const current = IMAGE_KEYS[active];

  return (
    <div className="gallery">
      <div className="gallery__thumbs" role="tablist" aria-label="Product images">
        {IMAGE_KEYS.map((img, i) => (
          <button
            key={img.key}
            role="tab"
            aria-selected={i === active}
            className={`gallery__thumb ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <ProductImage src={productImageWebp(product.slug, img.key, 400)} alt={img.label} fill sizes="84px" />
          </button>
        ))}
      </div>
      <div className="gallery__main">
        <ProductImage
          key={current.key}
          src={productImageWebp(product.slug, current.key, 800)}
          srcSet={productImageSrcSet(product.slug, current.key)}
          alt={`${product.name}, ${current.label}`}
          fill
          priority
          sizes="(max-width: 960px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}
