import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicleImages } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const imageId = Number(id);
  if (!Number.isSafeInteger(imageId) || imageId <= 0) {
    return new Response("Image not found", { status: 404 });
  }

  const [image] = await db
    .select({ data: vehicleImages.data, mimeType: vehicleImages.mimeType })
    .from(vehicleImages)
    .where(eq(vehicleImages.id, imageId))
    .limit(1);

  if (!image) return new Response("Image not found", { status: 404 });

  const body = new Uint8Array(Buffer.from(image.data, "base64"));
  return new Response(body, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
