import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { getPostById } from "@/lib/blog-db";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <AdminShell title="Edit Post">
      <PostEditor
        postId={post.id}
        initial={{
          title: post.title,
          description: post.description,
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags,
          status: post.status,
          slug: post.slug,
        }}
      />
    </AdminShell>
  );
}
