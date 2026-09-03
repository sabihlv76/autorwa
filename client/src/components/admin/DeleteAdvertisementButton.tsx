"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteAdvertisementAction } from "@/features/admin/actions/deleteAdvertisement";

export function DeleteAdvertisementButton({ adId }: { adId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this advertisement?")) return;
    startTransition(async () => {
      await deleteAdvertisementAction(adId);
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
