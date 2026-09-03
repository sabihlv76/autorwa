"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./Button";

export function SubmitButton({
  children,
  pendingLabel,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (pendingLabel ?? children) : children}
    </Button>
  );
}
