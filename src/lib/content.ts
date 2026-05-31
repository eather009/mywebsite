import { isStaticSite } from "./static-mode";
import type { BlogPostDetail, BlogPostListItem } from "./blog-db";
import type { SiteSettingsData } from "./site-settings";

export async function getPublishedPosts(): Promise<BlogPostListItem[]> {
  if (isStaticSite()) {
    const { getPublishedPosts } = await import("./blog-static");
    return getPublishedPosts();
  }
  const { getPublishedPosts } = await import("./blog-db");
  return getPublishedPosts();
}

export async function getPostBySlug(
  slug: string,
  includeDraft = false
): Promise<BlogPostDetail | null> {
  if (isStaticSite()) {
    const { getPostBySlug } = await import("./blog-static");
    return getPostBySlug(slug);
  }
  const { getPostBySlug } = await import("./blog-db");
  return getPostBySlug(slug, includeDraft);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (isStaticSite()) {
    const { getAllPublishedSlugs } = await import("./blog-static");
    return getAllPublishedSlugs();
  }
  const { getAllPublishedSlugs } = await import("./blog-db");
  return getAllPublishedSlugs();
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  if (isStaticSite()) {
    const { getSiteSettings } = await import("./site-settings-static");
    return getSiteSettings();
  }
  const { getSiteSettings } = await import("./site-settings-db");
  return getSiteSettings();
}
