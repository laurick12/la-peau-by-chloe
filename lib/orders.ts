import "server-only";

/**
 * Sends a new-order notification to ORDER_WEBHOOK_URL (Zapier, Make, Slack, Google Apps Script…).
 * Card orders are also always visible in the Stripe Dashboard.
 * Swap this for an email provider (Resend, Postmark) or a database insert when you're ready.
 */
export async function notifyNewOrder(order: Record<string, unknown>) {
  console.info("[order]", JSON.stringify(order));
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  } catch (err) {
    console.error("[order] webhook notification failed", err);
  }
}

export function newOrderId() {
  const time = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `LPC-${time}${rand}`;
}
