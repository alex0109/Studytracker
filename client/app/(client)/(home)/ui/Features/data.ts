import { FC } from "react";
import { IconType } from "react-icons";
import {
  LuCalendarClock,
  LuCalendarCheck,
  LuFeather,
  LuLanguages,
  LuLibrary,
  LuLink,
  LuShare2,
  LuSparkles,
} from "react-icons/lu";
import { EssayDemo } from "./demos/essay-demo";
import { TodayDemo } from "./demos/today-demo";
import { AiDemo } from "./demos/ai-demo";
import { LookupDemo } from "./demos/lookup-demo";
import { DeadlineDemo } from "./demos/deadline-demo";
import { LibraryDemo } from "./demos/library-demo";
import { ShareDemo } from "./demos/share-demo";
import { ImportDemo } from "./demos/import-demo";

export type FeatureId = "essay" | "today" | "ai" | "lookup" | "deadlines" | "library" | "import" | "share";

// Texts are translation keys under "landing.features.items.<id>"; span is the bento cell on wide screens
export interface IFeature {
  id: FeatureId;
  icon: IconType;
  tone: string;
  Demo: FC;
  span: string;
  isNew?: boolean;
  // A tall cell shows its demo right under the text instead of at the bottom
  demoAtTop?: boolean;
}

export const features: IFeature[] = [
  { id: "essay", icon: LuFeather, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", Demo: EssayDemo, span: "md:col-span-2 lg:col-span-4 lg:row-span-2", isNew: true, demoAtTop: true },
  { id: "today", icon: LuCalendarCheck, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", Demo: TodayDemo, span: "lg:col-span-2" },
  { id: "ai", icon: LuSparkles, tone: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300", Demo: AiDemo, span: "lg:col-span-2" },
  { id: "lookup", icon: LuLanguages, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300", Demo: LookupDemo, span: "lg:col-span-2" },
  { id: "deadlines", icon: LuCalendarClock, tone: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300", Demo: DeadlineDemo, span: "lg:col-span-2" },
  { id: "library", icon: LuLibrary, tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", Demo: LibraryDemo, span: "lg:col-span-2" },
  { id: "import", icon: LuLink, tone: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300", Demo: ImportDemo, span: "lg:col-span-3" },
  { id: "share", icon: LuShare2, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", Demo: ShareDemo, span: "md:col-span-2 lg:col-span-3" },
];
