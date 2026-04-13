import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin/session";

/** Call at the start of every admin server action. Redirects to login if not signed in. */
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }
}
