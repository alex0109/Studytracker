"use client";

import { LuLayers } from "react-icons/lu";
import { EmptyState } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

export const EmptyFlashcards = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<LuLayers aria-hidden />}
      title={t("flashcards.empty.title")}
      text={t("flashcards.empty.text")}
    />
  );
};
