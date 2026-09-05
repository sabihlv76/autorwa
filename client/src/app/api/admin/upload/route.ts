import { NextResponse } from "next/server";
import { requireAdminAction } from "@/lib/auth/requireAdmin";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Cloudinary-backed, same as /api/account/avatar — local disk (the old
// implementation here) doesn't persist on Vercel's serverless filesystem,
// so ad/product images uploaded through the admin panel would silently
// vanish in production even though the DB record saved a path for them.
export async function POST(request: Request) {
  const session = await requireAdminAction();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Image upload is not configured yet. Set CLOUDINARY_* env vars." },
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
  const { secureUrl } = await uploadImageBuffer(buffer, { folder: "autorwa/uploads" });

  return NextResponse.json({ url: secureUrl });
}
