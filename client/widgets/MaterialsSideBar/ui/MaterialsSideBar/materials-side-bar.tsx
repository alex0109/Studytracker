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
import { IMaterialResponse, useMaterialAll } from "@/entities/material";
import { MaterialsSidebarSectionEnum } from "../../lib/materials-sidebar-enum";
import { AddMaterialModal } from "@/features/material/create-material/ui";
import { AddNoteModal } from "@/features/note/create-note";
import { EmptySection } from "../EmptySection/empty-section";
import { INoteResponse } from "@/entities/note/model";
import { MaterialContent } from "@/widgets/MaterialContent";
import { NotesContent } from "@/widgets/NotesContent";
import { Skeleton } from "@/shared/radix-ui";
import { LuMenu, LuNotebookPen, LuPencil } from "react-icons/lu";
import { cn } from "@/shared/lib/utils";
import { useScreenInfo } from "@/shared/hooks/use-mobile";
import { motion } from "framer-motion";

export const MaterialsSideBar: FC = () => {
  const { isDesktop } = useScreenInfo();
  const [sheetOpen, setSheetOpen] = useState(false);

  const [activeSidebarSection, setActiveSidebarSection] =
    useState<MaterialsSidebarSectionEnum>(MaterialsSidebarSectionEnum.Empty);

  const { materialsData, materialsIsPending } = useMaterialAll();

  const [activeMaterial, setActiveMaterial] = useState<
    IMaterialResponse | undefined
  >(undefined);
  const [activeNote, setActiveNote] = useState<INoteResponse | undefined>(
    undefined,
  );
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
        <AddMaterialModal />

        {materialsIsPending && (
          <div className="flex flex-col w-full gap-4 justify-center items-center mt-5">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
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
                onClick={() => {
                  setActiveMaterial(item);
                  setActiveSidebarSection(MaterialsSidebarSectionEnum.Main);
                  setActiveNote(undefined);
                }}
                className="flex w-full justify-start items-start hover:bg-neutral-900/10 p-2"
              >
                <div className="flex w-full">
                  {activeMaterial?.id === item.id ? (
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="pr-2"
                    >
                      {`>`}
                    </motion.span>
                  ) : null}
                  <span className="px-2 group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                    {item.title}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent isOpen={accordionOpenValue === item.id}>
                <div className="flex flex-col ml-5 pl-2 py-2 gap-2 border-l border-neutral-200">
                  <div className="flex justify-between items-center">
                    <AddNoteModal materialId={item.id} />
                  </div>

                  {item.notes &&
                    item.notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex justify-between items-center"
                      >
                        <Button
                          onClick={() => {
                            setActiveMaterial(item);
                            setActiveNote(note);
                            setActiveSidebarSection(
                              MaterialsSidebarSectionEnum.Notes,
                            );
                            closeSheetIfMobile();
                          }}
                          variant="ghost"
                          className={cn(
                            "w-full flex justify-start items-center hover:bg-neutral-900/10",
                            activeNote?.id === note.id && "bg-neutral-900/5",
                          )}
                        >
                          {note.type === "text" ? (
                            <LuNotebookPen />
                          ) : note.type === "drawing" ? (
                            <LuPencil />
                          ) : null}{" "}
                          {note.title}
                        </Button>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </Accordion.Item>
          ))}
      </Accordion.Root>
    </div>
  );

  const content =
    activeSidebarSection === MaterialsSidebarSectionEnum.Main &&
    activeMaterial ? (
      <MaterialContent
        key={activeMaterial.id}
        id={activeMaterial.id}
        assessmentId={activeMaterial.assessmentId}
        title={activeMaterial.title}
        type={activeMaterial.type}
        link={activeMaterial.link}
        content={activeMaterial.content}
        tags={activeMaterial.materialTags}
        status={activeMaterial.status}
        createdAt={activeMaterial.createdAt}
      />
    ) : activeSidebarSection === MaterialsSidebarSectionEnum.Notes &&
      activeMaterial &&
      activeNote ? (
      <NotesContent
        materialId={activeMaterial.id}
        noteId={activeNote.id}
        title={activeNote.title}
        textContent={activeNote.textContent}
        drawingContent={activeNote.drawingContent}
        type={activeNote.type}
      />
    ) : (
      <EmptySection />
    );

  return (
    <div className="my-3 bg-gray-100 rounded-xl h-full border-3 border-gray-50 w-full min-w-0 lg:w-[90%]">
      {isDesktop ? (
        <div className="flex w-full min-w-0">
          <div className="flex-1 h-[500px] p-3">{list}</div>
          {content}
        </div>
      ) : (
        <div className="flex flex-col w-full min-w-0">
          <div className="p-3 border-b border-neutral-200">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg">
                  <LuMenu /> Materials
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
                        <LuMenu /> Materials
                      </Button>
                    </SheetTrigger>
                  </SheetTitle>
                </SheetHeader>
                {list}
              </SheetContent>
            </Sheet>
          </div>
          {content}
        </div>
      )}
    </div>
  );
};
