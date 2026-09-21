import { NoteTypeEnum } from "./note-type.type";

export interface INoteResponse {
  id: string;
  materialId: string;
  title: string;
  type: NoteTypeEnum;
  textContent?: string;
  drawingContent?: Object;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
