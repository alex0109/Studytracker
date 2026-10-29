"use client";

import { FC } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/shared/theme";
import { useTranslation } from "@/shared/i18n";

export const ThemeToggle: FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? t("preferences.lightTheme") : t("preferences.darkTheme");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-800 shadow-sm backdrop-blur transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      {isDark ? <LuSun aria-hidden /> : <LuMoon aria-hidden />}
    </button>
  );
};
