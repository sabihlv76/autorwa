import { connectToDatabase } from "@/lib/db/connect";
import { AdvertisementModel } from "@/models/Advertisement";
import type { Advertisement, AdPosition } from "@/types/product";

interface AdDoc {
  _id: { toString(): string };
  position: AdPosition;
  title: string;
  imageUrl: string;
  targetUrl: string;
  advertiser: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  priority: number;
}

function toAdvertisement(doc: AdDoc): Advertisement {
  return {
    id: doc._id.toString(),
    position: doc.position,
    title: doc.title,
    imageUrl: doc.imageUrl,
    targetUrl: doc.targetUrl,
    advertiser: doc.advertiser,
    active: doc.active,
    startDate: doc.startDate ? new Date(doc.startDate).toISOString() : undefined,
    endDate: doc.endDate ? new Date(doc.endDate).toISOString() : undefined,
    priority: doc.priority ?? 0,
  };
}

export async function getForPosition(
  position: AdPosition,
): Promise<Advertisement | undefined> {
  await connectToDatabase();
  const now = new Date();

  const doc = await AdvertisementModel.findOne({
    position,
    active: true,
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  })
    .sort({ priority: -1 })
    .lean<AdDoc | null>();

  return doc ? toAdvertisement(doc) : undefined;
}

export async function listAll(): Promise<Advertisement[]> {
  await connectToDatabase();
  const docs = await AdvertisementModel.find()
    .sort({ position: 1, priority: -1 })
    .lean<AdDoc[]>();
  return docs.map(toAdvertisement);
}

export async function findById(id: string): Promise<Advertisement | null> {
  await connectToDatabase();
  const doc = await AdvertisementModel.findById(id).lean<AdDoc | null>();
  return doc ? toAdvertisement(doc) : null;
}

interface AdvertisementInput {
  position: AdPosition;
  title: string;
  imageUrl: string;
  targetUrl: string;
  advertiser: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  priority: number;
}

export async function create(input: AdvertisementInput): Promise<Advertisement> {
  await connectToDatabase();
  const doc = await AdvertisementModel.create(input);
  return toAdvertisement(doc.toObject() as unknown as AdDoc);
}

export async function update(
  id: string,
  input: AdvertisementInput,
): Promise<Advertisement | null> {
  await connectToDatabase();
  const doc = await AdvertisementModel.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  ).lean<AdDoc | null>();
  return doc ? toAdvertisement(doc) : null;
}

export async function remove(id: string): Promise<void> {
  await connectToDatabase();
  await AdvertisementModel.findByIdAndDelete(id);
}
