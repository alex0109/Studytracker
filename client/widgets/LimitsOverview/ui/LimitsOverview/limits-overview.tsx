"use client";

import { FC } from "react";
import { LuChevronDown, LuFolderOpen, LuSparkles, LuUsers } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { LimitBar } from "@/shared/ui";
import { useLimits, useLimitsUsage } from "@/entities/limits";
import { aiFeatureLabelKey, useAiUsage } from "@/entities/ai";
import { SubscriptionTierName, useBillingStatus, useDuoStatus } from "@/entities/billing";
import { PlanChooser, PlanChooserMode } from "@/features/billing/upgrade-plan";
import { ManageSubscriptionButton, useSubscriptionPortal } from "@/features/billing/manage-subscription";
import { DuoPanel } from "@/features/billing/duo";
import { Trans, useTranslation } from "@/shared/i18n";
import { LimitsCard } from "../LimitsCard/limits-card";
import { MaterialLimitsList } from "../MaterialLimitsList/material-limits-list";
import { PlanHero } from "../PlanHero/plan-hero";
import { BillingFaq } from "../BillingFaq/billing-faq";

const formatDate = (value: string, language: string) =>
  new Date(value).toLocaleDateString(language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// The plan in force, the plans to choose from, the Duo, what is used, and the usual questions
export const LimitsOverview: FC = () => {
  const { t, i18n } = useTranslation();
  const { limitsData } = useLimits();
  const { limitsUsageData, limitsUsageError } = useLimitsUsage();
  const { aiUsageData } = useAiUsage();
  const { billingData } = useBillingStatus();
  const { duoData } = useDuoStatus();
  const { openPortal, portalPending } = useSubscriptionPortal();

  // A running paid plan is changed in Stripe's portal, someone on another person's Duo has one
  // already, and the rest buy one at checkout. Without payments set up there is nothing to choose
  const hasPaidPlan = !!billingData?.canManage && billingData.tier !== "Free";
  const onSomeonesDuo = duoData?.role === "Member" && duoData.active;
  const plansMode: PlanChooserMode | null = !billingData?.checkoutAvailable
    ? null
    : hasPaidPlan
      ? "portal"
      : onSomeonesDuo
        ? "none"
        : "checkout";
  const tier = (billingData?.tier ?? aiUsageData?.tier ?? "Free") as SubscriptionTierName;

  if (limitsUsageError) {
    return <p className="py-10 text-center text-neutral-500">{t("limits.page.loadError")}</p>;
  }

  if (!limitsData || !limitsUsageData || !billingData) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  // grid-cols-1 is minmax(0, 1fr): without it the phone column grew to fit a long
  // material title and the page got wider than the screen
  return (
    <div className="flex w-full flex-col gap-12">
      <PlanHero
        tier={tier}
        billing={billingData}
        duo={duoData}
        ai={aiUsageData}
        actions={billingData.canManage ? <ManageSubscriptionButton /> : undefined}
        showPlansLink={plansMode === "checkout" && tier === "Free"}
      />

      {duoData && duoData.role !== "None" && (
        <LimitsCard
          title={t("duo.title")}
          subtitle={t(duoData.role === "Owner" ? "duo.ownerText" : "duo.memberText")}
          icon={<LuUsers />}
          tone="violet"
        >
          <DuoPanel duo={duoData} />
        </LimitsCard>
      )}

      {plansMode && (
        <PlanChooser currentTier={tier} mode={plansMode} onPortal={openPortal} portalPending={portalPending} />
      )}

      <section aria-labelledby="usage-title" className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="usage-title" className="text-2xl! font-semibold! tracking-tight">
            {t("billing.page.usageTitle")}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">{t("billing.page.usageText")}</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <LimitsCard title={t("limits.page.aiMonth")} subtitle={t("limits.page.aiMonthText")} icon={<LuSparkles />} tone="emerald">
            {aiUsageData ? (
              <>
                <div className="flex flex-col gap-4">
                  {aiUsageData.features.map((item) => (
                    <LimitBar
                      key={item.feature}
                      label={t(aiFeatureLabelKey(item.feature), { defaultValue: item.feature })}
                      used={item.used}
                      max={item.limit}
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-500">
                  <Trans
                    i18nKey="limits.page.resets"
                    values={{ date: formatDate(aiUsageData.resetsAt, i18n.language) }}
                    components={{ b: <span className="font-medium text-neutral-700 dark:text-neutral-200" /> }}
                  />
                </p>
                {!aiUsageData.isEnabled && <p className="text-sm text-amber-600">{t("ai.off")}</p>}
              </>
            ) : (
              <Skeleton className="h-48 w-full" />
            )}
          </LimitsCard>

          <LimitsCard title={t("limits.page.workspace")} subtitle={t("limits.page.workspaceText")} icon={<LuFolderOpen />} tone="sky">
            <div className="flex flex-col gap-4">
              <LimitBar label={t("limits.page.materials")} used={limitsUsageData.materials} max={limitsData.maxMaterials} />
              <LimitBar label={t("limits.page.tags")} used={limitsUsageData.tags} max={limitsData.maxTags} />
              {/* Library copies have their own room when they don't share the material limit */}
              {limitsData.countLibraryImports === false && limitsData.maxLibraryImports !== undefined && (
                <LimitBar
                  label={t("limits.page.libraryCopies")}
                  used={limitsUsageData.libraryCopies ?? 0}
                  max={limitsData.maxLibraryImports}
                />
              )}
            </div>

            <details className="group border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 text-sm font-medium text-neutral-700 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-neutral-200 [&::-webkit-details-marker]:hidden">
                {t("billing.page.perMaterialShow")}
                <LuChevronDown
                  aria-hidden
                  className="shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="pt-4">
                <MaterialLimitsList materials={limitsUsageData.materialsUsage} limits={limitsData} />
              </div>
            </details>
          </LimitsCard>
        </div>
      </section>

      <BillingFaq />
    </div>
  );
};
