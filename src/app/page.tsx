import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { InventoryBrowser } from "@/components/InventoryBrowser";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getInventory } from "@/lib/inventory";
import { seedInitialInventory } from "@/lib/seed-inventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await seedInitialInventory();
  const vehicles = await getInventory();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-image-wrap">
            <Image
              src="/images/dealership-hero.jpg"
              alt="A polished car in a modern, understated showroom"
              fill
              priority
              sizes="100vw"
              className="hero-image"
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-red-detail" aria-hidden="true" />
          <div className="site-container hero-content">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-light"><i /> QUALITY PRE-OWNED VEHICLES</span>
              <h1>Find Your Next Vehicle at <span>Missouri City Motor Cars</span></h1>
              <p>Explore our selection of quality pre-owned cars, trucks, and SUVs. Browse our available inventory and find the right vehicle for your needs.</p>
              <div className="hero-actions">
                <a className="button button-red button-large" href="#inventory">Browse Our Inventory <span aria-hidden="true">↘</span></a>
                <a className="hero-call-link" href="tel:+13467148349"><span className="hero-call-icon" aria-hidden="true">↗</span><span><small>Speak with our team</small><strong>Call Us Today</strong></span></a>
              </div>
              <div className="hero-trust-points">
                <span><i aria-hidden="true">✓</i> Browse at your pace</span>
                <span><i aria-hidden="true">✓</i> Clear vehicle details</span>
                <span><i aria-hidden="true">✓</i> Direct dealership contact</span>
              </div>
            </div>
          </div>
          <a className="hero-scroll-cue" href="#inventory"><span /> Explore inventory</a>
        </section>

        <section className="quick-links-bar" aria-label="Ways to connect">
          <div className="site-container quick-links-inner">
            <div className="quick-link-item"><span className="quick-link-number">01</span><div><strong>Browse available vehicles</strong><small>Find a car, truck, or SUV</small></div></div>
            <div className="quick-link-divider" aria-hidden="true" />
            <div className="quick-link-item"><span className="quick-link-number">02</span><div><strong>Get the details</strong><small>VIN and known specs included</small></div></div>
            <div className="quick-link-divider" aria-hidden="true" />
            <div className="quick-link-item"><span className="quick-link-number">03</span><div><strong>Talk with our team</strong><small>Call or send a message</small></div></div>
          </div>
        </section>

        <section className="inventory-section section-space" id="inventory">
          <div className="site-container">
            <div className="section-heading-row">
              <div className="section-heading-copy">
                <span className="eyebrow"><i /> CURRENT SELECTION</span>
                <h2>Find your next <span>favorite.</span></h2>
                <p>Take a closer look at the vehicles currently featured at Missouri City Motor Cars.</p>
              </div>
              <div className="inventory-count-block"><strong>{String(vehicles.length).padStart(2, "0")}</strong><span>VEHICLES<br />TO EXPLORE</span></div>
            </div>
            <div className="inventory-note" role="note">
              <span className="inventory-note-icon" aria-hidden="true">i</span>
              <p>Vehicle photos have not been supplied for this initial inventory. Each listing is clearly marked, and real photos can be added in the owner inventory portal. Price and mileage appear only when provided.</p>
              <Link href="/admin" className="inventory-note-link">Owner portal <span aria-hidden="true">↗</span></Link>
            </div>
            <InventoryBrowser vehicles={vehicles} />
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-side-mark" aria-hidden="true">MCMC<span>·</span></div>
          <div className="site-container about-inner">
            <div className="about-number"><span>01</span><i /></div>
            <div className="about-copy">
              <span className="eyebrow eyebrow-light"><i /> A SIMPLE WAY TO START</span>
              <h2>Good choices start with <span>good information.</span></h2>
              <p>Shopping for a pre-owned vehicle should feel straightforward. Explore the current selection, review the details available for each vehicle, and reach out directly when something catches your eye.</p>
              <p>Whether you have a question about a specific VIN or want to talk through what you’re looking for, Missouri City Motor Cars is ready to hear from you.</p>
              <div className="about-actions">
                <a href="#inventory" className="about-text-link">Explore the inventory <span aria-hidden="true">→</span></a>
                <a href="tel:+13467148349" className="about-phone-link">346-714-8349</a>
              </div>
            </div>
            <div className="about-side-card">
              <span className="about-card-rule" />
              <span className="about-card-label">A DIRECT LINE</span>
              <p>Questions about a vehicle? Call us or send a message with its VIN.</p>
              <a href="tel:+13467148349">346-714-8349 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="contact-section section-space" id="contact">
          <div className="site-container">
            <div className="contact-section-heading">
              <div>
                <span className="eyebrow"><i /> LET’S TALK</span>
                <h2>We’re here when <span>you’re ready.</span></h2>
                <p>Ask a question about a vehicle or send us a note. We’ll be glad to hear from you.</p>
              </div>
              <div className="contact-hours-note"><span aria-hidden="true">↗</span><p>Prefer to talk?<br /><strong>Give us a call.</strong></p></div>
            </div>
            <div className="contact-panel">
              <div className="contact-details-panel">
                <span className="contact-kicker">MISSOURI CITY MOTOR CARS</span>
                <h3>Let’s find the right next step.</h3>
                <p>Reach out directly by phone or email, or leave a message using the form.</p>
                <div className="contact-direct-list">
                  <a href="tel:+13467148349" className="contact-direct-item"><span className="contact-direct-icon" aria-hidden="true">↗</span><span><small>CALL OUR TEAM</small><strong>346-714-8349</strong></span></a>
                  <a href="mailto:info@missouricitymotorcars.com" className="contact-direct-item"><span className="contact-direct-icon contact-email-icon" aria-hidden="true">@</span><span><small>EMAIL US</small><strong>info@missouricitymotorcars.com</strong></span></a>
                </div>
                <div className="contact-red-rule" />
                <p className="contact-detail-footnote">For the quickest help with a vehicle, include its year, make, model, or VIN.</p>
              </div>
              <div className="contact-form-panel">
                <span className="contact-form-heading">SEND A MESSAGE</span>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section className="closing-cta">
          <div className="site-container closing-cta-inner">
            <div><span className="eyebrow eyebrow-light"><i /> YOUR NEXT VEHICLE STARTS HERE</span><h2>See something you like?</h2><p>Let’s talk about it.</p></div>
            <div className="closing-cta-actions"><a className="button button-white" href="/#inventory">View inventory <span aria-hidden="true">↗</span></a><a className="closing-phone-link" href="tel:+13467148349">or call <strong>346-714-8349</strong></a></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
