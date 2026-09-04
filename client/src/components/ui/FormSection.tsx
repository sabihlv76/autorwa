export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
