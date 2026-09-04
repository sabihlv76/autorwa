"use client";

import { useRef, useState } from "react";

interface UploadingSlot {
  key: string;
  progress: "uploading" | "error";
  error?: string;
}

/**
 * Local-file image picker that uploads to /api/admin/upload and stores the
 * resulting URLs in a hidden input, so the surrounding form/Server Action
 * keeps working with plain URL strings (comma-separated when `multiple`) —
 * no changes needed to the existing validation schemas.
 */
export function ImageUploadField({
  name,
  label,
  defaultValue,
  multiple = false,
  errors,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  multiple?: boolean;
  errors?: string[];
}) {
  const [images, setImages] = useState<string[]>(
    defaultValue
      ? defaultValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );
  const [pending, setPending] = useState<UploadingSlot[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!multiple) list.splice(1);

    for (const file of list) {
      const key = `${file.name}-${crypto.randomUUID()}`;
      setPending((p) => [...p, { key, progress: "uploading" }]);

      try {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed.");

        setImages((prev) => (multiple ? [...prev, data.url] : [data.url]));
        setPending((p) => p.filter((slot) => slot.key !== key));
      } catch (err) {
        setPending((p) =>
          p.map((slot) =>
            slot.key === key
              ? { ...slot, progress: "error", error: (err as Error).message }
              : slot,
          ),
        );
      }
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function dismissError(key: string) {
    setPending((p) => p.filter((slot) => slot.key !== key));
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-black">{label}</label>
      <input type="hidden" name={name} value={images.join(", ")} />

      {(images.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
          {pending.map((slot) => (
            <div
              key={slot.key}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center ${
                slot.progress === "error"
                  ? "border-red-300 bg-red-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              {slot.progress === "uploading" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-accent" />
              ) : (
                <>
                  <p className="text-[10px] leading-tight text-red-600">{slot.error}</p>
                  <button
                    type="button"
                    onClick={() => dismissError(slot.key)}
                    className="text-[10px] font-medium text-zinc-500 underline"
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {(multiple || images.length === 0) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragActive
              ? "border-accent bg-accent/5"
              : "border-zinc-300 hover:border-accent hover:bg-zinc-50"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-zinc-400">
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-xs font-medium text-zinc-600">
            Click to upload or drag and drop
          </p>
          <p className="text-[11px] text-zinc-400">JPEG, PNG, WebP or GIF, up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {errors?.map((message) => (
        <p key={message} className="text-xs text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}
