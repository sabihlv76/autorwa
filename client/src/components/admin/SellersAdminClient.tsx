"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateSellerForm } from "@/components/admin/CreateSellerForm";
import { Modal } from "@/components/ui/Modal";
import type { Seller } from "@/types/product";

export function SellersAdminClient({ sellers }: { sellers: Seller[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(() => searchParams.get("new") === "1");

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Sellers</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New seller
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Location</th>
              <th className="px-3 py-2.5">WhatsApp</th>
              <th className="px-3 py-2.5">Verified</th>
              <th className="px-3 py-2.5">Enterprise</th>
              <th className="px-3 py-2.5">Rating</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-3 py-2.5 font-medium text-black">{seller.name}</td>
                <td className="px-3 py-2.5 text-zinc-500">{seller.location}</td>
                <td className="px-3 py-2.5 text-zinc-500">{seller.whatsapp}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      seller.verified ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {seller.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {seller.enterprise && (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      Enterprise
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {seller.rating ? seller.rating.toFixed(1) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title="New seller" description="Add a seller who can list products." onClose={() => setOpen(false)}>
          <CreateSellerForm onCreated={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
