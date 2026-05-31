import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isStaticSite } from "@/lib/static-mode";

export default async function AdminPostsPage() {
  if (isStaticSite()) notFound();

  const { getAllPostsAdmin } = await import("@/lib/blog-db");
  const posts = await getAllPostsAdmin();

  return (
    <AdminShell title="Blog Posts">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 font-medium text-slate-700">Title</th>
              <th className="px-5 py-3 font-medium text-slate-700">Status</th>
              <th className="px-5 py-3 font-medium text-slate-700">Date</th>
              <th className="px-5 py-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{post.title}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {(post.publishedAt ?? post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  {post.status === "published" && (
                    <>
                      {" · "}
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-slate-500 hover:underline"
                      >
                        View
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
