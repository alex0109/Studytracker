"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconType } from "react-icons";
import { LuFeather, LuMic, LuNotebookPen, LuPencil, LuScrollText } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "../../(home)/ui/Features/demos/demo-card";

const TYPES: { key: "text" | "drawing" | "summary" | "essay"; icon: IconType; tone: string }[] = [
  { key: "text", icon: LuNotebookPen, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { key: "drawing", icon: LuPencil, tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { key: "summary", icon: LuScrollText, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { key: "essay", icon: LuFeather, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
];

// The four kinds of notes, and the editor's voice input
export const NoteTypesDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <DemoPanel className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {TYPES.map((type, index) => (
          <motion.div
            key={type.key}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className="flex flex-col gap-2 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800"
          >
            <span className={`flex size-8 items-center justify-center rounded-lg ${type.tone}`}>
              <type.icon aria-hidden />
            </span>
            <span className="text-sm font-medium">{t(`notes.types.${type.key}`)}</span>
            <span className="text-xs text-neutral-500">{t(`guide.notes.${type.key}`)}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-900">
        <span className="relative flex size-8 items-center justify-center rounded-full bg-rose-500 text-white">
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-full bg-rose-500"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
          )}
          <LuMic aria-hidden className="relative" />
        </span>
        <span className="text-sm text-neutral-600 dark:text-neutral-300">{t("guide.notes.voice")}</span>
      </div>
    </DemoPanel>
  );
};
