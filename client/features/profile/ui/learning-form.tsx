"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronDown, LuRefreshCw } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { SaveStatus } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { IProfileUpdate, useProfile } from "@/entities/profile";
import { useProfileUpdate } from "../hooks/useProfileUpdate";
import { useReschedule } from "../hooks/useReschedule";
import { control, Field } from "./field";

type FieldName = keyof IProfileUpdate;
type NumberField = "dailyGoal" | "newCardsPerDay" | "maxReviewsPerDay";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

// Basics first; the settings for people who came from Anki are folded away
export const LearningForm: FC = () => {
  const { t } = useTranslation();
  const { profileData } = useProfile();
  const { updateProfile, updateProfileIsPending, updateProfileIsError } = useProfileUpdate();
  const { reschedule, rescheduleIsPending } = useReschedule();
  const [savingField, setSavingField] = useState<FieldName | null>(null);
  const [advanced, setAdvanced] = useState(false);
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
    // Someone who already changed these sees them open
    if (
      profileData.desiredRetention !== null ||
      profileData.newCardsPerDay !== null ||
      profileData.maxReviewsPerDay !== null ||
      profileData.streakFreezesPerMonth !== null
    ) {
      setAdvanced(true);
    }
  }

  if (!profileData) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { defaults } = profileData;

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

  const numberInput = (field: NumberField, min: number, max: number) => (
    <input
      className={control}
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
    <select
      className={control}
      value={profileData[field] ?? -1}
      onChange={(event) => save(field, { [field]: Number(event.target.value) })}
    >
      <option value={-1}>{t("learning.defaultHour", { hour: hourLabel(fallback) })}</option>
      {HOURS.map((hour) => (
        <option key={hour} value={hour}>
          {hourLabel(hour)}
        </option>
      ))}
    </select>
  );

  const shownRetention = retention ?? defaults.desiredRetention;
  const percent = Math.round(shownRetention * 100);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("learning.dailyGoal")} status={status("dailyGoal")} hint={t("learning.dailyGoalHint")}>
          {numberInput("dailyGoal", 0, 1000)}
        </Field>
        <Field label={t("learning.dailyReminder")} status={status("dailyReminderHour")}>
          {hourSelect("dailyReminderHour", defaults.dailyReminderHour)}
        </Field>
        <Field label={t("learning.streakReminder")} status={status("streakReminderHour")}>
          {hourSelect("streakReminderHour", defaults.streakReminderHour)}
        </Field>
      </div>

      <button
        type="button"
        aria-expanded={advanced}
        onClick={() => setAdvanced((open) => !open)}
        className="flex items-center gap-1.5 self-start text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      >
        <LuChevronDown aria-hidden className={cn("transition-transform", advanced && "rotate-180")} />
        {t("learning.advanced")}
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
            <div className="flex flex-col gap-5 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
              <Field
                label={t("learning.retention", { percent })}
                status={status("desiredRetention")}
                hint={t("learning.retentionHint")}
              >
                <input
                  type="range"
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
                  className="accent-emerald-600"
                />
                <span className="flex justify-between text-xs text-neutral-500">
                  <span>{t("learning.retentionLess")}</span>
                  <span>{t("learning.retentionMore")}</span>
                </span>
              </Field>
              {profileData.desiredRetention !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setRetention(null);
                    save("desiredRetention", { desiredRetention: 0 });
                  }}
                  className="-mt-3 self-start text-xs text-neutral-500 underline-offset-4 hover:underline"
                >
                  {t("learning.retentionReset", { percent: Math.round(defaults.desiredRetention * 100) })}
                </button>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t("learning.newPerDay")} status={status("newCardsPerDay")}>
                  {numberInput("newCardsPerDay", 0, 1000)}
                </Field>
                <Field label={t("learning.maxPerDay")} status={status("maxReviewsPerDay")}>
                  {numberInput("maxReviewsPerDay", 1, 5000)}
                </Field>
                <Field
                  label={t("learning.freezes")}
                  status={status("streakFreezesPerMonth")}
                  hint={t("learning.freezesHint")}
                >
                  <select
                    className={control}
                    value={profileData.streakFreezesPerMonth ?? -1}
                    onChange={(event) =>
                      save("streakFreezesPerMonth", { streakFreezesPerMonth: Number(event.target.value) })
                    }
                  >
                    <option value={-1}>
                      {t("learning.freezesDefault", { count: defaults.streakFreezesPerMonth })}
                    </option>
                    {Array.from({ length: 11 }, (_, count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
                <p className="text-xs text-neutral-500">{t("learning.rescheduleHint")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={rescheduleIsPending}
                  onClick={() => reschedule()}
                  className="shrink-0"
                >
                  <LuRefreshCw aria-hidden className={cn(rescheduleIsPending && "animate-spin")} />
                  {t("learning.reschedule")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
