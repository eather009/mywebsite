import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/content";
import { isStaticSite } from "@/lib/static-mode";

export async function GET() {
  if (isStaticSite()) {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  }

  const { getSiteSettings: getDbSettings } = await import("@/lib/site-settings-db");
  const settings = await getDbSettings();
  return NextResponse.json(settings);
}
