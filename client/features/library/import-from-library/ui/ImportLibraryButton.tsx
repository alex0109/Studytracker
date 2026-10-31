"use client";

import { FC } from "react";
import { LuCheck, LuDownload } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { useLibraryImport } from "../hooks/useLibraryImport";

interface ImportLibraryButtonProps {
  itemId: string;
  isImported: boolean;
}

export const ImportLibraryButton: FC<ImportLibraryButtonProps> = ({ itemId, isImported }) => {
  const { t } = useTranslation();
  const { importLibraryItem, importLibraryItemIsPending } = useLibraryImport(itemId);

  return (
    <div className="flex flex-col items-start gap-1">
      <Button size="lg" disabled={importLibraryItemIsPending} onClick={() => importLibraryItem()}>
        <LuDownload aria-hidden />
        {importLibraryItemIsPending
          ? t("library.importing")
          : isImported
            ? t("library.importAgain")
            : t("library.import")}
      </Button>
      {isImported && (
        <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
          <LuCheck aria-hidden /> {t("library.alreadyImported")}
        </span>
      )}
    </div>
  );
};
