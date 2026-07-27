export interface TextType {
  type: "bold" | "italic" | "underline" | "highlight" | "link";
  attrs?: Record<string, string | number>;
}

export interface Node {
  type: string;
  text?: string;
  marks?: TextType[];
  attrs?: Record<string, string | number | boolean>;
  content?: Node[];
}

export interface RichTextDocument {
  type: "doc";
  content: Node[];
}
