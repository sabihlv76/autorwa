"use client";

import { useId } from "react";

export type FlagCode = "GB" | "FR" | "RW" | "TZ" | "US";

// Precomputed endpoints for the 12 sun rays on the RW flag (center 18,4.4,
// radius 3.4, one every 30deg). Fixed literals rather than a runtime
// Math.cos/sin call so SSR and client markup always match exactly — trig
// results can differ by a ULP between server/client JS engines, which React
// treats as a hydration mismatch.
const RW_SUN_RAYS: [number, number][] = [
  [21.4, 4.4],
  [20.9, 6.1],
  [19.7, 7.3],
  [18, 7.8],
  [16.3, 7.3],
  [15.1, 6.1],
  [14.6, 4.4],
  [15.1, 2.7],
  [16.3, 1.5],
  [18, 1],
  [19.7, 1.5],
  [20.9, 2.7],
];

/**
 * Inline SVG flags, used instead of flag emoji: Chromium on Windows has no
 * color-flag glyphs and falls back to rendering the two-letter region code.
 */
export function Flag({
  code,
  className = "h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-inset ring-black/10",
}: {
  code: FlagCode;
  className?: string;
}) {
  const clipId = useId();

  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <clipPath id={clipId}>
        <rect width="24" height="16" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{renderFlag(code)}</g>
    </svg>
  );
}

function renderFlag(code: FlagCode) {
  switch (code) {
    case "GB":
      return (
        <>
          <rect width="24" height="16" fill="#00247D" />
          <path d="M0 0 24 16M24 0 0 16" stroke="#FFFFFF" strokeWidth="3.4" />
          <path d="M0 0 24 16M24 0 0 16" stroke="#CF142B" strokeWidth="1.3" />
          <path d="M12 0V16M0 8H24" stroke="#FFFFFF" strokeWidth="5.2" />
          <path d="M12 0V16M0 8H24" stroke="#CF142B" strokeWidth="3" />
        </>
      );
    case "FR":
      return (
        <>
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </>
      );
    case "RW":
      return (
        <>
          <rect width="24" height="16" fill="#20603D" />
          <rect width="24" height="10" fill="#00A1DE" />
          <rect y="9.4" width="24" height="1.6" fill="#E5BE01" />
          <circle cx="18" cy="4.4" r="2.1" fill="#FAD201" />
          {RW_SUN_RAYS.map(([x2, y2], i) => (
            <line key={i} x1={18} y1={4.4} x2={x2} y2={y2} stroke="#FAD201" strokeWidth="0.4" />
          ))}
        </>
      );
    case "TZ":
      return (
        <>
          <polygon points="0,0 24,0 0,16" fill="#1EB53A" />
          <polygon points="24,0 24,16 0,16" fill="#00A3DD" />
          <line x1="0" y1="16" x2="24" y2="0" stroke="#FCD116" strokeWidth="3.4" />
          <line x1="0" y1="16" x2="24" y2="0" stroke="#000000" strokeWidth="1.6" />
        </>
      );
    case "US":
      return (
        <>
          <rect width="24" height="16" fill="#B22234" />
          {[1, 3, 5, 7, 9, 11].map((i) => (
            <rect key={i} y={(i * 16) / 13} width="24" height={16 / 13} fill="#FFFFFF" />
          ))}
          <rect width="10" height={(16 / 13) * 7} fill="#3C3B6E" />
        </>
      );
  }
}
