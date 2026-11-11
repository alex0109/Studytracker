"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { LuCheck, LuLoaderCircle, LuLock, LuSparkles, LuSprout, LuUsers } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
  BillingIntervalName,
  BillingPlanName,
  formatPrice,
  IBillingPlan,
  IBillingPrice,
  likelyCurrency,
  priceIn,
  SubscriptionTierName,
  useBillingPlans,
  yearlySaving,
} from "@/entities/billing";
import { useCheckout } from "./use-checkout";

// Every AI quota, the ones people use most first
const AI_FEATURES = [
  "QuestionGeneration",
  "AnswerGrading",
  "MistakeExplanation",
  "DictionaryGeneration",
  "SummaryGeneration",
  "PodcastGeneration",
  "EssayReview",
  "WordLookup",
  "WordExplanation",
] as const;

const PLAN_LOOK: Record<string, { icon: IconType; tile: string }> = {
  Free: { icon: LuSprout, tile: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300" },
  Plus: { icon: LuSparkles, tile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  Duo: { icon: LuUsers, tile: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
};

// checkout: a new plan is bought; portal: a running plan is changed in Stripe's page;
// none: nothing to choose here, for someone on another person's Duo
export type PlanChooserMode = "checkout" | "portal" | "none";

interface PlanChooserProps {
  currentTier: SubscriptionTierName;
  mode: PlanChooserMode;
  onPortal?: () => void;
  portalPending?: boolean;
}

// Free, Plus and Duo side by side, with the billing period above. Renders nothing until Stripe has prices
export const PlanChooser: FC<PlanChooserProps> = ({ currentTier, mode, onPortal, portalPending }) => {
  const { t } = useTranslation();
  const { plansData } = useBillingPlans();
  const [period, setPeriod] = useState<BillingIntervalName>("Month");
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

  const actionFor = (plan: IBillingPlan) => {
    if (plan.tier === currentTier || mode === "none") return undefined;
    if (mode === "portal") {
      return {
        label: t("billing.page.switchTo", { plan: plan.tier }),
        run: () => {
          setPortalTier(plan.tier);
          onPortal?.();
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
          <span className="w-fit rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:bg-neutral-900">
            {t("billing.page.plansEyebrow")}
          </span>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {shown.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            interval={period}
            currency={currency}
            freeCurrency={freeCurrency}
            isCurrent={plan.tier === currentTier}
            action={actionFor(plan)}
            pending={mode === "portal" ? !!portalPending && portalTier === plan.tier : checkoutPlan === plan.tier}
            disabled={checkoutIsPending || !!portalPending}
          />
        ))}
      </div>

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

// A plan without a yearly price is shown with its monthly one; Free has none
const priceFor = (plan: IBillingPlan, interval: BillingIntervalName): IBillingPrice | undefined =>
  plan.prices.find((price) => price.interval === interval) ?? plan.prices[0];

interface PlanCardProps {
  plan: IBillingPlan;
  interval: BillingIntervalName;
  currency: string;
  freeCurrency: string;
  isCurrent: boolean;
  action?: { label: string; run: () => void };
  pending: boolean;
  disabled: boolean;
}

const PlanCard: FC<PlanCardProps> = ({ plan, interval, currency, freeCurrency, isCurrent, action, pending, disabled }) => {
  const { t, i18n } = useTranslation();
  const price = priceFor(plan, interval);
  const shown = price ? priceIn(price, currency) : { amount: 0, currency: freeCurrency };
  const isFree = plan.tier === "Free";
  const isDuo = plan.tier === "Duo";
  const look = PLAN_LOOK[plan.tier] ?? PLAN_LOOK.Plus;
  const Icon = look.icon;
  const monthly = !price || price.interval === "Month" ? shown.amount : Math.round(shown.amount / 12);

  return (
    <article
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl border p-6 transition",
        isCurrent
          ? "border-emerald-400 bg-white ring-4 ring-emerald-400/15 dark:border-emerald-700 dark:bg-neutral-900"
          : isDuo
            ? "border-violet-200 bg-linear-to-b from-violet-50 to-white dark:border-violet-900 dark:from-violet-950/40 dark:to-neutral-900"
            : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      {(isCurrent || isDuo) && (
        <span
          className={cn(
            "absolute top-5 right-5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            isCurrent
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-violet-600 text-white",
          )}
        >
          {isCurrent ? t("billing.plans.current") : t("billing.page.forTwo")}
        </span>
      )}

      <div className="flex flex-col gap-3">
        <span aria-hidden className={cn("flex size-11 items-center justify-center rounded-2xl text-xl", look.tile)}>
          <Icon />
        </span>
        <div>
          <h3 className="text-xl font-semibold">{plan.tier}</h3>
          <p className="text-sm text-neutral-500">{t(`billing.page.tiers.${plan.tier}`)}</p>
        </div>
      </div>

      <div className="min-h-16">
        <p className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight tabular-nums">
            {formatPrice(shown.amount, shown.currency, i18n.language)}
          </span>
          <span className="text-sm text-neutral-500">
            {t(price?.interval === "Year" ? "billing.plans.perYear" : "billing.plans.perMonth")}
          </span>
        </p>
        {!isFree && (price?.interval === "Year" || isDuo) && (
          <p className="text-sm text-neutral-500">
            {isDuo
              ? t("billing.page.perPerson", { price: formatPrice(Math.round(monthly / 2), shown.currency, i18n.language) }) +
                (price?.interval === "Year" ? ` ${t("billing.plans.perMonth")}` : "")
              : t("billing.plans.monthlyEquivalent", { price: formatPrice(monthly, shown.currency, i18n.language) })}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-start gap-2 font-medium">
          <LuCheck aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
          {t(isFree ? "billing.page.freeLine" : isDuo ? "billing.plans.forTwo" : "billing.plans.forOne")}
        </li>
        {!isFree && (
          <li className="flex items-start gap-2">
            <LuCheck aria-hidden className="mt-0.5 shrink-0 text-emerald-600" />
            {t("billing.plans.keepsContent")}
          </li>
        )}
      </ul>

      <div className="flex flex-col gap-2 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
        <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">{t("billing.page.aiQuotas")}</p>
        <dl className="flex flex-col gap-1.5 text-sm">
          {AI_FEATURES.map((feature) => (
            <div key={feature} className="flex items-baseline justify-between gap-3">
              <dt className="text-neutral-600 dark:text-neutral-400">{t(`ai.features.${feature}`)}</dt>
              <dd className="font-semibold tabular-nums">{(plan.aiPerMonth[feature] ?? 0).toLocaleString(i18n.language)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {(action || isCurrent) && (
        <Button
          size="lg"
          onClick={action?.run}
          disabled={isCurrent || disabled}
          variant={isCurrent || isFree ? "outline" : "default"}
          className={cn("mt-auto w-full", isDuo && !isCurrent && "bg-violet-600 text-white hover:bg-violet-700")}
        >
          {pending && <LuLoaderCircle aria-hidden className="animate-spin" />}
          {isCurrent ? t("billing.plans.current") : action?.label}
        </Button>
      )}
    </article>
  );
};
