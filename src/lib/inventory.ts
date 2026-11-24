import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { vehicleImages, vehicles } from "@/db/schema";
export { vehicleTitle } from "@/lib/vehicle-title";

export async function getInventory(includeSold = false) {
  const rows = includeSold
    ? await db.select().from(vehicles).orderBy(desc(vehicles.year), asc(vehicles.make), asc(vehicles.model))
    : await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.status, "available"))
        .orderBy(desc(vehicles.year), asc(vehicles.make), asc(vehicles.model));

  if (rows.length === 0) return [];

  const photos = await db
    .select({
      id: vehicleImages.id,
      vehicleId: vehicleImages.vehicleId,
      fileName: vehicleImages.fileName,
      mimeType: vehicleImages.mimeType,
      sortOrder: vehicleImages.sortOrder,
    })
    .from(vehicleImages)
    .where(inArray(vehicleImages.vehicleId, rows.map((vehicle) => vehicle.id)))
    .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id));

  return rows.map((vehicle) => ({
    ...vehicle,
    photos: photos.filter((photo) => photo.vehicleId === vehicle.id),
  }));
}

export async function getVehicleBySlug(slug: string) {
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.slug, slug)).limit(1);
  if (!vehicle) return null;

  const photos = await db
    .select({
      id: vehicleImages.id,
      vehicleId: vehicleImages.vehicleId,
      fileName: vehicleImages.fileName,
      mimeType: vehicleImages.mimeType,
      sortOrder: vehicleImages.sortOrder,
    })
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicle.id))
    .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id));

  return { ...vehicle, photos };
}

