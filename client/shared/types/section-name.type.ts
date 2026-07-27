import { materialInterface } from "@/widgets/MaterialInterface";
import { links } from "../config/data";

export type NavSectionName = (typeof links)[number]["name"];
export type MaterialSectionName = (typeof materialInterface)[number]["name"];
