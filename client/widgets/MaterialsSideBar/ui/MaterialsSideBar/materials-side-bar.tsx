"use client";

import { FC, ReactNode, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LuChevronRight, LuMenu, LuPanelLeftClose, LuPanelLeftOpen, LuX } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { useMaterialAll } from "@/entities/material";
import { IDictionaryResponse } from "@/entities/dictionary";
import { AddMaterialModal } from "@/features/material/create-material";
import { MaterialContent } from "@/widgets/MaterialContent";
import { NotesContent } from "@/widgets/NotesContent";
import { DictionaryContent } from "@/widgets/DictionaryContent";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { useMediaQuery } from "@/shared/hooks";
import { MaterialsSidebarSectionEnum } from "../../lib/materials-sidebar-enum";
import { useSidebarCollapsed } from "../../lib/use-sidebar-collapsed";
import { EmptySection } from "../EmptySection/empty-section";
import { SidebarList } from "../SidebarList/sidebar-list";

export const MaterialsSideBar: FC = () => {
  const { t } = useTranslation();
  // Same breakpoint as Tailwind's lg; re-renders only when it is crossed
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  // What is open lives in the address: it survives a reload, Back works and it can be shared
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeMaterialId = searchParams.get("material") ?? undefined;
  const activeNoteId = searchParams.get("note") ?? undefined;
  const activeDictionaryId = searchParams.get("dictionary") ?? undefined;
  const activeSidebarSection = activeDictionaryId
    ? MaterialsSidebarSectionEnum.Dictionary
    : activeNoteId
      ? MaterialsSidebarSectionEnum.Notes
      : activeMaterialId
        ? MaterialsSidebarSectionEnum.Main
        : MaterialsSidebarSectionEnum.Empty;

  // pushState, not the router: it updates the search params without asking the server for the
  // page again, and every choice is one step of Back. Choosing what is already open adds no step
  const openInUrl = (next: { material?: string; note?: string; dictionary?: string }) => {
    const params = new URLSearchParams();
    if (next.material) params.set("material", next.material);
    if (next.note) params.set("note", next.note);
    if (next.dictionary) params.set("dictionary", next.dictionary);

    const query = params.toString();
    if (query === searchParams.toString()) return;
    window.history.pushState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  const { materialsData, materialsIsPending } = useMaterialAll();

  // Ids, not copies: a copy taken at the click went stale after edits, so new subjects,
  // titles and statuses didn't show until the material was clicked again
  const activeMaterial = materialsData?.find((material) => material.id === activeMaterialId);
  const activeNote = activeMaterial?.notes?.find((note) => note.id === activeNoteId);
  const [openValue, setOpenValue] = useState(activeMaterialId);

  // Opened from the address or with Back: its row in the list opens too
  const [shownMaterialId, setShownMaterialId] = useState(activeMaterialId);
  if (activeMaterialId !== shownMaterialId) {
    setShownMaterialId(activeMaterialId);
    if (activeMaterialId) setOpenValue(activeMaterialId);
  }

  const closeSheetIfMobile = () => {
    if (!isDesktop) setSheetOpen(false);
  };

  // From the "added to dictionary" toast or the list: the dictionary opens next to its material
  const openDictionary = (dictionary: IDictionaryResponse) => {
    openInUrl({ material: dictionary.materialId, dictionary: dictionary.id });
    setOpenValue(dictionary.materialId);
    closeSheetIfMobile();
  };

  const list = (listenForShortcut: boolean, headerActions?: ReactNode, closeAction?: ReactNode) => (
    <SidebarList
      materials={materialsData}
      isPending={materialsIsPending}
      openValue={openValue}
      onOpenValueChange={setOpenValue}
      activeMaterialId={activeMaterialId}
      activeNoteId={activeNote?.id}
      activeDictionaryId={activeDictionaryId}
      onOpenMaterial={(materialId) => openInUrl({ material: materialId })}
      onOpenNote={(materialId, noteId) => {
        openInUrl({ material: materialId, note: noteId });
        closeSheetIfMobile();
      }}
      onOpenDictionary={openDictionary}
      onCreated={(materialId) => {
        openInUrl({ material: materialId });
        setOpenValue(materialId);
        closeSheetIfMobile();
      }}
      headerActions={headerActions}
      closeAction={closeAction}
      listenForShortcut={listenForShortcut}
    />
  );

  const content =
    activeSidebarSection === MaterialsSidebarSectionEnum.Main && activeMaterial ? (
      <MaterialContent
        key={activeMaterial.id}
        id={activeMaterial.id}
        noteId={activeNote?.id}
        assessmentId={activeMaterial.assessmentId}
        title={activeMaterial.title}
        type={activeMaterial.type}
        link={activeMaterial.link}
        tags={activeMaterial.materialTags}
        status={activeMaterial.status}
        createdAt={activeMaterial.createdAt}
        isImported={activeMaterial.isImported}
        isFromLibrary={activeMaterial.isFromLibrary}
        importedAt={activeMaterial.importedAt}
        onOpenDictionary={openDictionary}
      />
    ) : activeSidebarSection === MaterialsSidebarSectionEnum.Notes && activeMaterial && activeNote ? (
      <NotesContent
        materialId={activeMaterial.id}
        noteId={activeNote.id}
        assessmentId={activeMaterial.assessmentId}
        title={activeNote.title}
        type={activeNote.type}
        onOpenDictionary={openDictionary}
      />
    ) : activeSidebarSection === MaterialsSidebarSectionEnum.Dictionary && activeMaterial && activeDictionaryId ? (
      <DictionaryContent
        key={activeDictionaryId}
        materialId={activeMaterial.id}
        dictionaryId={activeDictionaryId}
        onDeleted={() => openInUrl({ material: activeMaterial.id })}
      />
    ) : (
      <EmptySection />
    );

  // Opening something else fades it in, so the pane doesn't just snap to new content
  const contentKey = `${activeSidebarSection}:${activeMaterial?.id ?? ""}:${activeNote?.id ?? ""}:${activeDictionaryId ?? ""}`;
  const animatedContent = (
    <motion.div
      key={contentKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex w-full min-w-0 justify-center"
    >
      {content}
    </motion.div>
  );

  return (
    <div className="my-3 w-full min-w-0 rounded-2xl border-3 border-neutral-50 bg-neutral-100 lg:w-[94%] xl:w-[90%] dark:border-neutral-800 dark:bg-neutral-900">
      {isDesktop ? (
        <div className="flex w-full min-w-0">
          {/* Stays in view while a long note scrolls; the list scrolls on its own */}
          <aside
            aria-label={t("nav.materials")}
            className={cn(
              "sticky top-28 self-start shrink-0 border-r border-neutral-200 transition-[width] duration-300 dark:border-neutral-800",
              collapsed ? "w-16" : "w-72 xl:w-80",
            )}
          >
            {collapsed ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(false)}
                  aria-label={t("materials.sidebar.expand")}
                  title={t("materials.sidebar.expand")}
                  className="rounded-xl"
                >
                  <LuPanelLeftOpen />
                </Button>
                <AddMaterialModal
                  variant="icon"
                  onCreated={(materialId) => {
                    openInUrl({ material: materialId });
                    setOpenValue(materialId);
                  }}
                />
              </div>
            ) : (
              <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin]">
                {list(
                  true,
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(true)}
                    aria-label={t("materials.sidebar.collapse")}
                    title={t("materials.sidebar.collapse")}
                    className="size-9 rounded-xl text-neutral-500"
                  >
                    <LuPanelLeftClose />
                  </Button>,
                )}
              </div>
            )}
          </aside>
          <div className="flex min-w-0 flex-1 items-start justify-center">{animatedContent}</div>
        </div>
      ) : (
        <div className="flex w-full min-w-0 flex-col">
          <div className="flex min-w-0 items-center gap-2 border-b border-neutral-200 p-3 dark:border-neutral-800">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="shrink-0 rounded-xl">
                  <LuMenu /> {t("nav.materials")}
                </Button>
              </SheetTrigger>
              {/* The sheet's own corner cross sat on top of "add"; the list's header closes it instead */}
              <SheetContent side="left" showCloseButton={false} className="w-[88%] overflow-y-auto p-0 sm:max-w-sm">
                <SheetHeader className="sr-only">
                  <SheetTitle>{t("nav.materials")}</SheetTitle>
                  <SheetDescription>{t("materials.sidebar.sheetText")}</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-5">
                  {list(
                    false,
                    undefined,
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("nav.closeMenu")}
                        title={t("nav.closeMenu")}
                        className="size-9 rounded-xl text-neutral-500"
                      >
                        <LuX />
                      </Button>
                    </SheetClose>,
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Where you are, so the list doesn't have to be opened to know it */}
            {activeMaterial && (
              <nav aria-label={t("materials.sidebar.breadcrumb")} className="flex min-w-0 items-center gap-1 text-sm">
                <LuChevronRight aria-hidden className="shrink-0 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => openInUrl({ material: activeMaterial.id })}
                  className={cn(
                    "min-w-0 truncate",
                    activeNote || activeDictionaryId
                      ? "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      : "font-medium text-neutral-900 dark:text-neutral-50",
                  )}
                >
                  {activeMaterial.title}
                </button>
                {activeNote && (
                  <>
                    <LuChevronRight aria-hidden className="shrink-0 text-neutral-400" />
                    <span className="min-w-0 truncate font-medium text-neutral-900 dark:text-neutral-50">
                      {activeNote.title}
                    </span>
                  </>
                )}
              </nav>
            )}
          </div>
          {animatedContent}
        </div>
      )}
    </div>
  );
};
