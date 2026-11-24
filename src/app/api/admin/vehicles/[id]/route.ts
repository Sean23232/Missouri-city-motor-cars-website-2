import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicleImages, vehicles } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { parseVehicleFields, parseVehicleImages } from "@/lib/vehicle-form";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function vehicleIdFrom(context: RouteContext) {
  const { id } = await context.params;
  const vehicleId = Number(id);
  return Number.isSafeInteger(vehicleId) && vehicleId > 0 ? vehicleId : null;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to manage inventory." }, { status: 401 });
  }
  const vehicleId = await vehicleIdFrom(context);
  if (!vehicleId) return Response.json({ error: "Vehicle not found." }, { status: 404 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "The listing form could not be read." }, { status: 400 });
  }

  try {
    const values = parseVehicleFields(form);
    const uploads = await parseVehicleImages(form);
    const updated = await db.transaction(async (tx) => {
      const [vehicle] = await tx
        .update(vehicles)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(vehicles.id, vehicleId))
        .returning({ id: vehicles.id });
      if (!vehicle) return false;

      if (uploads.length > 0) {
        const currentPhotos = await tx
          .select({ id: vehicleImages.id })
          .from(vehicleImages)
          .where(eq(vehicleImages.vehicleId, vehicleId));
        await tx.insert(vehicleImages).values(
          uploads.map((image, index) => ({
            ...image,
            vehicleId,
            sortOrder: currentPhotos.length + index,
          })),
        );
      }
      return true;
    });

    if (!updated) return Response.json({ error: "Vehicle not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "23505") {
      return Response.json({ error: "A listing already uses that VIN. Check the number and try again." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "The vehicle could not be saved.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to manage inventory." }, { status: 401 });
  }
  const vehicleId = await vehicleIdFrom(context);
  if (!vehicleId) return Response.json({ error: "Vehicle not found." }, { status: 404 });

  let status: string;
  try {
    const body = (await request.json()) as { status?: unknown };
    status = typeof body.status === "string" ? body.status : "";
  } catch {
    return Response.json({ error: "Choose an availability status." }, { status: 400 });
  }
  if (status !== "available" && status !== "sold") {
    return Response.json({ error: "Choose available or sold." }, { status: 400 });
  }

  const [updated] = await db
    .update(vehicles)
    .set({ status, updatedAt: new Date() })
    .where(eq(vehicles.id, vehicleId))
    .returning({ id: vehicles.id });
  if (!updated) return Response.json({ error: "Vehicle not found." }, { status: 404 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to manage inventory." }, { status: 401 });
  }
  const vehicleId = await vehicleIdFrom(context);
  if (!vehicleId) return Response.json({ error: "Vehicle not found." }, { status: 404 });

  const [removed] = await db.delete(vehicles).where(eq(vehicles.id, vehicleId)).returning({ id: vehicles.id });
  if (!removed) return Response.json({ error: "Vehicle not found." }, { status: 404 });
  return Response.json({ ok: true });
}
