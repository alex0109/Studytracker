"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LuChartColumn, LuCoins, LuCrown, LuUsers } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { useAiUsage } from "@/entities/ai";
import { SubscriptionTierName, useBillingStatus, useDuoStatus } from "@/entities/billing";
import { PlanChooser, PlanChooserMode } from "@/features/billing/upgrade-plan";
import { ManageSubscriptionButtons, useSubscriptionPortal } from "@/features/billing/manage-subscription";
import { DuoPanel } from "@/features/billing/duo";
import { CreditsPanel } from "@/features/billing/buy-credits";
import { useTranslation } from "@/shared/i18n";
import { AiUsageBuckets } from "../AiUsageBuckets/ai-usage-buckets";
import { PlanHero } from "../PlanHero/plan-hero";
import { BillingFaq } from "../BillingFaq/billing-faq";
import { LimitsTab, LimitsTabs, useLimitsTab } from "../LimitsTabs/limits-tabs";

// The plan in force at a glance, then one thing at a time: what is used, the plans, the credits and,
// for someone sharing a Duo, the Duo. Room for materials, questions and words is the same for everyone
// and not shown: its caps only stop scripts
export const LimitsOverview: FC = () => {
  const { t } = useTranslation();
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
  const hasDuo = !!duoData && duoData.role !== "None";

  const tabs = [
    { value: "usage" as const, label: t("billing.tabs.usage"), icon: LuChartColumn },
    { value: "plans" as const, label: t("billing.tabs.plans"), icon: LuCrown },
    { value: "credits" as const, label: t("billing.tabs.credits"), icon: LuCoins },
    ...(hasDuo ? [{ value: "duo" as const, label: "Duo", icon: LuUsers }] : []),
  ];
  const { tab, open } = useLimitsTab(tabs.map((x) => x.value));

  if (!billingData) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  const panel = (value: LimitsTab) => (
    <motion.div
      key={value}
      id={`limits-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`limits-tab-${value}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex w-full flex-col gap-8"
    >
      {value === "usage" &&
        (aiUsageData ? (
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <AiUsageBuckets usage={aiUsageData} onBuyCredits={() => open("credits")} />
            {!aiUsageData.isEnabled && <p className="mt-4 text-sm text-amber-600">{t("ai.off")}</p>}
          </section>
        ) : (
          <Skeleton className="h-64 w-full rounded-3xl" />
        ))}

      {value === "plans" && (
        <>
          {plansMode ? (
            <PlanChooser currentTier={tier} mode={plansMode} onPortal={openPortal} portalPending={portalPending} />
          ) : (
            <p className="rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              {t(onSomeonesDuo ? "billing.tabs.onDuo" : "billing.tabs.noCheckout")}
            </p>
          )}
          <BillingFaq />
        </>
      )}

      {value === "credits" && (
        <section className="flex flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("credits.text")}</p>
          <CreditsPanel />
        </section>
      )}

      {value === "duo" && duoData && (
        <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t(duoData.role === "Owner" ? "duo.ownerText" : "duo.memberText")}
          </p>
          <DuoPanel duo={duoData} />
        </section>
      )}
    </motion.div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <PlanHero
        tier={tier}
        billing={billingData}
        duo={duoData}
        ai={aiUsageData}
        actions={
          billingData.canManage ? <ManageSubscriptionButtons canChangePlan={hasPaidPlan && !billingData.cancelAtPeriodEnd} /> : undefined
        }
        showPlansLink={plansMode === "checkout" && tier === "Free"}
        onOpen={open}
      />

      <div className="sticky top-24 z-20 -mx-1 px-1">
        <LimitsTabs tabs={tabs} value={tab} onChange={open} />
      </div>

      {panel(tab)}
    </div>
  );
};
