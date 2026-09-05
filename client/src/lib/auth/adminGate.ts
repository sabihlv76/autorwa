import { cookies } from "next/headers";

const ADMIN_GATE_COOKIE = "admin_gate";
const ADMIN_GATE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/** Read-only check, safe to call from Server Components. */
export async function hasAdminGateCookie(): Promise<boolean> {
  const secret = process.env.ADMIN_GATE_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_GATE_COOKIE)?.value === secret;
}

/** For the /portal/[token] Route Handler only, once the secret has matched. */
export async function setAdminGateCookie(): Promise<void> {
  const secret = process.env.ADMIN_GATE_SECRET;
  if (!secret) return;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_GATE_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_GATE_MAX_AGE,
    path: "/",
  });
}
