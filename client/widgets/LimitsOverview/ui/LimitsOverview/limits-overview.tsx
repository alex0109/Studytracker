"use client";

import { FC } from "react";
import { LuBookOpen, LuCrown, LuFolderOpen, LuSparkles } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { LimitBar } from "@/shared/ui";
import { useLimits, useLimitsUsage } from "@/entities/limits";
import { aiFeatureLabelKey, useAiUsage } from "@/entities/ai";
import { Trans, useTranslation } from "@/shared/i18n";
import { LimitsCard } from "../LimitsCard/limits-card";
import { MaterialLimitsList } from "../MaterialLimitsList/material-limits-list";

const formatDate = (value: string, language: string) =>
  new Date(value).toLocaleDateString(language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const LimitsOverview: FC = () => {
  const { t, i18n } = useTranslation();
  const { limitsData } = useLimits();
  const { limitsUsageData, limitsUsageError } = useLimitsUsage();
  const { aiUsageData } = useAiUsage();

  if (limitsUsageError) {
    return (
      <p className="py-10 text-center text-neutral-500">
        {t("limits.page.loadError")}
      </p>
    );
  }

  if (!limitsData || !limitsUsageData) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl md:col-span-2" />
      </div>
    );
  }

  // grid-cols-1 is minmax(0, 1fr): without it the phone column grew to fit a long
  // material title and the page got wider than the screen
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <LimitsCard
        title={t("limits.page.plan")}
        subtitle={t("limits.page.planText")}
        icon={<LuCrown />}
      >
        {aiUsageData ? (
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {aiUsageData.tier}
            </span>
            <p className="text-sm text-neutral-500">
              <Trans
                i18nKey="limits.page.resets"
                values={{ date: formatDate(aiUsageData.resetsAt, i18n.language) }}
                components={{
                  b: <span className="font-medium text-neutral-700 dark:text-neutral-200" />,
                }}
              />
            </p>
            {!aiUsageData.isEnabled && (
              <p className="text-sm text-amber-600">
                {t("ai.off")}
              </p>
            )}
          </div>
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
      </LimitsCard>

      <LimitsCard
        title={t("limits.page.workspace")}
        subtitle={t("limits.page.workspaceText")}
        icon={<LuFolderOpen />}
      >
        <LimitBar
          label={t("limits.page.materials")}
          used={limitsUsageData.materials}
          max={limitsData.maxMaterials}
        />
        <LimitBar
          label={t("limits.page.tags")}
          used={limitsUsageData.tags}
          max={limitsData.maxTags}
        />
      </LimitsCard>

      <LimitsCard
        title={t("limits.page.aiMonth")}
        subtitle={t("limits.page.aiMonthText")}
        icon={<LuSparkles />}
        className="md:col-span-2"
      >
        {aiUsageData ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {aiUsageData.features.map((item) => (
              <LimitBar
                key={item.feature}
                label={t(aiFeatureLabelKey(item.feature), { defaultValue: item.feature })}
                used={item.used}
                max={item.limit}
              />
            ))}
          </div>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </LimitsCard>

      <LimitsCard
        title={t("limits.page.perMaterial")}
        subtitle={t("limits.page.perMaterialText", { count: limitsData.maxEntriesPerDictionary })}
        icon={<LuBookOpen />}
        className="md:col-span-2"
      >
        <MaterialLimitsList
          materials={limitsUsageData.materialsUsage}
          limits={limitsData}
        />
      </LimitsCard>
    </div>
  );
};
