import Link from "next/link";
import { DeleteAdvertisementButton } from "@/components/admin/DeleteAdvertisementButton";
import * as advertisementRepository from "@/repositories/advertisementRepository";

export default async function AdminAdvertisementsPage() {
  const ads = await advertisementRepository.listAll();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Advertisements</h1>
        <Link
          href="/ops-console/advertisements/new"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-dark"
        >
          New advertisement
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Schedule</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-3 py-2 font-medium text-black">{ad.title}</td>
                <td className="px-3 py-2 text-zinc-500">{ad.position}</td>
                <td className="px-3 py-2 text-zinc-500">{ad.priority}</td>
                <td className="px-3 py-2 text-zinc-500">
                  {ad.startDate ? ad.startDate.slice(0, 10) : "—"} →{" "}
                  {ad.endDate ? ad.endDate.slice(0, 10) : "—"}
                </td>
                <td className="px-3 py-2 text-zinc-500">{ad.active ? "Yes" : "No"}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/ops-console/advertisements/${ad.id}/edit`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteAdvertisementButton adId={ad.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
