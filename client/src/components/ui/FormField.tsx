import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string[];
}

export function FormField({ label, errors, id, className = "", ...props }: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-black">
        {label}
      </label>
      <input
        id={fieldId}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
          errors?.length
            ? "border-red-400 focus:border-red-500"
            : "border-zinc-300 focus:border-accent"
        } ${className}`}
        {...props}
      />
      {errors?.map((message) => (
        <p key={message} className="text-xs text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}
