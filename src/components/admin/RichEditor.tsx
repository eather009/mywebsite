"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import { common, createLowlight } from "lowlight";
import { tableExtensions, developerSkillsTableNode } from "@/lib/tiptap-table";
import { looksLikeMarkdown, markdownToHtml } from "@/lib/markdown";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

const lowlight = createLowlight(common);

type RichEditorProps = {
  content: string;
  onChange: (json: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md p-2 transition ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const lastEmittedRef = useRef(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
        horizontalRule: {},
        code: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Tell your story..." }),
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "php" }),
      CharacterCount,
      ...tableExtensions,
    ],
    content: content ? JSON.parse(content) : undefined,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[420px] max-w-none px-6 py-5 focus:outline-none",
      },
      handlePaste(view, event) {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        // Prefer Markdown when plain text looks like MD (VS Code / Cursor often
        // also put a useless HTML wrapper on the clipboard).
        const text = clipboard.getData("text/plain");
        if (!text || !looksLikeMarkdown(text)) {
          return false;
        }

        const html = markdownToHtml(text);
        const dom = document.createElement("div");
        dom.innerHTML = html;
        const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(dom);

        view.dispatch(
          view.state.tr.replaceSelection(slice).scrollIntoView().setMeta("paste", true)
        );
        return true;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = JSON.stringify(ed.getJSON());
      lastEmittedRef.current = json;
      onChange(json);
    },
  });

  useEffect(() => {
    if (!editor || !content) return;
    // Only apply external content (initial load / reset), not our own onChange echoes.
    if (content === lastEmittedRef.current) return;
    lastEmittedRef.current = content;
    editor.commands.setContent(JSON.parse(content), { emitUpdate: false });
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } else {
        window.alert(data.error ?? "Image upload failed");
      }
    };
    input.click();
  }, [editor]);

  const clearFormat = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run();
  }, [editor]);

  const insertSkillsTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent(developerSkillsTableNode()).run();
  }, [editor]);

  if (!editor) return null;

  const iconClass = "h-4 w-4";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <UnderlineIcon className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
          <Highlighter className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <Code className={iconClass} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph">
          <Pilcrow className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className={iconClass} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <List className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          <ListOrdered className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
          <Quote className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <Code className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Insert empty table (2 columns)">
          <Table2 className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={insertSkillsTable} title="Insert skills transfer table">
          <Table2 className={`${iconClass} text-blue-600`} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link">
          <Link2 className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Image">
          <ImageIcon className={iconClass} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
          <AlignLeft className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
          <AlignCenter className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
          <AlignRight className={iconClass} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton onClick={clearFormat} title="Clear formatting">
          <Eraser className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className={iconClass} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className={iconClass} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
        {editor.storage.characterCount.characters()} characters ·{" "}
        {editor.storage.characterCount.words()} words
        <span className="ml-2 text-slate-400">· Paste Markdown to auto-format</span>
      </div>
    </div>
  );
}
