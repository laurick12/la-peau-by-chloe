/**
 * Fulfillment configuration: edit rates, pickup copy, and delivery ZIP tiers here.
 * All money values are in cents.
 */

export const ORIGIN_ZIP = "28104";

export const SHIPPING = {
  standardCents: 695,
  freeOverCents: 7500,
  estimate: "Ships in 1–2 business days · USPS Ground Advantage (2–5 days)",
} as const;

export const PICKUP = {
  area: "Matthews / Charlotte, NC (28104)",
  details:
    "The pickup address and available time windows are emailed once your order is confirmed.",
  readyIn: "Usually ready within 1–2 business days",
} as const;

export type DeliveryTier = {
  id: "near" | "extended";
  label: string;
  feeCents: number;
  description: string;
  zips: readonly string[];
};

/**
 * Local delivery radiates out from ORIGIN_ZIP (28104).
 * "near"     ≈ within ~10 miles  → $5
 * "extended" ≈ ~10–25 miles      → $10
 * Any ZIP not listed is not eligible for local delivery (shipping or pickup still available).
 */
export const DELIVERY_TIERS: readonly DeliveryTier[] = [
  {
    id: "near",
    label: "Nearby delivery",
    feeCents: 500,
    description: "Matthews, Stallings, Indian Trail, Mint Hill, Weddington & close by",
    zips: ["28104", "28105", "28106", "28079", "28227", "28270", "28226", "28173"],
  },
  {
    id: "extended",
    label: "Extended delivery",
    feeCents: 1000,
    description: "Greater Charlotte, Monroe, Ballantyne, Concord & Fort Mill",
    zips: [
      // Charlotte
      "28202", "28203", "28204", "28205", "28206", "28207", "28208", "28209", "28210",
      "28211", "28212", "28213", "28215", "28217", "28262", "28269", "28273", "28277",
      // Monroe / Union County
      "28110", "28112",
      // Cabarrus County
      "28025", "28027", "28075", "28107",
      // Pineville
      "28134",
      // South Carolina border
      "29707", "29708", "29715",
    ],
  },
] as const;

export const DELIVERY_SCHEDULE = "Delivered within 1–3 business days. We’ll text you a delivery window.";
