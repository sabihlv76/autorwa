"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function StatusUpdateForm<TStatus extends string>({
  id,
  currentStatus,
  statusOptions,
  onUpdate,
}: {
  id: string;
  currentStatus: TStatus;
  statusOptions: TStatus[];
  onUpdate: (id: string, status: TStatus) => Promise<{ success: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(newStatus: TStatus) {
    setStatus(newStatus);
    setError(null);
    startTransition(async () => {
      const result = await onUpdate(id, newStatus);
      if (!result.success) {
        setError(result.error ?? "Update failed.");
        setStatus(currentStatus);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div>
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as TStatus)}
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-600">{error}</p>}
    </div>
  );
}
