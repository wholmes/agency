"use server";

import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { setAdminSessionCookie, isAdminPasswordConfigured } from "@/lib/admin/session";

function constantTimeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminPasswordConfigured()) {
    return { error: "Admin is not configured. Set ADMIN_PASSWORD (8+ characters) in .env." };
  }
  const password = formData.get("password");
  if (typeof password !== "string") {
    return { error: "Enter your password." };
  }
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!constantTimeEqualString(password, expected)) {
    return { error: "Invalid password." };
  }
  await setAdminSessionCookie();
  redirect("/admin");
}
