import { readdir } from "node:fs/promises";
import path from "node:path";
import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
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
  const [images, productCounts, sellerCount] = await Promise.all([
    getHeroImages(),
    productRepository.countByType(),
    sellerRepository.count(),
  ]);
  const listingCount = productCounts.vehicle + productCounts.spare_part;

  return (
    <div>
      <Hero images={images} listingCount={listingCount} sellerCount={sellerCount} />
      <ValueProps />
    </div>
  );
}
