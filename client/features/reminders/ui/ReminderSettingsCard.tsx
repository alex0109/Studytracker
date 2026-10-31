"use client";

import { FC } from "react";
import { LuBellRing } from "react-icons/lu";
import { useNotificationSettings } from "@/entities/notification";
import { useSession } from "@/shared/context/session.provider";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useReminderSettingsUpdate } from "../hooks/useReminderSettingsUpdate";

const OPTIONS = [
  { field: "emailDailyReminder", key: "daily" },
  { field: "emailStreakReminder", key: "streak" },
  { field: "emailWeeklyDigest", key: "weekly" },
] as const;

// Emails go out only for the kinds the user switches on here
export const ReminderSettingsCard: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const { user } = useSession();
  const { settingsData } = useNotificationSettings();
  const { updateSettings, updateSettingsIsPending } = useReminderSettingsUpdate();

  const timeZoneReady = !!settingsData?.timeZone;
  const email = settingsData?.email ?? user?.email;

  return (
    <section
      id="reminders"
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none",
        className,
      )}
    >
      <header className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <LuBellRing aria-hidden />
        </span>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
            {t("digest.settings.title")}
          </h3>
          <p className="text-sm text-neutral-500">{t("digest.settings.text")}</p>
        </div>
      </header>

      <ul className="flex flex-col gap-3">
        {OPTIONS.map(({ field, key }) => {
          const checked = settingsData?.[field] ?? false;

          return (
            <li key={field} className="flex items-center justify-between gap-4">
              <span className="flex flex-col">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {t(`digest.settings.${key}.title`)}
                </span>
                <span className="text-xs text-neutral-500">
                  {t(`digest.settings.${key}.text`)}
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={t(`digest.settings.${key}.title`)}
                disabled={!timeZoneReady || updateSettingsIsPending}
                onClick={() => updateSettings({ [field]: !checked })}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
                  checked ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-700",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                    checked && "translate-x-5",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-neutral-500">
        {email ? t("digest.settings.consent", { email }) : t("digest.settings.noEmail")}
      </p>
    </section>
  );
};
