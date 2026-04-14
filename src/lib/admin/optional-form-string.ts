/** Trimmed empty string → null for optional Prisma string fields from FormData. */
export function optionalFormString(formData: FormData, key: string): string | null {
  const s = String(formData.get(key) ?? "").trim();
  return s === "" ? null : s;
}
