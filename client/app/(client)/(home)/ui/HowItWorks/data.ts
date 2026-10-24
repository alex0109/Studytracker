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

export interface IHowItWorksStep {
  id: string;
  label: string;
  icon: IconType;
  title: string;
  text: string;
  Demo: FC;
}

export const howItWorksSteps: IHowItWorksStep[] = [
  {
    id: "material",
    label: "Add a material",
    icon: LuFileText,
    title: "Everything starts with a material",
    text: "An article, a video, a practice task or a test. Give it a status and tags, then attach notes, questions and a dictionary to it.",
    Demo: MaterialDemo,
  },
  {
    id: "questions",
    label: "Create questions",
    icon: LuCircleHelp,
    title: "Turn it into questions",
    text: "Write questions in your own words and pick a difficulty. Three types cover most of what you need to check:",
    Demo: QuestionsDemo,
  },
  {
    id: "defend",
    label: "Self defending",
    icon: LuShieldCheck,
    title: "Defend what you know",
    text: "Self defending is a quiz over a material's questions. They come in random order, and with every answer you say how sure you are. Try it:",
    Demo: DefendDemo,
  },
  {
    id: "score",
    label: "Get a score",
    icon: LuGauge,
    title: "A score that is honest",
    text: "Every answer gets 0 to 100. Open answers are checked by exact match first, then by fuzzy match, so a typo does not cost you. The attempt score is a weighted average where hard questions count three times.",
    Demo: ScoreDemo,
  },
  {
    id: "statistics",
    label: "Watch it grow",
    icon: LuChartSpline,
    title: "See what is getting stronger",
    text: "Statistics follow you over time: score trend, study streak, accuracy by difficulty, how well your confidence matches reality and which tags are your weakest.",
    Demo: StatisticsDemo,
  },
];
