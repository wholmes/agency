"use server";

import { randomBytes } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { requireAdminSession } from "@/lib/admin/require-admin";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function buildPublicUrl(bucket: string, region: string, key: string): string {
  const custom = process.env.AWS_S3_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (custom) {
    return `${custom}/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export type BlogS3UploadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Upload a blog image to S3 (admin only). Configure AWS_* env vars and bucket policy for public reads on `blog/*`.
 */
export async function uploadBlogImageToS3(formData: FormData): Promise<BlogS3UploadResult> {
  await requireAdminSession();

  const region = process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim();
  const bucket = process.env.AWS_S3_BUCKET?.trim();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    return {
      ok: false,
      error:
        "S3 is not configured. Set AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY (optional: AWS_S3_PUBLIC_BASE_URL for CloudFront or a custom origin).",
    };
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return { ok: false, error: "No file uploaded." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: `Image must be at most ${MAX_BYTES / (1024 * 1024)} MB.` };
  }

  const ext = extFromMime(file.type);
  const key = `blog/images/${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buf,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "S3 upload failed";
    return { ok: false, error: msg };
  }

  return { ok: true, url: buildPublicUrl(bucket, region, key) };
}
