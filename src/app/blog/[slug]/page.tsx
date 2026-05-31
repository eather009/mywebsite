import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { Badge } from "@/components/ui";
import { BlogContent, BlogCover } from "@/components/BlogContent";
import { getAllPublishedSlugs, getPostBySlug } from "@/lib/blog-db";
import { siteConfig } from "@/lib/data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const url = `${siteConfig.domain}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      url,
      siteName: siteConfig.name,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const shareUrl = `${siteConfig.domain}/blog/${slug}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <PageLayout>
      <article className="border-b border-[var(--php-border)] bg-[var(--php-surface)]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--php-muted)] hover:text-[var(--php-keyword)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--port-fg)] md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[var(--port-muted)]">{post.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--port-muted)]">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
                {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>
          </header>

          {post.coverImage && (
            <div className="mt-10">
              <BlogCover src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div className="mt-10 border-t border-[var(--port-border)] pt-10">
            <BlogContent html={post.htmlContent} />
          </div>

          <footer className="mt-12 border-t border-[var(--port-border)] pt-8">
            <p className="text-sm font-medium text-[var(--port-muted)]">Share this article</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={linkedInShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                <LinkedInIcon className="h-4 w-4" />
                Share on LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-[var(--port-border)] bg-[var(--ide-panel)] px-4 py-2 text-sm font-medium text-[var(--port-fg)] transition hover:border-[var(--ide-accent)]"
              >
                <Share2 className="h-4 w-4" />
                Share on X
              </a>
            </div>
          </footer>
        </div>
      </article>
    </PageLayout>
  );
}
