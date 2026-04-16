"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin";

function normaliseSource(raw: string): string {
  const trimmed = raw.trim();
  // Ensure it starts with /
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function createRedirect(formData: FormData) {
  await requireAdminSession();

  const source = normaliseSource(String(formData.get("source") ?? ""));
  const destination = String(formData.get("destination") ?? "").trim();
  const permanent = formData.get("permanent") === "on";
  const enabled = formData.get("enabled") === "on";
  const note = String(formData.get("note") ?? "").trim();

  await prisma.redirect.create({
    data: { source, destination, permanent, enabled, note },
  });

  revalidatePath("/api/redirects");
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function updateRedirect(id: number, formData: FormData) {
  await requireAdminSession();

  const source = normaliseSource(String(formData.get("source") ?? ""));
  const destination = String(formData.get("destination") ?? "").trim();
  const permanent = formData.get("permanent") === "on";
  const enabled = formData.get("enabled") === "on";
  const note = String(formData.get("note") ?? "").trim();

  await prisma.redirect.update({
    where: { id },
    data: { source, destination, permanent, enabled, note },
  });

  revalidatePath("/api/redirects");
  revalidatePath("/admin/redirects");
}

export async function deleteRedirect(id: number) {
  await requireAdminSession();

  await prisma.redirect.delete({ where: { id } });

  revalidatePath("/api/redirects");
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function toggleRedirectEnabled(id: number) {
  await requireAdminSession();

  const row = await prisma.redirect.findUnique({ where: { id }, select: { enabled: true } });
  if (!row) return;

  await prisma.redirect.update({
    where: { id },
    data: { enabled: !row.enabled },
  });

  revalidatePath("/api/redirects");
  revalidatePath("/admin/redirects");
}
