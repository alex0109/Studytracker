import { LuBookA, LuLayers } from "react-icons/lu";

import { DictionaryInterfaceEnum } from "./dictionary-interface-enum";
import { switchInterfaceType } from "@/shared/ui/SwitchInterface/switch-interface.type";

export const dictionaryInterface: switchInterfaceType[] = [
  { key: 512, name: DictionaryInterfaceEnum.Words, icon: <LuBookA /> },
  { key: 278, name: DictionaryInterfaceEnum.Flashcards, icon: <LuLayers /> },
];
