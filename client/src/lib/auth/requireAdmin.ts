import { notFound } from "next/navigation";
import { auth } from "./auth";
import { hasAdminGateCookie } from "./adminGate";
import type { Session } from "next-auth";

/**
 * For Server Components/pages. A non-admin (or signed-out visitor), or an
 * admin session missing the secret-URL gate cookie, gets a plain 404 — not
 * a redirect to sign-in, which would reveal that a protected admin area
 * exists at this URL.
 */
export async function requireAdminPage(): Promise<Session> {
  const session = await auth();
  const gated = await hasAdminGateCookie();
  if (!session || session.user.role !== "admin" || !gated) {
    notFound();
  }
  return session;
}

/**
 * For Server Actions. A Server Action is its own callable endpoint — the
 * page-level guard above does NOT protect it, so every admin action must
 * independently re-check. Returns null instead of throwing so callers can
 * shape their own error response.
 */
export async function requireAdminAction(): Promise<Session | null> {
  const session = await auth();
  const gated = await hasAdminGateCookie();
  if (!session || session.user.role !== "admin" || !gated) {
    return null;
  }
  return session;
}

/**
 * For the admin sign-in page only: checks just the gate cookie, not a full
 * admin session — establishing that session is the whole point of the page
 * this guards.
 */
export async function requireAdminGate(): Promise<void> {
  const gated = await hasAdminGateCookie();
  if (!gated) {
    notFound();
  }
}
