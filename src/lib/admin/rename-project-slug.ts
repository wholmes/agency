"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { isValidProjectIdSegment, normalizeProjectId } from "@/lib/admin/project-id";

export type RenameProjectSlugState = { error?: string } | null;

/**
 * Change a case study’s primary key / URL segment (`/work/[id]`). Optionally insert or update
 * a permanent redirect from the old path so external links keep working.
 */
export async function renameProjectSlug(
  _prev: RenameProjectSlugState,
  formData: FormData,
): Promise<RenameProjectSlugState> {
  await requireAdminSession();

  const currentId = String(formData.get("currentId") ?? "").trim();
  const newId = normalizeProjectId(String(formData.get("newId") ?? ""));
  const addRedirect = formData.get("addRedirect") === "on";

  if (!currentId) return { error: "Missing current project id." };
  if (!newId) return { error: "New URL slug is required." };
  if (!isValidProjectIdSegment(newId)) {
    return { error: "The slug may only contain lowercase letters, numbers, and hyphens." };
  }
  if (newId === currentId) return { error: "New slug is the same as the current one." };

  const existing = await prisma.project.findUnique({ where: { id: currentId } });
  if (!existing) return { error: "This project was not found." };

  const taken = await prisma.project.findUnique({ where: { id: newId } });
  if (taken) return { error: `A case study with slug "${newId}" already exists.` };

  const oldPath = `/work/${currentId}`;
  const newPath = `/work/${newId}`;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.project.update({ where: { id: currentId }, data: { id: newId } });

      if (addRedirect) {
        const prior = await tx.redirect.findUnique({ where: { source: oldPath } });
        if (prior) {
          await tx.redirect.update({
            where: { id: prior.id },
            data: {
              destination: newPath,
              permanent: true,
              enabled: true,
              note: prior.note.trim() ? prior.note : "Case study URL change",
            },
          });
        } else {
          await tx.redirect.create({
            data: {
              source: oldPath,
              destination: newPath,
              permanent: true,
              enabled: true,
              note: "Case study URL change",
            },
          });
        }
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update the URL.";
    return { error: message };
  }

  revalidatePath("/work");
  revalidatePath(oldPath);
  revalidatePath(newPath);
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/api/redirects");
  revalidatePath("/admin/redirects");

  redirect(`/admin/projects/${newId}`);
}
