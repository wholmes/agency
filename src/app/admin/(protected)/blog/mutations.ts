"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin";

function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTagsInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "[]";
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
    } catch { /* fall through */ }
  }
  const tags = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return JSON.stringify(tags);
}

export async function createBlogPost(formData: FormData) {
  await requireAdminSession();

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "");
  const author = String(formData.get("author") ?? "");
  const authorTitle = String(formData.get("authorTitle") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "");
  const metaDescription = String(formData.get("metaDescription") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const featured = formData.get("featured") === "on";

  const slug = rawSlug || slugify(title);
  const readingTime = estimateReadingTime(body);
  const tags = parseTagsInput(tagsRaw);
  const publishedAt = status === "published" ? new Date() : null;

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      body,
      excerpt,
      coverImage,
      author,
      authorTitle,
      tags,
      metaTitle,
      metaDescription,
      status,
      featured,
      readingTime,
      publishedAt,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdminSession();

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "");
  const author = String(formData.get("author") ?? "");
  const authorTitle = String(formData.get("authorTitle") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "");
  const metaDescription = String(formData.get("metaDescription") ?? "");
  const newStatus = formData.get("status") === "published" ? "published" : "draft";
  const featured = formData.get("featured") === "on";

  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { status: true, publishedAt: true, slug: true } });
  if (!existing) return;

  const slug = rawSlug || existing.slug;
  const readingTime = estimateReadingTime(body);
  const tags = parseTagsInput(tagsRaw);

  const wasPublished = existing.status === "published";
  const isNowPublished = newStatus === "published";
  const publishedAt =
    isNowPublished && !wasPublished
      ? new Date()
      : isNowPublished
      ? existing.publishedAt
      : null;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      body,
      excerpt,
      coverImage,
      author,
      authorTitle,
      tags,
      metaTitle,
      metaDescription,
      status: newStatus,
      featured,
      readingTime,
      publishedAt,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function toggleBlogPostStatus(id: string) {
  await requireAdminSession();

  const post = await prisma.blogPost.findUnique({ where: { id }, select: { status: true, slug: true } });
  if (!post) return;

  const newStatus = post.status === "published" ? "draft" : "published";

  await prisma.blogPost.update({
    where: { id },
    data: {
      status: newStatus,
      publishedAt: newStatus === "published" ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdminSession();

  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
  if (!post) return;

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function toggleBlogPostFeatured(id: string) {
  await requireAdminSession();

  const post = await prisma.blogPost.findUnique({ where: { id }, select: { featured: true, slug: true } });
  if (!post) return;

  await prisma.blogPost.update({
    where: { id },
    data: { featured: !post.featured },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
