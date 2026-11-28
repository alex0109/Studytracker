// SHARED-UI
"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";
import styles from "./brand-loader.module.css";

interface BrandLoaderProps {
  className?: string;
}

// Shown while a big page loads: the logo as on the guide and the name under it. The motion is plain CSS,
// so it plays from the first paint
export const BrandLoader: FC<BrandLoaderProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[60dvh] w-full flex-col items-center justify-center gap-5",
        className,
      )}
    >
      <div className="relative size-24 md:size-28">
        <div
          aria-hidden
          className={cn("absolute -inset-6 rounded-full", styles.glow)}
        />
        <div aria-hidden className={cn("relative size-full", styles.emblem)} />
      </div>
      <span
        className={cn(
          "text-2xl font-semibold tracking-tight md:text-3xl",
          styles.word,
        )}
      >
        Studytracker
      </span>
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
};
