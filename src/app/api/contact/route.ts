import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, vehicles } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
    vehicleId?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Please complete the form and try again." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 5 || message.length > 4000) {
    return Response.json({ error: "Your message should be between 5 and 4,000 characters." }, { status: 400 });
  }
  if (phone.length > 60) {
    return Response.json({ error: "Please check the phone number field." }, { status: 400 });
  }

  let vehicleId: number | null = null;
  let vehicleSummary: string | null = null;
  if (body.vehicleId !== undefined && body.vehicleId !== null && body.vehicleId !== "") {
    const parsedId = Number(body.vehicleId);
    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
      return Response.json({ error: "The selected vehicle could not be found." }, { status: 400 });
    }
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, parsedId)).limit(1);
    if (!vehicle) {
      return Response.json({ error: "The selected vehicle could not be found." }, { status: 400 });
    }
    vehicleId = vehicle.id;
    vehicleSummary = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} · VIN ${vehicle.vin}`;
  }

  await db.insert(inquiries).values({
    name,
    email,
    phone: phone || null,
    message,
    vehicleId,
    vehicleSummary,
  });

  return Response.json({ ok: true, message: "Your message has been received by the dealership." });
}
