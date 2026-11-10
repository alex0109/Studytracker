"use client";

import { FC } from "react";
import { LuPlay, LuPlus, LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

interface QuestionsToolbarProps {
  count: number;
  canStart: boolean;
  isStarting: boolean;
  onAdd: () => void;
  onGenerate: () => void;
  onStart: () => void;
}

// The main step stands out, adding and generating sit next to it as quieter buttons
export const QuestionsToolbar: FC<QuestionsToolbarProps> = ({ count, canStart, isStarting, onAdd, onGenerate, onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="flex items-center gap-2 text-lg! font-semibold! text-neutral-900 dark:text-neutral-50">
        {t("questions.editor.title")}
        {count > 0 && (
          <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-xs font-medium tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {count}
          </span>
        )}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <Button
          size="lg"
          disabled={!canStart}
          onClick={onStart}
          className="col-span-2 bg-emerald-600 text-white hover:bg-emerald-700 sm:order-3 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500"
        >
          {isStarting ? <Spinner /> : <LuPlay aria-hidden />}
          {t("questions.actions.start")}
        </Button>
        <Button size="lg" variant="outline" onClick={onAdd} className="sm:order-1">
          <LuPlus aria-hidden /> {t("questions.editor.add")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onGenerate}
          className="border-violet-200 text-violet-700 hover:bg-violet-50 sm:order-2 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950/40"
        >
          <LuSparkles aria-hidden /> {t("questions.actions.generate")}
        </Button>
      </div>
    </div>
  );
};
