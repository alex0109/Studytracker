"use client";

import { FC, useEffect } from "react";
import { useNotificationSettings } from "@/entities/notification";
import { useTranslation } from "@/shared/i18n";
import { useReminderSettingsUpdate } from "../hooks/useReminderSettingsUpdate";

const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

// Keeps the server's copy of the time zone and language current, so reminders come at
// the user's local hour and in their language. Renders nothing
export const ReminderSettingsSync: FC = () => {
  const { i18n } = useTranslation();
  const { settingsData } = useNotificationSettings();
  const { updateSettings } = useReminderSettingsUpdate(true);

  useEffect(() => {
    if (!settingsData) return;

    const timeZone = browserTimeZone();
    const changes: { timeZone?: string; language?: string } = {};

    if (timeZone && settingsData.timeZone !== timeZone) changes.timeZone = timeZone;
    if (settingsData.language !== i18n.language && settingsData.timeZone) {
      changes.language = i18n.language;
    }
    // The first save needs the time zone, the language goes with it
    if (changes.timeZone && !settingsData.timeZone) changes.language = i18n.language;

    if (Object.keys(changes).length > 0) updateSettings(changes);
  }, [settingsData, i18n.language]);

  return null;
};
