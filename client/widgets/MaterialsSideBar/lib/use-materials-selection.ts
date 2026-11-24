"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMaterialAll } from "@/entities/material";
import { IDictionaryResponse } from "@/entities/dictionary";
import { MaterialsSidebarSectionEnum } from "./materials-sidebar-enum";

type Selection = { material?: string; note?: string; dictionary?: string };

// What is open lives in the address: it survives a reload, Back works and it can be shared
export const useMaterialsSelection = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const materialId = searchParams.get("material") ?? undefined;
  const noteId = searchParams.get("note") ?? undefined;
  const dictionaryId = searchParams.get("dictionary") ?? undefined;
  const section = dictionaryId
    ? MaterialsSidebarSectionEnum.Dictionary
    : noteId
      ? MaterialsSidebarSectionEnum.Notes
      : materialId
        ? MaterialsSidebarSectionEnum.Main
        : MaterialsSidebarSectionEnum.Empty;

  const { materialsData, materialsIsPending } = useMaterialAll();

  // Ids, not copies: a copy taken at the click went stale after edits, so new subjects,
  // titles and statuses didn't show until the material was clicked again
  const material = materialsData?.find((item) => item.id === materialId);
  const note = material?.notes?.find((item) => item.id === noteId);

  // The material whose row is unfolded in the list
  const [openValue, setOpenValue] = useState(materialId);

  // Opened from the address or with Back: its row in the list opens too
  const [shownMaterialId, setShownMaterialId] = useState(materialId);
  if (materialId !== shownMaterialId) {
    setShownMaterialId(materialId);
    if (materialId) setOpenValue(materialId);
  }

  // pushState, not the router: it updates the search params without asking the server for the
  // page again, and every choice is one step of Back. Choosing what is already open adds no step
  const open = (next: Selection) => {
    const params = new URLSearchParams();
    if (next.material) params.set("material", next.material);
    if (next.note) params.set("note", next.note);
    if (next.dictionary) params.set("dictionary", next.dictionary);

    const query = params.toString();
    if (query === searchParams.toString()) return;
    window.history.pushState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  // A new material or one picked from a toast: it opens with its row unfolded
  const openMaterial = (id: string) => {
    open({ material: id });
    setOpenValue(id);
  };

  // From the "added to dictionary" toast or the list: the dictionary opens next to its material
  const openDictionary = (dictionary: IDictionaryResponse) => {
    open({ material: dictionary.materialId, dictionary: dictionary.id });
    setOpenValue(dictionary.materialId);
  };

  return {
    section,
    materials: materialsData,
    materialsIsPending,
    material,
    note,
    dictionaryId,
    openValue,
    setOpenValue,
    open,
    openMaterial,
    openDictionary,
  };
};
