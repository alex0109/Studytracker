"use client";

import { FC, useState } from "react";
import { LuChevronDown, LuCoins } from "react-icons/lu";
import { LimitBar } from "@/shared/ui";
import { cn, formatDate } from "@/shared/lib";
import { Trans, useTranslation } from "@/shared/i18n";
import { aiFeatureLabelKey, IAiFeatureUsage, IAiUsage } from "@/entities/ai";

const fraction = (item: IAiFeatureUsage) => (item.limit > 0 ? Math.min(item.used / item.limit, 1) : 0);

// What is left of a media feature: the period's quota, or Free's one-time trial
const MediaBar: FC<{ item: IAiFeatureUsage | undefined; label: string }> = ({ item, label }) => {
  const { t } = useTranslation();
  if (!item) return null;
  const onTrial = item.limit === 0 && item.trialLimit > 0;

  return (
    <LimitBar
      label={onTrial ? `${label} · ${t("billing.usage.trial")}` : label}
      used={onTrial ? item.trialUsed : item.used}
      max={onTrial ? item.trialLimit : item.limit}
    />
  );
};

// AI of this billing period in two parts: study AI as one bar (the average use of its quotas) and
// media as what is left of podcasts and video minutes; every feature on expand, the credits beside
export const AiUsageBuckets: FC<{ usage: IAiUsage; onBuyCredits: () => void }> = ({ usage, onBuyCredits }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const study = usage.features.filter((x) => x.bucket === "Study" && x.limit > 0);
  const media = usage.features.filter((x) => x.bucket === "Media");
  const studyPercent = study.length ? Math.round((study.reduce((sum, x) => sum + fraction(x), 0) / study.length) * 100) : 0;
  const unit = (feature: string) => {
    const name = t(`ai.units.${feature}` as "ai.units.VideoTranscript");
    return name ? ` (${name})` : "";
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
          <span className="text-sm font-semibold">{t("billing.compare.study")}</span>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-neutral-700 dark:text-neutral-200">{t("billing.usage.studyText", { percent: studyPercent })}</span>
            <div
              role="progressbar"
              aria-label={t("billing.compare.study")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={studyPercent}
              className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
            >
              <div
                className={cn("h-full rounded-full transition-[width] duration-500", studyPercent >= 90 ? "bg-amber-500" : "bg-emerald-500")}
                style={{ width: `${studyPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
          <span className="text-sm font-semibold">{t("billing.compare.media")}</span>
          <MediaBar item={media.find((x) => x.feature === "PodcastGeneration")} label={t("billing.usage.podcasts")} />
          <MediaBar item={media.find((x) => x.feature === "VideoTranscript")} label={t("billing.usage.video")} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500">
        <span>
          <Trans
            i18nKey="limits.page.resets"
            values={{ date: formatDate(usage.resetsAt, i18n.language) }}
            components={{ b: <span className="font-medium text-neutral-700 dark:text-neutral-200" /> }}
          />
        </span>
        <button type="button" onClick={onBuyCredits} className="flex items-center gap-1.5 font-medium text-violet-700 hover:underline dark:text-violet-300">
          <LuCoins aria-hidden /> {t("billing.usage.credits", { count: usage.creditBalance })}
        </button>
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 self-start text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      >
        <LuChevronDown aria-hidden className={cn("transition", open && "rotate-180")} />
        {t("billing.usage.details")}
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {usage.features.map((item) => (
            <LimitBar
              key={item.feature}
              label={`${t(aiFeatureLabelKey(item.feature), { defaultValue: item.feature })}${unit(item.feature)}`}
              used={item.limit === 0 && item.trialLimit > 0 ? item.trialUsed : item.used}
              max={item.limit === 0 && item.trialLimit > 0 ? item.trialLimit : item.limit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
