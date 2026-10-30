"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { loadOrderSummary, type OrderSummary } from "@/lib/order-summary";
import { PICKUP, DELIVERY_SCHEDULE, SHIPPING } from "@/config/fulfillment";

function Confirmation() {
  const params = useSearchParams();
  const { clear, hydrated } = useCart();
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  const orderId = params.get("order");
  const redirectStatus = params.get("redirect_status"); // set by Stripe after confirmPayment
  const cardFailed = redirectStatus && redirectStatus !== "succeeded" && redirectStatus !== "processing";

  useEffect(() => {
    const s = loadOrderSummary();
    setSummary(s && s.orderId === orderId ? s : null);
    setLoaded(true);
  }, [orderId]);

  useEffect(() => {
    if (hydrated && !cardFailed) clear();
  }, [hydrated, cardFailed, clear]);

  if (!loaded) return null;

  if (cardFailed) {
    return (
      <div className="center">
        <h1>Payment didn’t go through</h1>
        <p className="muted">Your card was not charged. Your bag is still saved.</p>
        <Link href="/checkout" className="btn mt-lg">Try again</Link>
      </div>
    );
  }

  const ins = summary?.instructions;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="center">
        <span className="eyebrow">Order {orderId}</span>
        <h1>{ins ? "Almost done!" : "Thank you!"}</h1>
        <p className="muted">
          {ins
            ? `Your order is reserved. Complete your ${ins.method} payment to confirm it.`
            : `Your payment was received${summary ? `, ${summary.customerName.split(" ")[0]}` : ""}. A receipt is on its way to your inbox.`}
        </p>
      </div>

      {ins && (
        <div className="instructions">
          <h3 style={{ marginBottom: 4 }}>Pay with {ins.method}</h3>
          <p className="muted small" style={{ margin: 0 }}>
            Orders are held for {ins.windowHours} hours. We’ll email you as soon as payment is confirmed.
          </p>
          <dl>
            <dt>Send to</dt>
            <dd>{ins.sendTo}</dd>
            {ins.recipientName && (<><dt>Name</dt><dd>{ins.recipientName}</dd></>)}
            {summary && (<><dt>Amount</dt><dd>{formatMoney(summary.totals.totalCents)}</dd></>)}
            <dt>Memo / note</dt>
            <dd>{ins.memo}</dd>
          </dl>
          <p className="note">Please include your order number <strong>{ins.memo}</strong> in the payment note so we can match it to your order.</p>
        </div>
      )}

      {summary && (
        <div className="checkout__summary" style={{ position: "static" }}>
          {summary.lines.map((l) => (
            <div className="drawer__row" key={`${l.slug}-${l.sizeId}`}>
              <span>{l.quantity}× {l.name} <span className="muted">({l.sizeLabel})</span></span>
              <span>{formatMoney(l.lineCents)}</span>
            </div>
          ))}
          <div className="summary-totals">
            <div><span>Subtotal</span><span>{formatMoney(summary.totals.subtotalCents)}</span></div>
            <div><span>{summary.totals.fulfillmentLabel}</span><span>{summary.totals.fulfillmentCents ? formatMoney(summary.totals.fulfillmentCents) : "Free"}</span></div>
            <div className="total"><span>Total</span><span>{formatMoney(summary.totals.totalCents)}</span></div>
          </div>
          <p className="small muted" style={{ marginTop: 16, marginBottom: 0 }}>
            {summary.fulfillmentMethod === "pickup" && `${PICKUP.readyIn}. ${PICKUP.details}`}
            {summary.fulfillmentMethod === "delivery" && DELIVERY_SCHEDULE}
            {summary.fulfillmentMethod === "shipping" && SHIPPING.estimate}
          </p>
        </div>
      )}

      <div className="center mt-lg">
        <Link href="/shop" className="link-underline">Continue shopping</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="container section">
      <Suspense fallback={null}>
        <Confirmation />
      </Suspense>
    </div>
  );
}
