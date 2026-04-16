import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Revalidate every 60 seconds — middleware caches this response at the edge.
export const revalidate = 60;

export type RedirectEntry = {
  source: string;
  destination: string;
  permanent: boolean;
};

export async function GET() {
  const rows = await prisma.redirect.findMany({
    where: { enabled: true },
    select: { source: true, destination: true, permanent: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    { redirects: rows as RedirectEntry[] },
    {
      headers: {
        // Shared cache: edge CDN caches for 60s; stale-while-revalidate for 30s on top.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    },
  );
}
