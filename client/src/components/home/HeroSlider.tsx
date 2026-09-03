"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_ADVANCE_MS = 5000;

function ChevronButton({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  function goTo(next: number) {
    setIndex(((next % images.length) + images.length) % images.length);
  }

  return (
    <div
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className={`object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {images.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronButton direction="left" onClick={() => goTo(index - 1)} label="Previous" />
            <ChevronButton direction="right" onClick={() => goTo(index + 1)} label="Next" />
          </div>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
