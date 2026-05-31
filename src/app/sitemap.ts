import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";
import { getAllPublishedSlugs } from "@/lib/blog-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs();
  const blogPosts = slugs.map((slug) => ({
    url: `${siteConfig.domain}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pages = ["", "/about", "/experience", "/projects", "/blog", "/contact"].map(
    (path) => ({
      url: `${siteConfig.domain}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  return [...pages, ...blogPosts];
}
