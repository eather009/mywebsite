"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, Trash2 } from "lucide-react";
import { RichEditor } from "./RichEditor";
import { emptyDocument } from "@/lib/tiptap";

type PostEditorProps = {
  postId?: string;
  initial?: {
    title: string;
    description: string;
    content: string;
    coverImage: string | null;
    tags: string[];
    status: string;
    slug: string;
  };
};

export function PostEditor({ postId, initial }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.content ?? emptyDocument());
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(", ") ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      title,
      description,
      content,
      coverImage: coverImage || null,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      status: publish ? "published" : status,
    };

    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/posts/${data.id}/edit`);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!postId || !confirm("Delete this post permanently?")) return;
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) setCoverImage(data.url);
    else setError(data.error ?? "Cover image upload failed");
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full border-0 text-3xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description for SEO and previews..."
          rows={2}
          className="mt-3 w-full resize-none border-0 text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
      </div>

      <RichEditor content={content} onChange={setContent} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">
              Cover Image (showcase)
            </label>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="mt-3 max-h-48 rounded-lg object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={uploadCover}
              className="mt-3 block w-full text-sm text-slate-600"
            />
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <label className="mt-4 block text-sm font-medium text-slate-700">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Engineering, Leadership"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Publish
              </button>
              {postId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {postId && initial?.slug && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <p className="font-medium text-slate-700">Preview</p>
              <Link
                href={`/blog/${initial.slug}`}
                target="_blank"
                className="mt-2 block text-blue-600 hover:underline"
              >
                /blog/{initial.slug}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
