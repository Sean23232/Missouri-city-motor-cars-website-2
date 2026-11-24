import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-accent-line" />
      <div className="site-container footer-grid">
        <div className="footer-brand-column">
          <BrandMark inverse />
          <p>Explore quality pre-owned cars, trucks, and SUVs. When a vehicle feels right, our team is just a call or message away.</p>
        </div>
        <div className="footer-links-column">
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/#inventory">Inventory</Link>
          <Link href="/#about">About us</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <div className="footer-contact-column">
          <h2>Get in touch</h2>
          <a href="tel:+13467148349">346-714-8349</a>
          <a href="mailto:info@missouricitymotorcars.com">info@missouricitymotorcars.com</a>
          <p>Questions about a particular vehicle? Include its name or VIN in your message.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} Missouri City Motor Cars. All rights reserved.</span>
        <Link href="/admin" className="owner-login-link">Owner inventory login</Link>
      </div>
    </footer>
  );
}
