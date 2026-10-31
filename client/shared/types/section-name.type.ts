import { links } from "../config/data";
import type { switchInterfaceType } from "../ui/SwitchInterface/switch-interface.type";

export type NavSectionName = (typeof links)[number]["name"];
export type SwitchSectionName =
  | switchInterfaceType[][number]["name"]
  | undefined;
