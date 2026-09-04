import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// tsx runs this script standalone (outside Next.js), so .env.local isn't
// auto-loaded the way `next dev`/`next build` do it. Load it ourselves.
function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/db/connect";
import { AdvertisementModel } from "../src/models/Advertisement";
import { ProductModel } from "../src/models/Product";
import { SellerModel } from "../src/models/Seller";
import { mockAdvertisements } from "../src/lib/mock/advertisements";
import { mockSellers } from "../src/lib/mock/businesses";
import { mockProducts } from "../src/lib/mock/products";

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) delete clone[key];
  return clone;
}

async function seed() {
  await connectToDatabase();

  await Promise.all([
    SellerModel.deleteMany({}),
    AdvertisementModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  const insertedSellers = await SellerModel.insertMany(
    mockSellers.map(({ name, verified, location, whatsapp, enterprise, rating }) => ({
      name,
      verified,
      location,
      whatsapp,
      enterprise: enterprise ?? false,
      rating,
    })),
  );

  const sellerIdMap = new Map<string, (typeof insertedSellers)[number]>();
  mockSellers.forEach((mockSeller, i) => {
    sellerIdMap.set(mockSeller.id, insertedSellers[i]);
  });

  const insertedAds = await AdvertisementModel.insertMany(
    mockAdvertisements.map(({ position, title, imageUrl, targetUrl, advertiser, active }) => ({
      position,
      title,
      imageUrl,
      targetUrl,
      advertiser,
      active,
    })),
  );

  const productDocs = mockProducts.map((product) => {
    const seller = sellerIdMap.get(product.seller.id);
    if (!seller) {
      throw new Error(`No seeded seller found for mock seller id ${product.seller.id}`);
    }

    const rest = omit(product, ["id", "seller", "createdAt"]);

    return {
      ...rest,
      sellerId: seller._id,
      seller: {
        id: seller._id.toString(),
        name: seller.name,
        verified: seller.verified,
        location: seller.location,
        whatsapp: seller.whatsapp,
        enterprise: seller.enterprise,
        rating: seller.rating,
        createdAt: seller.createdAt,
      },
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.createdAt),
    };
  });

  // Bypass Mongoose's timestamps middleware (raw driver insert) so the
  // staggered mock `createdAt` values survive instead of being overwritten
  // with "now" — they're what makes newest/oldest sort meaningfully testable.
  await ProductModel.collection.insertMany(productDocs);

  console.log(
    `Seeded ${insertedSellers.length} sellers, ${insertedAds.length} advertisements, ${productDocs.length} products.`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
