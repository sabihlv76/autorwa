import Link from "next/link";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { updateUserAccountStatusAction } from "@/features/admin/actions/updateUserAccountStatus";
import * as userRepository from "@/repositories/userRepository";
import type { AccountStatus, Role } from "@/types/user";

const PAGE_SIZE = 20;
const ROLES: Role[] = ["customer", "business", "admin", "moderator", "finance", "support"];
const STATUSES: AccountStatus[] = ["active", "suspended", "closed"];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string; status?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;
  const role = ROLES.includes(resolved.role as Role) ? (resolved.role as Role) : undefined;
  const status = STATUSES.includes(resolved.status as AccountStatus)
    ? (resolved.status as AccountStatus)
    : undefined;

  const { items, totalPages } = await userRepository.findMany({
    role,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  const query = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return qs ? `/ops-console/users?${qs}` : "/ops-console/users";
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Users</h1>

      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <Link
          href={query({ role: undefined })}
          className={`rounded-md border px-2 py-1 ${!role ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
        >
          All roles
        </Link>
        {ROLES.map((r) => (
          <Link
            key={r}
            href={query({ role: r })}
            className={`rounded-md border px-2 py-1 ${role === r ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
          >
            {r}
          </Link>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Link
          href={query({ status: undefined })}
          className={`rounded-md border px-2 py-1 ${!status ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
        >
          All statuses
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={query({ status: s })}
            className={`rounded-md border px-2 py-1 ${status === s ? "border-accent bg-accent text-white" : "border-zinc-300"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-medium text-black">{user.name}</td>
                <td className="px-3 py-2 text-zinc-500">{user.email}</td>
                <td className="px-3 py-2 text-zinc-500">{user.role}</td>
                <td className="px-3 py-2 text-zinc-500">{user.createdAt.slice(0, 10)}</td>
                <td className="px-3 py-2">
                  <StatusUpdateForm
                    id={user.id}
                    currentStatus={user.accountStatus}
                    statusOptions={STATUSES}
                    onUpdate={updateUserAccountStatusAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={query({ page: String(p) })}
              className={`rounded-md border px-2 py-1 ${
                p === page ? "border-accent bg-accent text-white" : "border-zinc-300 text-black"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
