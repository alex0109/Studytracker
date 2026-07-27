import { LuBrain, LuPlay, LuPlus } from "react-icons/lu";
import { questionInterfaceType } from "../model/question-interface.type";

export const questionInterface: questionInterfaceType[] = [
  { key: "open-modal", title: "Add Question", icon: <LuPlus /> },
  {
    key: "generate",
    title: "Generate it",
    icon: <LuBrain />,
    styles: "bg-violet-700 hover:bg-violet-800",
  },
  {
    key: "start",
    title: "Start Self Defending",
    icon: <LuPlay />,
    styles: "bg-emerald-600 hover:bg-emerald-700",
  },
];
