import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";
import * as userRepository from "@/repositories/userRepository";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Photo upload is not configured yet. Contact the site administrator." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { secureUrl } = await uploadImageBuffer(buffer, { folder: "autorwa/avatars" });

  await userRepository.updateProfile(session.user.id, { image: secureUrl });

  return NextResponse.json({ url: secureUrl });
}
