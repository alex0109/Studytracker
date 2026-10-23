import { IconType } from "react-icons";
import { LuShieldCheck, LuRepeat, LuSprout } from "react-icons/lu";

export interface ILoopStep {
  verb: string;
  icon: IconType;
  text: string;
  entities: string[];
  styles: {
    icon: string;
    chip: string;
    glow: string;
  };
}

export const loopSteps: ILoopStep[] = [
  {
    verb: "Grow",
    icon: LuSprout,
    text: "Give everything you learn a place to live: an article, a lecture, a set of new words. Your knowledge base starts here.",
    entities: ["Materials", "Notes", "Dictionaries"],
    styles: {
      icon: "bg-emerald-600 text-white shadow-emerald-600/30",
      chip: "bg-emerald-50 text-emerald-700",
      glow: "from-emerald-200/60",
    },
  },
  {
    verb: "Reinforce",
    icon: LuRepeat,
    text: "Turn it into questions and flashcards. Pulling an answer out of memory makes it stronger than reading it again.",
    entities: ["Questions", "Flashcards"],
    styles: {
      icon: "bg-violet-600 text-white shadow-violet-600/30",
      chip: "bg-violet-50 text-violet-700",
      glow: "from-violet-200/60",
    },
  },
  {
    verb: "Strengthen",
    icon: LuShieldCheck,
    text: "Defend what you know, get an honest score and see which topics crack. Then go back and grow exactly those.",
    entities: ["Self defending", "Score", "Statistics"],
    styles: {
      icon: "bg-sky-600 text-white shadow-sky-600/30",
      chip: "bg-sky-50 text-sky-700",
      glow: "from-sky-200/60",
    },
  },
];
