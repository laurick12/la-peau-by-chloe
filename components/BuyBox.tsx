"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { MAX_QTY } from "@/lib/order";
import { Icon } from "@/components/Icons";
import { SHIPPING } from "@/config/fulfillment";
import type { Product, SizeId } from "@/data/products";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState<SizeId>(product.sizes[1]?.id ?? product.sizes[0].id);
  const [qty, setQty] = useState(1);
  const size = product.sizes.find((s) => s.id === sizeId)!;
  const ounces = parseInt(size.label, 10);

  return (
    <div>
      <div className="pdp__price" aria-live="polite">{formatMoney(size.priceCents * qty)}</div>
      <div className="pdp__unit">
        {formatMoney(size.priceCents)} · {formatMoney(Math.round(size.priceCents / ounces))}/oz
      </div>

      <span className="option-label" id="size-label">Size</span>
      <div className="size-toggle" role="group" aria-labelledby="size-label">
        {product.sizes.map((s) => (
          <button key={s.id} type="button" aria-pressed={s.id === sizeId} onClick={() => setSizeId(s.id)}>
            <strong>{s.label}</strong>
            <span>{formatMoney(s.priceCents)}</span>
          </button>
        ))}
      </div>

      <div className="buy-row">
        <div className="qty">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button className="btn btn--gold" onClick={() => add(product.slug, sizeId, qty)}>
          Add to bag · {formatMoney(size.priceCents * qty)}
        </button>
      </div>

      <ul className="pdp__perks">
        <li><Icon.truck /> Free shipping on orders over {formatMoney(SHIPPING.freeOverCents)}</li>
        <li><Icon.pin /> Free local pickup or $5–$10 delivery around Charlotte, NC</li>
        <li><Icon.check /> Small-batch, made fresh to order</li>
      </ul>
    </div>
  );
}
