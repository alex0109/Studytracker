"use client";

import { FC, useState } from "react";
import { LuHourglass, LuRefreshCw, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { ConfirmModal } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { LibraryRequestTypeEnum } from "@/entities/library";
import { useLibraryRequestCreate } from "../hooks/useLibraryRequests";
import { SubmitToLibraryModal } from "./SubmitToLibraryModal";

interface LibraryAuthorActionsProps {
  itemId: string;
  nickname: string;
  pendingRequest?: LibraryRequestTypeEnum | null;
}

// The author can't edit a library material: they ask for a new version or for removal
export const LibraryAuthorActions: FC<LibraryAuthorActionsProps> = ({
  itemId,
  nickname,
  pendingRequest,
}) => {
  const { t } = useTranslation();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const { createLibraryRequest, createLibraryRequestIsPending } = useLibraryRequestCreate();

  const askRemoval = async () => {
    try {
      await createLibraryRequest({ type: LibraryRequestTypeEnum.Remove, libraryItemId: itemId });
      setRemoveOpen(false);
    } catch {
      // The hook already explains what went wrong
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{t("library.author.title")}</p>
      {pendingRequest ? (
        <p className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
          <LuHourglass aria-hidden />
          {pendingRequest === LibraryRequestTypeEnum.Remove
            ? t("library.author.removalPending")
            : t("library.author.updatePending")}
        </p>
      ) : (
        <p className="text-xs text-neutral-500">{t("library.author.text")}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={!!pendingRequest} onClick={() => setUpdateOpen(true)}>
          <LuRefreshCw aria-hidden /> {t("library.author.update")}
        </Button>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          disabled={!!pendingRequest}
          onClick={() => setRemoveOpen(true)}
        >
          <LuTrash2 aria-hidden /> {t("library.author.remove")}
        </Button>
      </div>

      <SubmitToLibraryModal
        open={updateOpen}
        setOpen={setUpdateOpen}
        libraryItemId={itemId}
        defaultNickname={nickname}
      />

      <ConfirmModal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={askRemoval}
        pending={createLibraryRequestIsPending}
        title={t("library.author.removeTitle")}
        description={t("library.author.removeText")}
        confirmText={t("library.author.removeConfirm")}
      />
    </div>
  );
};
