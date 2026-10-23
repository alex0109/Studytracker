"use client";

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
  const { resetProgress, resetProgressIsPending } =
    useEntryProgressReset(dictionaryId);

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Reset learning progress"
      disabled={resetProgressIsPending}
      onClick={() => resetProgress(entryId)}
    >
      <LuRotateCcw />
    </Button>
  );
};
