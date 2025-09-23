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

export interface Material {
  title: string;
  type?: "article" | "video" | "summary" | "practice" | "test";
  tag?: string;
  link?: string;
  status?: "tolearn" | "inprocess" | "finished";
  description: RichTextDocument;
}
