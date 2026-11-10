"use client";

import { FC, useState } from "react";
import { LuEllipsis, LuLibrary, LuTrash2 } from "react-icons/lu";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { MaterialDeleteModal } from "@/features/material/delete-material";
import { MaterialShareModal } from "@/features/material/share-material";
import { SubmitToLibraryModal } from "@/features/library/send-library-request";

interface MaterialActionsProps {
  materialId: string;
  // A library copy goes back only through its own library material
  isFromLibrary?: boolean;
}

// Sharing is the one action people look for; the rare and the dangerous ones wait in "more"
export const MaterialActions: FC<MaterialActionsProps> = ({ materialId, isFromLibrary }) => {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-1.5">
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
