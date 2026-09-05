import { NextResponse } from "next/server";
import { setAdminGateCookie } from "@/lib/auth/adminGate";

// The one and only entry point into the admin portal. Nothing in the UI
// links here — knowing this exact URL (with the real secret token) is
// what grants access to even attempt an admin sign-in; see
// src/lib/auth/adminGate.ts / requireAdmin.ts for the cookie it sets and
// how /ops-console and /admin-signin both require it.
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const secret = process.env.ADMIN_GATE_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await setAdminGateCookie();
  return NextResponse.redirect(new URL("/admin-signin", request.url));
}
