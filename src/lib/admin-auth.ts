import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "mcmc_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function constantTimeTextEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function verifyAdminPassword(candidate: string) {
  const password = getAdminPassword();
  return password.length > 0 && constantTimeTextEqual(candidate, password);
}

function sign(expiresAt: string, password: string) {
  return createHmac("sha256", password).update(expiresAt).digest("hex");
}

export function createAdminSessionToken() {
  const password = getAdminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD is not configured");
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expiresAt}.${sign(expiresAt, password)}`;
}

export function isAdminRequest(request: Request) {
  const password = getAdminPassword();
  if (!password) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  if (!cookie) return false;

  const token = cookie.slice(ADMIN_COOKIE.length + 1);
  const [expiresAt, signature, extra] = token.split(".");
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  return constantTimeTextEqual(signature, sign(expiresAt, password));
}

export function serializeAdminCookie(token: string, maxAge = SESSION_SECONDS) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
