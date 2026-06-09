import { siteConfig as defaults } from "./data";
import { AVAILABILITY_PRESETS, type SiteSettingsData } from "./site-settings";

export function getSiteSettings(): SiteSettingsData {
  return {
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
}
