"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProductAction } from "@/features/admin/actions/deleteProduct";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteProductAction(productId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
