import { Node, RichTextDocument } from "@/shared/types";

// Same limits as the backend checks
export const ESSAY_MIN_WORDS = 30;
export const ESSAY_TASK_MAX_LENGTH = 2000;

export type EssayScoreLevel = "excellent" | "good" | "adequate" | "partial" | "weak";

// Bands of the 0-100 scale the check uses
export const essayScoreLevel = (score: number): EssayScoreLevel =>
  score >= 90
    ? "excellent"
    : score >= 75
      ? "good"
      : score >= 60
        ? "adequate"
        : score >= 40
          ? "partial"
          : "weak";

const INLINE_BREAKS = new Set(["hardBreak"]);

// Text of the document with blocks apart and inline pieces joined, as the backend reads it
const plainText = (node: Node): string => {
  if (node.text) return node.text;
  if (INLINE_BREAKS.has(node.type)) return " ";

  const inner = (node.content ?? []).map(plainText).join("");
  return node.type === "text" ? inner : ` ${inner} `;
};

// Runs of text with at least one letter or digit, like the backend's count
export const countDocumentWords = (document?: RichTextDocument): number => {
  if (!document?.content) return 0;

  return document.content
    .map(plainText)
    .join(" ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
};
