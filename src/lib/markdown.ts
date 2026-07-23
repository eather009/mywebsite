import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

/** Heuristic: pasted plain text that should be parsed as Markdown. */
export function looksLikeMarkdown(text: string): boolean {
  const sample = text.trim();
  if (!sample || sample.length < 2) return false;

  return (
    /^#{1,6}\s/m.test(sample) ||
    /^[-*+]\s+\S/m.test(sample) ||
    /^\d+\.\s+\S/m.test(sample) ||
    /\*\*[^*]+\*\*/.test(sample) ||
    /__[^_]+__/.test(sample) ||
    /\[[^\]]+\]\([^)]+\)/.test(sample) ||
    /^```/m.test(sample) ||
    /^>/m.test(sample) ||
    /^\|.+\|/m.test(sample) ||
    /^---+$/m.test(sample)
  );
}

/** Convert Markdown → HTML (GFM: tables, strikethrough, etc.). */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown.trim(), { async: false });
  return typeof html === "string" ? html : String(html);
}
