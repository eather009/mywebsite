import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { isStaticSite } from "@/lib/static-mode";

export default function NewPostPage() {
  if (isStaticSite()) notFound();
  return (
    <AdminShell title="New Post">
      <PostEditor />
    </AdminShell>
  );
}
