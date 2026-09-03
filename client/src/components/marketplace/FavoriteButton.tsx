"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { toggleFavoriteAction } from "@/features/favorites/actions/toggleFavorite";

export function FavoriteButton({
  productId,
  initiallyFavorited,
  className = "",
}: {
  productId: string;
  initiallyFavorited: boolean;
  className?: string;
}) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await toggleFavoriteAction(productId);
      if (result.requiresAuth) {
        router.push("/signin");
        return;
      }
      if (result.success) {
        setFavorited(result.favorited ?? favorited);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={favorited ? dictionary.product.saved : dictionary.product.save}
      className={`rounded-full border px-2 py-1 text-xs font-medium ${
        favorited
          ? "border-accent bg-accent text-white"
          : "border-zinc-300 bg-white text-zinc-600"
      } ${className}`}
    >
      {favorited ? dictionary.product.saved : dictionary.product.save}
    </button>
  );
}
