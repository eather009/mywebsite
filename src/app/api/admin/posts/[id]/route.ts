import { NextResponse } from "next/server";
import { getPostById, updateBlogPost, deleteBlogPost } from "@/lib/blog-db";
import { isValidTipTapContent } from "@/lib/tiptap";
import { revalidateBlogPaths } from "@/lib/revalidate-blog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.content || !isValidTipTapContent(body.content)) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const existing = await getPostById(id);

    const post = await updateBlogPost(id, {
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      content: body.content,
      coverImage: body.coverImage ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status === "published" ? "published" : "draft",
      slug: body.slug?.trim() || undefined,
    });

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateBlogPaths(existing?.slug);
    if (post.slug !== existing?.slug) {
      revalidateBlogPaths(post.slug);
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await getPostById(id);
    await deleteBlogPost(id);
    revalidateBlogPaths(existing?.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
