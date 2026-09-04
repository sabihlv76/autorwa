import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { requireAdminPage } from "@/lib/auth/requireAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <AdminTopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
