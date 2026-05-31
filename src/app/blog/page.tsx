import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Card, Badge } from "@/components/ui";
import { getPublishedPosts } from "@/lib/blog-db";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <PageLayout>
      <PageHero
        title="Blog"
        subtitle="Thoughts on engineering leadership, agile delivery, backend architecture, and building reliable software teams."
        label="blog/index.tsx"
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {posts.length === 0 ? (
            <p className="text-center text-[var(--port-muted)]">No posts yet. Check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="flex h-full flex-col hover:border-[var(--ide-accent)]">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt=""
                        className="mb-4 h-44 w-full rounded object-cover opacity-90"
                      />
                    )}
                    <time
                      dateTime={(post.publishedAt ?? post.createdAt).toISOString()}
                      className="text-xs text-[var(--ide-comment)]"
                    >
                      {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="mt-3 text-lg font-semibold text-[var(--port-fg)]">{post.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--port-muted)]">
                      {post.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--port-muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime}
                      </span>
                      <span className="flex items-center gap-1 text-[var(--ide-accent)]">
                        read() <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
