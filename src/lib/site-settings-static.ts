import { AVAILABILITY_PRESETS, type SiteSettingsData } from "./site-settings";

export function getSiteSettings(): SiteSettingsData {
  return {
    availabilityStatus: "open",
    availabilityLabel: AVAILABILITY_PRESETS.open.label,
    availabilityMessage: AVAILABILITY_PRESETS.open.description,
  };
}
