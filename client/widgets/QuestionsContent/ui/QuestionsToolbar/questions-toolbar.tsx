"use client";

import { FC } from "react";
import { LuPlay, LuPlus, LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

interface QuestionsStartProps {
  count: number;
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
}

// The main step of the section, so it is the biggest thing on the screen: answering the questions
export const QuestionsStart: FC<QuestionsStartProps> = ({ count, canStart, isStarting, onStart }) => {
  const { t } = useTranslation();

  return (
    <Button
      disabled={!canStart}
      onClick={onStart}
      className="h-16 min-h-16 w-full gap-3 rounded-2xl bg-emerald-600 text-xl font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 max-sm:h-16 max-sm:min-h-16 max-sm:text-xl sm:h-[4.5rem] sm:min-h-[4.5rem] dark:bg-emerald-600 dark:text-white dark:shadow-emerald-950/50 dark:hover:bg-emerald-500 [&_svg:not([class*='size-'])]:size-6 max-sm:[&_svg:not([class*='size-'])]:size-6"
    >
      {isStarting ? <Spinner /> : <LuPlay aria-hidden />}
      {t("questions.actions.start")}
      {count > 0 && (
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-medium tabular-nums">
          {t("questions.editor.count", { count })}
        </span>
      )}
    </Button>
  );
};

interface QuestionsActionsProps {
  onAdd: () => void;
  onGenerate: () => void;
}

// Adding and generating sit under the search, above the list they grow; quieter than "Start"
export const QuestionsActions: FC<QuestionsActionsProps> = ({ onAdd, onGenerate }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
      <Button size="lg" variant="outline" onClick={onAdd}>
        <LuPlus aria-hidden /> {t("questions.editor.add")}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={onGenerate}
        className="border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950/40"
      >
        <LuSparkles aria-hidden /> {t("questions.actions.generate")}
      </Button>
    </div>
  );
};
