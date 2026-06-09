import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings-db";
import { AVAILABILITY_PRESETS, parseAvailabilityStatus } from "@/lib/site-settings";

function revalidateSitePaths() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const status = parseAvailabilityStatus(body.availabilityStatus ?? "open");
    const preset = AVAILABILITY_PRESETS[status];

    const settings = await updateSiteSettings({
      siteName: body.siteName,
      shortName: body.shortName,
      title: body.title,
      tagline: body.tagline,
      summary: body.summary,
      location: body.location,
      email: body.email,
      availabilityStatus: status,
      availabilityLabel: body.availabilityLabel?.trim() || preset.label,
      availabilityMessage:
        body.availabilityMessage?.trim() || preset.description || null,
    });

    revalidateSitePaths();

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
