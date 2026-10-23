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
  LuTag,
} from "react-icons/lu";

export interface IGlossaryItem {
  name: string;
  icon: IconType;
  text: string;
}

export const glossary: IGlossaryItem[] = [
  {
    name: "Material",
    icon: LuFileText,
    text: "Anything you study: an article, video, summary, practice or test. Has a status and tags.",
  },
  {
    name: "Note",
    icon: LuNotebookPen,
    text: "Your own text or drawing inside a material. Notes can have their own questions.",
  },
  {
    name: "Question",
    icon: LuCircleHelp,
    text: "Open, options with one or more right answers, or true/false. Easy, medium or hard.",
  },
  {
    name: "Dictionary",
    icon: LuBookA,
    text: "The words of a material with translation, transcription, examples and synonyms.",
  },
  {
    name: "Flashcard",
    icon: LuLayers,
    text: "A dictionary word in practice. Your answer decides when you see it again.",
  },
  {
    name: "Self defending",
    icon: LuShieldCheck,
    text: "A quiz over a material's questions, with your confidence recorded for every answer.",
  },
  {
    name: "Score",
    icon: LuGauge,
    text: "Weighted average of your answers, 0 to 100. Hard questions count three times.",
  },
  {
    name: "Statistics",
    icon: LuChartSpline,
    text: "Trend, streak, accuracy, confidence calibration and your weakest topics over time.",
  },
  {
    name: "Tag",
    icon: LuTag,
    text: "A label that groups materials and shows which topics need the most work.",
  },
];
