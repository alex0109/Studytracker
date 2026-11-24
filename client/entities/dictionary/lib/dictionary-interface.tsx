import { LuBookA, LuLayers } from "react-icons/lu";

import { DictionaryInterfaceEnum } from "./dictionary-interface-enum";
import { switchInterfaceType } from "@/shared/ui/SwitchInterface";

export const dictionaryInterface: switchInterfaceType[] = [
  { key: 512, name: DictionaryInterfaceEnum.Words, icon: <LuBookA /> },
  // Where the words are actually learned: green, so it isn't missed next to the list
  { key: 278, name: DictionaryInterfaceEnum.Flashcards, icon: <LuLayers />, tone: "emerald" },
];
