"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Reuses the .animate-fade-in-up keyframe already defined in globals.css
// for the Hero — this just defers it until the section actually scrolls
// into view, instead of applying it once on page load where a below-the-
// fold section would already be finished animating before anyone sees it.
// prefers-reduced-motion is handled by that same CSS rule, not here.
export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? "animate-fade-in-up" : "opacity-0"}>
      {children}
    </div>
  );
}
