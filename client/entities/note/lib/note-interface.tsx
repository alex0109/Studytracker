import { LuBookCheck, LuNotebookPen } from "react-icons/lu";

import { NoteInterfaceEnum } from "./note-interface-enum";
import { switchInterfaceType } from "@/shared/ui/SwitchInterface";

export const noteInterface: switchInterfaceType[] = [
  { key: 943, name: NoteInterfaceEnum.Note, icon: <LuNotebookPen /> },
  { key: 142, name: NoteInterfaceEnum.Questions, icon: <LuBookCheck /> },
];
