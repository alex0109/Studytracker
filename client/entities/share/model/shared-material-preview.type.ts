import type { MaterialTypeEnum } from "@/entities/material/model/material-type.type";

export interface ISharedMaterialPreview {
  token: string;
  title: string;
  type: MaterialTypeEnum;
  notesCount: number;
  questionsCount: number;
  dictionariesCount: number;
  wordsCount: number;
  // Filled only for signed in users
  isOwner: boolean;
  isAlreadyImported: boolean;
  sharedAt: Date;
}
