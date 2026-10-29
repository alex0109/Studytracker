"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

interface SaveStatusProps {
  isPending: boolean;
  isError?: boolean;
  className?: string;
  // Shown while nothing is saving, so the mark can take the place of another icon
  idle?: ReactNode;
}

const SAVED_FOR_MS = 1600;

// Mark next to an autosaved field: a spinner while the request runs, then a check that
// pops in and fades away. A failed save shows nothing here, its toast says what happened
export const SaveStatus: FC<SaveStatusProps> = ({
  isPending,
  isError = false,
  className,
  idle,
}) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (isPending) {
      wasPending.current = true;
      return;
    }
    if (!wasPending.current) return;
    wasPending.current = false;
    if (isError) return;

    setSaved(true);
    const timer = setTimeout(() => setSaved(false), SAVED_FOR_MS);
    return () => clearTimeout(timer);
  }, [isPending, isError]);

  const state = isPending ? "saving" : saved ? "saved" : null;

  return (
    <span
      className={cn("inline-flex size-5 shrink-0 items-center justify-center", className)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "saving" && (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="size-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 dark:border-neutral-600 dark:border-t-neutral-200"
          />
        )}
        {state === "saved" && (
          <motion.span
            key="saved"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            className="text-emerald-500"
          >
            <LuCheck aria-hidden className="size-4" />
          </motion.span>
        )}
        {state === null && idle && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex"
          >
            {idle}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {state === "saving" ? t("common.saving") : state === "saved" ? t("common.saved") : ""}
      </span>
    </span>
  );
};
