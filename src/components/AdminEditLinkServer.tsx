import { isAdminSession } from "@/lib/admin/session";
import AdminEditLink from "./AdminEditLink";

export default async function AdminEditLinkServer() {
  const isAdmin = await isAdminSession();
  return <AdminEditLink isAdmin={isAdmin} />;
}
