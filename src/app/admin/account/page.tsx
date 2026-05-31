import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { isStaticSite } from "@/lib/static-mode";

export default async function AdminAccountPage() {
  if (isStaticSite()) notFound();

  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  return (
    <AdminShell title="Account">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Signed in as</p>
        <p className="mt-1 font-medium text-slate-900">{session?.name}</p>
        <p className="text-sm text-slate-600">{session?.email}</p>
      </div>
      <ChangePasswordForm />
    </AdminShell>
  );
}
