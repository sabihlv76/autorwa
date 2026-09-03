import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-black">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const [productCounts, sellerCount] = await Promise.all([
    productRepository.countByType(),
    sellerRepository.count(),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Vehicles" value={productCounts.vehicle} />
        <StatCard label="Spare parts" value={productCounts.spare_part} />
        <StatCard label="Sellers" value={sellerCount} />
      </div>
    </div>
  );
}
