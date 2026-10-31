import { IconType } from "react-icons";
import { LuShieldCheck, LuRepeat, LuSprout } from "react-icons/lu";

// Texts are translation keys under "landing.loop.steps.<key>"
export interface ILoopStep {
  key: "grow" | "reinforce" | "strengthen";
  icon: IconType;
  entities: ("materials" | "notes" | "dictionaries" | "questions" | "flashcards" | "selfDefending" | "score" | "statistics")[];
  styles: {
    icon: string;
    chip: string;
    glow: string;
  };
}

export const loopSteps: ILoopStep[] = [
  {
    key: "grow",
    icon: LuSprout,
    entities: ["materials", "notes", "dictionaries"],
    styles: {
      icon: "bg-emerald-600 text-white shadow-emerald-600/30",
      chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
      glow: "from-emerald-200/60 dark:from-emerald-900/40",
    },
  },
  {
    key: "reinforce",
    icon: LuRepeat,
    entities: ["questions", "flashcards"],
    styles: {
      icon: "bg-violet-600 text-white shadow-violet-600/30",
      chip: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
      glow: "from-violet-200/60 dark:from-violet-900/40",
    },
  },
  {
    key: "strengthen",
    icon: LuShieldCheck,
    entities: ["selfDefending", "score", "statistics"],
    styles: {
      icon: "bg-sky-600 text-white shadow-sky-600/30",
      chip: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
      glow: "from-sky-200/60 dark:from-sky-900/40",
    },
  },
];
