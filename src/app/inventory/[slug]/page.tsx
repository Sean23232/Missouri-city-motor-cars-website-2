import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VehicleGallery } from "@/components/VehicleGallery";
import { getVehicleBySlug, vehicleTitle } from "@/lib/inventory";
import { seedInitialInventory } from "@/lib/seed-inventory";

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

async function findVehicle(slug: string) {
  await seedInitialInventory();
  return getVehicleBySlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await findVehicle(slug);
  if (!vehicle) return { title: "Vehicle Not Found | Missouri City Motor Cars" };
  const title = vehicleTitle(vehicle);
  return {
    title: `${title} | Missouri City Motor Cars`,
    description: `View the available details, VIN, photos, and contact options for the ${title} at Missouri City Motor Cars.`,
  };
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = await findVehicle(slug);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const isTruck = /truck|pickup/i.test(`${vehicle.model} ${vehicle.body ?? ""} ${vehicle.configuration ?? ""}`);
  const subject = encodeURIComponent(`Question about the ${title}`);
  const body = encodeURIComponent(`Hello Missouri City Motor Cars,\n\nI'm interested in the ${title}.\nVIN: ${vehicle.vin}\n\nPlease contact me with more information.`);
  const detailRows = [
    vehicle.body ? ["Body", vehicle.body] : null,
    vehicle.configuration ? ["Configuration", vehicle.configuration] : null,
    vehicle.engine ? ["Engine", vehicle.engine] : null,
    vehicle.mileage != null ? ["Mileage", `${vehicle.mileage.toLocaleString("en-US")} miles`] : null,
    vehicle.price != null ? ["Price", currency(vehicle.price)] : null,
  ].filter((row): row is [string, string] => row !== null);

  return (
    <>
      <SiteHeader />
      <main className="vehicle-detail-page">
        <div className="site-container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/#inventory">Inventory</Link><span aria-hidden="true">/</span><span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="vehicle-detail-heading">
            <div>
              <span className="eyebrow"><i /> {vehicle.status === "sold" ? "SOLD LISTING" : "CURRENT INVENTORY"}</span>
              <h1>{vehicle.year} <span>{vehicle.make}</span> {vehicle.model}</h1>
              {vehicle.trim && <p className="detail-trim">{vehicle.trim}</p>}
              <p className="vehicle-detail-subtitle">{[vehicle.configuration, vehicle.body, vehicle.engine ? `${vehicle.engine} engine` : null].filter(Boolean).join(" · ") || "Vehicle details available by request"}</p>
            </div>
            <span className={`detail-status${vehicle.status === "sold" ? " detail-status-sold" : ""}`}><i />{vehicle.status === "sold" ? "Sold" : "Available"}</span>
          </div>

          <div className="vehicle-detail-layout">
            <div className="vehicle-detail-main">
              <VehicleGallery title={title} truck={isTruck} photos={vehicle.photos} />
              <section className="vehicle-overview-card">
                <div className="vehicle-overview-heading"><span className="detail-section-index">01</span><div><span className="eyebrow">AT A GLANCE</span><h2>Vehicle overview</h2></div></div>
                <dl className="vehicle-spec-list">
                  <div><dt>Year</dt><dd>{vehicle.year}</dd></div>
                  <div><dt>Make</dt><dd>{vehicle.make}</dd></div>
                  <div><dt>Model</dt><dd>{vehicle.model}</dd></div>
                  {vehicle.trim && <div><dt>Trim</dt><dd>{vehicle.trim}</dd></div>}
                  {detailRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  <div className="vehicle-vin-detail"><dt>VIN</dt><dd><code>{vehicle.vin}</code></dd></div>
                </dl>
                <p className="vehicle-detail-disclaimer">Only information provided for this listing is shown. Call the dealership to confirm availability and ask about any additional details.</p>
              </section>
            </div>

            <aside className="vehicle-detail-sidebar">
              <div className="vehicle-contact-card">
                <span className="eyebrow"><i /> {vehicle.status === "sold" ? "ASK ABOUT SIMILAR VEHICLES" : "INTERESTED IN THIS VEHICLE?"}</span>
                <h2>{vehicle.status === "sold" ? "Looking for something similar?" : "Let’s talk about it."}</h2>
                <p>Contact Missouri City Motor Cars today for more information.</p>
                {vehicle.price != null && <div className="detail-price">{currency(vehicle.price)}<small>Listed price</small></div>}
                <a className="button button-red detail-call-button" href="tel:+13467148349">Call 346-714-8349 <span aria-hidden="true">↗</span></a>
                <a className="button button-outline detail-email-button" href={`mailto:info@missouricitymotorcars.com?subject=${subject}&body=${body}`}>Send an Email <span aria-hidden="true">↗</span></a>
                <div className="detail-contact-divider"><span>OR SEND A MESSAGE</span></div>
                <ContactForm vehicleId={vehicle.id} vehicleName={title} compact />
              </div>
              <div className="detail-vin-card"><span>VEHICLE IDENTIFICATION NUMBER</span><code>{vehicle.vin}</code><small>Include this VIN when you contact us.</small></div>
              <Link href="/#inventory" className="back-to-inventory-link">← Back to all vehicles</Link>
            </aside>
          </div>

          <section className="detail-bottom-cta">
            <div><span className="eyebrow eyebrow-light"><i /> MISSOURI CITY MOTOR CARS</span><h2>Questions about this vehicle?</h2><p>Our team is one call away.</p></div>
            <a className="button button-white" href="tel:+13467148349">Call 346-714-8349 <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
