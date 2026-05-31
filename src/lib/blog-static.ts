import { getAllPosts, getPostBySlug as getMdxPost, getAllSlugs } from "./blog";
import { markdownToHtml } from "./mdx-content";
import type { BlogPostDetail, BlogPostListItem } from "./blog-db";

function toListItem(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: string;
}): BlogPostListItem {
  const publishedAt = new Date(post.date);
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    author: post.author,
    coverImage: null,
    status: "published",
    publishedAt,
    createdAt: publishedAt,
    readingTime: post.readingTime,
  };
}

export function getPublishedPosts(): BlogPostListItem[] {
  return getAllPosts().map(toListItem);
}

export function getPostBySlug(slug: string): BlogPostDetail | null {
  const post = getMdxPost(slug);
  if (!post) return null;

  const item = toListItem(post);
  const htmlContent = markdownToHtml(post.content);

  return {
    ...item,
    content: post.content,
    htmlContent,
    updatedAt: new Date(post.date),
  };
}

export function getAllPublishedSlugs(): string[] {
  return getAllSlugs();
}
