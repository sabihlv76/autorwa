import { connectToDatabase } from "@/lib/db/connect";
import { PasswordResetTokenModel } from "@/models/PasswordResetToken";

interface TokenDoc {
  _id: { toString(): string };
  userId: { toString(): string };
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
}

export async function create({
  userId,
  tokenHash,
  expiresAt,
}: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> {
  await connectToDatabase();
  await PasswordResetTokenModel.updateMany(
    { userId, used: false },
    { $set: { used: true } },
  );
  await PasswordResetTokenModel.create({ userId, tokenHash, expiresAt });
}

export async function findValidByHash(
  tokenHash: string,
): Promise<{ id: string; userId: string } | null> {
  await connectToDatabase();
  const doc = await PasswordResetTokenModel.findOne({
    tokenHash,
    used: false,
    expiresAt: { $gt: new Date() },
  }).lean<TokenDoc | null>();
  return doc ? { id: doc._id.toString(), userId: doc.userId.toString() } : null;
}

export async function markUsed(id: string): Promise<void> {
  await connectToDatabase();
  await PasswordResetTokenModel.updateOne({ _id: id }, { $set: { used: true } });
}
