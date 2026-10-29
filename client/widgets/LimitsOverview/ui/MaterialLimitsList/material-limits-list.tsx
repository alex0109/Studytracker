"use client";

import { FC } from "react";
import Link from "next/link";
import { IMaterialLimitsUsage, IUserLimits } from "@/entities/limits";
import { LimitBar } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

interface MaterialLimitsListProps {
  materials: IMaterialLimitsUsage[];
  limits: IUserLimits;
}

export const MaterialLimitsList: FC<MaterialLimitsListProps> = ({
  materials,
  limits,
}) => {
  const { t } = useTranslation();

  if (materials.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        {t("limits.page.noMaterials")}{" "}
        <Link
          href="/materials"
          className="font-medium text-emerald-600 underline"
        >
          {t("limits.page.createFirst")}
        </Link>
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
      {materials.map((material) => (
        <li
          key={material.materialId}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
        >
          <p className="truncate font-medium">{material.title}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LimitBar
              label={t("limits.page.questions")}
              used={material.questions}
              max={limits.maxQuestionsPerMaterial}
            />
            <LimitBar
              label={t("limits.page.notes")}
              used={material.notes}
              max={limits.maxNotesPerMaterial}
            />
            <LimitBar
              label={t("limits.page.dictionaries")}
              used={material.dictionaries}
              max={limits.maxDictionariesPerMaterial}
            />
            <LimitBar
              label={t("limits.page.fullestDictionary")}
              used={material.maxDictionaryEntries}
              max={limits.maxEntriesPerDictionary}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
