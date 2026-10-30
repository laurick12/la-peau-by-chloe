"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unscented", label: "Unscented" },
  { id: "women", label: "Women’s" },
  { id: "men", label: "Men’s" },
] as const;

export function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.filter === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter products">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? "is-active" : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 3} index={i} />
        ))}
      </div>
    </>
  );
}
