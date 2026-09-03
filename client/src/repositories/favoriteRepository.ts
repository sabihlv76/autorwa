import { connectToDatabase } from "@/lib/db/connect";
import { FavoriteModel } from "@/models/Favorite";

export async function isFavorited(userId: string, productId: string): Promise<boolean> {
  await connectToDatabase();
  const doc = await FavoriteModel.findOne({ userId, productId }).lean();
  return !!doc;
}

export async function listProductIdsForUser(
  userId: string,
  productIds?: string[],
): Promise<Set<string>> {
  await connectToDatabase();
  const filter: Record<string, unknown> = { userId };
  if (productIds) filter.productId = { $in: productIds };

  const docs = await FavoriteModel.find(filter)
    .select("productId")
    .lean<{ productId: { toString(): string } }[]>();
  return new Set(docs.map((d) => d.productId.toString()));
}

export async function add(userId: string, productId: string): Promise<void> {
  await connectToDatabase();
  await FavoriteModel.updateOne(
    { userId, productId },
    { $setOnInsert: { userId, productId } },
    { upsert: true },
  );
}

export async function remove(userId: string, productId: string): Promise<void> {
  await connectToDatabase();
  await FavoriteModel.deleteOne({ userId, productId });
}
