"use client";

import { FC, ReactNode } from "react";
import { LuChevronRight, LuPanelLeftOpen, LuX } from "react-icons/lu";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IMaterialResponse } from "@/entities/material";
import { INoteResponse } from "@/entities/note";

interface MobileLayoutProps {
  // The list, given the button that closes the sheet it is in
  list: (closeButton: ReactNode) => ReactNode;
  content: ReactNode;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  materialsCount: number;
  material?: IMaterialResponse;
  note?: INoteResponse;
  // A note or a dictionary is open, so the material's name leads back to it
  isInside: boolean;
  onOpenMaterial: (materialId: string) => void;
}

// Something is open on a phone: the list waits in a sheet, the way back is a breadcrumb
export const MobileLayout: FC<MobileLayoutProps> = ({
  list,
  content,
  sheetOpen,
  onSheetOpenChange,
  materialsCount,
  material,
  note,
  isInside,
  onOpenMaterial,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex min-w-0 items-center gap-2 border-b border-neutral-200 p-3 dark:border-neutral-800">
        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
          {/* Not a hamburger: that icon is the site menu, and the two were mixed up */}
          <SheetTrigger asChild>
            <Button className="shrink-0 rounded-xl">
              <LuPanelLeftOpen /> {t("materials.sidebar.myMaterials")}
              {materialsCount > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 text-xs tabular-nums dark:bg-neutral-900/15">
                  {materialsCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          {/* The list's own header closes the sheet, next to "add" */}
          <SheetContent side="left" className="w-[88%] overflow-y-auto p-0 sm:max-w-sm">
            <SheetHeader className="sr-only">
              <SheetTitle>{t("nav.materials")}</SheetTitle>
              <SheetDescription>{t("materials.sidebar.sheetText")}</SheetDescription>
            </SheetHeader>
            <div className="p-4 pt-5">
              {list(
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
        {material && (
          <nav aria-label={t("materials.sidebar.breadcrumb")} className="flex min-w-0 items-center gap-1 text-sm">
            <LuChevronRight aria-hidden className="shrink-0 text-neutral-400" />
            <button
              type="button"
              onClick={() => onOpenMaterial(material.id)}
              className={cn(
                "min-w-0 truncate",
                isInside
                  ? "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  : "font-medium text-neutral-900 dark:text-neutral-50",
              )}
            >
              {material.title}
            </button>
            {note && (
              <>
                <LuChevronRight aria-hidden className="shrink-0 text-neutral-400" />
                <span className="min-w-0 truncate font-medium text-neutral-900 dark:text-neutral-50">{note.title}</span>
              </>
            )}
          </nav>
        )}
      </div>
      {content}
    </div>
  );
};
