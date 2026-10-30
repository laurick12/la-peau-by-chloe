"use client";

import { useState } from "react";
import { getDeliveryTier, normalizeZip } from "@/lib/order";
import { formatMoney } from "@/lib/format";

export function ZipChecker() {
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState(false);
  const z = normalizeZip(zip);
  const tier = getDeliveryTier(z);

  return (
    <div>
      <form
        className="zip-check"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <label htmlFor="zip-check" className="sr-only">ZIP code</label>
        <input
          id="zip-check"
          className="input"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Enter your ZIP code"
          value={zip}
          maxLength={5}
          onChange={(e) => {
            setZip(e.target.value);
            setChecked(false);
          }}
        />
        <button className="btn" type="submit" disabled={z.length !== 5}>Check</button>
      </form>
      {checked && (
        <p className={`zip-result ${tier ? "ok" : "error"}`} role="status">
          {tier
            ? `Great news, we deliver to ${z}! ${tier.label}: ${formatMoney(tier.feeCents)}.`
            : `We don’t deliver to ${z} yet. Choose free local pickup or standard shipping at checkout.`}
        </p>
      )}
    </div>
  );
}
