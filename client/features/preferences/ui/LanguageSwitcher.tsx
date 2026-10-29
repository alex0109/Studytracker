"use client";

import { FC, useState } from "react";
import { LuCheck, LuLanguages } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/radix-ui";
import {
  LANGUAGE_LABELS,
  LANGUAGES,
  useLanguage,
  useTranslation,
} from "@/shared/i18n";

export const LanguageSwitcher: FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={t("preferences.language")}
        title={t("preferences.language")}
        className="flex h-10 items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <LuLanguages aria-hidden />
        {LANGUAGE_LABELS[language].short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {LANGUAGES.map((item) => (
          <DropdownMenuItem
            key={item}
            lang={item}
            onSelect={() => setLanguage(item)}
            className="flex items-center justify-between gap-3"
          >
            <span>{LANGUAGE_LABELS[item].name}</span>
            {item === language && <LuCheck aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
