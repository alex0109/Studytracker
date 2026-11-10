import { FC } from "react";
import { IconType } from "react-icons";
import {
  LuBookA,
  LuCalendarCheck,
  LuCalendarClock,
  LuChartSpline,
  LuCircleHelp,
  LuFeather,
  LuFileText,
  LuGauge,
  LuLanguages,
  LuLibrary,
  LuNotebookPen,
  LuShare2,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { MaterialDemo } from "../../(home)/ui/HowItWorks/demos/material-demo";
import { QuestionsDemo } from "../../(home)/ui/HowItWorks/demos/questions-demo";
import { DefendDemo } from "../../(home)/ui/HowItWorks/demos/defend-demo";
import { ScoreDemo } from "../../(home)/ui/HowItWorks/demos/score-demo";
import { StatisticsDemo } from "../../(home)/ui/HowItWorks/demos/statistics-demo";
import { FlashcardsDemo } from "../../(home)/ui/WordsThatStick/flashcards-demo";
import { EssayDemo } from "../../(home)/ui/Features/demos/essay-demo";
import { LookupDemo } from "../../(home)/ui/Features/demos/lookup-demo";
import { TodayDemo } from "../../(home)/ui/Features/demos/today-demo";
import { DeadlineDemo } from "../../(home)/ui/Features/demos/deadline-demo";
import { LibraryDemo } from "../../(home)/ui/Features/demos/library-demo";
import { ShareDemo } from "../../(home)/ui/Features/demos/share-demo";
import { AiDemo } from "../../(home)/ui/Features/demos/ai-demo";
import { NoteTypesDemo } from "./note-types-demo";

export type GuideChapterId = "basics" | "check" | "words" | "daily" | "together";

export type GuideSectionId =
  | "start"
  | "notes"
  | "essay"
  | "questions"
  | "defend"
  | "score"
  | "words"
  | "lookup"
  | "today"
  | "deadlines"
  | "statistics"
  | "library"
  | "share"
  | "ai";

// Texts are translation keys under "guide.sections.<id>"
export interface IGuideSection {
  id: GuideSectionId;
  chapter: GuideChapterId;
  icon: IconType;
  tone: string;
  Demo: FC;
}

const tones = {
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300",
};

export const guideSections: IGuideSection[] = [
  { id: "start", chapter: "basics", icon: LuFileText, tone: tones.sky, Demo: MaterialDemo },
  { id: "notes", chapter: "basics", icon: LuNotebookPen, tone: tones.amber, Demo: NoteTypesDemo },
  { id: "essay", chapter: "basics", icon: LuFeather, tone: tones.violet, Demo: EssayDemo },
  { id: "questions", chapter: "check", icon: LuCircleHelp, tone: tones.sky, Demo: QuestionsDemo },
  { id: "defend", chapter: "check", icon: LuShieldCheck, tone: tones.emerald, Demo: DefendDemo },
  { id: "score", chapter: "check", icon: LuGauge, tone: tones.amber, Demo: ScoreDemo },
  { id: "words", chapter: "words", icon: LuBookA, tone: tones.emerald, Demo: FlashcardsDemo },
  { id: "lookup", chapter: "words", icon: LuLanguages, tone: tones.sky, Demo: LookupDemo },
  { id: "today", chapter: "daily", icon: LuCalendarCheck, tone: tones.emerald, Demo: TodayDemo },
  { id: "deadlines", chapter: "daily", icon: LuCalendarClock, tone: tones.rose, Demo: DeadlineDemo },
  { id: "statistics", chapter: "daily", icon: LuChartSpline, tone: tones.indigo, Demo: StatisticsDemo },
  { id: "library", chapter: "together", icon: LuLibrary, tone: tones.amber, Demo: LibraryDemo },
  { id: "share", chapter: "together", icon: LuShare2, tone: tones.indigo, Demo: ShareDemo },
  { id: "ai", chapter: "together", icon: LuSparkles, tone: tones.fuchsia, Demo: AiDemo },
];

export const guideChapters: GuideChapterId[] = ["basics", "check", "words", "daily", "together"];

// Extra parts of the page that are not feature sections
export const GUIDE_EXTRA_IDS = ["hood", "tips", "faq"] as const;
