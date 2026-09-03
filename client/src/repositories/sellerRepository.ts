import { connectToDatabase } from "@/lib/db/connect";
import { SellerModel } from "@/models/Seller";
import type { Seller } from "@/types/product";

interface SellerDoc {
  _id: { toString(): string };
  name: string;
  verified: boolean;
  location: string;
  whatsapp: string;
}

function toSeller(doc: SellerDoc): Seller {
  return {
    id: doc._id.toString(),
    name: doc.name,
    verified: doc.verified,
    location: doc.location,
    whatsapp: doc.whatsapp,
  };
}

export async function listAll(): Promise<Seller[]> {
  await connectToDatabase();
  const docs = await SellerModel.find().sort({ name: 1 }).lean<SellerDoc[]>();
  return docs.map(toSeller);
}

export async function findById(id: string): Promise<Seller | null> {
  await connectToDatabase();
  const doc = await SellerModel.findById(id).lean<SellerDoc | null>();
  return doc ? toSeller(doc) : null;
}

export async function count(): Promise<number> {
  await connectToDatabase();
  return SellerModel.countDocuments();
}

export async function create({
  name,
  verified,
  location,
  whatsapp,
}: {
  name: string;
  verified: boolean;
  location: string;
  whatsapp: string;
}): Promise<Seller> {
  await connectToDatabase();
  const doc = await SellerModel.create({ name, verified, location, whatsapp });
  return toSeller(doc.toObject() as unknown as SellerDoc);
}
