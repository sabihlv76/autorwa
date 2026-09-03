import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdminPage } from "@/lib/auth/requireAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="flex flex-1">
      <AdminNav />
      <main className="flex-1 bg-zinc-50 p-6">{children}</main>
    </div>
  );
}
