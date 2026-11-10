"use client";

import { FC } from "react";
import { LuBookA } from "react-icons/lu";
import { IDictionaryResponse, useDictionaryAll } from "@/entities/dictionary";
import { AddDictionaryModal } from "@/features/dictionary/create-dictionary";
import { Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { SidebarSection } from "../SidebarSection/sidebar-section";
import { SidebarLink } from "../SidebarSection/sidebar-link";

interface MaterialDictionariesProps {
  materialId: string;
  enabled: boolean;
  activeDictionaryId?: string;
  onSelect: (dictionary: IDictionaryResponse) => void;
}

export const MaterialDictionaries: FC<MaterialDictionariesProps> = ({
  materialId,
  enabled,
  activeDictionaryId,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { dictionariesData, dictionariesIsPending } = useDictionaryAll(materialId, enabled);

  return (
    <SidebarSection
      label={t("materials.sidebar.dictionaries")}
      count={dictionariesData?.length}
      action={<AddDictionaryModal materialId={materialId} variant="icon" />}
    >
      {enabled && dictionariesIsPending ? (
        <Skeleton className="h-8 w-full" />
      ) : !dictionariesData || dictionariesData.length === 0 ? (
        <p className="px-2 pb-1 text-xs text-neutral-400 dark:text-neutral-500">
          {t("materials.sidebar.noDictionaries")}
        </p>
      ) : (
        dictionariesData.map((dictionary) => (
          <SidebarLink
            key={dictionary.id}
            icon={LuBookA}
            label={dictionary.title}
            isActive={activeDictionaryId === dictionary.id}
            onSelect={() => onSelect(dictionary)}
            trailing={
              <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                {dictionary.entries?.length ?? 0}
              </span>
            }
          />
        ))
      )}
    </SidebarSection>
  );
};
