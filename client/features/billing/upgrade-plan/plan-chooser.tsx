"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { LuCheck, LuCrown, LuLoaderCircle } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
  BillingIntervalName,
  BillingPlanName,
  formatPrice,
  IBillingPlan,
  SubscriptionTierName,
  useBillingPlans,
  yearlySaving,
} from "@/entities/billing";
import { useCheckout } from "./use-checkout";

// What a plan card lists: the limits people hit first
const AI_FEATURES = ["QuestionGeneration", "AnswerGrading", "WordLookup"] as const;

// Plus and Pro side by side with the billing period above. Renders nothing until Stripe has prices
export const PlanChooser: FC<{ currentTier: SubscriptionTierName }> = ({ currentTier }) => {
  const { t } = useTranslation();
  const { plansData } = useBillingPlans();
  const [period, setPeriod] = useState<BillingIntervalName>("Month");
  const { startCheckout, checkoutPlan, checkoutIsPending } = useCheckout();

  const paid = plansData?.plans.filter((plan) => plan.tier !== "Free" && plan.prices.length > 0) ?? [];
  if (!plansData?.checkoutAvailable || paid.length === 0) return null;

  const hasYear = paid.some((plan) => plan.prices.some((price) => price.interval === "Year"));
  const savings = paid.map((plan) => yearlySaving(plan.prices)).filter((x): x is number => x !== null);
  const bestSaving = savings.length > 0 ? Math.max(...savings) : null;

  return (
    <div className="flex flex-col gap-4">
      {hasYear && (
        <div
          role="radiogroup"
          aria-label={t("billing.plans.period")}
          className="flex w-fit items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1 text-sm font-medium dark:border-neutral-700 dark:bg-neutral-800"
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
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-neutral-950"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{t(value === "Month" ? "billing.plans.monthly" : "billing.plans.yearly")}</span>
              {value === "Year" && bestSaving !== null && (
                <span className="relative rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {t("billing.plans.save", { percent: bestSaving })}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {paid.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            interval={period}
            isCurrent={plan.tier === currentTier}
            isPending={checkoutPlan === plan.tier}
            disabled={checkoutIsPending}
            onChoose={() => startCheckout({ plan: plan.tier as BillingPlanName, interval: priceFor(plan, period).interval })}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-500">{t("billing.plans.note")}</p>
    </div>
  );
};

// A plan without a yearly price is shown with its monthly one
const priceFor = (plan: IBillingPlan, interval: BillingIntervalName) =>
  plan.prices.find((price) => price.interval === interval) ?? plan.prices[0];

interface PlanCardProps {
  plan: IBillingPlan;
  interval: BillingIntervalName;
  isCurrent: boolean;
  isPending: boolean;
  disabled: boolean;
  onChoose: () => void;
}

const PlanCard: FC<PlanCardProps> = ({ plan, interval, isCurrent, isPending, disabled, onChoose }) => {
  const { t, i18n } = useTranslation();
  const price = priceFor(plan, interval);
  const isPro = plan.tier === "Pro";

  const count = (value: number | null) =>
    value === null ? t("billing.plans.unlimited") : value.toLocaleString(i18n.language);

  const lines = [
    t("billing.plans.materials", { count: count(plan.limits.materials) }),
    t("billing.plans.words", { count: count(plan.limits.entriesPerDictionary) }),
    ...AI_FEATURES.map((feature) =>
      t("billing.plans.aiPerMonth", {
        feature: t(`ai.features.${feature}`),
        count: count(plan.aiPerMonth[feature] ?? null),
      }),
    ),
  ];

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4",
        isPro
          ? "border-violet-300 bg-violet-50/60 dark:border-violet-800 dark:bg-violet-950/30"
          : "border-neutral-200 dark:border-neutral-700",
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-lg font-semibold">
          {isPro && <LuCrown aria-hidden className="text-violet-600 dark:text-violet-400" />}
          {plan.tier}
        </h4>
        {isCurrent && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {t("billing.plans.current")}
          </span>
        )}
      </header>

      <div>
        <p className="text-2xl font-bold tabular-nums">
          {formatPrice(price.amount, price.currency, i18n.language)}
          <span className="ml-1 text-sm font-normal text-neutral-500">
            {t(price.interval === "Year" ? "billing.plans.perYear" : "billing.plans.perMonth")}
          </span>
        </p>
        {price.interval === "Year" && (
          <p className="text-sm text-neutral-500">
            {t("billing.plans.monthlyEquivalent", {
              price: formatPrice(Math.round(price.amount / 12), price.currency, i18n.language),
            })}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-1.5 text-sm">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <LuCheck aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onChoose}
        disabled={disabled}
        variant={isPro ? "default" : "outline"}
        className="mt-auto"
      >
        {isPending && <LuLoaderCircle aria-hidden className="animate-spin" />}
        {t("billing.plans.choose", { plan: plan.tier })}
      </Button>
    </article>
  );
};
