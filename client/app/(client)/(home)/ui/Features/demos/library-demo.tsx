"use client";

import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuCheck, LuPlus } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

// Names of real library materials; they are not translated
const ITEMS = [
  { id: "norsk", emoji: "🇳🇴", title: "Norsk A1–A2", words: 180, questions: 40 },
  { id: "python", emoji: "🐍", title: "Python", words: 60, questions: 55 },
  { id: "english", emoji: "🇬🇧", title: "English B1", words: 220, questions: 45 },
];

export const LibraryDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [added, setAdded] = useState<string[]>([]);

  return (
    <DemoPanel className="flex flex-col gap-2">
      {ITEMS.map((item, index) => {
        const isAdded = added.includes(item.id);

        return (
          <motion.div
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 px-3 py-2 dark:border-neutral-800"
          >
            <span className="text-xl" aria-hidden>{item.emoji}</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{item.title}</span>
              <span className="text-xs text-neutral-500">
                {t("landing.features.demo.library.meta", { words: item.words, questions: item.questions })}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setAdded((list) => (isAdded ? list : [...list, item.id]))}
              aria-label={isAdded ? t("landing.features.demo.library.added") : t("landing.features.demo.library.add")}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition",
                isAdded
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200",
              )}
            >
              {isAdded ? <LuCheck aria-hidden /> : <LuPlus aria-hidden />}
            </button>
          </motion.div>
        );
      })}
    </DemoPanel>
  );
};
