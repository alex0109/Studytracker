import { RichTextDocument } from "@/shared/types";
import { NoteTypeEnum } from "./note-type.type";
import { IDrawingContent } from "./drawing-content.type";
import { IEssayReview } from "./essay-review.type";

export interface INoteResponse {
  id: string;
  materialId: string;
  title: string;
  type: NoteTypeEnum;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  // Essays only
  essayTask?: string | null;
  essayReview?: IEssayReview | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
