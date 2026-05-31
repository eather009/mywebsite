import { AVAILABILITY_PRESETS, type SiteSettingsData } from "@/lib/site-settings";

export function AvailabilityBadge({ settings }: { settings: SiteSettingsData }) {
  if (settings.availabilityStatus === "hidden") return null;

  const tone = AVAILABILITY_PRESETS[settings.availabilityStatus].tone;
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
    neutral: "bg-[var(--ide-panel)] text-[var(--ide-muted)] ring-[var(--ide-border)]",
    hidden: "",
  }[tone];

  const dotColor = {
    success: "bg-emerald-500",
    info: "bg-sky-500",
    neutral: "bg-[var(--ide-muted)]",
    hidden: "",
  }[tone];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${styles}`}
      role="status"
    >
      <span className="relative flex h-2 w-2">
        {settings.availabilityStatus === "open" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
      </span>
      <span className="syntax-comment">status:</span> {settings.availabilityLabel}
    </div>
  );
}

export function AvailabilityMessage({ settings }: { settings: SiteSettingsData }) {
  if (settings.availabilityStatus === "hidden" || !settings.availabilityMessage) {
    return null;
  }

  return (
    <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
      <span className="syntax-comment">// </span>
      {settings.availabilityMessage}
    </p>
  );
}
