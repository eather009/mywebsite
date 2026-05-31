export type AvailabilityStatus = "open" | "selective" | "not_looking" | "hidden";

export const AVAILABILITY_PRESETS: Record<
  AvailabilityStatus,
  { label: string; description: string; tone: "success" | "info" | "neutral" | "hidden" }
> = {
  open: {
    label: "Open to opportunities",
    description: "Actively exploring senior engineering and leadership roles.",
    tone: "success",
  },
  selective: {
    label: "Selectively open",
    description: "Open to the right role — reach out with details.",
    tone: "info",
  },
  not_looking: {
    label: "Not currently looking",
    description: "Focused on current work. Networking welcome.",
    tone: "neutral",
  },
  hidden: {
    label: "Hidden",
    description: "Do not display availability on the site.",
    tone: "hidden",
  },
};

export type SiteSettingsData = {
  availabilityStatus: AvailabilityStatus;
  availabilityLabel: string;
  availabilityMessage: string | null;
};

export function parseAvailabilityStatus(value: string): AvailabilityStatus {
  if (value === "open" || value === "selective" || value === "not_looking" || value === "hidden") {
    return value;
  }
  return "open";
}
