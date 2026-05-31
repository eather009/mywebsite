import { siteConfig } from "@/lib/data";

export function BlogContent({ html }: { html: string }) {
  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlogCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded border border-[var(--port-border)] bg-[var(--ide-panel)]">
      <img src={src} alt={alt} className="w-full object-cover" />
    </div>
  );
}
