import { Node, RichTextDocument } from "@/shared/types";

const nodeHasText = (node: Node): boolean =>
  !!node.text?.trim() || !!node.content?.some(nodeHasText);

// Empty paragraphs left by the editor do not count as content
export const hasTextContent = (document?: RichTextDocument): boolean =>
  !!document?.content?.some(nodeHasText);
