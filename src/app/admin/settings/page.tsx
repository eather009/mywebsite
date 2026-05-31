import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/site-settings-db";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell title="Site Settings">
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
