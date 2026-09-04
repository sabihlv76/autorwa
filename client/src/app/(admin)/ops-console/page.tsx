import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";
import * as userRepository from "@/repositories/userRepository";
import * as whatsappOrderRepository from "@/repositories/whatsappOrderRepository";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-dark">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="text-2xl font-bold text-black">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function icon(path: string) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AdminOverviewPage() {
  const [productCounts, sellerCount, userTotal, orderTotal, ads] = await Promise.all([
    productRepository.countByType(),
    sellerRepository.count(),
    userRepository.findMany({ page: 1, pageSize: 1 }),
    whatsappOrderRepository.findMany({ page: 1, pageSize: 1 }),
    advertisementRepository.listAll(),
  ]);
  const activeAds = ads.filter((ad) => ad.active).length;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Vehicles"
          value={productCounts.vehicle}
          icon={icon("M3 12l2-7h14l2 7M5 12v7h14v-7M5 12h14")}
        />
        <StatCard
          label="Spare parts"
          value={productCounts.spare_part}
          icon={icon("M14.7 6.3a1 1 0 0 0 1.4 1.4l1.6-1.6a4 4 0 0 1-5.4 5.4L4.7 19a2 2 0 0 1-2.8-2.8l7.5-7.5a4 4 0 0 1 5.4-5.4Z")}
        />
        <StatCard
          label="Sellers"
          value={sellerCount}
          icon={icon("M4 9l1-5h14l1 5M4 9v10h16V9M4 9h16")}
        />
        <StatCard
          label="Users"
          value={userTotal.totalItems}
          icon={icon("M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 8c0-3 2.5-5 6-5s6 2 6 5")}
        />
        <StatCard
          label="Orders"
          value={orderTotal.totalItems}
          icon={icon("M6 7h12l1 13H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2")}
        />
        <StatCard
          label="Active ads"
          value={activeAds}
          icon={icon("M3 10v4h3l5 4V6L6 10H3Zm14.5-2.5a5 5 0 0 1 0 9")}
        />
      </div>
    </div>
  );
}
