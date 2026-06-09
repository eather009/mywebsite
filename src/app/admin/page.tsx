import Link from "next/link";
import { FileText, Plus, Settings } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isStaticSite } from "@/lib/static-mode";

export default async function AdminDashboardPage() {
  if (isStaticSite()) notFound();

  const { getAllPostsAdmin } = await import("@/lib/blog-db");
  const { getSiteSettings } = await import("@/lib/site-settings-db");
  const [posts, settings] = await Promise.all([
    getAllPostsAdmin(),
    getSiteSettings(),
  ]);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Published Posts</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{published}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Drafts</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{drafts}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Availability</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {settings.availabilityStatus === "hidden"
              ? "Hidden (not shown on site)"
              : settings.availabilityLabel}
          </p>
          <p className="mt-2 text-sm text-slate-500">{settings.title}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 transition hover:bg-blue-100"
        >
          <Plus className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Write New Post</p>
            <p className="text-sm text-blue-700">Create a blog article with rich editor</p>
          </div>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:bg-slate-50"
        >
          <Settings className="h-6 w-6 text-slate-600" />
          <div>
            <p className="font-semibold text-slate-900">Site Settings</p>
            <p className="text-sm text-slate-600">Configure job availability status</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{post.title}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {post.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
