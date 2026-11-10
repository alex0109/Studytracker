import { IconType } from "react-icons";
import {
  LuBookA,
  LuChartSpline,
  LuCircleHelp,
  LuFileText,
  LuGauge,
  LuLayers,
  LuNotebookPen,
  LuShieldCheck,
  LuBookMarked,
  LuFeather,
} from "react-icons/lu";

// Texts are translation keys under "landing.glossary.items.<key>"
export interface IGlossaryItem {
  key:
    | "material"
    | "note"
    | "question"
    | "dictionary"
    | "flashcard"
    | "selfDefending"
    | "score"
    | "statistics"
    | "tag"
    | "essay";
  icon: IconType;
}

export const glossary: IGlossaryItem[] = [
  {
    key: "material",
    icon: LuFileText,
  },
  {
    key: "note",
    icon: LuNotebookPen,
  },
  {
    key: "essay",
    icon: LuFeather,
  },
  {
    key: "question",
    icon: LuCircleHelp,
  },
  {
    key: "dictionary",
    icon: LuBookA,
  },
  {
    key: "flashcard",
    icon: LuLayers,
  },
  {
    key: "selfDefending",
    icon: LuShieldCheck,
  },
  {
    key: "score",
    icon: LuGauge,
  },
  {
    key: "statistics",
    icon: LuChartSpline,
  },
  {
    key: "tag",
    icon: LuBookMarked,
  },
];
