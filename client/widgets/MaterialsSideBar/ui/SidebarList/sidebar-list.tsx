"use client";

import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { LayoutGroup } from "framer-motion";
import { LuFolderPlus, LuSearch, LuSearchX, LuX } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/shared/i18n";
import { IMaterialResponse } from "@/entities/material";
import { IDictionaryResponse } from "@/entities/dictionary";
import { ITagResponse } from "@/entities/tag";
import { AddMaterialModal } from "@/features/material/create-material";
import { filterSidebarMaterials } from "../../lib/filter-sidebar-materials";
import { MaterialRow } from "../MaterialRow/material-row";

interface SidebarListProps {
  materials?: IMaterialResponse[];
  isPending: boolean;
  openValue?: string;
  onOpenValueChange: (value: string | undefined) => void;
  activeMaterialId?: string;
  activeNoteId?: string;
  activeDictionaryId?: string;
  onOpenMaterial: (materialId: string) => void;
  onOpenNote: (materialId: string, noteId: string) => void;
  onOpenDictionary: (dictionary: IDictionaryResponse) => void;
  onCreated: (materialId: string) => void;
  // Extra buttons next to "add", like folding the list
  headerActions?: ReactNode;
  // "/" focuses the search; only one list on the page should listen
  listenForShortcut?: boolean;
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export const SidebarList: FC<SidebarListProps> = ({
  materials,
  isPending,
  openValue,
  onOpenValueChange,
  activeMaterialId,
  activeNoteId,
  activeDictionaryId,
  onOpenMaterial,
  onOpenNote,
  onOpenDictionary,
  onCreated,
  headerActions,
  listenForShortcut = false,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Only subjects some material has: an unused one would filter to nothing
  const subjects = useMemo(() => {
    const byId = new Map<string, ITagResponse>();
    materials?.forEach((material) => material.materialTags?.forEach((tag) => byId.set(tag.id, tag)));
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [materials]);

  // A subject that was removed from every material stops filtering
  const activeSubjectId = subjectId && subjects.some((x) => x.id === subjectId) ? subjectId : null;

  const visible = useMemo(
    () => (materials ? filterSidebarMaterials(materials, query, activeSubjectId) : []),
    [materials, query, activeSubjectId],
  );
  useEffect(() => {
    if (!listenForShortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [listenForShortcut]);

  const clearFilters = () => {
    setQuery("");
    setSubjectId(null);
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="flex items-center gap-2 text-base! font-semibold! text-neutral-900 dark:text-neutral-50">
          {t("nav.materials")}
          {materials && materials.length > 0 && (
            <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-xs font-medium tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {materials.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1">
          {headerActions}
          <AddMaterialModal variant="icon" onCreated={onCreated} />
        </div>
      </div>

      {materials && materials.length > 0 && (
        <>
          <div className="relative">
            <LuSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder={t("materials.sidebar.search")}
              aria-label={t("materials.sidebar.search")}
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-9 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/50 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("materials.sidebar.clearSearch")}
                className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <LuX />
              </button>
            ) : (
              listenForShortcut && (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-neutral-200 px-1.5 font-mono text-[11px] text-neutral-400 lg:block dark:border-neutral-700">
                  /
                </kbd>
              )
            )}
          </div>

          {subjects.length > 0 && (
            <div
              role="group"
              aria-label={t("materials.sidebar.subjectsFilter")}
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...subjects].map((subject) => {
                const isSelected = (subject?.id ?? null) === activeSubjectId;

                return (
                  <button
                    key={subject?.id ?? "all"}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSubjectId(subject && !isSelected ? subject.id : null)}
                    className={cn(
                      "flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-600",
                    )}
                  >
                    {subject && (
                      <span className="size-2 rounded-full" style={{ backgroundColor: subject.color }} aria-hidden />
                    )}
                    {subject ? subject.name : t("materials.sidebar.allSubjects")}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {isPending && (
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-2.5 px-2 py-2">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {materials && materials.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-300 p-5 text-center dark:border-neutral-700">
          <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            <LuFolderPlus aria-hidden />
          </span>
          <p className="font-medium text-neutral-800 dark:text-neutral-100">{t("materials.sidebar.emptyTitle")}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("materials.sidebar.emptyText")}</p>
          <div className="mt-1 w-full">
            <AddMaterialModal onCreated={onCreated} />
          </div>
        </div>
      )}

      {materials && materials.length > 0 && visible.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl p-5 text-center">
          <LuSearchX aria-hidden className="size-6 text-neutral-400" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{t("materials.sidebar.noResults")}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline dark:hover:text-white"
          >
            {t("materials.sidebar.clearFilters")}
          </button>
        </div>
      )}

      {visible.length > 0 && (
        <LayoutGroup id="materials-sidebar">
          <Accordion.Root
            type="single"
            collapsible
            value={openValue ?? ""}
            onValueChange={(value) => onOpenValueChange(value || undefined)}
            className="flex flex-col gap-0.5"
          >
            {visible.map((material) => (
              <MaterialRow
                key={material.id}
                material={material}
                isOpen={openValue === material.id}
                isActive={material.id === activeMaterialId && !activeNoteId && !activeDictionaryId}
                activeNoteId={material.id === activeMaterialId ? activeNoteId : undefined}
                activeDictionaryId={material.id === activeMaterialId ? activeDictionaryId : undefined}
                onOpenMaterial={() => onOpenMaterial(material.id)}
                onOpenNote={(noteId) => onOpenNote(material.id, noteId)}
                onOpenDictionary={onOpenDictionary}
              />
            ))}
          </Accordion.Root>
        </LayoutGroup>
      )}
    </div>
  );
};
