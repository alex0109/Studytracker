"use client";

import { LuBookA } from "react-icons/lu";
import { EmptyState } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

export const EmptyWords = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<LuBookA aria-hidden />}
      title={t("dictionary.empty.title")}
      text={t("dictionary.empty.text")}
    />
  );
};
