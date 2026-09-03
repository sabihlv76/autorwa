import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer | undefined;

/**
 * Starts an isolated in-memory MongoDB instance and points MONGODB_URI at
 * it. Call from `beforeAll` in every integration test file — each file gets
 * its own instance rather than sharing one via a Vitest globalSetup, since
 * globalSetup's process.env mutations don't reliably reach worker threads.
 */
export async function startTestDatabase(): Promise<void> {
  // Pinned to a version already present in the local mongodb-binaries cache
  // (~/.cache/mongodb-binaries) — the default (latest) version triggers a
  // ~650MB download that this sandbox's network cannot reliably complete.
  mongod = await MongoMemoryServer.create({
    binary: { version: "8.2.1" },
    instance: { launchTimeout: 30000 },
  });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "autorwa_test";
}

/**
 * Disconnects Mongoose, stops the in-memory server, and clears
 * connectToDatabase()'s module-level connection cache — without that last
 * step, a worker thread that runs another test file next would reuse a
 * cached connection pointing at this now-stopped instance.
 */
export async function stopTestDatabase(): Promise<void> {
  await mongoose.disconnect();
  await mongod?.stop();
  mongod = undefined;
  global.__autorwaMongooseCache = { conn: null, promise: null };
}

export async function clearCollections(): Promise<void> {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}
