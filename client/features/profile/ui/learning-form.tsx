"use client";

import { FC, ReactNode, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBell,
  LuChevronDown,
  LuLanguages,
  LuRefreshCw,
  LuSlidersHorizontal,
  LuSparkles,
  LuTarget,
} from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { FieldSelect, SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { IProfileUpdate, useProfile } from "@/entities/profile";
import { SubscriptionTierEnum, useAiUsage } from "@/entities/ai";
import { useProfileUpdate } from "../hooks/useProfileUpdate";
import { useReschedule } from "../hooks/useReschedule";
import { control, Field } from "./field";

type FieldName = keyof IProfileUpdate;
type NumberField = "dailyGoal" | "newCardsPerDay" | "maxReviewsPerDay";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;
const GOAL_PRESETS = [10, 20, 30, 50] as const;
const isPresetGoal = (goal: number) => goal === 0 || (GOAL_PRESETS as readonly number[]).includes(goal);

const TONES = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  neutral: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

// One group of settings: a tile, a title, a line on what it is for
const Group: FC<{
  icon: IconType;
  tone: keyof typeof TONES;
  title: string;
  text: string;
  aside?: ReactNode;
  children?: ReactNode;
}> = ({ icon: Icon, tone, title, text, aside, children }) => (
  <section className="flex flex-col gap-5 rounded-2xl border border-neutral-200 p-4 sm:p-5 dark:border-neutral-800">
    <header className="flex items-start gap-3">
      <span aria-hidden className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl text-lg", TONES[tone])}>
        <Icon />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-neutral-900 dark:text-neutral-50">{title}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{text}</span>
      </span>
      {aside}
    </header>
    {children}
  </section>
);

const Chip: FC<{ active: boolean; onClick: () => void; children: ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "h-11 min-w-14 rounded-xl border px-4 text-[15px] font-medium transition sm:h-10 sm:text-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
      active
        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200"
        : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white",
    )}
  >
    {children}
  </button>
);

// The day's rhythm first, then help with words; the settings for people who came from Anki are folded away
export const LearningForm: FC = () => {
  const { t } = useTranslation();
  const { profileData } = useProfile();
  const { aiUsageData } = useAiUsage();
  const { updateProfile, updateProfileIsPending, updateProfileIsError } = useProfileUpdate();
  const { reschedule, rescheduleIsPending } = useReschedule();
  const [savingField, setSavingField] = useState<FieldName | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [customGoal, setCustomGoal] = useState(false);
  const goalInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<Record<NumberField, string>>({
    dailyGoal: "",
    newCardsPerDay: "",
    maxReviewsPerDay: "",
  });
  const [retention, setRetention] = useState<number | null>(null);

  // The fields follow the server copy whenever a new one arrives
  const [syncedProfile, setSyncedProfile] = useState<typeof profileData>();
  if (profileData && profileData !== syncedProfile) {
    setSyncedProfile(profileData);
    setDraft({
      dailyGoal: profileData.dailyGoal ? String(profileData.dailyGoal) : "",
      newCardsPerDay: profileData.newCardsPerDay === null ? "" : String(profileData.newCardsPerDay),
      maxReviewsPerDay: profileData.maxReviewsPerDay === null ? "" : String(profileData.maxReviewsPerDay),
    });
    setRetention(profileData.desiredRetention);
    if (!isPresetGoal(profileData.dailyGoal ?? 0)) setCustomGoal(true);
    // Someone who already changed these sees them open
    if (
      profileData.desiredRetention !== null ||
      profileData.newCardsPerDay !== null ||
      profileData.maxReviewsPerDay !== null
    ) {
      setAdvanced(true);
    }
  }

  if (!profileData) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const { defaults } = profileData;
  const goal = profileData.dailyGoal ?? 0;
  const isFree = !!aiUsageData && aiUsageData.tier === SubscriptionTierEnum.Free;

  const save = (field: FieldName, body: IProfileUpdate) => {
    setSavingField(field);
    updateProfile(body);
  };

  const status = (field: FieldName) => (
    <SaveStatus isPending={updateProfileIsPending && savingField === field} isError={updateProfileIsError} />
  );

  // Empty means "no goal" or "no limit"; the goal is cleared with 0, limits with -1
  const saveNumber = (field: NumberField) => {
    const parsed = Number.parseInt(draft[field], 10);
    const empty = !Number.isFinite(parsed) || (field !== "newCardsPerDay" && parsed <= 0);
    const next = empty ? (field === "dailyGoal" ? 0 : -1) : parsed;
    const current = profileData[field] ?? (field === "dailyGoal" ? 0 : -1);
    if (next !== current) save(field, { [field]: next });
  };

  const pickGoal = (next: number) => {
    setCustomGoal(false);
    setDraft((prev) => ({ ...prev, dailyGoal: next ? String(next) : "" }));
    if (next !== goal) save("dailyGoal", { dailyGoal: next });
  };

  const numberInput = (field: NumberField, min: number, max: number, className?: string) => (
    <input
      ref={field === "dailyGoal" ? goalInput : undefined}
      className={cn(control, className)}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={draft[field]}
      placeholder={field === "dailyGoal" ? t("learning.noGoal") : t("learning.noLimit")}
      onChange={(event) => setDraft((prev) => ({ ...prev, [field]: event.target.value }))}
      onBlur={() => saveNumber(field)}
    />
  );

  const hourSelect = (field: "dailyReminderHour" | "streakReminderHour", fallback: number) => (
    <FieldSelect
      value={String(profileData[field] ?? -1)}
      onValueChange={(next) => save(field, { [field]: Number(next) })}
      options={[
        { value: "-1", label: t("learning.defaultHour", { hour: hourLabel(fallback) }) },
        ...HOURS.map((hour) => ({ value: String(hour), label: hourLabel(hour) })),
      ]}
    />
  );

  const shownRetention = retention ?? defaults.desiredRetention;
  const percent = Math.round(shownRetention * 100);
  const autoTranslate = profileData.autoTranslate;

  return (
    <div className="flex flex-col gap-4">
      <Group
        icon={LuTarget}
        tone="emerald"
        title={t("learning.groups.rhythm.title")}
        text={t("learning.groups.rhythm.text")}
      >
        <div role="group" aria-label={t("learning.dailyGoal")} className="flex flex-col gap-2">
          <span className="flex items-center justify-between gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {t("learning.dailyGoal")}
            {status("dailyGoal")}
          </span>
          <div className="flex flex-wrap gap-2">
            <Chip active={!customGoal && goal === 0} onClick={() => pickGoal(0)}>
              {t("learning.noGoal")}
            </Chip>
            {GOAL_PRESETS.map((preset) => (
              <Chip key={preset} active={!customGoal && goal === preset} onClick={() => pickGoal(preset)}>
                {preset}
              </Chip>
            ))}
            <Chip
              active={customGoal}
              onClick={() => {
                setCustomGoal(true);
                requestAnimationFrame(() => goalInput.current?.focus());
              }}
            >
              {t("common.customNumber")}
            </Chip>
          </div>
          {customGoal && (
            <div className="flex items-center gap-2">
              {numberInput("dailyGoal", 0, 1000, "w-32 sm:w-28")}
              <span className="text-sm text-neutral-500">{t("learning.perDay")}</span>
            </div>
          )}
          <span className="text-xs text-neutral-500">{t("learning.dailyGoalHint")}</span>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <span className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
            <LuBell aria-hidden className="text-neutral-400" />
            {t("learning.reminders")}
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("learning.dailyReminder")} status={status("dailyReminderHour")}>
              {hourSelect("dailyReminderHour", defaults.dailyReminderHour)}
            </Field>
            <Field label={t("learning.streakReminder")} status={status("streakReminderHour")}>
              {hourSelect("streakReminderHour", defaults.streakReminderHour)}
            </Field>
          </div>
        </div>
      </Group>

      <Group icon={LuLanguages} tone="sky" title={t("learning.groups.words.title")} text={t("learning.groups.words.text")}>
        <div className="flex items-start gap-4 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap items-center gap-2 font-medium text-neutral-900 dark:text-neutral-50">
              {t("learning.autoTranslate.title")}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <LuSparkles aria-hidden />
                Plus
              </span>
              {status("autoTranslate")}
            </span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{t("learning.autoTranslate.text")}</span>
            <span className="text-xs text-neutral-500">
              {t("learning.autoTranslate.quota", { feature: t("ai.features.WordLookup") })}
            </span>
            {isFree && (
              <Link
                href="/limits#plans"
                className="mt-1 inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
              >
                {t("learning.autoTranslate.plus")}
                <LuArrowRight aria-hidden />
              </Link>
            )}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={autoTranslate}
            aria-label={t("learning.autoTranslate.title")}
            disabled={updateProfileIsPending && savingField === "autoTranslate"}
            onClick={() => save("autoTranslate", { autoTranslate: !autoTranslate })}
            className={cn(
              "relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
              autoTranslate ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-700",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
                autoTranslate && "translate-x-5",
              )}
            />
          </button>
        </div>
      </Group>

      <section className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          aria-expanded={advanced}
          onClick={() => setAdvanced((open) => !open)}
          className="flex items-start gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-neutral-50 sm:p-5 dark:hover:bg-neutral-800/40"
        >
          <span aria-hidden className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl text-lg", TONES.neutral)}>
            <LuSlidersHorizontal />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">{t("learning.advanced")}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{t("learning.groups.advanced.text")}</span>
          </span>
          <LuChevronDown
            aria-hidden
            className={cn("mt-2.5 shrink-0 text-neutral-400 transition-transform", advanced && "rotate-180")}
          />
        </button>

        <AnimatePresence initial={false}>
          {advanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-6 px-4 pb-5 sm:px-5">
                <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
                  <span className="flex items-center justify-between gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {t("learning.retentionTitle")}
                    {status("desiredRetention")}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-emerald-700 tabular-nums dark:text-emerald-400">
                    {percent}%
                  </span>
                  <input
                    type="range"
                    aria-label={t("learning.retention", { percent })}
                    min={defaults.minRetention}
                    max={defaults.maxRetention}
                    step={0.01}
                    value={shownRetention}
                    onChange={(event) => setRetention(Number(event.target.value))}
                    onPointerUp={() => {
                      if (retention !== null && retention !== profileData.desiredRetention)
                        save("desiredRetention", { desiredRetention: retention });
                    }}
                    onKeyUp={() => {
                      if (retention !== null && retention !== profileData.desiredRetention)
                        save("desiredRetention", { desiredRetention: retention });
                    }}
                    className="h-6 w-full accent-emerald-600"
                  />
                  <span className="flex justify-between gap-4 text-xs text-neutral-500">
                    <span>{t("learning.retentionLess")}</span>
                    <span className="text-right">{t("learning.retentionMore")}</span>
                  </span>
                  <span className="text-xs text-neutral-500">{t("learning.retentionHint")}</span>
                  {profileData.desiredRetention !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setRetention(null);
                        save("desiredRetention", { desiredRetention: 0 });
                      }}
                      className="self-start text-sm text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                    >
                      {t("learning.retentionReset", { percent: Math.round(defaults.desiredRetention * 100) })}
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("learning.newPerDay")} status={status("newCardsPerDay")}>
                    {numberInput("newCardsPerDay", 0, 1000)}
                  </Field>
                  <Field label={t("learning.maxPerDay")} status={status("maxReviewsPerDay")}>
                    {numberInput("maxReviewsPerDay", 1, 5000)}
                  </Field>
                </div>


                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("learning.rescheduleHint")}</p>
                  <Button
                    variant="outline"
                    disabled={rescheduleIsPending}
                    onClick={() => reschedule()}
                    className="h-11 shrink-0 sm:h-10"
                  >
                    <LuRefreshCw aria-hidden className={cn(rescheduleIsPending && "animate-spin")} />
                    {t("learning.reschedule")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
