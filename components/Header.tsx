"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { SHIPPING } from "@/config/fulfillment";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/#ingredients", label: "Ingredients" },
  { href: "/#local", label: "Local Delivery" },
  { href: "/#about", label: "Our Story" },
];

export function Header() {
  const { count, open, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announcement">
        Free shipping over {formatMoney(SHIPPING.freeOverCents)} · Local pickup &amp; delivery in Charlotte, NC
      </div>
      <header className="header">
        <div className="container header__inner">
          <div>
            <nav className="header__nav" aria-label="Main">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <button
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
              </svg>
              <span className="sr-only">Menu</span>
            </button>
          </div>

          <Link href="/" className="header__logo" aria-label="La Peau by Chloe home">
            <Image src="/images/logo.svg" alt="La Peau by Chloe" width={116} height={116} priority unoptimized />
          </Link>

          <div className="header__actions">
            <button className="cart-btn" onClick={open} aria-label={`Open bag, ${count} items`}>
              <span>Bag</span>
              <span className="cart-btn__count">{hydrated ? count : 0}</span>
            </button>
          </div>
        </div>
        <nav id="mobile-nav" className={`mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
