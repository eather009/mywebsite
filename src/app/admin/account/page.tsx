import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { getSession } from "@/lib/auth";

export default async function AdminAccountPage() {
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
