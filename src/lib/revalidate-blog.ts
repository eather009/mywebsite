import { revalidatePath } from "next/cache";

export function revalidateBlogPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
}
