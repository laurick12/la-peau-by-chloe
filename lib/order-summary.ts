import type { PricedLine, Totals } from "@/lib/order";

export type ManualInstructions = {
  method: "Cash App" | "Zelle";
  sendTo: string;
  recipientName?: string;
  memo: string;
  windowHours: number;
};

export type OrderSummary = {
  orderId: string;
  paymentMethod: "card" | "cashapp" | "zelle";
  customerName: string;
  email: string;
  fulfillmentMethod: "shipping" | "pickup" | "delivery";
  lines: PricedLine[];
  totals: Totals;
  instructions?: ManualInstructions;
};

const KEY = "lpc-last-order";

export function saveOrderSummary(summary: OrderSummary) {
  sessionStorage.setItem(KEY, JSON.stringify(summary));
}

export function loadOrderSummary(): OrderSummary | null {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}
