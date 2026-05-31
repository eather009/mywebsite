import slugify from "slugify";
import readingTime from "reading-time";
import { prisma } from "./prisma";
import { renderTipTapToHtml, extractPlainText } from "./tiptap";

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  readingTime: string;
};

export type BlogPostDetail = BlogPostListItem & {
  content: string;
  htmlContent: string;
  updatedAt: Date;
};

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

function toListItem(post: {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string;
  author: string;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
}): BlogPostListItem {
  const plain = extractPlainText(post.content);
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: parseTags(post.tags),
    author: post.author,
    coverImage: post.coverImage,
    status: post.status,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    readingTime: readingTime(plain).text,
  };
}

export async function getPublishedPosts(): Promise<BlogPostListItem[]> {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map(toListItem);
}

export async function getAllPostsAdmin(): Promise<BlogPostListItem[]> {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return posts.map(toListItem);
}

export async function getPostBySlug(slug: string, includeDraft = false) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return null;
  if (!includeDraft && post.status !== "published") return null;

  const item = toListItem(post);
  return {
    ...item,
    content: post.content,
    htmlContent: renderTipTapToHtml(post.content),
    updatedAt: post.updatedAt,
  } satisfies BlogPostDetail;
}

export async function getPostById(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return null;

  const item = toListItem(post);
  return {
    ...item,
    content: post.content,
    htmlContent: renderTipTapToHtml(post.content),
    updatedAt: post.updatedAt,
  } satisfies BlogPostDetail;
}

export async function getAllPublishedSlugs() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export function createSlug(title: string) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export async function ensureUniqueSlug(title: string, excludeId?: string) {
  let base = createSlug(title) || "untitled";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${counter++}`;
  }
}

export async function createBlogPost(data: {
  title: string;
  description: string;
  content: string;
  coverImage?: string | null;
  tags: string[];
  status: string;
  author: string;
}) {
  const slug = await ensureUniqueSlug(data.title);
  const publishedAt = data.status === "published" ? new Date() : null;

  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      coverImage: data.coverImage ?? null,
      tags: JSON.stringify(data.tags),
      status: data.status,
      author: data.author,
      publishedAt,
    },
  });
}

export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    description: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    status: string;
    slug?: string;
  }
) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return null;

  const slug = data.slug ?? (await ensureUniqueSlug(data.title, id));
  const publishedAt =
    data.status === "published"
      ? existing.publishedAt ?? new Date()
      : null;

  return prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      coverImage: data.coverImage ?? null,
      tags: JSON.stringify(data.tags),
      status: data.status,
      publishedAt,
    },
  });
}

export async function deleteBlogPost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}
