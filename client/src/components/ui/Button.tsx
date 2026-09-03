import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:bg-zinc-300 disabled:text-zinc-500",
  secondary:
    "bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500",
  ghost:
    "bg-transparent text-black border border-zinc-300 hover:border-black disabled:text-zinc-400 disabled:border-zinc-200",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
