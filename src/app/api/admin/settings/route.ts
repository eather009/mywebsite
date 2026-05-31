import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings-db";
import { AVAILABILITY_PRESETS, parseAvailabilityStatus } from "@/lib/site-settings";

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
      availabilityStatus: status,
      availabilityLabel: body.availabilityLabel?.trim() || preset.label,
      availabilityMessage:
        body.availabilityMessage?.trim() || preset.description || null,
    });

    return NextResponse.json({
      availabilityStatus: settings.availabilityStatus,
      availabilityLabel: settings.availabilityLabel,
      availabilityMessage: settings.availabilityMessage,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
