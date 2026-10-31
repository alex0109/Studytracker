"use client";

import { LuCircleHelp } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";

export const EmptyQuestions = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full my-8 flex-col justify-center items-center gap-2 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-neutral-200 text-xl text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
        <LuCircleHelp aria-hidden />
      </span>
      <p className="font-medium text-neutral-800 dark:text-neutral-100">
        {t("questions.empty.title")}
      </p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        {t("questions.empty.text")}
      </p>
    </div>
  );
};
