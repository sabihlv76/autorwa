"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface IconSelectOption<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
}

/**
 * A small icon-capable listbox, used where a native `<select>` can't show
 * an icon per option (icons inside `<option>` aren't reliably renderable
 * cross-browser). Kept generic since LanguageSwitcher and CurrencySwitcher
 * need the exact same interaction, just different data.
 */
export function IconSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: IconSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-black hover:border-black focus:border-accent focus:outline-none"
      >
        <span aria-hidden="true">{current.icon}</span>
        <span>{current.label}</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-zinc-400">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute right-0 z-20 mt-1 min-w-full overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-left text-sm hover:bg-zinc-100 ${
                  option.value === value ? "bg-zinc-50 font-medium text-black" : "text-zinc-700"
                }`}
              >
                <span aria-hidden="true">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
