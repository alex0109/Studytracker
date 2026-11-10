import { IconType } from "react-icons";
import {
  LuBookOpen,
  LuClipboardCheck,
  LuFeather,
  LuFileText,
  LuGraduationCap,
  LuHeadphones,
  LuLightbulb,
  LuMonitorPlay,
  LuNewspaper,
  LuNotebookPen,
  LuPencil,
  LuPenTool,
  LuPlay,
  LuScrollText,
} from "react-icons/lu";
import type { MaterialTypeEnum } from "@/entities/material";
import { NoteTypeEnum } from "@/entities/note";

export const MATERIAL_TYPE_ICONS: Record<`${MaterialTypeEnum}`, IconType> = {
  article: LuNewspaper,
  video: LuPlay,
  practice: LuPenTool,
  test: LuClipboardCheck,
  lecture: LuGraduationCap,
  book: LuBookOpen,
  course: LuMonitorPlay,
  podcast: LuHeadphones,
  document: LuFileText,
  topic: LuLightbulb,
};

export const NOTE_TYPE_ICONS: Partial<Record<NoteTypeEnum, IconType>> = {
  [NoteTypeEnum.text]: LuNotebookPen,
  [NoteTypeEnum.drawing]: LuPencil,
  [NoteTypeEnum.summary]: LuScrollText,
  [NoteTypeEnum.essay]: LuFeather,
};
