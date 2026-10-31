import { FC } from "react";
import { IconType } from "react-icons";
import {
  LuChartSpline,
  LuCircleHelp,
  LuFileText,
  LuGauge,
  LuShieldCheck,
} from "react-icons/lu";
import { MaterialDemo } from "./demos/material-demo";
import { QuestionsDemo } from "./demos/questions-demo";
import { DefendDemo } from "./demos/defend-demo";
import { ScoreDemo } from "./demos/score-demo";
import { StatisticsDemo } from "./demos/statistics-demo";

// Texts are translation keys under "landing.how.steps.<id>"
export interface IHowItWorksStep {
  id: "material" | "questions" | "defend" | "score" | "statistics";
  icon: IconType;
  Demo: FC;
}

export const howItWorksSteps: IHowItWorksStep[] = [
  {
    id: "material",
    icon: LuFileText,
    Demo: MaterialDemo,
  },
  {
    id: "questions",
    icon: LuCircleHelp,
    Demo: QuestionsDemo,
  },
  {
    id: "defend",
    icon: LuShieldCheck,
    Demo: DefendDemo,
  },
  {
    id: "score",
    icon: LuGauge,
    Demo: ScoreDemo,
  },
  {
    id: "statistics",
    icon: LuChartSpline,
    Demo: StatisticsDemo,
  },
];
