import { LuBookCheck, LuNotebookPen, LuBookMarked } from "react-icons/lu";
import { materialInterfaceType } from "../model/material-interface.type";
import { MaterialInterfaceEnum } from "./material-interface-enum";

export const materialInterface: materialInterfaceType[] = [
  { key: 943, name: MaterialInterfaceEnum.Material, icon: <LuNotebookPen /> },
  { key: 142, name: MaterialInterfaceEnum.Questions, icon: <LuBookCheck /> },
  { key: 623, name: MaterialInterfaceEnum.Attempts, icon: <LuBookMarked /> },
];
