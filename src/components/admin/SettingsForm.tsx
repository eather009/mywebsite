"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import {
  AVAILABILITY_PRESETS,
  type AvailabilityStatus,
  type SiteSettingsData,
} from "@/lib/site-settings";

export function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initial.siteName);
  const [shortName, setShortName] = useState(initial.shortName);
  const [title, setTitle] = useState(initial.title);
  const [tagline, setTagline] = useState(initial.tagline);
  const [summary, setSummary] = useState(initial.summary);
  const [location, setLocation] = useState(initial.location);
  const [email, setEmail] = useState(initial.email);
  const [status, setStatus] = useState<AvailabilityStatus>(initial.availabilityStatus);
  const [label, setLabel] = useState(initial.availabilityLabel);
  const [message, setMessage] = useState(initial.availabilityMessage ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSiteName(initial.siteName);
    setShortName(initial.shortName);
    setTitle(initial.title);
    setTagline(initial.tagline);
    setSummary(initial.summary);
    setLocation(initial.location);
    setEmail(initial.email);
    setStatus(initial.availabilityStatus);
    setLabel(initial.availabilityLabel);
    setMessage(initial.availabilityMessage ?? "");
  }, [initial]);

  function applyPreset(next: AvailabilityStatus) {
    setStatus(next);
    setLabel(AVAILABILITY_PRESETS[next].label);
    setMessage(AVAILABILITY_PRESETS[next].description);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          shortName,
          title,
          tagline,
          summary,
          location,
          email,
          availabilityStatus: status,
          availabilityLabel: label,
          availabilityMessage: message,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Save failed (${response.status})`);
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile & Site Copy</h2>
        <p className="mt-1 text-sm text-slate-600">
          Update your name, title, and text shown on the homepage, about page, footer, and SEO metadata.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="shortName" className="block text-sm font-medium text-slate-700">
              Short Name
            </label>
            <input
              id="shortName"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Job Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Contact Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tagline" className="block text-sm font-medium text-slate-700">
              Tagline (short — header/footer)
            </label>
            <input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <p className="mt-1 text-xs text-slate-500">
              One short line. Do not paste the full Professional Summary here.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-slate-700">
              Professional Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <p className="mt-1 text-xs text-slate-500">
              Longer About / homepage intro text (shown under Professional Summary).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Job Availability</h2>
        <p className="mt-1 text-sm text-slate-600">
          Control how recruiters see your availability on the homepage and contact page.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(Object.keys(AVAILABILITY_PRESETS) as AvailabilityStatus[]).map((key) => {
            const preset = AVAILABILITY_PRESETS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-lg border p-4 text-left transition ${
                  status === key
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-900">{preset.label}</p>
                <p className="mt-1 text-xs text-slate-500">{preset.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-slate-700">
              Display Label
            </label>
            <input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">
              Custom Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
        {saved && <span className="text-sm text-green-600">Saved — changes are live immediately</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}
