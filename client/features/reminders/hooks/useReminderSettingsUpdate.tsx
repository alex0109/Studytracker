"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  INotificationSettingsUpdate,
  notificationKeys,
  updateNotificationSettings,
} from "@/entities/notification";
import { statisticsKeys } from "@/entities/statistics";

export const useReminderSettingsUpdate = (silent = false) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: INotificationSettingsUpdate) => updateNotificationSettings(token, body),
    onSuccess: (settings) => {
      queryClient.setQueryData(notificationKeys.settings(), settings);
      // Streak and "today" are counted in the user's time zone
      queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.studyStreak() });
      if (!silent) toast({ title: `✅${t("digest.settings.saved")}`, variant: "success" });
    },
    onError: (error) => {
      logExceptionError(error, { section: "notifications/settings (update)", userID: user?.id });
      if (!silent) toast({ title: `❌${t("digest.settings.error")}`, variant: "error" });
    },
  });

  return {
    updateSettings: mutation.mutate,
    updateSettingsIsPending: mutation.isPending,
  };
};
