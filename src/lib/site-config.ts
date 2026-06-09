import { siteConfig as defaultSiteConfig } from "./data";
import { isStaticSite } from "./static-mode";
import type { SiteSettingsData } from "./site-settings";

export type PublicSiteConfig = typeof defaultSiteConfig;

function mergeSettings(settings: SiteSettingsData): PublicSiteConfig {
  return {
    ...defaultSiteConfig,
    name: settings.siteName,
    shortName: settings.shortName,
    title: settings.title,
    tagline: settings.tagline,
    summary: settings.summary,
    location: settings.location,
    email: settings.email,
  };
}

export async function getSiteConfig(): Promise<PublicSiteConfig> {
  if (isStaticSite()) {
    return defaultSiteConfig;
  }

  const { getSiteSettings } = await import("./site-settings-db");
  const settings = await getSiteSettings();
  return mergeSettings(settings);
}
