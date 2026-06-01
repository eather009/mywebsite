import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";
import {
  AVAILABILITY_PRESETS,
  parseAvailabilityStatus,
  type SiteSettingsData,
} from "./site-settings";

export async function getSiteSettings(): Promise<SiteSettingsData> {
  noStore();
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 1,
        availabilityStatus: "open",
        availabilityLabel: AVAILABILITY_PRESETS.open.label,
        availabilityMessage: AVAILABILITY_PRESETS.open.description,
      },
    });
  }

  return {
    availabilityStatus: parseAvailabilityStatus(settings.availabilityStatus),
    availabilityLabel: settings.availabilityLabel,
    availabilityMessage: settings.availabilityMessage,
  };
}

export async function updateSiteSettings(data: {
  availabilityStatus: string;
  availabilityLabel: string;
  availabilityMessage?: string | null;
}) {
  const status = parseAvailabilityStatus(data.availabilityStatus);

  return prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      availabilityStatus: status,
      availabilityLabel: data.availabilityLabel,
      availabilityMessage: data.availabilityMessage ?? null,
    },
    update: {
      availabilityStatus: status,
      availabilityLabel: data.availabilityLabel,
      availabilityMessage: data.availabilityMessage ?? null,
    },
  });
}
