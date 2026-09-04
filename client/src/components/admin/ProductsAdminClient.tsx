"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { Modal } from "@/components/ui/Modal";
import { createProductAction } from "@/features/admin/actions/createProduct";
import { updateProductAction } from "@/features/admin/actions/updateProduct";
import type { Product, Seller } from "@/types/product";

type ModalState = { mode: "closed" } | { mode: "new" } | { mode: "edit"; product: Product };

const AVAILABILITY_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  reserved: "bg-amber-50 text-amber-700",
  sold: "bg-zinc-100 text-zinc-500",
  out_of_stock: "bg-red-50 text-red-600",
};

export function ProductsAdminClient({
  items,
  page,
  totalPages,
  sellers,
}: {
  items: Product[];
  page: number;
  totalPages: number;
  sellers: Seller[];
}) {
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
        <h1 className="text-xl font-bold text-black">Products</h1>
        <button
          type="button"
          onClick={() => setModal({ mode: "new" })}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2.5">Product</th>
              <th className="px-3 py-2.5">Type</th>
              <th className="px-3 py-2.5">Listing</th>
              <th className="px-3 py-2.5">Price</th>
              <th className="px-3 py-2.5">Availability</th>
              <th className="px-3 py-2.5">Seller</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-black">{product.title}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-zinc-500">{product.type}</td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {product.type === "vehicle" ? product.listingType : "—"}
                </td>
                <td className="px-3 py-2.5 text-zinc-500">
                  {product.currency} {product.price.toLocaleString()}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      AVAILABILITY_STYLES[product.availability] ?? "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {product.availability}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-zinc-500">{product.seller.name}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModal({ mode: "edit", product })}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Edit
                    </button>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/ops-console/products?page=${p}`}
              className={`rounded-md border px-2 py-1 ${
                p === page ? "border-accent bg-accent text-white" : "border-zinc-300 text-black"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}

      {modal.mode !== "closed" && (
        <Modal
          title={modal.mode === "edit" ? "Edit product" : "New product"}
          description={modal.mode === "edit" ? modal.product.title : "Add a new listing to the marketplace."}
          onClose={closeModal}
          size="lg"
        >
          <ProductForm
            action={modal.mode === "edit" ? updateProductAction : createProductAction}
            sellers={sellers}
            product={modal.mode === "edit" ? modal.product : undefined}
            onSuccess={handleSuccess}
          />
        </Modal>
      )}
    </div>
  );
}
