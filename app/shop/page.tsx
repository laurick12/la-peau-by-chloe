import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop 100% natural shea butters for sensitive skin: raw, whipped unscented, and softly scented blends.",
};

export default function ShopPage() {
  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">Shop All</span>
        <h1>The Shea Collection</h1>
        <p>Raw, whipped, and gently scented. Every butter made with a short list of ingredients you can read.</p>
      </div>
      <ShopGrid products={products} />
      <div style={{ height: 96 }} />
    </div>
  );
}
