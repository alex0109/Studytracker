import { materialInterface } from "@/app/(client)/materials/[materialId]/lib/data/data";
import { links } from "../data";

export type NavSectionName = (typeof links)[number]["name"];
export type MaterialSectionName = (typeof materialInterface)[number]["name"];
