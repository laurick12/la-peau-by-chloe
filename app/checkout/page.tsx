"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { computeTotals, getDeliveryTier, normalizeZip, type FulfillmentMethod, type PaymentMethod, type PricedLine, type Totals } from "@/lib/order";
import { saveOrderSummary, type OrderSummary } from "@/lib/order-summary";
import { productImage } from "@/data/products";
import { ProductImage } from "@/components/ProductImage";
import { DELIVERY_SCHEDULE, DELIVERY_TIERS, PICKUP, SHIPPING } from "@/config/fulfillment";
import { paymentConfig } from "@/config/site";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey && !publishableKey.includes("xxx") ? loadStripe(publishableKey) : null;

type Form = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
};

const emptyForm: Form = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "NC", zip: "", notes: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, rawLines, subtotalCents, hydrated, clear } = useCart();
  const [form, setForm] = useState<Form>(emptyForm);
  const [method, setMethod] = useState<FulfillmentMethod>("shipping");
  const [payment, setPayment] = useState<PaymentMethod>(stripePromise ? "card" : "cashapp");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cardSession, setCardSession] = useState<{ clientSecret: string; summary: OrderSummary } | null>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const zip = normalizeZip(form.zip);
  const tier = getDeliveryTier(zip);
  const quote = useMemo(() => computeTotals(subtotalCents, method, zip), [subtotalCents, method, zip]);
  const needsAddress = method !== "pickup";
  const locked = cardSession !== null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: rawLines,
          customer: { name: form.name, email: form.email, phone: form.phone },
          fulfillment: {
            method,
            address: needsAddress
              ? { line1: form.line1, line2: form.line2, city: form.city, state: form.state, zip: form.zip }
              : undefined,
          },
          paymentMethod: payment,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      const summary: OrderSummary = {
        orderId: data.orderId,
        paymentMethod: payment,
        customerName: form.name,
        email: form.email,
        fulfillmentMethod: method,
        lines: data.lines as PricedLine[],
        totals: data.totals as Totals,
        instructions: data.instructions,
      };

      if (payment === "card") {
        setCardSession({ clientSecret: data.clientSecret, summary });
      } else {
        saveOrderSummary(summary);
        clear();
        router.push(`/order/confirmation?order=${encodeURIComponent(data.orderId)}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0 && !cardSession) {
    return (
      <div className="container section center">
        <h1>Your bag is empty</h1>
        <p className="muted">Add a butter or two and come back.</p>
        <Link href="/shop" className="btn mt-lg">Shop all</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout">
        <div>
          <form onSubmit={submit}>
            <fieldset disabled={locked} style={{ border: 0, padding: 0, margin: 0 }}>
              <h2>Contact</h2>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="name">Full name</label>
                  <input id="name" required autoComplete="name" value={form.name} onChange={set("name")} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone {method === "shipping" && <span className="muted">(optional)</span>}</label>
                  <input id="phone" type="tel" autoComplete="tel" required={method !== "shipping"} value={form.phone} onChange={set("phone")} />
                </div>
              </div>

              <h2>Delivery method</h2>
              <div className="choice-list" role="radiogroup">
                <label className={`choice ${method === "shipping" ? "is-active" : ""}`}>
                  <input type="radio" name="method" checked={method === "shipping"} onChange={() => setMethod("shipping")} />
                  <div>
                    <strong>Standard shipping</strong>
                    <span>{SHIPPING.estimate}</span>
                  </div>
                  <div className="choice__price">
                    {subtotalCents >= SHIPPING.freeOverCents ? "Free" : formatMoney(SHIPPING.standardCents)}
                  </div>
                </label>
                <label className={`choice ${method === "pickup" ? "is-active" : ""}`}>
                  <input type="radio" name="method" checked={method === "pickup"} onChange={() => setMethod("pickup")} />
                  <div>
                    <strong>Local pickup · {PICKUP.area}</strong>
                    <span>{PICKUP.readyIn}. {PICKUP.details}</span>
                  </div>
                  <div className="choice__price">Free</div>
                </label>
                <label className={`choice ${method === "delivery" ? "is-active" : ""}`}>
                  <input type="radio" name="method" checked={method === "delivery"} onChange={() => setMethod("delivery")} />
                  <div>
                    <strong>Local delivery · Charlotte area</strong>
                    <span>
                      {DELIVERY_TIERS.map((t) => `${t.label} ${formatMoney(t.feeCents)}`).join(" · ")}. {DELIVERY_SCHEDULE}
                    </span>
                  </div>
                  <div className="choice__price">{tier ? formatMoney(tier.feeCents) : "$5–$10"}</div>
                  {method === "delivery" && zip.length === 5 && (
                    <div className="choice__extra">
                      {tier ? (
                        <span className="ok">✓ {tier.label} available for {zip}</span>
                      ) : (
                        <span className="error">We don’t deliver to {zip} yet. Choose shipping or pickup.</span>
                      )}
                    </div>
                  )}
                </label>
              </div>

              {needsAddress && (
                <>
                  <h2>{method === "delivery" ? "Delivery address" : "Shipping address"}</h2>
                  <div className="form-grid">
                    <div className="field full">
                      <label htmlFor="line1">Address</label>
                      <input id="line1" required autoComplete="address-line1" value={form.line1} onChange={set("line1")} />
                    </div>
                    <div className="field full">
                      <label htmlFor="line2">Apt, suite (optional)</label>
                      <input id="line2" autoComplete="address-line2" value={form.line2} onChange={set("line2")} />
                    </div>
                    <div className="field">
                      <label htmlFor="city">City</label>
                      <input id="city" required autoComplete="address-level2" value={form.city} onChange={set("city")} />
                    </div>
                    <div className="form-grid" style={{ gap: 14 }}>
                      <div className="field">
                        <label htmlFor="state">State</label>
                        <input id="state" required maxLength={2} autoComplete="address-level1" value={form.state} onChange={set("state")} />
                      </div>
                      <div className="field">
                        <label htmlFor="zip">ZIP</label>
                        <input id="zip" required inputMode="numeric" maxLength={10} autoComplete="postal-code" value={form.zip} onChange={set("zip")} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <h2>Payment</h2>
              <div className="choice-list" role="radiogroup">
                <label className={`choice ${payment === "card" ? "is-active" : ""}`} aria-disabled={!stripePromise}>
                  <input type="radio" name="payment" disabled={!stripePromise} checked={payment === "card"} onChange={() => setPayment("card")} />
                  <div>
                    <strong>Credit / debit card</strong>
                    <span>{stripePromise ? "Secure checkout by Stripe · Apple Pay & Google Pay supported" : "Card payments coming soon"}</span>
                  </div>
                  <div />
                </label>
                <label className={`choice ${payment === "cashapp" ? "is-active" : ""}`}>
                  <input type="radio" name="payment" checked={payment === "cashapp"} onChange={() => setPayment("cashapp")} />
                  <div>
                    <strong>Cash App</strong>
                    <span>Send to {paymentConfig.cashApp.cashtag} after placing your order. Instructions on the next page.</span>
                  </div>
                  <div />
                </label>
                <label className={`choice ${payment === "zelle" ? "is-active" : ""}`}>
                  <input type="radio" name="payment" checked={payment === "zelle"} onChange={() => setPayment("zelle")} />
                  <div>
                    <strong>Zelle</strong>
                    <span>Send to {paymentConfig.zelle.recipient} after placing your order. Instructions on the next page.</span>
                  </div>
                  <div />
                </label>
              </div>

              <div className="field" style={{ marginTop: 24 }}>
                <label htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} placeholder="Gate code, gift note, delivery preferences…" />
              </div>
            </fieldset>

            {error && <p className="error" role="alert" style={{ marginTop: 18 }}>{error}</p>}

            {!locked && (
              <button className="btn btn--gold btn--block" style={{ marginTop: 24 }} disabled={submitting || !quote.ok}>
                {submitting
                  ? "One moment…"
                  : payment === "card"
                    ? "Continue to payment"
                    : `Place order${quote.ok ? ` · ${formatMoney(quote.totals.totalCents)}` : ""}`}
              </button>
            )}
          </form>

          {cardSession && stripePromise && (
            <div className="pay-box">
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: cardSession.clientSecret,
                  appearance: {
                    theme: "flat",
                    variables: {
                      colorPrimary: "#8e6a2e",
                      colorBackground: "#ffffff",
                      colorText: "#2f2620",
                      fontFamily: "Jost, system-ui, sans-serif",
                      borderRadius: "2px",
                    },
                    rules: { ".Input": { border: "1px solid #e6dacb" } },
                  },
                }}
              >
                <CardPayment summary={cardSession.summary} onBack={() => setCardSession(null)} />
              </Elements>
            </div>
          )}
        </div>

        <aside className="checkout__summary" aria-label="Order summary">
          <h2 style={{ marginTop: 0 }}>Order summary</h2>
          {lines.map((l) => (
            <div className="summary-line" key={`${l.slug}-${l.sizeId}`}>
              <div className="line__img">
                <ProductImage src={productImage(l.slug, "main")} alt={l.name} fill sizes="64px" />
              </div>
              <div>
                <div className="line__name" style={{ fontSize: "1rem" }}>{l.name}</div>
                <div className="line__meta" style={{ margin: 0 }}>{l.sizeLabel} · Qty {l.quantity}</div>
              </div>
              <div>{formatMoney(l.lineCents)}</div>
            </div>
          ))}
          <div className="summary-totals">
            <div><span>Subtotal</span><span>{formatMoney(subtotalCents)}</span></div>
            <div>
              <span>{quote.ok ? quote.totals.fulfillmentLabel : "Delivery"}</span>
              <span>{quote.ok ? (quote.totals.fulfillmentCents ? formatMoney(quote.totals.fulfillmentCents) : "Free") : "TBD"}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>{quote.ok ? formatMoney(quote.totals.totalCents) : "TBD"}</span>
            </div>
          </div>
          {!quote.ok && method === "delivery" && zip.length === 5 && <p className="error small" style={{ marginTop: 12 }}>{quote.error}</p>}
        </aside>
      </div>
    </div>
  );
}

function CardPayment({ summary, onBack }: { summary: OrderSummary; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pay() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    saveOrderSummary(summary);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation?order=${encodeURIComponent(summary.orderId)}`,
        receipt_email: summary.email,
      },
    });
    // Only reached on immediate errors (card declined, validation); success redirects.
    if (error) setError(error.message ?? "Payment failed. Please try again.");
    setBusy(false);
  }

  return (
    <div>
      <span className="option-label">Card details</span>
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className="error" role="alert" style={{ marginTop: 14 }}>{error}</p>}
      <button className="btn btn--gold btn--block" style={{ marginTop: 20 }} onClick={pay} disabled={!stripe || busy}>
        {busy ? "Processing…" : `Pay ${formatMoney(summary.totals.totalCents)}`}
      </button>
      <button type="button" className="line__remove" style={{ display: "block", margin: "14px auto 0" }} onClick={onBack} disabled={busy}>
        Edit order details
      </button>
    </div>
  );
}
