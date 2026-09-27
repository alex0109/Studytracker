import { RichTextDocument } from "@/shared/types";
import { IDrawingContent } from "./drawing-content.type";

export interface INoteUpdate {
  title?: string;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  order?: number;
}
