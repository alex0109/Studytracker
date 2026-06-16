import {
  LuBookCheck,
  LuNotebookPen,
  LuBrain,
  LuPlay,
  LuPlus,
} from "react-icons/lu";
import {
  questionInterfaceType,
  materialInterfaceType,
} from "../types/data.types";

export const materialInterface: materialInterfaceType[] = [
  { key: 943, name: "Materials", icon: <LuNotebookPen /> },
  { key: 142, name: "Questions", icon: <LuBookCheck /> },
];

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
