# La Peau by Chloe

A clean, minimalist, conversion-focused storefront for **La Peau by Chloe**: 100% natural, sensitive-skin-friendly shea butter, hand-whipped in Charlotte, NC.

Built with **Next.js (App Router) + TypeScript + Stripe**. No database required to launch: the product catalog lives in code, card orders live in Stripe, and Cash App / Zelle orders are posted to a webhook of your choice.

---

## Features

- **Homepage**: hero with clean-ingredient message, trust badges, featured grid of all 5 products, ingredient story, local delivery ZIP checker, founder story.
- **Shop**: 4:5 product grid with texture photo on hover, filter chips (All / Unscented / Women’s / Men’s).
- **Product pages**: large gallery (5 angles), 4 / 8 / 16 oz size toggles with live price & price-per-ounce, quantity, full transparent ingredient table (plain name + INCI + why it’s there), “never inside” list, sensitive-skin benefits, how to use, related products, Product JSON-LD for Google.
- **Slide-out cart drawer**: quantity edits, free-shipping progress bar, persists in `localStorage`.
- **Checkout**
  - Card, Apple Pay & Google Pay via embedded **Stripe Payment Element**
  - **Cash App** and **Zelle** with on-screen payment instructions + order number memo
  - **Standard shipping** ($6.95, free over $75)
  - **Local pickup** (free, Matthews / Charlotte)
  - **Local delivery** by ZIP from 28104, **$5** nearby tier, **$10** extended tier
  - All prices & fees re-calculated server-side (client prices are never trusted)
- Stripe webhook for paid-order notifications, mobile-first responsive design, accessible markup.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Hand-written CSS with design tokens (`app/globals.css`), no CSS framework |
| Fonts | Cormorant Garamond (headings), Jost (body), Pinyon Script (accents) via `next/font` |
| Payments | Stripe Payment Intents + Payment Element; manual Cash App / Zelle |
| Hosting | Any Node host, Vercel recommended |

## Project structure

```
la-peau-by-chloe/
├── app/
│   ├── layout.tsx                 # Fonts, header, footer, cart drawer
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Design tokens + all styles
│   ├── shop/page.tsx              # All products
│   ├── products/[slug]/page.tsx   # Product detail page
│   ├── checkout/page.tsx          # Checkout (fulfillment + payments)
│   ├── order/confirmation/page.tsx
│   ├── api/checkout/route.ts      # Prices order, creates PaymentIntent / manual order
│   ├── api/webhooks/stripe/route.ts
│   └── icon.png, apple-icon.png   # Favicons (generated from logo)
├── components/                    # Header, Footer, CartDrawer, ProductCard, BuyBox, …
├── config/
│   ├── site.ts                    # Brand info, Cash App / Zelle handles
│   └── fulfillment.ts             # Shipping rates, pickup copy, delivery ZIP tiers
├── data/products.ts               # ← The 5 products: sizes, prices, ingredients, copy
├── lib/                           # Cart context, order math, Stripe client, helpers
├── public/images/
│   ├── logo.png                   # Master logo
│   ├── logo-mark.png              # Optimized logo
│   ├── products/<slug>/*.svg      # Placeholders → replace with your photos
│   └── site/*.svg                 # Hero, ingredients, founder placeholders
├── docs/IMAGE_GUIDE.md            # Exact photo shot list & dimensions
├── scripts/                       # Placeholder + logo asset generators
└── .env.example
```

## Getting started

**Requirements:** Node.js 20.9+ (22 recommended) and npm.

```bash
git clone https://github.com/<your-username>/la-peau-by-chloe.git
cd la-peau-by-chloe
npm install
cp .env.example .env.local     # then fill in your keys
npm run dev                    # http://localhost:3000
```

The site runs without Stripe keys, the card option is simply disabled and Cash App / Zelle still work.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript check |
| `npm run placeholders` | Regenerate SVG image placeholders |
| `npm run optimize:logo` | Regenerate logo-mark, favicons, and OG image from `public/images/logo.png` |

## Configuration

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://lapeaubychloe.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_…`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_…`), server only |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) |
| `NEXT_PUBLIC_CASHAPP_CASHTAG` | e.g. `$LaPeauByChloe` |
| `NEXT_PUBLIC_ZELLE_RECIPIENT` / `NEXT_PUBLIC_ZELLE_NAME` | Zelle email/phone and display name |
| `ORDER_WEBHOOK_URL` | Optional, every order is POSTed here as JSON |
| `NEXT_PUBLIC_IMAGE_EXT` | `svg` (placeholders) or `jpg` (your photos) |

### Products & pricing: `data/products.ts`

Edit names, descriptions, ingredients, and prices (in **cents**). Launch prices:

| Product | 4 oz | 8 oz | 16 oz |
|---|---|---|---|
| The Original Raw Shea Butter | $12 | $20 | $34 |
| The Unscented Whipped Shea Butter | $16 | $26 | $42 |
| Vanilla & Coconut | $18 | $28 | $46 |
| Floral Jasmine | $18 | $28 | $46 |
| Cedarwood & Amber | $18 | $28 | $46 |

### Shipping, pickup & delivery: `config/fulfillment.ts`

- `SHIPPING.standardCents` / `freeOverCents`
- `PICKUP` copy (the exact pickup address is intentionally emailed, not published)
- `DELIVERY_TIERS`: add or move ZIP codes between the `$5` and `$10` tiers. ZIPs not listed can’t select local delivery.

## Stripe setup

1. Create a Stripe account → **Developers → API keys**; copy test keys into `.env.local`.
2. In **Settings → Payment methods**, enable Cards, Apple Pay, Google Pay (and Cash App Pay via Stripe if you like).
3. Webhook (local):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
4. Webhook (production): **Developers → Webhooks → Add endpoint** → `https://<your-domain>/api/webhooks/stripe`, events `payment_intent.succeeded` and `payment_intent.payment_failed`.
5. Test with card `4242 4242 4242 4242`, any future date, any CVC.

Order details (items, size, fulfillment, phone, address) are stored on each PaymentIntent’s metadata and shipping fields, visible in the Stripe Dashboard.

## Cash App & Zelle orders

Customers see your handle, the exact amount, and their order number to use as the payment memo. The order is POSTed to `ORDER_WEBHOOK_URL` with `status: "awaiting_manual_payment"`. Easy options:

- **Zapier / Make** “Catch Hook” → email yourself + add a row to Google Sheets
- **Slack** incoming webhook
- Replace `lib/orders.ts › notifyNewOrder` with an email provider (Resend, Postmark) or a database

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables above (use **live** Stripe keys in Production).
4. Add your domain, then set `NEXT_PUBLIC_SITE_URL` and the production Stripe webhook.

## Images

See **[docs/IMAGE_GUIDE.md](docs/IMAGE_GUIDE.md)** for the full shot list (30 images: 25 product + 5 site), exact dimensions, and angles.

## Before launch checklist

- [ ] Replace placeholder photos and set `NEXT_PUBLIC_IMAGE_EXT=jpg`
- [ ] Confirm prices, ingredient lists, and the delivery ZIP tiers
- [ ] Verify marketing claims (e.g. “cruelty-free”) and add any required labeling/allergen notes
- [ ] Set real Cash App / Zelle handles and contact email/Instagram in `config/site.ts`
- [ ] Decide on NC sales tax collection (Stripe Tax can be added to the PaymentIntent)
- [ ] Add Privacy, Terms, and Shipping & Returns pages
- [ ] Switch Stripe to live keys and register the production webhook
