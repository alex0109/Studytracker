"use client";

import { FC, useState } from "react";
import { AccordionContent, AccordionTrigger } from "@/shared/ui";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "@/shared/ui/Accordion/styles.module.css";
import { useMaterialAll, usePrefetchMaterial } from "@/entities/material";
import { usePrefetchNote } from "@/entities/note/hooks";
import { MaterialsSidebarSectionEnum } from "../../lib/materials-sidebar-enum";
import { AddMaterialModal } from "@/features/material/create-material/ui";
import { AddNoteModal } from "@/features/note/create-note";
import { AddDictionaryModal } from "@/features/dictionary/create-dictionary";
import { EmptySection } from "../EmptySection/empty-section";
import { IDictionaryResponse } from "@/entities/dictionary";
import { MaterialContent } from "@/widgets/MaterialContent";
import { NotesContent } from "@/widgets/NotesContent";
import { DictionaryContent } from "@/widgets/DictionaryContent";
import { MaterialDictionaries } from "../MaterialDictionaries/material-dictionaries";
import { Skeleton } from "@/shared/radix-ui";
import {
  LuDownload,
  LuFolderPlus,
  LuLibrary,
  LuMenu,
  LuNotebookPen,
  LuPencil,
  LuScrollText,
} from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { motion } from "framer-motion";

export const MaterialsSideBar: FC = () => {
  const { t } = useTranslation();
  // Same breakpoint as Tailwind's lg; re-renders only when it is crossed
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sheetOpen, setSheetOpen] = useState(false);

  const [activeSidebarSection, setActiveSidebarSection] =
    useState<MaterialsSidebarSectionEnum>(MaterialsSidebarSectionEnum.Empty);

  const { materialsData, materialsIsPending } = useMaterialAll();
  const prefetchMaterial = usePrefetchMaterial();
  const prefetchNote = usePrefetchNote();

  // Ids, not copies: a copy taken at the click went stale after edits, so new tags,
  // titles and statuses didn't show until the material was clicked again
  const [activeMaterialId, setActiveMaterialId] = useState<string>();
  const [activeNoteId, setActiveNoteId] = useState<string>();
  const activeMaterial = materialsData?.find(
    (material) => material.id === activeMaterialId,
  );
  const activeNote = activeMaterial?.notes?.find(
    (note) => note.id === activeNoteId,
  );
  const [activeDictionary, setActiveDictionary] = useState<
    IDictionaryResponse | undefined
  >(undefined);
  const [accordionOpenValue, setAccordionOpenValue] = useState<
    string | undefined
  >();

  const closeSheetIfMobile = () => {
    if (!isDesktop) setSheetOpen(false);
  };

  const list = (
    <div className="flex flex-col justify-center gap-2 p-5">
      <Accordion.Root
        className={styles.Root}
        type="single"
        value={accordionOpenValue}
        onValueChange={setAccordionOpenValue}
        collapsible
      >
        <AddMaterialModal
          onCreated={(materialId) => {
            setActiveMaterialId(materialId);
            setActiveNoteId(undefined);
            setActiveDictionary(undefined);
            setActiveSidebarSection(MaterialsSidebarSectionEnum.Main);
            setAccordionOpenValue(materialId);
          }}
        />

        {materialsIsPending && (
          <div className="flex flex-col w-full gap-4 justify-center items-center mt-5">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </div>
        )}

        {materialsData && materialsData.length === 0 && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-300 p-5 text-center dark:border-neutral-700">
            <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <LuFolderPlus aria-hidden />
            </span>
            <p className="font-medium text-neutral-800 dark:text-neutral-100">
              {t("materials.sidebar.emptyTitle")}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("materials.sidebar.emptyText")}
            </p>
          </div>
        )}

        {materialsData &&
          materialsData.map((item) => (
            <Accordion.Item
              key={item.id}
              className={styles.Item}
              value={item.id}
            >
              <AccordionTrigger
                onMouseEnter={() => prefetchMaterial(item.id)}
                onFocus={() => prefetchMaterial(item.id)}
                onClick={() => {
                  setActiveMaterialId(item.id);
                  setActiveSidebarSection(MaterialsSidebarSectionEnum.Main);
                  setActiveNoteId(undefined);
                  setActiveDictionary(undefined);
                }}
                className={cn(
                  "flex w-full justify-start items-start rounded-xl transition-colors hover:bg-neutral-900/10 dark:hover:bg-white/10 p-2",
                  activeMaterial?.id === item.id &&
                    "bg-neutral-900/5 dark:bg-white/5",
                )}
              >
                <div className="flex w-full min-w-0">
                  {activeMaterial?.id === item.id ? (
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="pr-2"
                    >
                      {`>`}
                    </motion.span>
                  ) : null}
                  {/* Long titles wrap to two lines: on one line they were cut off,
                      and focusing the item scrolled the start of the title away */}
                  <span
                    title={item.title}
                    className="min-w-0 px-2 py-1 text-left text-sm font-medium break-words line-clamp-2 select-none"
                  >
                    {item.title}
                  </span>
                  {item.isFromLibrary ? (
                    <LuLibrary
                      title={t("library.fromLibrary")}
                      aria-label={t("library.fromLibrary")}
                      className="ml-1 mt-2 shrink-0 text-emerald-600"
                    />
                  ) : item.isImported ? (
                    <LuDownload
                      title={t("materials.imported")}
                      aria-label={t("materials.imported")}
                      className="ml-1 mt-2 shrink-0 text-sky-600"
                    />
                  ) : null}
                </div>
              </AccordionTrigger>

              <AccordionContent isOpen={accordionOpenValue === item.id}>
                <div className="flex flex-col ml-5 pl-2 py-2 gap-2 border-l border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-center">
                    <AddNoteModal
                      materialId={item.id}
                      notesCount={item.notes?.length ?? 0}
                      hasSummary={
                        item.notes?.some((note) => note.type === "summary") ??
                        false
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <AddDictionaryModal
                      materialId={item.id}
                      enabled={accordionOpenValue === item.id}
                    />
                  </div>

                  {(item.notes?.length ?? 0) === 0 && (
                    <p className="px-3 text-xs text-neutral-400 dark:text-neutral-500">
                      {t("materials.sidebar.noNotes")}
                    </p>
                  )}

                  {item.notes &&
                    item.notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex justify-between items-center"
                      >
                        <Button
                          onMouseEnter={() => prefetchNote(item.id, note.id)}
                          onFocus={() => prefetchNote(item.id, note.id)}
                          onClick={() => {
                            setActiveMaterialId(item.id);
                            setActiveNoteId(note.id);
                            setActiveDictionary(undefined);
                            setActiveSidebarSection(
                              MaterialsSidebarSectionEnum.Notes,
                            );
                            closeSheetIfMobile();
                          }}
                          variant="ghost"
                          className={cn(
                            "w-full flex justify-start items-center hover:bg-neutral-900/10 dark:hover:bg-white/10",
                            activeNote?.id === note.id && "bg-neutral-900/5 dark:bg-white/5",
                          )}
                        >
                          {note.type === "text" ? (
                            <LuNotebookPen />
                          ) : note.type === "drawing" ? (
                            <LuPencil />
                          ) : note.type === "summary" ? (
                            <LuScrollText />
                          ) : null}{" "}
                          {note.title}
                        </Button>
                      </div>
                    ))}

                  <MaterialDictionaries
                    materialId={item.id}
                    enabled={accordionOpenValue === item.id}
                    activeDictionaryId={activeDictionary?.id}
                    onSelect={(dictionary) => {
                      setActiveMaterialId(item.id);
                      setActiveNoteId(undefined);
                      setActiveDictionary(dictionary);
                      setActiveSidebarSection(
                        MaterialsSidebarSectionEnum.Dictionary,
                      );
                      closeSheetIfMobile();
                    }}
                  />
                </div>
              </AccordionContent>
            </Accordion.Item>
          ))}
      </Accordion.Root>
    </div>
  );

  // From the "added to dictionary" toast: the dictionary opens next to the text it came from
  const openDictionary = (dictionary: IDictionaryResponse) => {
    setActiveNoteId(undefined);
    setActiveDictionary(dictionary);
    setActiveSidebarSection(MaterialsSidebarSectionEnum.Dictionary);
    setAccordionOpenValue(dictionary.materialId);
  };

  const content =
    activeSidebarSection === MaterialsSidebarSectionEnum.Main &&
    activeMaterial ? (
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
    ) : activeSidebarSection === MaterialsSidebarSectionEnum.Notes &&
      activeMaterial &&
      activeNote ? (
      <NotesContent
        materialId={activeMaterial.id}
        noteId={activeNote.id}
        assessmentId={activeMaterial.assessmentId}
        title={activeNote.title}
        type={activeNote.type}
        onOpenDictionary={openDictionary}
      />
    ) : activeSidebarSection === MaterialsSidebarSectionEnum.Dictionary &&
      activeMaterial &&
      activeDictionary ? (
      <DictionaryContent
        key={activeDictionary.id}
        materialId={activeMaterial.id}
        dictionaryId={activeDictionary.id}
        onDeleted={() => {
          setActiveDictionary(undefined);
          setActiveSidebarSection(MaterialsSidebarSectionEnum.Main);
        }}
      />
    ) : (
      <EmptySection />
    );

  // Opening something else fades it in, so the pane doesn't just snap to new content
  const contentKey = `${activeSidebarSection}:${activeMaterial?.id ?? ""}:${activeNote?.id ?? ""}:${activeDictionary?.id ?? ""}`;
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
    <div className="my-3 bg-neutral-100 rounded-xl h-full border-3 border-neutral-50 w-full min-w-0 lg:w-[90%] dark:bg-neutral-900 dark:border-neutral-800">
      {isDesktop ? (
        <div className="flex w-full min-w-0">
          <div className="flex-1 min-h-[500px] p-3">{list}</div>
          <div className="flex flex-3 min-w-0 justify-center items-start">
            {animatedContent}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full min-w-0">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                  <LuMenu /> {t("nav.materials")}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85%] sm:max-w-sm overflow-auto p-0"
              >
                <SheetHeader className="p-4 pb-0">
                  <SheetTitle>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="lg">
                        <LuMenu /> {t("nav.materials")}
                      </Button>
                    </SheetTrigger>
                  </SheetTitle>
                </SheetHeader>
                {list}
              </SheetContent>
            </Sheet>
          </div>
          {animatedContent}
        </div>
      )}
    </div>
  );
};
