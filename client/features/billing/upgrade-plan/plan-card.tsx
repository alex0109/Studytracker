"use client";

import { FC, ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuBadgePercent, LuCheck, LuClapperboard, LuLoaderCircle, LuSparkles, LuSprout, LuUsers } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { BillingIntervalName, formatPrice, IBillingPlan, priceIn } from "@/entities/billing";
import { priceFor, quotaOf } from "./plan-math";

const PLAN_LOOK: Record<string, { icon: IconType; tile: string; check: string }> = {
  Free: { icon: LuSprout, tile: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300", check: "text-neutral-500" },
  Plus: { icon: LuSparkles, tile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", check: "text-emerald-600" },
  Duo: { icon: LuUsers, tile: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", check: "text-violet-600" },
};

interface PlanCardProps {
  plan: IBillingPlan;
  interval: BillingIntervalName;
  currency: string;
  freeCurrency: string;
  isCurrent: boolean;
  // Plus while the user is on Free: the step most people take
  isRecommended: boolean;
  // How many times study AI is Free's
  studyTimes: number | null;
  // Duo against two Plus, in percent
  duoSaving: number | null;
  action?: { label: string; run: () => void };
  pending: boolean;
  disabled: boolean;
}

const Perk: FC<{ icon?: IconType; className: string; strong?: boolean; children: ReactNode }> = ({ icon: Icon = LuCheck, className, strong, children }) => (
  <li className={cn("flex items-start gap-2.5", strong && "font-semibold text-neutral-900 dark:text-neutral-50")}>
    <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", className)} />
    <span>{children}</span>
  </li>
);

// One plan: its price, what it gives in a few lines, and the button to take it. The full list of
// quotas is in the comparison under the cards
export const PlanCard: FC<PlanCardProps> = ({
  plan,
  interval,
  currency,
  freeCurrency,
  isCurrent,
  isRecommended,
  studyTimes,
  duoSaving,
  action,
  pending,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  const price = priceFor(plan, interval);
  const shown = price ? priceIn(price, currency) : { amount: 0, currency: freeCurrency };
  const isFree = plan.tier === "Free";
  const isDuo = plan.tier === "Duo";
  const look = PLAN_LOOK[plan.tier] ?? PLAN_LOOK.Plus;
  const Icon = look.icon;
  const money = (amount: number) => formatPrice(amount, shown.currency, i18n.language);
  const monthly = !price || price.interval === "Month" ? shown.amount : Math.round(shown.amount / 12);
  const media = {
    podcasts: quotaOf(plan, "PodcastGeneration").toLocaleString(i18n.language),
    videos: quotaOf(plan, "VideoTranscript").toLocaleString(i18n.language),
  };
  const badge = isCurrent ? t("billing.plans.current") : isDuo ? t("billing.page.forTwo") : isRecommended ? t("billing.page.recommended") : null;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl border p-6 transition",
        isCurrent
          ? "border-emerald-400 bg-white ring-4 ring-emerald-400/15 dark:border-emerald-700 dark:bg-neutral-900"
          : isRecommended
            ? "border-emerald-300 bg-linear-to-b from-emerald-50 to-white shadow-lg shadow-emerald-900/5 md:-translate-y-2 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-neutral-900 dark:shadow-none"
            : isDuo
              ? "border-violet-200 bg-linear-to-b from-violet-50 to-white dark:border-violet-900 dark:from-violet-950/40 dark:to-neutral-900"
              : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      {badge && (
        <span
          className={cn(
            "absolute top-5 right-5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            isCurrent
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : isDuo
                ? "bg-violet-600 text-white"
                : "bg-emerald-600 text-white",
          )}
        >
          {badge}
        </span>
      )}

      <div className="flex flex-col gap-3">
        <span aria-hidden className={cn("flex size-11 items-center justify-center rounded-2xl text-xl", look.tile)}>
          <Icon />
        </span>
        <div className="min-h-12">
          <h3 className="text-xl font-semibold">{plan.tier}</h3>
          <p className="text-sm text-neutral-500">{t(`billing.page.tiers.${plan.tier}`)}</p>
        </div>
      </div>

      <div className="min-h-16">
        <p className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight tabular-nums">{money(shown.amount)}</span>
          <span className="text-sm text-neutral-500">
            {t(price?.interval === "Year" ? "billing.plans.perYear" : "billing.plans.perMonth")}
          </span>
        </p>
        {isFree ? (
          <p className="text-sm text-neutral-500">{t("billing.page.freeForever")}</p>
        ) : (
          (price?.interval === "Year" || isDuo) && (
            <p className="text-sm text-neutral-500">
              {isDuo
                ? t("billing.page.perPerson", { price: money(Math.round(monthly / 2)) }) +
                  (price?.interval === "Year" ? ` ${t("billing.plans.perMonth")}` : "")
                : t("billing.plans.monthlyEquivalent", { price: money(monthly) })}
            </p>
          )
        )}
      </div>

      <ul className="flex flex-col gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
        {isFree ? (
          <>
            <Perk className={look.check} strong>{t("billing.page.freeLine")}</Perk>
            <Perk className={look.check}>{t("billing.page.perks.aiTaste")}</Perk>
            {(plan.aiTrial?.PodcastGeneration ?? 0) + (plan.aiTrial?.VideoTranscript ?? 0) > 0 && (
              <Perk icon={LuClapperboard} className={look.check}>
                {t("billing.page.perks.trial", { podcasts: plan.aiTrial.PodcastGeneration ?? 0, videos: plan.aiTrial.VideoTranscript ?? 0 })}
              </Perk>
            )}
          </>
        ) : (
          <>
            {isDuo && <Perk icon={LuUsers} className={look.check} strong>{t("billing.plans.forTwo")}</Perk>}
            {studyTimes && (
              <Perk icon={LuSparkles} className={look.check} strong={!isDuo}>
                {t(isDuo ? "billing.page.perks.studyEach" : "billing.page.perks.study", { times: studyTimes })}
              </Perk>
            )}
            {isDuo && duoSaving && <Perk icon={LuBadgePercent} className={look.check}>{t("billing.page.perks.duoSaving", { percent: duoSaving })}</Perk>}
          </>
        )}
        {!isFree && <Perk icon={LuClapperboard} className={look.check}>{t("billing.page.perks.media", media)}</Perk>}
        {!isFree && <Perk className={look.check}>{t(isDuo ? "billing.page.perks.ownAccounts" : "billing.plans.keepsContent")}</Perk>}
      </ul>

      {(action || isCurrent) && (
        <Button
          size="lg"
          onClick={action?.run}
          disabled={isCurrent || disabled}
          variant={isCurrent || isFree ? "outline" : "default"}
          className={cn(
            "mt-auto w-full",
            !isCurrent && isDuo && "bg-violet-600 text-white hover:bg-violet-700",
            !isCurrent && isRecommended && "bg-emerald-600 text-white hover:bg-emerald-700",
          )}
        >
          {pending && <LuLoaderCircle aria-hidden className="animate-spin" />}
          {isCurrent ? t("billing.plans.current") : action?.label}
        </Button>
      )}
    </article>
  );
};
