import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  errors?: string[];
}

export function SelectField({
  label,
  errors,
  id,
  name,
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-black">
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          name={name}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm focus:outline-none ${
            errors?.length
              ? "border-red-400 focus:border-red-500"
              : "border-zinc-300 focus:border-accent"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {errors?.map((message) => (
        <p key={message} className="text-xs text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}
