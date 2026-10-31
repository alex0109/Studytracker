import { RichTextDocument } from "@/shared/types";
import { NoteTypeEnum } from "./note-type.type";
import { IDrawingContent } from "./drawing-content.type";

export interface INoteResponse {
  id: string;
  materialId: string;
  title: string;
  type: NoteTypeEnum;
  textContent?: RichTextDocument;
  drawingContent?: IDrawingContent;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
