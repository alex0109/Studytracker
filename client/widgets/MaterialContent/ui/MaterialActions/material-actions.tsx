"use client";

import { FC, useState } from "react";
import { LuEllipsis, LuHeadphones, LuLibrary, LuTrash2 } from "react-icons/lu";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { MaterialDeleteModal } from "@/features/material/delete-material";
import { MaterialShareModal } from "@/features/material/share-material";
import { SubmitToLibraryModal } from "@/features/library/send-library-request";

interface MaterialActionsProps {
  materialId: string;
  // A library copy goes back only through its own library material
  isFromLibrary?: boolean;
  isPodcastOpen: boolean;
  onTogglePodcast: () => void;
}

// Sharing is the one action people look for; the rare and the dangerous ones wait in "more"
export const MaterialActions: FC<MaterialActionsProps> = ({ materialId, isFromLibrary, isPodcastOpen, onTogglePodcast }) => {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Button
        variant="outline"
        onClick={onTogglePodcast}
        aria-pressed={isPodcastOpen}
        aria-label={t("podcast.title")}
        title={t("podcast.title")}
        className={cn(
          isPodcastOpen &&
            "border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
        )}
      >
        <LuHeadphones aria-hidden /> <span className="hidden sm:inline">{t("podcast.title")}</span>
      </Button>
      <MaterialShareModal materialId={materialId} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("materials.moreActions")} title={t("materials.moreActions")}>
            <LuEllipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          {!isFromLibrary && (
            <>
              <DropdownMenuItem onSelect={() => setLibraryOpen(true)}>
                <LuLibrary aria-hidden /> {t("library.sendMaterial")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <LuTrash2 aria-hidden /> {t("materials.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MaterialDeleteModal id={materialId} open={deleteOpen} setOpen={setDeleteOpen} />
      <SubmitToLibraryModal open={libraryOpen} setOpen={setLibraryOpen} materialId={materialId} />
    </div>
  );
};
