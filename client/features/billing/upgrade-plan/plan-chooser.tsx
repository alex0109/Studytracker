"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuChevronDown, LuLock, LuTable2, LuTicket } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
  BillingIntervalName,
  BillingPlanName,
  IBillingPlan,
  likelyCurrency,
  priceIn,
  SubscriptionTierName,
  useBillingPlans,
  yearlySaving,
} from "@/entities/billing";
import { useCheckout } from "./use-checkout";
import { PlanCard } from "./plan-card";
import { PlanComparison } from "./plan-comparison";
import { duoSaving, priceFor, studyTimes } from "./plan-math";

// checkout: a new plan is bought; portal: a running plan is changed in Stripe's page;
// none: nothing to choose here, for someone on another person's Duo
export type PlanChooserMode = "checkout" | "portal" | "none";

interface PlanChooserProps {
  currentTier: SubscriptionTierName;
  mode: PlanChooserMode;
  // changePlan: open on switching plans; going to Free is cancelling, on the portal's main page
  onPortal?: (changePlan: boolean) => void;
  portalPending?: boolean;
}

// Free, Plus and Duo side by side, with the billing period above. Renders nothing until Stripe has prices
export const PlanChooser: FC<PlanChooserProps> = ({ currentTier, mode, onPortal, portalPending }) => {
  const { t } = useTranslation();
  const { plansData } = useBillingPlans();
  const [period, setPeriod] = useState<BillingIntervalName>("Month");
  const [compareOpen, setCompareOpen] = useState(false);
  const { startCheckout, checkoutPlan, checkoutIsPending } = useCheckout();
  const currency = useMemo(() => likelyCurrency(), []);
  // The card whose button opened Stripe's portal shows the spinner
  const [portalTier, setPortalTier] = useState<string | null>(null);

  const paid = plansData?.plans.filter((plan) => plan.tier !== "Free" && plan.prices.length > 0) ?? [];
  if (!plansData?.checkoutAvailable || paid.length === 0) return null;

  const free = plansData.plans.find((plan) => plan.tier === "Free");
  const shown = free ? [free, ...paid] : paid;
  const hasYear = paid.some((plan) => plan.prices.some((price) => price.interval === "Year"));
  const savings = paid.map((plan) => yearlySaving(plan.prices, currency)).filter((x): x is number => x !== null);
  const bestSaving = savings.length > 0 ? Math.max(...savings) : null;
  // Free costs nothing in the same currency the paid cards show
  const freeCurrency = priceIn(priceFor(paid[0], period)!, currency).currency;
  const plus = paid.find((plan) => plan.tier === "Plus");
  const duo = paid.find((plan) => plan.tier === "Duo");
  const duoCheaper = plus && duo ? duoSaving(priceFor(plus, period), priceFor(duo, period), currency) : null;

  const actionFor = (plan: IBillingPlan) => {
    if (plan.tier === currentTier || mode === "none") return undefined;
    if (mode === "portal") {
      return {
        label: t("billing.page.switchTo", { plan: plan.tier }),
        run: () => {
          setPortalTier(plan.tier);
          onPortal?.(plan.tier !== "Free");
        },
      };
    }
    if (plan.tier === "Free") return undefined;
    return {
      label: t("billing.plans.choose", { plan: plan.tier }),
      run: () => startCheckout({ plan: plan.tier as BillingPlanName, interval: priceFor(plan, period)!.interval }),
    };
  };

  return (
    <section id="plans" aria-labelledby="plans-title" className="flex w-full scroll-mt-28 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 id="plans-title" className="text-2xl! font-semibold! tracking-tight sm:text-3xl!">
            {t("billing.page.plansTitle")}
          </h2>
          <p className="text-neutral-600 text-pretty dark:text-neutral-400">{t("billing.page.plansText")}</p>
        </div>

        {hasYear && (
          <div
            role="radiogroup"
            aria-label={t("billing.plans.period")}
            className="flex w-fit shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-sm font-medium dark:border-neutral-700 dark:bg-neutral-900"
          >
            {(["Month", "Year"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={period === value}
                onClick={() => setPeriod(value)}
                className="relative flex items-center gap-1.5 rounded-full px-4 py-1.5"
              >
                {period === value && (
                  <motion.span
                    layoutId="billing-interval"
                    className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={cn("relative", period === value && "text-white dark:text-neutral-900")}>
                  {t(value === "Month" ? "billing.plans.monthly" : "billing.plans.yearly")}
                </span>
                {value === "Year" && bestSaving !== null && (
                  <span className="relative rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t("billing.plans.save", { percent: bestSaving })}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
        {shown.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            interval={period}
            currency={currency}
            freeCurrency={freeCurrency}
            isCurrent={plan.tier === currentTier}
            isRecommended={currentTier === "Free" && plan.tier === "Plus"}
            studyTimes={studyTimes(plan, free)}
            duoSaving={plan.tier === "Duo" ? duoCheaper : null}
            action={actionFor(plan)}
            pending={mode === "portal" ? !!portalPending && portalTier === plan.tier : checkoutPlan === plan.tier}
            disabled={checkoutIsPending || !!portalPending}
          />
        ))}
      </div>

      {/* Every quota side by side, for whoever wants the detail */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          aria-expanded={compareOpen}
          onClick={() => setCompareOpen(!compareOpen)}
          className="flex items-center gap-2 self-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <LuTable2 aria-hidden />
          {t(compareOpen ? "billing.compare.hide" : "billing.compare.show")}
          <LuChevronDown aria-hidden className={cn("transition", compareOpen && "rotate-180")} />
        </button>
        {compareOpen && <PlanComparison plans={shown} currentTier={currentTier} />}
      </div>

      {/* Codes are typed on Stripe's page; checkout already shows the field */}
      {mode === "checkout" && (
        <p className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <LuTicket aria-hidden className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{t("billing.plans.promo")}</span>
        </p>
      )}

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
        <LuLock aria-hidden className="shrink-0" />
        <span>{t("billing.plans.note")}</span>
        <Link href="/terms#cancel" className="font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400">
          {t("billing.page.termsLink")}
        </Link>
      </p>
    </section>
  );
};
