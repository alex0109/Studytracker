"use client";

import { FC } from "react";
import { LuBookOpen, LuCrown, LuFolderOpen, LuSparkles } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { LimitBar } from "@/shared/ui";
import { useLimits, useLimitsUsage } from "@/entities/limits";
import { aiFeatureLabels, useAiUsage } from "@/entities/ai";
import { LimitsCard } from "../LimitsCard/limits-card";
import { MaterialLimitsList } from "../MaterialLimitsList/material-limits-list";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const LimitsOverview: FC = () => {
  const { limitsData } = useLimits();
  const { limitsUsageData, limitsUsageError } = useLimitsUsage();
  const { aiUsageData } = useAiUsage();

  if (limitsUsageError) {
    return (
      <p className="py-10 text-center text-neutral-500">
        Could not load your limits, please refresh the page.
      </p>
    );
  }

  if (!limitsData || !limitsUsageData) {
    return (
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl md:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <LimitsCard
        title="Your plan"
        subtitle="AI limits depend on the plan"
        icon={<LuCrown />}
      >
        {aiUsageData ? (
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {aiUsageData.tier}
            </span>
            <p className="text-sm text-neutral-500">
              AI requests are counted per month and reset on{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {formatDate(aiUsageData.resetsAt)}
              </span>
              . Requests that failed are not counted.
            </p>
            {!aiUsageData.isEnabled && (
              <p className="text-sm text-amber-600">
                AI features are turned off right now.
              </p>
            )}
          </div>
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
      </LimitsCard>

      <LimitsCard
        title="Workspace"
        subtitle="Shared by all your materials"
        icon={<LuFolderOpen />}
      >
        <LimitBar
          label="Materials"
          used={limitsUsageData.materials}
          max={limitsData.maxMaterials}
        />
        <LimitBar
          label="Tags"
          used={limitsUsageData.tags}
          max={limitsData.maxTags}
        />
      </LimitsCard>

      <LimitsCard
        title="AI this month"
        subtitle="How many AI requests are left"
        icon={<LuSparkles />}
        className="md:col-span-2"
      >
        {aiUsageData ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {aiUsageData.features.map((item) => (
              <LimitBar
                key={item.feature}
                label={aiFeatureLabels[item.feature] ?? item.feature}
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
        title="Inside every material"
        subtitle={`Every dictionary holds up to ${limitsData.maxEntriesPerDictionary} words`}
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
