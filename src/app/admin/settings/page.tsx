import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { isStaticSite } from "@/lib/static-mode";

export default async function AdminSettingsPage() {
  if (isStaticSite()) notFound();

  const { getSiteSettings } = await import("@/lib/site-settings-db");
  const settings = await getSiteSettings();

  return (
    <AdminShell title="Site Settings">
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
