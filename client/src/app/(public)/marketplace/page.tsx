import { Suspense } from "react";
import { AdSlot } from "@/components/marketplace/AdSlot";
import { FilterDrawer } from "@/components/marketplace/FilterDrawer";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { MarketplaceIntro } from "@/components/marketplace/MarketplaceIntro";
import { Pagination } from "@/components/marketplace/Pagination";
import { PostedWithinSelect } from "@/components/marketplace/PostedWithinSelect";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { SortDropdown } from "@/components/marketplace/SortDropdown";
import {
  PAGE_SIZE,
  parseFilters,
  parsePage,
  parseSort,
  type RawSearchParams,
} from "@/features/products/lib/searchParams";
import { auth } from "@/lib/auth/auth";
import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as favoriteRepository from "@/repositories/favoriteRepository";
import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const sort = parseSort(resolvedSearchParams);
  const page = parsePage(resolvedSearchParams);

  const [paginated, topLeftAd, topRightAd, sellers, session, makeCounts] = await Promise.all([
    productRepository.findMany({ filters, sort, page, pageSize: PAGE_SIZE }),
    advertisementRepository.getForPosition("top_left"),
    advertisementRepository.getForPosition("top_right"),
    sellerRepository.listAll(),
    auth(),
    filters.type === "vehicle" ? productRepository.countVehiclesByMake() : Promise.resolve({}),
  ]);

  const favoritedProductIds = session?.user?.id
    ? await favoriteRepository.listProductIdsForUser(
        session.user.id,
        paginated.items.map((p) => p.id),
      )
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap justify-between gap-3">
        <div className="w-full max-w-xs">
          <AdSlot ad={topLeftAd} />
        </div>
        <div className="w-full max-w-xs">
          <AdSlot ad={topRightAd} />
        </div>
      </div>

      <Suspense fallback={null}>
        <div className="mb-4 lg:hidden">
          <FilterDrawer sellers={sellers} />
        </div>

        <div className="flex gap-6">
          <FilterSidebar sellers={sellers} />

          <div className="min-w-0 flex-1">
            <MarketplaceIntro
              type={filters.type}
              activeCategory={filters.category}
              activeBodyType={filters.bodyType === "all" ? undefined : filters.bodyType}
              makeCounts={makeCounts}
            />

            <div className="mb-3 flex items-center justify-end gap-2">
              <SortDropdown />
              <PostedWithinSelect />
            </div>

            <ProductGrid
              products={paginated.items}
              totalItems={paginated.totalItems}
              favoritedProductIds={favoritedProductIds}
            />

            <Pagination page={paginated.page} totalPages={paginated.totalPages} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
