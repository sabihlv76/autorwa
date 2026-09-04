"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { DeleteAdvertisementButton } from "@/components/admin/DeleteAdvertisementButton";
import { Modal } from "@/components/ui/Modal";
import { createAdvertisementAction } from "@/features/admin/actions/createAdvertisement";
import { updateAdvertisementAction } from "@/features/admin/actions/updateAdvertisement";
import type { Advertisement } from "@/types/product";

type ModalState = { mode: "closed" } | { mode: "new" } | { mode: "edit"; ad: Advertisement };

export function AdvertisementsAdminClient({ ads }: { ads: Advertisement[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modal, setModal] = useState<ModalState>(() =>
    searchParams.get("new") === "1" ? { mode: "new" } : { mode: "closed" },
  );

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeModal() {
    setModal({ mode: "closed" });
  }

  function handleSuccess() {
    closeModal();
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Advertisements</h1>
        <button
          type="button"
          onClick={() => setModal({ mode: "new" })}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New advertisement
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2.5">Advertisement</th>
              <th className="px-3 py-2.5">Position</th>
              <th className="px-3 py-2.5">Priority</th>
              <th className="px-3 py-2.5">Schedule</th>
              <th className="px-3 py-2.5">Active</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                      {ad.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-black">{ad.title}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-zinc-500">{ad.position}</td>
                <td className="px-3 py-2.5 text-zinc-500">{ad.priority}</td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {ad.startDate ? ad.startDate.slice(0, 10) : "—"} →{" "}
                  {ad.endDate ? ad.endDate.slice(0, 10) : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      ad.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {ad.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModal({ mode: "edit", ad })}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Edit
                    </button>
                    <DeleteAdvertisementButton adId={ad.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.mode !== "closed" && (
        <Modal
          title={modal.mode === "edit" ? "Edit advertisement" : "New advertisement"}
          description={modal.mode === "edit" ? modal.ad.title : "Create a new sponsored banner."}
          onClose={closeModal}
        >
          <AdvertisementForm
            action={modal.mode === "edit" ? updateAdvertisementAction : createAdvertisementAction}
            ad={modal.mode === "edit" ? modal.ad : undefined}
            onSuccess={handleSuccess}
          />
        </Modal>
      )}
    </div>
  );
}
