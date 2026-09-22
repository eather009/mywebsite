import { generateHTML, generateJSON } from "@tiptap/html/server";
import { markdownToHtml } from "./markdown";
import { editorExtensions } from "./tiptap";

/** TipTap JSON string from Markdown (Node / server only). */
export function markdownToTipTap(markdown: string): string {
  const html = markdownToHtml(markdown);
  if (!html.trim()) {
    return JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] });
  }
  return JSON.stringify(generateJSON(html, editorExtensions));
}

export function renderTipTapToHtml(content: string): string {
  try {
    const json = JSON.parse(content);
    if (!json || typeof json !== "object") return "";
    return cleanupRenderedHtml(generateHTML(json, editorExtensions));
  } catch {
    return `<p>${escapeHtml(content)}</p>`;
  }
}

/** Remove empty headings left over from incomplete Markdown paste. */
function cleanupRenderedHtml(html: string): string {
  return html
    .replace(/<h([1-6])(?:\s[^>]*)?>\s*(?:&nbsp;|\u00a0|\s)*<\/h\1>/gi, "")
    .replace(/\n{3,}/g, "\n\n");
}

export function extractPlainText(content: string): string {
  const html = renderTipTapToHtml(content);
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
