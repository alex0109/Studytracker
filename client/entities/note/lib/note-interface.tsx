import { LuBookCheck, LuNotebookPen, LuBookMarked } from "react-icons/lu";

import { NoteInterfaceEnum } from "./note-interface-enum";
import { switchInterfaceType } from "@/shared/ui/SwitchInterface/switch-interface.type";

export const noteInterface: switchInterfaceType[] = [
  { key: 943, name: NoteInterfaceEnum.Note, icon: <LuNotebookPen /> },
  { key: 142, name: NoteInterfaceEnum.Questions, icon: <LuBookCheck /> },
];
