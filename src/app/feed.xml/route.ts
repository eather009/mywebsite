import { getPublishedPosts } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export async function GET() {
  const posts = await getPublishedPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} — Blog</title>
    <link>${siteConfig.domain}/blog</link>
    <description>${siteConfig.tagline}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.domain}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteConfig.domain}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.domain}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
