export interface Node {
  type: string;
  text?: string;
  attrs?: Record<string, string | number>;
  content?: Node[];
}

export interface RichTextDocument {
  type: "doc";
  content: Node[];
}
