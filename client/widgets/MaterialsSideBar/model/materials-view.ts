import type { ReactNode } from "react";
import type { IMaterialResponse } from "@/entities/material";
import type { INoteResponse } from "@/entities/note";
import type { IDictionaryResponse } from "@/entities/dictionary";
import type { MaterialsSidebarSectionEnum } from "../lib/materials-sidebar-enum";

// What is open next to the list, for the page to show: the material itself, one of its notes or
// one of its dictionaries
export interface IMaterialsView {
  section: Exclude<MaterialsSidebarSectionEnum, MaterialsSidebarSectionEnum.Empty>;
  material: IMaterialResponse;
  note?: INoteResponse;
  dictionaryId?: string;
  openMaterial: (materialId: string) => void;
  openDictionary: (dictionary: IDictionaryResponse) => void;
}

export type RenderMaterialsView = (view: IMaterialsView) => ReactNode;
