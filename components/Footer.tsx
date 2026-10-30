import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__logo">
            <Image src="/images/logo.svg" alt="La Peau by Chloe" width={192} height={192} unoptimized />
            <p className="muted" style={{ maxWidth: 300 }}>
              Small-batch, 100% natural shea butter made for sensitive skin in {siteConfig.location}.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`}>{p.shortName}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link href="/#local">Local pickup &amp; delivery</Link></li>
              <li><Link href="/checkout">Checkout</Link></li>
              <li><a href={`mailto:${siteConfig.email}`}>Contact us</a></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li><a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <span>
            For external use only. Patch test new products. These statements have not been evaluated by the FDA.
          </span>
        </div>
      </div>
    </footer>
  );
}
