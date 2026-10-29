"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuBookA, LuCircleHelp, LuNotebookPen, LuPencil } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";

const attachments = [
  { icon: LuNotebookPen, key: "lightReactions" },
  { icon: LuPencil, key: "sketch" },
  { icon: LuCircleHelp, key: "questions" },
  { icon: LuBookA, key: "terms" },
] as const;

export const MaterialDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-3 border-neutral-50 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("landing.demo.material.meta")}
            </span>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t("landing.demo.material.title")}
            </span>
          </div>
          <span className="shrink-0 rounded-2xl bg-purple-500 px-3 py-1 text-xs text-white">
            {t("landing.demo.material.status")}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-xl bg-sky-500 px-2 py-0.5 text-xs text-white">
            {t("landing.demo.material.tagBiology")}
          </span>
          <span className="rounded-xl bg-rose-500 px-2 py-0.5 text-xs text-white">
            {t("landing.demo.material.tagExam")}
          </span>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {attachments.map((item, index) => (
          <motion.li
            key={item.key}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.07 }}
            className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              <item.icon />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                {t(`landing.demo.material.attachments.${item.key}.title`)}
              </span>
              <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {t(`landing.demo.material.attachments.${item.key}.meta`)}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
