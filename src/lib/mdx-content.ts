import { renderTipTapToHtml } from "./tiptap";

function markdownToTipTap(markdown: string) {
  const lines = markdown.trim().split("\n");
  const content: object[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      content.push({
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: trimmed.slice(3) }],
      });
    } else if (trimmed.startsWith("### ")) {
      content.push({
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: trimmed.slice(4) }],
      });
    } else if (trimmed.startsWith("- ")) {
      content.push({
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: trimmed.slice(2) }],
              },
            ],
          },
        ],
      });
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      content.push({
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: trimmed.slice(2, -2),
          },
        ],
      });
    } else {
      content.push({
        type: "paragraph",
        content: [{ type: "text", text: trimmed }],
      });
    }
  }

  return JSON.stringify({ type: "doc", content });
}

export function markdownToHtml(markdown: string): string {
  return renderTipTapToHtml(markdownToTipTap(markdown));
}
