/** Normalise user input to a project primary-key / URL segment (e.g. `meridian-saas`). */
export function normalizeProjectId(raw: string): string {
  return String(raw ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function isValidProjectIdSegment(id: string): boolean {
  return id.length > 0 && /^[a-z0-9-]+$/.test(id);
}
