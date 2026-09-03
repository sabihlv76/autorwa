/**
 * One-off script to create the single admin account. Admin accounts are
 * never self-service (signup always hardcodes role: "customer") — this is
 * the only way one gets created.
 *
 * Usage:
 *   ADMIN_NAME="Jane Doe" ADMIN_EMAIL="jane@example.com" ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/db/connect";
import { UserModel } from "../src/models/User";

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables and re-run.",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  await connectToDatabase();

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`A user with email ${email} already exists (role: ${existing.role}).`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "admin",
    accountStatus: "active",
  });

  console.log(`Admin account created for ${email}. Sign in at /signin, then visit /ops-console.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
