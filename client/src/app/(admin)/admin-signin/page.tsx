import { requireAdminGate } from "@/lib/auth/requireAdmin";
import { AdminSignInForm } from "./AdminSignInForm";

// Sibling to ops-console/, not nested inside it — ops-console/layout.tsx
// requires an admin session, which would block this sign-in page itself.
// requireAdminGate() only checks the secret-URL cookie from /portal/[token].
export default async function AdminSignInPage() {
  await requireAdminGate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <AdminSignInForm />
      </div>
    </div>
  );
}
