import { IconType } from "react-icons";
import {
  LuClipboardCheck,
  LuFeather,
  LuFileText,
  LuNotebookPen,
  LuPencil,
  LuPenTool,
  LuPlay,
  LuScrollText,
} from "react-icons/lu";
import type { MaterialStatusEnum, MaterialTypeEnum } from "@/entities/material";
import { NoteTypeEnum } from "@/entities/note";

export const MATERIAL_TYPE_ICONS: Record<`${MaterialTypeEnum}`, IconType> = {
  article: LuFileText,
  video: LuPlay,
  practice: LuPenTool,
  test: LuClipboardCheck,
};

export const NOTE_TYPE_ICONS: Partial<Record<NoteTypeEnum, IconType>> = {
  [NoteTypeEnum.text]: LuNotebookPen,
  [NoteTypeEnum.drawing]: LuPencil,
  [NoteTypeEnum.summary]: LuScrollText,
  [NoteTypeEnum.essay]: LuFeather,
};

// A dot that says how far the material is, without reading a word
export const STATUS_DOTS: Record<`${MaterialStatusEnum}`, string> = {
  tolearn: "bg-neutral-400",
  inprocess: "bg-amber-500",
  finished: "bg-emerald-500",
};
