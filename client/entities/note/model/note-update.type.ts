import { RichTextDocument } from "@/shared/types";
import { IDrawingContent } from "./drawing-content.type";

export interface INoteUpdate {
  title?: string;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  // Essays only; an empty string removes the task
  essayTask?: string;
  // "Ielts/B2/Letter"; an empty string makes it a general essay
  essayFormat?: string;
  order?: number;
}
