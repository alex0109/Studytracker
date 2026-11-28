"use client";

import { FC } from "react";
import { LuGraduationCap } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { useRequireAuth } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Spinner } from "@/shared/ui";
import { useLibraryStart } from "../hooks/useLibraryStart";

interface StartLearningButtonProps {
  itemId: string;
  // The user already has it: their copy or, for the author, the original
  isStarted?: boolean;
  className?: string;
}

export const StartLearningButton: FC<StartLearningButtonProps> = ({ itemId, isStarted, className }) => {
  const { t } = useTranslation();
  const { startLearning, startLearningIsPending } = useLibraryStart(itemId);
  const requireAuth = useRequireAuth();

  return (
    <Button
      disabled={startLearningIsPending}
      onClick={() => requireAuth(startLearning)}
      className={cn(
        "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500",
        className,
      )}
    >
      {startLearningIsPending ? <Spinner /> : <LuGraduationCap aria-hidden />}
      {t(isStarted ? "library.continueLearning" : "library.startLearning")}
    </Button>
  );
};
