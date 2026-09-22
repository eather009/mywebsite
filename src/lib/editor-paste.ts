import { looksLikeHtmlSource, looksLikeMarkdown, markdownToHtml, normalizePastedHtml } from "./markdown";

/** Google Docs / Gemini / Office-ish rich HTML worth keeping over plain text. */
export function hasUsefulRichHtml(html: string | undefined): boolean {
  if (!html?.trim()) return false;
  const sample = html.trim();

  if (
    /docs-internal-guid|google-docs|urn:schemas-microsoft-com|office:office|data-sheets/i.test(
      sample
    )
  ) {
    return true;
  }

  // Semantic structure beyond a single wrapper
  const blocks =
    sample.match(
      /<(p|h[1-6]|ul|ol|li|table|blockquote|pre|div|span|strong|b|em|i|a)\b/gi
    ) ?? [];
  return blocks.length >= 1 && /<(p|h[1-6]|ul|ol|li|table|blockquote|pre)\b/i.test(sample);
}

/**
 * Light sanitize for Docs/Gemini HTML so TipTap schema can parse it cleanly.
 * Strips style/class noise; maps b/i → strong/em.
 */
export function sanitizePastedHtml(html: string): string {
  const wrapped = `<div id="__paste_root">${normalizePastedHtml(html)}</div>`;
  const doc = new DOMParser().parseFromString(wrapped, "text/html");
  const root = doc.getElementById("__paste_root");
  if (!root) return html;

  const walk = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Drop meta / script / style
    if (["script", "style", "meta", "link", "xml"].includes(tag)) {
      el.remove();
      return;
    }

    // Map presentational tags
    if (tag === "b") {
      const strong = doc.createElement("strong");
      while (el.firstChild) strong.appendChild(el.firstChild);
      el.replaceWith(strong);
      walk(strong);
      return;
    }
    if (tag === "i") {
      const em = doc.createElement("em");
      while (el.firstChild) em.appendChild(el.firstChild);
      el.replaceWith(em);
      walk(em);
      return;
    }

    // Strip noisy attributes
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      if (
        name === "style" ||
        name === "class" ||
        name === "id" ||
        name === "dir" ||
        name.startsWith("data-") ||
        name.startsWith("aria-") ||
        name.startsWith("xmlns")
      ) {
        // Keep href/src/alt/title
        if (name === "href" || name === "src" || name === "alt" || name === "title") continue;
        el.removeAttribute(attr.name);
      }
    }

    // Keep href/src only on anchors/images
    if (tag !== "a") el.removeAttribute("href");
    if (tag !== "img") {
      el.removeAttribute("src");
      el.removeAttribute("alt");
    }

    [...el.childNodes].forEach(walk);
  };

  [...root.childNodes].forEach(walk);

  // Remove empty spans left by Docs
  root.querySelectorAll("span").forEach((span) => {
    if (!span.textContent?.trim() && span.children.length === 0) {
      span.remove();
      return;
    }
    // Unwrap span with only text/inline children
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    span.remove();
  });

  return root.innerHTML;
}

export type PasteResolution =
  | { kind: "html"; html: string }
  | { kind: "skip" };

/**
 * Decide what to insert for a paste event.
 * Prefer rich HTML (Docs/Gemini HTML) over plain Markdown heuristics,
 * unless HTML is only a wrapper around Markdown syntax (common from Gemini).
 */
export function resolvePasteContent(clipboard: DataTransfer): PasteResolution {
  const richHtml = clipboard.getData("text/html");
  const plain = clipboard.getData("text/plain");

  if (hasUsefulRichHtml(richHtml)) {
    const hasSemanticBlocks = /<(h[1-6]|ul|ol|table|blockquote|pre)\b/i.test(richHtml);
    const markdownWrappedInHtml =
      !!plain &&
      looksLikeMarkdown(plain) &&
      !hasSemanticBlocks &&
      !/docs-internal-guid|google-docs|urn:schemas-microsoft-com/i.test(richHtml);

    if (markdownWrappedInHtml) {
      return { kind: "html", html: markdownToHtml(plain) };
    }

    return { kind: "html", html: sanitizePastedHtml(richHtml) };
  }

  if (plain) {
    if (looksLikeMarkdown(plain)) {
      return { kind: "html", html: markdownToHtml(plain) };
    }
    if (looksLikeHtmlSource(plain)) {
      return { kind: "html", html: sanitizePastedHtml(normalizePastedHtml(plain)) };
    }
  }

  return { kind: "skip" };
}
