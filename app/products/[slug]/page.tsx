import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { NEVER_INSIDE, fromPriceCents, getProduct, productImage, products } from "@/data/products";
import { siteConfig } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.tagline} Ingredients: ${product.ingredients.map((i) => i.name).join(", ")}.`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    image: `${siteConfig.url}${productImage(product.slug, "main")}`,
    offers: product.sizes.map((s) => ({
      "@type": "Offer",
      name: s.label,
      price: (s.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    })),
    lowPrice: (fromPriceCents(product) / 100).toFixed(2),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.shortName}</span>
        </nav>

        <div className="pdp">
          <ProductGallery product={product} />

          <div className="pdp__info">
            <span className="eyebrow">{product.collection}</span>
            <h1>{product.name}</h1>
            <p className="pdp__tagline">{product.tagline}</p>
            <div className="pdp__badges">
              {product.badges.map((b) => <span className="pill" key={b}>{b}</span>)}
            </div>
            <p className="muted">{product.description}</p>

            <BuyBox product={product} />

            <div className="accordion">
              <details open>
                <summary>Full ingredient list ({product.ingredients.length})</summary>
                <div className="accordion__body">
                  <table className="ingredient-table">
                    <tbody>
                      {product.ingredients.map((i) => (
                        <tr key={i.inci}>
                          <td>
                            <strong>{i.name}</strong>
                            <em>{i.inci}</em>
                          </td>
                          <td className="why">{i.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: 18 }}>
                    <span className="option-label">Never inside</span>
                    <div className="never">{NEVER_INSIDE.map((n) => <span key={n}>{n}</span>)}</div>
                  </div>
                </div>
              </details>
              <details>
                <summary>Sensitive-skin benefits</summary>
                <div className="accordion__body">
                  <ul className="benefit-list">
                    {product.benefits.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                  {product.skinNote && <p className="note">{product.skinNote}</p>}
                </div>
              </details>
              <details>
                <summary>Scent &amp; texture</summary>
                <div className="accordion__body">
                  <p><strong style={{ fontWeight: 500 }}>Scent:</strong> {product.scent}</p>
                  <p style={{ margin: 0 }}><strong style={{ fontWeight: 500 }}>Texture:</strong> {product.texture}</p>
                </div>
              </details>
              <details>
                <summary>How to use</summary>
                <div className="accordion__body">
                  <p>{product.howToUse}</p>
                  <p className="note">Always patch test a new product on your inner arm 24 hours before full use. Store below 75°F. natural shea may soften in heat and re-firm when cool; this doesn’t affect quality.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">You may also love</span>
            <h2>Complete your ritual</h2>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
