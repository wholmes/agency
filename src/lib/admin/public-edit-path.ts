/**
 * Maps a public-site pathname to the best matching admin URL for editing.
 * Returns null when there is no dedicated editor (or unknown route).
 */
export function getAdminEditHref(pathname: string): string | null {
  const path = (pathname.split("?")[0] || "/").replace(/\/$/, "") || "/";

  if (path === "/") return "/admin";

  if (path === "/about") return "/admin/about";
  if (path === "/contact") return "/admin/contact";
  if (path === "/work") return "/admin/work";
  if (path === "/services") return "/admin/services";
  if (path === "/industries") return "/admin/industries";

  const workMatch = /^\/work\/([^/]+)$/.exec(path);
  if (workMatch) {
    return `/admin/projects/${encodeURIComponent(workMatch[1])}`;
  }

  const serviceMatch = /^\/services\/([^/]+)$/.exec(path);
  if (serviceMatch) {
    return `/admin/service-pages/${encodeURIComponent(serviceMatch[1])}`;
  }

  const industryMatch = /^\/industries\/([^/]+)$/.exec(path);
  if (industryMatch) {
    return `/admin/industries/${encodeURIComponent(industryMatch[1])}`;
  }

  return null;
}
