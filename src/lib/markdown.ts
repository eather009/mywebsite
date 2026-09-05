import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

const HTML_BLOCK_TAG =
  /<\/?(?:p|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|pre|code|blockquote|div|span|strong|em|b|i|a|br|hr|img|section|article|header|footer)\b/i;

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

/** Heuristic: pasted plain text that is HTML source (tags as text). */
export function looksLikeHtmlSource(text: string): boolean {
  const sample = text.trim();
  if (!sample || sample.length < 3 || !sample.includes("<")) return false;

  const tags = sample.match(/<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\/?>/g);
  if (!tags || tags.length < 1) return false;

  return HTML_BLOCK_TAG.test(sample);
}

/** Strip outer html/body wrappers from pasted HTML source. */
export function normalizePastedHtml(text: string): string {
  let html = text.trim();
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (body) html = body[1].trim();
  return html;
}

/** Convert Markdown → HTML (GFM: tables, strikethrough, etc.). */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown.trim(), { async: false });
  return typeof html === "string" ? html : String(html);
}
