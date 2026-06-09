import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";
import { siteConfig as defaults } from "./data";
import {
  AVAILABILITY_PRESETS,
  parseAvailabilityStatus,
  type SiteSettingsData,
} from "./site-settings";

function toSiteSettingsData(settings: {
  siteName: string | null;
  shortName: string | null;
  title: string | null;
  tagline: string | null;
  summary: string | null;
  location: string | null;
  email: string | null;
  availabilityStatus: string;
  availabilityLabel: string;
  availabilityMessage: string | null;
}): SiteSettingsData {
  return {
    siteName: settings.siteName?.trim() || defaults.name,
    shortName: settings.shortName?.trim() || defaults.shortName,
    title: settings.title?.trim() || defaults.title,
    tagline: settings.tagline?.trim() || defaults.tagline,
    summary: settings.summary?.trim() || defaults.summary,
    location: settings.location?.trim() || defaults.location,
    email: settings.email?.trim() || defaults.email,
    availabilityStatus: parseAvailabilityStatus(settings.availabilityStatus),
    availabilityLabel: settings.availabilityLabel,
    availabilityMessage: settings.availabilityMessage,
  };
}

const defaultCreateData = {
  id: 1,
  siteName: defaults.name,
  shortName: defaults.shortName,
  title: defaults.title,
  tagline: defaults.tagline,
  summary: defaults.summary,
  location: defaults.location,
  email: defaults.email,
  availabilityStatus: "open",
  availabilityLabel: AVAILABILITY_PRESETS.open.label,
  availabilityMessage: AVAILABILITY_PRESETS.open.description,
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  noStore();

  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: defaultCreateData,
    });
  }

  return toSiteSettingsData(settings);
}

export async function updateSiteSettings(data: {
  siteName?: string;
  shortName?: string;
  title?: string;
  tagline?: string;
  summary?: string;
  location?: string;
  email?: string;
  availabilityStatus: string;
  availabilityLabel: string;
  availabilityMessage?: string | null;
}) {
  const status = parseAvailabilityStatus(data.availabilityStatus);

  const record = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      ...defaultCreateData,
      siteName: data.siteName?.trim() || defaults.name,
      shortName: data.shortName?.trim() || defaults.shortName,
      title: data.title?.trim() || defaults.title,
      tagline: data.tagline?.trim() || defaults.tagline,
      summary: data.summary?.trim() || defaults.summary,
      location: data.location?.trim() || defaults.location,
      email: data.email?.trim() || defaults.email,
      availabilityStatus: status,
      availabilityLabel: data.availabilityLabel,
      availabilityMessage: data.availabilityMessage ?? null,
    },
    update: {
      siteName: data.siteName?.trim() || defaults.name,
      shortName: data.shortName?.trim() || defaults.shortName,
      title: data.title?.trim() || defaults.title,
      tagline: data.tagline?.trim() || defaults.tagline,
      summary: data.summary?.trim() || defaults.summary,
      location: data.location?.trim() || defaults.location,
      email: data.email?.trim() || defaults.email,
      availabilityStatus: status,
      availabilityLabel: data.availabilityLabel,
      availabilityMessage: data.availabilityMessage ?? null,
    },
  });

  return toSiteSettingsData(record);
}
