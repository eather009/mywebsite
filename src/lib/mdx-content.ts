import { markdownToTipTap, renderTipTapToHtml } from "./tiptap-render";

export { markdownToTipTap };

/** Markdown → HTML via TipTap schema (strips unsupported tags). */
export function markdownToHtml(markdown: string): string {
  return renderTipTapToHtml(markdownToTipTap(markdown));
}
