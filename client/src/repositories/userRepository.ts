import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/models/User";
import type { PaginatedResult } from "@/features/products/lib/paginate";
import type { AccountStatus, PublicUser, Role, UserWithPasswordHash } from "@/types/user";

interface UserDoc {
  _id: { toString(): string };
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  accountStatus: PublicUser["accountStatus"];
}

function toPublicUser(doc: UserDoc): PublicUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    accountStatus: doc.accountStatus,
  };
}

function toUserWithPasswordHash(doc: UserDoc): UserWithPasswordHash {
  return { ...toPublicUser(doc), passwordHash: doc.passwordHash };
}

export async function findByEmail(
  email: string,
): Promise<UserWithPasswordHash | null> {
  await connectToDatabase();
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean<UserDoc | null>();
  return doc ? toUserWithPasswordHash(doc) : null;
}

export async function findById(id: string): Promise<PublicUser | null> {
  await connectToDatabase();
  const doc = await UserModel.findById(id).lean<UserDoc | null>();
  return doc ? toPublicUser(doc) : null;
}

export async function createCustomer({
  name,
  email,
  passwordHash,
}: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<PublicUser> {
  await connectToDatabase();
  const doc = await UserModel.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "customer",
  });
  return toPublicUser(doc as unknown as UserDoc);
}

export async function updateLastLogin(id: string): Promise<void> {
  await connectToDatabase();
  await UserModel.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
}

export async function updatePasswordHash(
  id: string,
  passwordHash: string,
): Promise<void> {
  await connectToDatabase();
  await UserModel.updateOne({ _id: id }, { $set: { passwordHash } });
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  createdAt: string;
}

interface UserSummaryDoc extends UserDoc {
  createdAt: Date;
}

function toSummary(doc: UserSummaryDoc): UserSummary {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    accountStatus: doc.accountStatus,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function findMany({
  role,
  status,
  page,
  pageSize,
}: {
  role?: Role;
  status?: AccountStatus;
  page: number;
  pageSize: number;
}): Promise<PaginatedResult<UserSummary>> {
  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (role) query.role = role;
  if (status) query.accountStatus = status;

  const totalItems = await UserModel.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const docs = await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean<UserSummaryDoc[]>();

  return {
    items: docs.map(toSummary),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

export async function updateAccountStatus(
  id: string,
  status: AccountStatus,
): Promise<void> {
  await connectToDatabase();
  await UserModel.updateOne({ _id: id }, { $set: { accountStatus: status } });
}
