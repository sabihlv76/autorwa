import { readdir } from "node:fs/promises";
import path from "node:path";
import { Hero } from "@/components/home/Hero";
import { SearchByMake } from "@/components/home/SearchByMake";
import { SearchByType } from "@/components/home/SearchByType";
import { ValueProps } from "@/components/home/ValueProps";
import { VehicleSection } from "@/components/home/VehicleSection";
import { AdSlot } from "@/components/marketplace/AdSlot";
import { auth } from "@/lib/auth/auth";
import * as advertisementRepository from "@/repositories/advertisementRepository";
import * as favoriteRepository from "@/repositories/favoriteRepository";
import * as productRepository from "@/repositories/productRepository";
import * as sellerRepository from "@/repositories/sellerRepository";

const HERO_IMAGE_DIR = path.join(process.cwd(), "public", "hero");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function getHeroImages(): Promise<string[]> {
  try {
    const files = await readdir(HERO_IMAGE_DIR);
    return files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/hero/${file}`);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [
    images,
    productCounts,
    sellerCount,
    makeCounts,
    bodyTypeCounts,
    featuredVehicles,
    recentVehicles,
    session,
    topLeftAd,
    topRightAd,
  ] = await Promise.all([
    getHeroImages(),
    productRepository.countByType(),
    sellerRepository.count(),
    productRepository.countVehiclesByMake(),
    productRepository.countVehiclesByBodyType(),
    productRepository.findVehicles({ featured: true, limit: 8 }),
    productRepository.findVehicles({ limit: 12 }),
    auth(),
    advertisementRepository.getForPosition("top_left"),
    advertisementRepository.getForPosition("top_right"),
  ]);
  const listingCount = productCounts.vehicle + productCounts.spare_part;

  const featuredIds = new Set(featuredVehicles.map((v) => v.id));
  const latestVehicles = recentVehicles.filter((v) => !featuredIds.has(v.id)).slice(0, 8);

  const favoritedProductIds = session?.user?.id
    ? await favoriteRepository.listProductIdsForUser(
        session.user.id,
        [...featuredVehicles, ...latestVehicles].map((v) => v.id),
      )
    : undefined;

  return (
    <div>
      <Hero images={images} listingCount={listingCount} sellerCount={sellerCount} />

      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xs">
          <AdSlot ad={topLeftAd} variant="transparent" />
        </div>
        <div className="w-full max-w-xs">
          <AdSlot ad={topRightAd} variant="transparent" />
        </div>
      </div>

      <SearchByMake counts={makeCounts} />
      <SearchByType counts={bodyTypeCounts} />
      <VehicleSection
        variant="featured"
        viewAllHref="/marketplace?type=vehicle"
        products={featuredVehicles}
        favoritedProductIds={favoritedProductIds}
      />
      <VehicleSection
        variant="latest"
        viewAllHref="/marketplace?type=vehicle&sort=newest"
        products={latestVehicles}
        favoritedProductIds={favoritedProductIds}
      />
      <ValueProps />
    </div>
  );
}
