"use client";

import { FC, ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuArrowRight, LuCalendarClock, LuCrown, LuSparkles, LuSprout, LuUsers } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn, formatDate } from "@/shared/lib";
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

interface PlanHeroProps {
  tier: SubscriptionTierName;
  billing?: IBillingStatus;
  duo?: IDuoStatus;
  ai?: IAiUsage;
  // Shown under the plan: managing a paid plan, or a way to the plans
  actions?: ReactNode;
  showPlansLink: boolean;
  // Opens the tab a glance tile is about
  onOpen: (tab: "usage" | "plans" | "credits") => void;
}

// One number at a glance; a click opens its tab
const Glance: FC<{ label: string; value: string; hint: string; tone?: "warn" | "ai"; onClick: () => void }> = ({ label, value, hint, tone, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex min-w-0 flex-col items-start gap-0.5 rounded-2xl bg-white/75 p-3 text-left sm:p-4 backdrop-blur-sm transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-emerald-500 dark:bg-neutral-900/70 dark:hover:bg-neutral-900"
  >
    <span className="text-xs font-medium text-neutral-500">{label}</span>
    <span
      className={cn(
        "text-base font-semibold tabular-nums sm:text-xl",
        tone === "warn" && "text-amber-600 dark:text-amber-400",
        tone === "ai" && "text-violet-700 dark:text-violet-300",
      )}
    >
      {value}
    </span>
    <span className="text-xs text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">{hint}</span>
  </button>
);

// The plan in force, its state and this month's AI at a glance
export const PlanHero: FC<PlanHeroProps> = ({ tier, billing, duo, ai, actions, showPlansLink, onOpen }) => {
  const { t, i18n } = useTranslation();
  const look = TIER_LOOK[tier] ?? TIER_LOOK.Free;
  const Icon = look.icon;
  const date = (value: string | null) => (value ? formatDate(value, i18n.language) : "—");

  // The period's AI in three numbers: study quotas used on average, media left, credits
  const glance = ai && (() => {
    const study = ai.features.filter((x) => x.bucket === "Study" && x.limit > 0);
    const studyPercent = study.length
      ? Math.round((study.reduce((sum, x) => sum + Math.min(x.used / x.limit, 1), 0) / study.length) * 100)
      : 0;
    const left = (feature: string) => {
      const item = ai.features.find((x) => x.feature === feature);
      if (!item) return 0;
      return item.limit > 0 ? Math.max(0, item.limit - item.used) : Math.max(0, item.trialLimit - item.trialUsed);
    };
    return { studyPercent, media: `${left("PodcastGeneration")} · ${left("VideoTranscript")} ${t("ai.units.VideoTranscript")}` };
  })();

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
                <button
                  type="button"
                  onClick={() => onOpen("plans")}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {t("billing.page.seePlans")} <LuArrowRight aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>

        {glance && ai && (
          <div className="grid w-full grid-cols-3 gap-2 lg:max-w-md">
            <Glance label={t("billing.compare.study")} value={`${glance.studyPercent}%`} hint={t("billing.glance.used")} tone={glance.studyPercent >= 90 ? "warn" : undefined} onClick={() => onOpen("usage")} />
            <Glance label={t("billing.compare.media")} value={glance.media} hint={t("billing.glance.mediaHint")} onClick={() => onOpen("usage")} />
            <Glance label={t("credits.title")} value={ai.creditBalance.toLocaleString(i18n.language)} hint={t("billing.glance.topUp")} tone="ai" onClick={() => onOpen("credits")} />
          </div>
        )}
      </div>
    </section>
  );
};
