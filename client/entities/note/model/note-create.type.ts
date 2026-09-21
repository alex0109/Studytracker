import { NoteTypeEnum } from "./note-type.type";

export interface INoteCreate {
  title: string;
  type: NoteTypeEnum;
}
