import { NextResponse } from "next/server";
import {
  computeTotals,
  normalizeZip,
  priceLines,
  type CartLineInput,
  type FulfillmentMethod,
  type PaymentMethod,
} from "@/lib/order";
import { getStripe } from "@/lib/stripe";
import { newOrderId, notifyNewOrder } from "@/lib/orders";
import { paymentConfig } from "@/config/site";

type Body = {
  items: CartLineInput[];
  customer: { name: string; email: string; phone?: string };
  fulfillment: {
    method: FulfillmentMethod;
    address?: { line1: string; line2?: string; city: string; state: string; zip: string };
  };
  paymentMethod: PaymentMethod;
  notes?: string;
};

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request.");
  }

  // ---- Validate customer ----
  const name = str(body.customer?.name, 120);
  const email = str(body.customer?.email, 200);
  const phone = str(body.customer?.phone, 40);
  if (!name) return bad("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email.");

  // ---- Validate fulfillment ----
  const method = body.fulfillment?.method;
  if (!["shipping", "pickup", "delivery"].includes(method)) return bad("Choose a delivery method.");
  const a = body.fulfillment?.address;
  const address =
    method === "pickup"
      ? undefined
      : {
          line1: str(a?.line1),
          line2: str(a?.line2),
          city: str(a?.city, 80),
          state: str(a?.state, 2).toUpperCase(),
          zip: normalizeZip(a?.zip),
        };
  if (address && (!address.line1 || !address.city || address.state.length !== 2 || address.zip.length !== 5)) {
    return bad("Please complete your address.");
  }
  if ((method === "delivery" || method === "pickup") && !phone) {
    return bad("A phone number is required for local pickup or delivery.");
  }

  // ---- Re-price everything server-side ----
  let lines;
  try {
    lines = priceLines(body.items);
  } catch (e) {
    return bad((e as Error).message);
  }
  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);
  const result = computeTotals(subtotalCents, method, address?.zip);
  if (!result.ok) return bad(result.error);
  const { totals } = result;

  const paymentMethod = body.paymentMethod;
  if (!["card", "cashapp", "zelle"].includes(paymentMethod)) return bad("Choose a payment method.");

  const orderId = newOrderId();
  const itemsSummary = lines.map((l) => `${l.quantity}× ${l.name} (${l.sizeLabel})`).join("; ");
  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: { name, email, phone },
    fulfillment: { method, label: totals.fulfillmentLabel, address },
    paymentMethod,
    items: lines,
    totals,
    notes: str(body.notes, 500),
  };

  // ---- Card: create a Stripe PaymentIntent for the embedded Payment Element ----
  if (paymentMethod === "card") {
    const stripe = getStripe();
    if (!stripe) return bad("Card payments are not configured yet. Please choose Cash App or Zelle.", 503);

    const intent = await stripe.paymentIntents.create({
      amount: totals.totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `La Peau by Chloe order ${orderId}`,
      metadata: {
        orderId,
        customer_name: name,
        customer_phone: phone,
        fulfillment: totals.fulfillmentLabel,
        items: itemsSummary.slice(0, 500),
        notes: order.notes.slice(0, 500),
      },
      ...(address && {
        shipping: {
          name,
          phone: phone || undefined,
          address: {
            line1: address.line1,
            line2: address.line2 || undefined,
            city: address.city,
            state: address.state,
            postal_code: address.zip,
            country: "US",
          },
        },
      }),
    });

    // The confirmed order notification is sent from the Stripe webhook once payment succeeds.
    return NextResponse.json({ orderId, totals, lines, clientSecret: intent.client_secret });
  }

  // ---- Cash App / Zelle: record the order as awaiting manual payment ----
  await notifyNewOrder({ ...order, status: "awaiting_manual_payment" });

  const instructions =
    paymentMethod === "cashapp"
      ? { method: "Cash App", sendTo: paymentConfig.cashApp.cashtag }
      : { method: "Zelle", sendTo: paymentConfig.zelle.recipient, recipientName: paymentConfig.zelle.name };

  return NextResponse.json({
    orderId,
    totals,
    lines,
    instructions: { ...instructions, memo: orderId, windowHours: paymentConfig.manualPaymentWindowHours },
  });
}
