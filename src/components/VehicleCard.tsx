import Image from "next/image";
import Link from "next/link";
import { vehicleTitle } from "@/lib/vehicle-title";
import { VehiclePhotoPlaceholder } from "@/components/VehiclePhotoPlaceholder";
import type { getInventory } from "@/lib/inventory";

type VehicleListing = Awaited<ReturnType<typeof getInventory>>[number];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function VehicleCard({ vehicle }: { vehicle: VehicleListing }) {
  const title = vehicleTitle(vehicle);
  const isTruck = /truck|pickup/i.test(`${vehicle.model} ${vehicle.body ?? ""} ${vehicle.configuration ?? ""}`);
  const mailSubject = encodeURIComponent(`I'm interested in the ${title}`);
  const mailBody = encodeURIComponent(`Hello Missouri City Motor Cars,\n\nI'm interested in the ${title}.\nVIN: ${vehicle.vin}\n\nPlease contact me with more information.`);

  return (
    <article className="vehicle-card">
      <div className="vehicle-card-media">
        {vehicle.photos.length > 0 ? (
          <Image
            src={`/api/vehicle-images/${vehicle.photos[0].id}`}
            alt={`${title} vehicle photograph`}
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="vehicle-card-photo"
          />
        ) : (
          <VehiclePhotoPlaceholder title={title} truck={isTruck} />
        )}
        <span className="vehicle-status-badge"><span aria-hidden="true" />Available</span>
        {vehicle.photos.length > 1 && <span className="photo-count-badge">{vehicle.photos.length} photos</span>}
      </div>

      <div className="vehicle-card-content">
        <div className="vehicle-card-heading">
          <span className="vehicle-year-label">{vehicle.year} · {vehicle.make}</span>
          <h3>{vehicle.model}</h3>
          {vehicle.trim && <p className="vehicle-trim">{vehicle.trim}</p>}
        </div>

        <div className="vehicle-card-specs">
          {vehicle.body && <span>{vehicle.body}</span>}
          {vehicle.configuration && <span>{vehicle.configuration}</span>}
          {vehicle.engine && <span>{vehicle.engine} engine</span>}
          {vehicle.price != null && <span>{formatCurrency(vehicle.price)}</span>}
          {vehicle.mileage != null && <span>{vehicle.mileage.toLocaleString("en-US")} miles</span>}
        </div>

        <p className="vehicle-vin"><span>VIN</span><code>{vehicle.vin}</code></p>

        <div className="vehicle-card-actions">
          <Link href={`/inventory/${vehicle.slug}`} className="button button-red button-card">
            View details <span aria-hidden="true">↗</span>
          </Link>
          <a
            className="button button-outline button-card"
            href={`mailto:info@missouricitymotorcars.com?subject=${mailSubject}&body=${mailBody}`}
          >
            Inquire now
          </a>
        </div>
      </div>
    </article>
  );
}
