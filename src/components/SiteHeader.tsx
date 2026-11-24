"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/#inventory" },
  { label: "About us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="header-ribbon">
        <div className="site-container header-ribbon-inner">
          <span>MISSOURI CITY MOTOR CARS</span>
          <a href="tel:+13467148349"><span aria-hidden="true">Call our team</span> <strong>346-714-8349</strong></a>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container site-header-inner">
          <BrandMark />
          <nav className="desktop-navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href}>{item.label}</Link>
            ))}
          </nav>
          <a className="button button-red header-call" href="tel:+13467148349">
            <span className="phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.2 3.6h2.1c.5 0 .9.3 1.1.8l.8 2.9a1.2 1.2 0 0 1-.4 1.3l-1.5 1.2a14 14 0 0 0 6.1 6.1l1.2-1.5a1.2 1.2 0 0 1 1.3-.4l2.9.8c.5.1.8.6.8 1.1V18c0 .8-.6 1.4-1.4 1.4C10.6 19.4 4.6 13.4 4.6 6.9c0-.8.7-1.5 1.5-1.5Z" /></svg></span>
            <span><small>Talk to our team</small><strong>Call Now</strong></span>
          </a>
          <button
            className={`mobile-menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
        </div>
        <nav id="mobile-navigation" className={`mobile-navigation${menuOpen ? " mobile-navigation-open" : ""}`} aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<span aria-hidden="true">↗</span></Link>
          ))}
          <a className="mobile-phone-link" href="tel:+13467148349">Call 346-714-8349</a>
        </nav>
      </header>
    </>
  );
}
