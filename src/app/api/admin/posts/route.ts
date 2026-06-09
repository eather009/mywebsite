import { NextResponse } from "next/server";
import {
  getAllPostsAdmin,
  createBlogPost,
} from "@/lib/blog-db";
import { isValidTipTapContent } from "@/lib/tiptap";
import { getSession } from "@/lib/auth";
import { revalidateBlogPaths } from "@/lib/revalidate-blog";

export async function GET() {
  const posts = await getAllPostsAdmin();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }
    if (!body.content || !isValidTipTapContent(body.content)) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const post = await createBlogPost({
      title: body.title.trim(),
      description: body.description.trim(),
      content: body.content,
      coverImage: body.coverImage ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status === "published" ? "published" : "draft",
      author: session?.name ?? "Iftekhar Ahmed Eather",
    });

    if (post.status === "published") {
      revalidateBlogPaths(post.slug);
    }

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
