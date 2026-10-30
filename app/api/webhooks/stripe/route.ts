import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { notifyNewOrder } from "@/lib/orders";

/**
 * Stripe webhook: point a Dashboard endpoint (or `stripe listen`) at /api/webhooks/stripe
 * and subscribe to `payment_intent.succeeded` and `payment_intent.payment_failed`.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    await notifyNewOrder({
      orderId: pi.metadata.orderId,
      status: "paid",
      paymentMethod: "card",
      amountCents: pi.amount_received,
      email: pi.receipt_email,
      ...pi.metadata,
      shipping: pi.shipping,
      stripePaymentIntent: pi.id,
    });
  } else if (event.type === "payment_intent.payment_failed") {
    console.warn("[stripe] payment failed", event.data.object.id, event.data.object.metadata.orderId);
  }

  return NextResponse.json({ received: true });
}
