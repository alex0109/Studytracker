"use client";

import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion, useReducedMotion } from "framer-motion";
import { LuChevronRight, LuDownload, LuLibrary } from "react-icons/lu";
import { TruncatedText } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/shared/i18n";
import { IMaterialResponse, usePrefetchMaterial } from "@/entities/material";
import { IDictionaryResponse } from "@/entities/dictionary";
import { MATERIAL_TYPE_ICONS, STATUS_DOTS } from "../../lib/sidebar-icons";
import { MaterialNotes } from "../MaterialNotes/material-notes";
import { MaterialDictionaries } from "../MaterialDictionaries/material-dictionaries";

// Subjects past this many are summed up as "+N"
const SHOWN_SUBJECTS = 3;

interface MaterialRowProps {
  material: IMaterialResponse;
  isOpen: boolean;
  // The material itself is shown, not one of its notes or dictionaries
  isActive: boolean;
  activeNoteId?: string;
  activeDictionaryId?: string;
  onOpenMaterial: () => void;
  onOpenNote: (noteId: string) => void;
  onOpenDictionary: (dictionary: IDictionaryResponse) => void;
}

export const MaterialRow: FC<MaterialRowProps> = ({
  material,
  isOpen,
  isActive,
  activeNoteId,
  activeDictionaryId,
  onOpenMaterial,
  onOpenNote,
  onOpenDictionary,
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const prefetchMaterial = usePrefetchMaterial();

  // Notes and dictionaries are built the first time the row opens and kept, so closing still slides
  const [wasOpened, setWasOpened] = useState(isOpen);
  if (isOpen && !wasOpened) setWasOpened(true);

  const TypeIcon = MATERIAL_TYPE_ICONS[material.type] ?? MATERIAL_TYPE_ICONS.article;
  const subjects = material.materialTags ?? [];
  const notes = material.notes ?? [];

  return (
    <Accordion.Item value={material.id} className="relative">
      <Accordion.Header asChild>
        <div>
          <Accordion.Trigger
            onClick={onOpenMaterial}
            onMouseEnter={() => prefetchMaterial(material.id)}
            onFocus={() => prefetchMaterial(material.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex w-full items-start gap-2.5 rounded-xl px-2 py-2 text-left transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60",
              !isActive && "hover:bg-neutral-900/5 dark:hover:bg-white/5",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="materials-sidebar-active"
                aria-hidden
                className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-neutral-900/5 dark:bg-neutral-800 dark:ring-white/5"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            <span
              aria-hidden
              className={cn(
                "relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive || isOpen
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-neutral-200/70 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
              )}
            >
              <TypeIcon className="size-4" />
            </span>

            <span className="relative flex min-w-0 flex-1 flex-col gap-1">
              <TruncatedText
                text={material.title}
                lines={2}
                className="text-sm font-medium leading-snug text-neutral-900 select-none dark:text-neutral-100"
              />
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOTS[material.status])} aria-hidden />
                <span className="truncate">{t(`materials.statuses.${material.status}`)}</span>
                {subjects.length > 0 && (
                  <span className="ml-auto flex shrink-0 items-center gap-1" aria-label={subjects.map((x) => x.name).join(", ")}>
                    {subjects.slice(0, SHOWN_SUBJECTS).map((subject) => (
                      <span
                        key={subject.id}
                        title={subject.name}
                        className="size-2 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                        style={{ backgroundColor: subject.color }}
                      />
                    ))}
                    {subjects.length > SHOWN_SUBJECTS && (
                      <span className="tabular-nums">+{subjects.length - SHOWN_SUBJECTS}</span>
                    )}
                  </span>
                )}
              </span>
            </span>

            {material.isFromLibrary ? (
              <LuLibrary
                title={t("library.fromLibrary")}
                aria-label={t("library.fromLibrary")}
                className="relative mt-1 shrink-0 text-emerald-600"
              />
            ) : material.isImported ? (
              <LuDownload
                title={t("materials.imported")}
                aria-label={t("materials.imported")}
                className="relative mt-1 shrink-0 text-sky-600"
              />
            ) : null}

            <LuChevronRight
              aria-hidden
              className="relative mt-1.5 size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-90"
            />
          </Accordion.Trigger>
        </div>
      </Accordion.Header>

      <Accordion.Content forceMount asChild>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 },
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
          // Closed rows keep their built content out of the tab order
          inert={!isOpen}
        >
          {wasOpened && (
            <div className="ml-6 mt-1 mb-2 flex flex-col gap-2 border-l border-neutral-200 pl-3 dark:border-neutral-800">
              <MaterialNotes
                materialId={material.id}
                notes={notes}
                activeNoteId={activeNoteId}
                onSelect={onOpenNote}
              />
              <MaterialDictionaries
                materialId={material.id}
                enabled={isOpen}
                activeDictionaryId={activeDictionaryId}
                onSelect={onOpenDictionary}
              />
            </div>
          )}
        </motion.div>
      </Accordion.Content>
    </Accordion.Item>
  );
};
