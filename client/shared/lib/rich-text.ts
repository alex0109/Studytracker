import type { Node, RichTextDocument } from "@/shared/types";

// The words of a document without its formatting
export const richTextToPlainText = (document?: RichTextDocument | null) => {
  const parts: string[] = [];

  const walk = (node: Node) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    // Blocks and line breaks must not glue the last word of one to the first of the next
    if (node.type !== "text") parts.push(" ");
  };
  document?.content?.forEach(walk);

  return parts.join("").replace(/\s+/g, " ").trim();
};

// For search snippets: cut on a word, not in the middle of one
export const excerpt = (text: string, max = 160) => {
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—–-]+$/, "")}…`;
};
