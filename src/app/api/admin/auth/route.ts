import {
  createAdminSessionToken,
  getAdminPassword,
  isAdminRequest,
  serializeAdminCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return Response.json({
    configured: Boolean(getAdminPassword()),
    authenticated: isAdminRequest(request),
  });
}

export async function POST(request: Request) {
  if (!getAdminPassword()) {
    return Response.json(
      { error: "Owner access is not configured. Set ADMIN_PASSWORD before signing in." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Enter your admin password." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return Response.json({ error: "That password was not recognized." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  return Response.json(
    { authenticated: true },
    { headers: { "Set-Cookie": serializeAdminCookie(token) } },
  );
}

export async function DELETE() {
  return Response.json(
    { authenticated: false },
    { headers: { "Set-Cookie": serializeAdminCookie("", 0) } },
  );
}
