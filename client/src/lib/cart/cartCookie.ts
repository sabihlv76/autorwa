import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/auth";

const CART_COOKIE = "autorwa_cart_token";
const CART_COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

export type CartOwnerKey = { userId: string } | { anonymousToken: string };

/**
 * Read-only lookup, safe to call from Server Components (which can't set
 * cookies). Returns null if the visitor is a guest with no cart cookie yet
 * — meaning they simply have no cart, nothing to create.
 */
export async function readCartOwnerKey(): Promise<CartOwnerKey | null> {
  const session = await auth();
  if (session?.user?.id) return { userId: session.user.id };

  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  return token ? { anonymousToken: token } : null;
}

/**
 * Same as readCartOwnerKey, but for use inside Server Actions/Route
 * Handlers: creates and sets a new guest cart cookie if none exists yet.
 */
export async function getOrCreateCartOwnerKey(): Promise<CartOwnerKey> {
  const session = await auth();
  if (session?.user?.id) return { userId: session.user.id };

  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return { anonymousToken: existing };

  const token = randomBytes(24).toString("hex");
  cookieStore.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
  return { anonymousToken: token };
}

export async function readGuestCartToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
}

export async function clearGuestCartCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}
