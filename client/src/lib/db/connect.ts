import dns from "node:dns";
import mongoose from "mongoose";

// Node's own DNS client (not the OS resolver) sometimes can't reach the
// default nameserver on this host, which breaks the SRV/TXT lookups
// `mongodb+srv://` needs. Point it at a public resolver instead.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cached across hot-reloads/invocations so serverless functions and `next
// dev` don't open a new connection per request.
declare global {
  var __autorwaMongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__autorwaMongooseCache ?? {
  conn: null,
  promise: null,
};
global.__autorwaMongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error(
      "MONGODB_URI is not set. Copy client/.env.example to client/.env.local and fill in your Atlas connection string.",
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongodbUri, {
      dbName: process.env.MONGODB_DB || "autorwa",
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
