import { db } from "@/db";
import { vehicleImages, vehicles } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { getInventory } from "@/lib/inventory";
import { seedInitialInventory } from "@/lib/seed-inventory";
import { makeVehicleSlug, parseVehicleFields, parseVehicleImages } from "@/lib/vehicle-form";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to manage inventory." }, { status: 401 });
  }

  await seedInitialInventory();
  const inventory = await getInventory(true);
  return Response.json({ vehicles: inventory });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to manage inventory." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "The listing form could not be read." }, { status: 400 });
  }

  try {
    const values = parseVehicleFields(form);
    const uploads = await parseVehicleImages(form);
    const [created] = await db.transaction(async (tx) => {
      const [vehicle] = await tx
        .insert(vehicles)
        .values({ ...values, slug: makeVehicleSlug(values) })
        .returning();

      if (uploads.length > 0) {
        await tx.insert(vehicleImages).values(
          uploads.map((image, index) => ({
            ...image,
            vehicleId: vehicle.id,
            sortOrder: index,
          })),
        );
      }
      return [vehicle];
    });

    return Response.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "23505") {
      return Response.json({ error: "A listing already uses that VIN. Check the number and try again." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "The vehicle could not be saved.";
    return Response.json({ error: message }, { status: 400 });
  }
}
