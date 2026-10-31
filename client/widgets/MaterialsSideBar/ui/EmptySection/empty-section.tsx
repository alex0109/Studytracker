"use client";

import React, { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuDices } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";

const subscribeToNothing = () => () => {};

// Random line on every visit: funny, warm or simply true, so the empty page feels alive
export const EmptySection = () => {
  const { t } = useTranslation();
  const lines = t("materials.emptySection.lines", { returnObjects: true }) as string[];

  // Shown only in the browser, so the server and the first browser frame render the same
  const isBrowser = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const [firstPick] = useState(() => Math.random());
  const [rolled, setRolled] = useState<number | null>(null);
  const index = rolled ?? (isBrowser ? Math.floor(firstPick * lines.length) : null);

  // Each roll turns the dice a little further
  const [turns, setTurns] = useState(0);

  const next = () => {
    setTurns((value) => value + 1);
    if (lines.length < 2) {
      setRolled(0);
      return;
    }
    let value = index ?? 0;
    while (value === index) value = Math.floor(Math.random() * lines.length);
    setRolled(value);
  };

  return (
    <div className="flex flex-3 flex-col justify-center items-center gap-5 bg-transparent min-h-[500px] rounded-2xl p-5 text-center">
      <div className="min-h-24 max-w-xl">
        <AnimatePresence mode="wait">
          {index !== null && (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-semibold text-neutral-800 text-balance dark:text-neutral-100"
            >
              {lines[index]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {t("materials.emptySection.hint")}
      </p>
      <button
        type="button"
        onClick={next}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600 transition motion-safe:active:scale-95 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      >
        <motion.span
          aria-hidden
          className="inline-flex"
          animate={{ rotate: turns * 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <LuDices />
        </motion.span>{" "}
        {t("materials.emptySection.another")}
      </button>
    </div>
  );
};
