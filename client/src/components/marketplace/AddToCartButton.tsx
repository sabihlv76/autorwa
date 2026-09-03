"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { addToCartAction } from "@/features/cart/actions/addToCart";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M3 4h2l1.2 11.4A2 2 0 0 0 8.2 17H18a2 2 0 0 0 2-1.7L21.3 8H6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20.5" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddToCartButton({
  productId,
  disabled,
  className = "",
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(productId);
      if (result.success) {
        setJustAdded(true);
        router.refresh();
        setTimeout(() => setJustAdded(false), 1500);
      } else {
        setError(result.error ?? "Could not add to cart.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isPending}
        aria-label={justAdded ? dictionary.product.addedToCart : dictionary.product.addToCart}
        title={justAdded ? dictionary.product.addedToCart : dictionary.product.addToCart}
        className={`flex w-full items-center justify-center rounded-md bg-black py-1.5 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 ${className}`}
      >
        {justAdded ? <CheckIcon /> : <CartIcon />}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
