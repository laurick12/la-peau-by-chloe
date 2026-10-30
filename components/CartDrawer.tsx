"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { productImage } from "@/data/products";
import { ProductImage } from "@/components/ProductImage";
import { SHIPPING } from "@/config/fulfillment";

export function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove, subtotalCents, count } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const remaining = Math.max(0, SHIPPING.freeOverCents - subtotalCents);
  const pct = Math.min(100, (subtotalCents / SHIPPING.freeOverCents) * 100);

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? "is-open" : ""}`} onClick={close} aria-hidden />
      <aside
        className={`drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="drawer__head">
          <h2>Your Bag {count > 0 && <span className="muted small">({count})</span>}</h2>
          <button className="drawer__close" onClick={close} aria-label="Close bag">
            ×
          </button>
        </div>

        {lines.length > 0 && (
          <div className="drawer__progress">
            {remaining > 0 ? (
              <>You’re <strong>{formatMoney(remaining)}</strong> away from free shipping</>
            ) : (
              <>You’ve unlocked <strong>free shipping</strong> ✨</>
            )}
            <div className="progress"><span style={{ width: `${pct}%` }} /></div>
          </div>
        )}

        <div className="drawer__lines">
          {lines.length === 0 ? (
            <div className="drawer__empty">
              <p className="script" style={{ fontSize: "2.2rem" }}>Your bag is empty</p>
              <p className="muted">Pure, simple shea is just a click away.</p>
              <Link href="/shop" className="btn" onClick={close}>Shop all</Link>
            </div>
          ) : (
            lines.map((l) => (
              <div className="line" key={`${l.slug}-${l.sizeId}`}>
                <Link href={`/products/${l.slug}`} className="line__img" onClick={close}>
                  <ProductImage src={productImage(l.slug, "main")} alt={l.name} fill sizes="84px" />
                </Link>
                <div>
                  <div className="line__name">{l.name}</div>
                  <div className="line__meta">{l.sizeLabel} · {formatMoney(l.unitCents)}</div>
                  <div className="qty qty--sm">
                    <button onClick={() => setQuantity(l.slug, l.sizeId, l.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span>{l.quantity}</span>
                    <button onClick={() => setQuantity(l.slug, l.sizeId, l.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="line__remove" onClick={() => remove(l.slug, l.sizeId)}>Remove</button>
                </div>
                <div className="line__price">{formatMoney(l.lineCents)}</div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__row">
              <span>Subtotal</span>
              <strong style={{ fontWeight: 500 }}>{formatMoney(subtotalCents)}</strong>
            </div>
            <p className="small muted">Shipping, local pickup, or Charlotte delivery chosen at checkout.</p>
            <Link href="/checkout" className="btn btn--block btn--gold" onClick={close}>
              Checkout
            </Link>
            <p className="small muted center" style={{ margin: "12px 0 0" }}>
              Card · Apple Pay · Google Pay · Cash App · Zelle
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
