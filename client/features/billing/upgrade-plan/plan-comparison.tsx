"use client";

import { FC, Fragment } from "react";
import { LuCheck } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IBillingPlan, SubscriptionTierName } from "@/entities/billing";
import { MEDIA_FEATURES, quotaOf, STUDY_FEATURES, timesFree } from "./plan-math";

interface PlanComparisonProps {
  plans: IBillingPlan[];
  currentTier: SubscriptionTierName;
}

const GROUPS = [
  { key: "study", features: STUDY_FEATURES },
  { key: "media", features: MEDIA_FEATURES },
] as const;

// Every quota side by side, grouped like the usage below: what a feature does, how much each plan gives,
// and how many times Free's. The column of the user's own plan is marked
export const PlanComparison: FC<PlanComparisonProps> = ({ plans, currentTier }) => {
  const { t, i18n } = useTranslation();
  const free = plans.find((plan) => plan.tier === "Free");
  const cell = (tier: string) => cn("px-2 py-3 text-right sm:px-4", tier === currentTier && "bg-emerald-50/70 dark:bg-emerald-950/30");

  return (
    <section aria-labelledby="compare-title" className="flex flex-col gap-3">
      <p id="compare-title" className="text-center text-sm text-neutral-500">{t("billing.compare.text")}</p>

      <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full min-w-[20rem] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th scope="col" className="px-4 py-3 text-left font-medium text-neutral-500">{t("billing.compare.perMonth")}</th>
              {plans.map((plan) => (
                <th key={plan.tier} scope="col" className={cn(cell(plan.tier), "font-semibold")}>
                  <span className="block">{plan.tier}</span>
                  <span className="block text-xs font-normal text-neutral-500">
                    {plan.tier === currentTier ? t("billing.plans.current") : plan.tier === "Duo" ? t("billing.compare.perSeat") : " "}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <Fragment key={group.key}>
                <tr className="bg-neutral-50 dark:bg-neutral-800/40">
                  <th scope="colgroup" colSpan={plans.length + 1} className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                    {t(`billing.compare.${group.key}`)}
                  </th>
                </tr>
                {group.features.map((feature) => (
                  <tr key={feature} className="border-t border-neutral-100 dark:border-neutral-800">
                    <th scope="row" className="py-3 pr-2 pl-4 text-left font-normal">
                      <span className="block font-medium">{t(`ai.features.${feature}`)}</span>
                      <span className="block text-xs text-neutral-500">{t(`billing.compare.features.${feature}`)}</span>
                    </th>
                    {plans.map((plan) => {
                      const value = quotaOf(plan, feature);
                      const trial = plan.aiTrial?.[feature] ?? 0;
                      const times = plan.tier === "Free" ? null : timesFree(value, quotaOf(free, feature));
                      return (
                        <td key={plan.tier} className={cell(plan.tier)}>
                          <span className="font-semibold tabular-nums">
                            {value === 0 && trial > 0
                              ? t("billing.compare.once", { count: trial })
                              : value.toLocaleString(i18n.language)}
                          </span>
                          {times && (
                            <span className="ml-1.5 hidden rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 sm:inline dark:bg-emerald-950 dark:text-emerald-300">
                              ×{times}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}

            <tr className="bg-neutral-50 dark:bg-neutral-800/40">
              <th scope="colgroup" colSpan={plans.length + 1} className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                {t("billing.compare.basics")}
              </th>
            </tr>
            <tr className="border-t border-neutral-100 dark:border-neutral-800">
              <th scope="row" className="px-4 py-3 text-left font-medium">{t("billing.compare.accounts")}</th>
              {plans.map((plan) => (
                <td key={plan.tier} className={cn(cell(plan.tier), "font-semibold tabular-nums")}>{plan.tier === "Duo" ? 2 : 1}</td>
              ))}
            </tr>
            <tr className="border-t border-neutral-100 dark:border-neutral-800">
              <th scope="row" className="py-3 pr-2 pl-4 text-left font-normal">
                <span className="block font-medium">{t("billing.compare.credits")}</span>
                <span className="block text-xs text-neutral-500">{t("billing.compare.creditsText")}</span>
              </th>
              {plans.map((plan) => (
                <td key={plan.tier} className={cell(plan.tier)}>
                  <LuCheck aria-label={t("billing.compare.included")} className="ml-auto size-4 text-emerald-600" />
                </td>
              ))}
            </tr>
            <tr className="border-t border-neutral-100 dark:border-neutral-800">
              <th scope="row" className="py-3 pr-2 pl-4 text-left font-normal">
                <span className="block font-medium">{t("billing.compare.everything")}</span>
                <span className="block text-xs text-neutral-500">{t("billing.compare.everythingText")}</span>
              </th>
              {plans.map((plan) => (
                <td key={plan.tier} className={cell(plan.tier)}>
                  <LuCheck aria-label={t("billing.compare.included")} className="ml-auto size-4 text-emerald-600" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
