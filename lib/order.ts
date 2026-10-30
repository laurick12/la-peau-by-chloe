/**
 * Order math shared by the browser (cart, checkout) and the server (/api/checkout).
 * The server ALWAYS re-prices from this catalog. Client-sent prices are never trusted.
 */
import { getProduct, getSize } from "@/data/products";
import { DELIVERY_TIERS, SHIPPING, type DeliveryTier } from "@/config/fulfillment";

export type FulfillmentMethod = "shipping" | "pickup" | "delivery";
export type PaymentMethod = "card" | "cashapp" | "zelle";

export type CartLineInput = { slug: string; sizeId: string; quantity: number };

export type PricedLine = CartLineInput & {
  name: string;
  sizeLabel: string;
  unitCents: number;
  lineCents: number;
};

export type Totals = {
  subtotalCents: number;
  fulfillmentCents: number;
  totalCents: number;
  fulfillmentLabel: string;
};

export const MAX_QTY = 20;

export function normalizeZip(zip?: string | null) {
  return (zip ?? "").replace(/\D/g, "").slice(0, 5);
}

export function getDeliveryTier(zip?: string | null): DeliveryTier | null {
  const z = normalizeZip(zip);
  if (z.length !== 5) return null;
  return DELIVERY_TIERS.find((t) => t.zips.includes(z)) ?? null;
}

export function shippingCents(subtotalCents: number) {
  return subtotalCents >= SHIPPING.freeOverCents ? 0 : SHIPPING.standardCents;
}

/** Strict pricing: throws on any unknown product/size or bad quantity. */
export function priceLines(lines: CartLineInput[]): PricedLine[] {
  if (!Array.isArray(lines) || lines.length === 0) throw new Error("Your bag is empty.");
  if (lines.length > 50) throw new Error("Too many items.");
  return lines.map((line) => {
    const product = getProduct(String(line?.slug));
    const size = product && getSize(product, String(line?.sizeId));
    const qty = Number(line?.quantity);
    if (!product || !size) throw new Error("One of the items in your bag is no longer available.");
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new Error("Invalid quantity.");
    return {
      slug: product.slug,
      sizeId: size.id,
      quantity: qty,
      name: product.name,
      sizeLabel: size.label,
      unitCents: size.priceCents,
      lineCents: size.priceCents * qty,
    };
  });
}

/** Lenient pricing for the UI: silently drops lines that no longer exist. */
export function safePriceLines(lines: CartLineInput[]): PricedLine[] {
  return lines.flatMap((l) => {
    try {
      return priceLines([l]);
    } catch {
      return [];
    }
  });
}

export function subtotalOf(lines: PricedLine[]) {
  return lines.reduce((sum, l) => sum + l.lineCents, 0);
}

export function computeTotals(
  subtotalCents: number,
  method: FulfillmentMethod,
  zip?: string | null,
): { ok: true; totals: Totals } | { ok: false; error: string } {
  let fulfillmentCents = 0;
  let fulfillmentLabel = "";

  if (method === "shipping") {
    fulfillmentCents = shippingCents(subtotalCents);
    fulfillmentLabel = fulfillmentCents === 0 ? "Standard shipping (free)" : "Standard shipping";
  } else if (method === "pickup") {
    fulfillmentLabel = "Local pickup · Charlotte area (free)";
  } else if (method === "delivery") {
    const tier = getDeliveryTier(zip);
    if (!tier) {
      return {
        ok: false,
        error: "Local delivery isn’t available for that ZIP code yet. Choose shipping or local pickup.",
      };
    }
    fulfillmentCents = tier.feeCents;
    fulfillmentLabel = `${tier.label} (${normalizeZip(zip)})`;
  } else {
    return { ok: false, error: "Choose a delivery method." };
  }

  return {
    ok: true,
    totals: {
      subtotalCents,
      fulfillmentCents,
      totalCents: subtotalCents + fulfillmentCents,
      fulfillmentLabel,
    },
  };
}
