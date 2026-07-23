import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { tableExtensions } from "./tiptap-table";

const lowlight = createLowlight(common);

export const editorExtensions = [
  StarterKit.configure({
    codeBlock: false,
    heading: { levels: [1, 2, 3] },
    link: false,
    underline: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: "blog-link", rel: "noopener noreferrer" },
  }),
  Image.configure({
    HTMLAttributes: { class: "blog-image" },
  }),
  Underline,
  Highlight.configure({ multicolor: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: "php",
  }),
  ...tableExtensions,
];

export function emptyDocument() {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
}

export function isValidTipTapContent(content: string): boolean {
  try {
    const json = JSON.parse(content);
    return json?.type === "doc";
  } catch {
    return false;
  }
}
