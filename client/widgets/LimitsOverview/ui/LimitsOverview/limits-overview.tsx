"use client";

import { FC } from "react";
import { LuBookOpen, LuCrown, LuFolderOpen, LuGem, LuSparkles } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { LimitBar } from "@/shared/ui";
import { useLimits, useLimitsUsage } from "@/entities/limits";
import { aiFeatureLabelKey, useAiUsage } from "@/entities/ai";
import { useBillingStatus } from "@/entities/billing";
import { PlanChooser } from "@/features/billing/upgrade-plan";
import { ManageSubscriptionButton } from "@/features/billing/manage-subscription";
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
  const { billingData } = useBillingStatus();

  // A running paid plan is changed in Stripe's portal; plans are offered to everyone else
  const hasPaidPlan = !!billingData?.canManage && billingData.tier !== "Free";
  const offerPlans = !!billingData?.checkoutAvailable && !hasPaidPlan;

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
              {billingData?.tier ?? aiUsageData.tier}
            </span>
            {/* Status and end of a paid or granted plan */}
            {billingData?.status && billingData.tier !== "Free" && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {billingData.cancelAtPeriodEnd || billingData.status === "Canceled"
                  ? t("billing.endsOn", { date: billingData.currentPeriodEnd ? formatDate(billingData.currentPeriodEnd, i18n.language) : "—" })
                  : billingData.status === "PastDue"
                    ? t("billing.pastDue")
                    : billingData.status === "Trialing" && billingData.trialEndsAt
                      ? t("billing.trialUntil", { date: formatDate(billingData.trialEndsAt, i18n.language) })
                      : billingData.currentPeriodEnd
                        ? t("billing.activeUntil", { date: formatDate(billingData.currentPeriodEnd, i18n.language) })
                        : t("billing.activeNoEnd")}
              </p>
            )}
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
            {billingData?.canManage && <ManageSubscriptionButton />}
          </div>
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
      </LimitsCard>

      {/* Only when payments are set up on the server */}
      {offerPlans && (
        <LimitsCard
          title={t("billing.plans.title")}
          subtitle={t("billing.plans.text")}
          icon={<LuGem />}
          className="md:col-span-2"
        >
          <PlanChooser currentTier={billingData.tier} />
        </LimitsCard>
      )}

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
        {/* Library copies have their own room when they don't share the material limit */}
        {limitsData.countLibraryImports === false && limitsData.maxLibraryImports !== undefined && (
          <LimitBar
            label={t("limits.page.libraryCopies")}
            used={limitsUsageData.libraryCopies ?? 0}
            max={limitsData.maxLibraryImports}
          />
        )}
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
        subtitle={
          limitsData.maxEntriesPerDictionary === null
            ? t("limits.page.perMaterialTextUnlimited")
            : t("limits.page.perMaterialText", { count: limitsData.maxEntriesPerDictionary })
        }
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
