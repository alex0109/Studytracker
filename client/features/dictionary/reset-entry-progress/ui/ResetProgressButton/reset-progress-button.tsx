"use client";

import { useTranslation } from "@/shared/i18n";

import { FC } from "react";
import { LuRotateCcw } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useEntryProgressReset } from "../../hooks/useEntryProgressReset";

interface ResetProgressButtonProps {
  dictionaryId: string;
  entryId: string;
}

export const ResetProgressButton: FC<ResetProgressButtonProps> = ({
  dictionaryId,
  entryId,
}) => {
  const { t } = useTranslation();
  const { resetProgress, resetProgressIsPending } =
    useEntryProgressReset(dictionaryId);

  return (
    <Button
      variant="ghost"
      size="icon"
      title={t("dictionary.resetProgress")}
      aria-label={t("dictionary.resetProgress")}
      disabled={resetProgressIsPending}
      onClick={() => resetProgress(entryId)}
    >
      <LuRotateCcw />
    </Button>
  );
};
