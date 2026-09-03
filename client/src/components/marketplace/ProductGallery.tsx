"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductPlaceholderIcon } from "./ProductPlaceholderIcon";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images;

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 sm:h-96">
        <ProductPlaceholderIcon type={product.type} className="h-20 w-20 text-zinc-300" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-72 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 sm:h-96">
        <Image
          src={images[activeIndex]}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                i === activeIndex ? "border-accent" : "border-zinc-200"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
