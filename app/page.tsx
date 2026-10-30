import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Marquee } from "@/components/Sticker";
import { TrustBadges } from "@/components/TrustBadges";
import { ZipChecker } from "@/components/ZipChecker";
import { NEVER_INSIDE, products } from "@/data/products";
import { DELIVERY_TIERS, SHIPPING } from "@/config/fulfillment";
import { siteImage } from "@/config/site";
import { formatMoney } from "@/lib/format";

const HERO_INGREDIENTS = [
  { name: "Raw Shea Butter", text: "Unrefined, Grade A, rich in vitamins A & E." },
  { name: "Organic Coconut Oil", text: "Virgin and cold-pressed for a silky glide." },
  { name: "Pure Jojoba Oil", text: "Mirrors skin's own oils, no greasy film." },
  { name: "Natural Essential Oils", text: "Used sparingly, only in scented blends." },
];

export default function HomePage() {
  return (
    <>
      {/* Magazine-cover hero */}
      <section className="cover" aria-label="La Peau by Chloe">
        <div className="cover__photo cover__photo--desktop">
          <ProductImage src={siteImage("hero-desktop")} alt="La Peau by Chloe shea butter jars on travertine in warm window light" fill priority sizes="100vw" />
        </div>
        <div className="cover__photo cover__photo--mobile">
          <ProductImage src={siteImage("hero-mobile")} alt="La Peau by Chloe shea butter jars" fill priority sizes="100vw" />
        </div>

        <p className="cover__rail" aria-hidden>Small batch · Charlotte, North Carolina · Made for sensitive skin</p>

        <div className="container cover__inner">
          <div className="cover__issue">
            <span>N°01</span>
            <span className="cover__rule" aria-hidden />
            <span>The Shea Edit</span>
          </div>

          <h1 className="cover__title">
            <span className="cover__line">Nothing</span>
            <span className="cover__line cover__line--indent"><em>to hide,</em></span>
            <span className="cover__script">just shea.</span>
          </h1>

          <div className="cover__label">
            <span className="cover__label-head">The Original · Full ingredient list</span>
            <span className="cover__label-body">Butyrospermum parkii (shea) butter.</span>
            <span className="cover__label-foot">That&apos;s it. That&apos;s the jar.</span>
          </div>

          <div className="cover__actions">
            <Link href="/shop" className="cover__cta">
              Shop the five butters <span aria-hidden>→</span>
            </Link>
            <span className="cover__sign">xo, Chloe</span>
          </div>
        </div>

        <Image className="cover__seal" src="/images/logo.svg" alt="" width={150} height={150} priority unoptimized />
      </section>

      <Marquee items={["100% Natural", "Sensitive-Skin First", "Small-Batch Whipped", "No Synthetic Fragrance", "Charlotte, NC"]} />

      <TrustBadges />

      {/* Featured products */}
      <section className="section section--editorial">
        <div className="container">
          <div className="section-head section-head--left">
            <span className="eyebrow">The Collection</span>
            <h2>
              Five butters. <span className="script">Zero fillers.</span>
            </h2>
            <p>From our single-ingredient original to softly scented blends, each available in 4, 8, and 16 oz.</p>
          </div>
          <div className="product-grid product-grid--featured">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} priority={i < 2} />
            ))}
          </div>
          <div className="center mt-lg">
            <Link href="/shop" className="link-underline">View all products</Link>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="section section--cream section--tilted" id="ingredients">
        <div className="container split">
          <div className="split__media split__media--arch tilt-l">
            <ProductImage src={siteImage("ingredients-story")} alt="Raw shea nuts, shea butter, coconut and jojoba" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div>
            <span className="eyebrow">Clean Beauty, Honestly</span>
            <h2>If you can't read it, it's not in the jar.</h2>
            <p className="muted">Every ingredient is listed in plain English with its botanical name beside it. No synthetic fragrance, no preservatives you've never heard of, no fillers to stretch the jar.</p>
            <div className="ingredient-cards">
              {HERO_INGREDIENTS.map((i) => (
                <div key={i.name}>
                  <h4>{i.name}</h4>
                  <p>{i.text}</p>
                </div>
              ))}
            </div>
            <span className="option-label">Never inside</span>
            <div className="never">
              {NEVER_INSIDE.map((n) => <span key={n}>{n}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Local */}
      <section className="section" id="local">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Charlotte, NC</span>
            <h2>Shipped, picked up, or hand-delivered.</h2>
            <p>We're local to the Charlotte area. Skip the wait with free pickup or same-week delivery from Matthews (28104).</p>
          </div>
          <div className="local-cards">
            <div className="local-card tilt-l">
              <span className="eyebrow">Local Pickup</span>
              <div className="price">Free</div>
              <p>Pick up in the Matthews / Charlotte area. Address & times sent after you order.</p>
            </div>
            {DELIVERY_TIERS.map((t) => (
              <div className="local-card" key={t.id}>
                <span className="eyebrow">{t.label}</span>
                <div className="price">{formatMoney(t.feeCents)}</div>
                <p>{t.description}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ZipChecker />
            <p className="small muted" style={{ marginTop: 12 }}>
              Not local? Standard shipping is {formatMoney(SHIPPING.standardCents)}, free over {formatMoney(SHIPPING.freeOverCents)}.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section section--cream" id="about">
        <div className="container split split--reverse">
          <div>
            <span className="eyebrow">Our Story</span>
            <h2>
              Made by hand, <span className="script" style={{ fontSize: "1.2em" }}>by Chloe</span>
            </h2>
            <p className="muted">La Peau, French for "the skin," began with a simple frustration: every "gentle" lotion on the shelf came with a paragraph of ingredients that irritated sensitive skin.</p>
            <p className="muted">So we went back to the source. Raw, unrefined shea butter, a few pure plant oils, and nothing to hide. Each jar is whipped in small batches in Charlotte, North Carolina.</p>
            <Link href="/shop" className="btn mt-lg">Find your butter</Link>
          </div>
          <div className="split__media split__media--portrait split__media--arch tilt-r">
            <ProductImage src={siteImage("founder")} alt="Chloe whipping shea butter by hand" fill sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section--tight center">
        <div className="container">
          <Image src="/images/logo.svg" alt="La Peau by Chloe logo" width={120} height={120} style={{ margin: "0 auto 16px" }} unoptimized />
          <p className="script" style={{ fontSize: "2.2rem", margin: 0 }}>Simply, beautifully natural.</p>
        </div>
      </section>
    </>
  );
}
