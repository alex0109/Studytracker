"use client";

import { FC, ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuArrowDown, LuCalendarClock, LuCrown, LuSparkles, LuSprout, LuUsers } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IAiUsage } from "@/entities/ai";
import { IBillingStatus, IDuoStatus, SubscriptionTierName } from "@/entities/billing";

const TIER_LOOK: Record<SubscriptionTierName, { icon: IconType; surface: string; tile: string }> = {
  Free: {
    icon: LuSprout,
    surface: "from-neutral-100 via-white to-emerald-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-emerald-950/30",
    tile: "bg-white text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  },
  Plus: {
    icon: LuSparkles,
    surface: "from-emerald-100/90 via-white to-sky-100/80 dark:from-emerald-950/60 dark:via-neutral-900 dark:to-sky-950/40",
    tile: "bg-emerald-600 text-white",
  },
  Duo: {
    icon: LuUsers,
    surface: "from-violet-100/90 via-white to-sky-100/80 dark:from-violet-950/60 dark:via-neutral-900 dark:to-sky-950/40",
    tile: "bg-violet-600 text-white",
  },
  Pro: {
    icon: LuCrown,
    surface: "from-amber-100/90 via-white to-rose-50 dark:from-amber-950/50 dark:via-neutral-900 dark:to-rose-950/30",
    tile: "bg-amber-500 text-white",
  },
};

// The three quotas people reach first
const KEY_FEATURES = ["QuestionGeneration", "AnswerGrading", "WordLookup"] as const;

const formatDate = (value: string, language: string) =>
  new Date(value).toLocaleDateString(language, { day: "numeric", month: "long", year: "numeric" });

interface PlanHeroProps {
  tier: SubscriptionTierName;
  billing?: IBillingStatus;
  duo?: IDuoStatus;
  ai?: IAiUsage;
  // Shown under the plan: managing a paid plan, or a way down to the plans
  actions?: ReactNode;
  showPlansLink: boolean;
}

// The plan in force, its state and this month's AI at a glance
export const PlanHero: FC<PlanHeroProps> = ({ tier, billing, duo, ai, actions, showPlansLink }) => {
  const { t, i18n } = useTranslation();
  const look = TIER_LOOK[tier] ?? TIER_LOOK.Free;
  const Icon = look.icon;
  const date = (value: string | null) => (value ? formatDate(value, i18n.language) : "—");

  // Status and end of a paid or granted plan; someone on another person's Duo sees whose it is
  const status =
    duo?.role === "Member" && duo.active
      ? t("billing.page.duoFrom", { email: duo.ownerEmail ?? "—" })
      : billing?.status && tier !== "Free"
        ? billing.cancelAtPeriodEnd || billing.status === "Canceled"
          ? t("billing.endsOn", { date: date(billing.currentPeriodEnd) })
          : billing.status === "PastDue"
            ? t("billing.pastDue")
            : billing.status === "Trialing" && billing.trialEndsAt
              ? t("billing.trialUntil", { date: date(billing.trialEndsAt) })
              : billing.currentPeriodEnd
                ? t("billing.activeUntil", { date: date(billing.currentPeriodEnd) })
                : t("billing.activeNoEnd")
        : null;

  return (
    <section
      aria-labelledby="plan-hero-title"
      className={cn(
        "w-full rounded-3xl border border-white/80 bg-linear-to-br p-6 shadow-sm sm:p-8 dark:border-neutral-800",
        look.surface,
      )}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:bg-neutral-800 dark:text-neutral-400">
            {t("billing.page.yourPlan")}
          </span>
          <div className="flex items-center gap-4">
            <span aria-hidden className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm", look.tile)}>
              <Icon />
            </span>
            <div>
              <p id="plan-hero-title" className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {tier}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">{t(`billing.page.tiers.${tier}`)}</p>
            </div>
          </div>
          {status && (
            <p
              className={cn(
                "flex items-center gap-2 text-sm",
                billing?.status === "PastDue" ? "text-amber-700 dark:text-amber-400" : "text-neutral-600 dark:text-neutral-300",
              )}
            >
              <LuCalendarClock aria-hidden className="shrink-0" /> {status}
            </p>
          )}
          {(actions || showPlansLink) && (
            <div className="flex flex-wrap gap-2">
              {actions}
              {showPlansLink && (
                <a
                  href="#plans"
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {t("billing.page.seePlans")} <LuArrowDown aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>

        {ai && (
          <div className="flex w-full flex-col gap-3 rounded-2xl bg-white/70 p-4 backdrop-blur-sm lg:max-w-sm dark:bg-neutral-900/70">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold">{t("billing.page.aiThisMonth")}</p>
              <p className="text-xs text-neutral-500">{t("billing.page.resetsOn", { date: formatDate(ai.resetsAt, i18n.language) })}</p>
            </div>
            {KEY_FEATURES.map((feature) => {
              const usage = ai.features.find((x) => x.feature === feature);
              if (!usage) return null;
              const ratio = usage.limit > 0 ? Math.min(usage.used / usage.limit, 1) : 1;
              return (
                <div key={feature} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-neutral-600 dark:text-neutral-300">{t(`ai.features.${feature}`)}</span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {usage.used} / {usage.limit.toLocaleString(i18n.language)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className={cn("h-full rounded-full", ratio >= 1 ? "bg-red-500" : ratio >= 0.8 ? "bg-amber-500" : "bg-emerald-500")}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
