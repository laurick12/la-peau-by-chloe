import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns a Stripe client, or null when STRIPE_SECRET_KEY is not configured. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("xxx")) return null;
  client ??= new Stripe(key, { appInfo: { name: "La Peau by Chloe storefront" } });
  return client;
}
