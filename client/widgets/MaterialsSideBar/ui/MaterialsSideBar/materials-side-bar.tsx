"use client";

import { FC, ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/shared/hooks";
import { MaterialsSidebarSectionEnum } from "../../lib/materials-sidebar-enum";
import { useMaterialsSelection } from "../../lib/use-materials-selection";
import { RenderMaterialsView } from "../../model/materials-view";
import { EmptySection } from "../EmptySection/empty-section";
import { SidebarList } from "../SidebarList/sidebar-list";
import { DesktopLayout } from "./desktop-layout";
import { MobileLayout } from "./mobile-layout";

interface MaterialsSideBarProps {
  // What is open next to the list; the page decides how a material, note or dictionary looks
  renderContent: RenderMaterialsView;
}

export const MaterialsSideBar: FC<MaterialsSideBarProps> = ({ renderContent }) => {
  // Same breakpoint as Tailwind's lg; re-renders only when it is crossed
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sheetOpen, setSheetOpen] = useState(false);
  const selection = useMaterialsSelection();
  const { section, material, note, dictionaryId } = selection;

  // A choice on a phone shows it at once instead of leaving the list on top
  const closeSheetIfMobile = () => {
    if (!isDesktop) setSheetOpen(false);
  };

  const openMaterial = (materialId: string) => {
    selection.openMaterial(materialId);
    closeSheetIfMobile();
  };

  const list = (listenForShortcut: boolean, headerActions?: ReactNode, closeAction?: ReactNode) => (
    <SidebarList
      materials={selection.materials}
      isPending={selection.materialsIsPending}
      openValue={selection.openValue}
      onOpenValueChange={selection.setOpenValue}
      activeMaterialId={material?.id}
      activeNoteId={note?.id}
      activeDictionaryId={dictionaryId}
      onOpenMaterial={(materialId) => selection.open({ material: materialId })}
      onOpenNote={(materialId, noteId) => {
        selection.open({ material: materialId, note: noteId });
        closeSheetIfMobile();
      }}
      onOpenDictionary={(dictionary) => {
        selection.openDictionary(dictionary);
        closeSheetIfMobile();
      }}
      onCreated={openMaterial}
      headerActions={headerActions}
      closeAction={closeAction}
      listenForShortcut={listenForShortcut}
    />
  );

  const view =
    section !== MaterialsSidebarSectionEnum.Empty && material
      ? renderContent({
          section,
          material,
          note,
          dictionaryId,
          openMaterial: selection.openMaterial,
          openDictionary: selection.openDictionary,
        })
      : null;

  // Opening something else fades it in, so the pane doesn't just snap to new content
  const content = (
    <motion.div
      key={`${section}:${material?.id ?? ""}:${note?.id ?? ""}:${dictionaryId ?? ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex w-full min-w-0 justify-center"
    >
      {view ?? <EmptySection />}
    </motion.div>
  );

  return (
    <div className="my-3 w-full min-w-0 rounded-2xl border-3 border-neutral-50 bg-neutral-100 lg:w-[94%] xl:w-[90%] dark:border-neutral-800 dark:bg-neutral-900">
      {isDesktop ? (
        <DesktopLayout list={(collapseButton) => list(true, collapseButton)} content={content} onCreated={openMaterial} />
      ) : section === MaterialsSidebarSectionEnum.Empty ? (
        // Nothing open on a phone: the list itself is the page, not a hint to find a hidden one
        <div className="min-w-0 p-3 sm:p-4">{list(false)}</div>
      ) : (
        <MobileLayout
          list={(closeButton) => list(false, undefined, closeButton)}
          content={content}
          sheetOpen={sheetOpen}
          onSheetOpenChange={setSheetOpen}
          materialsCount={selection.materials?.length ?? 0}
          material={material}
          note={note}
          isInside={section !== MaterialsSidebarSectionEnum.Main}
          onOpenMaterial={(materialId) => selection.open({ material: materialId })}
        />
      )}
    </div>
  );
};
