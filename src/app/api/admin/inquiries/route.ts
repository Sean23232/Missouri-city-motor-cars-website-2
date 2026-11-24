import { desc } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Please sign in to view messages." }, { status: 401 });
  }

  const messages = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(30);
  return Response.json({ messages });
}
