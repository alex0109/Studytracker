"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { IProfileUpdate, profileKeys, updateProfile } from "@/entities/profile";
import { notificationKeys } from "@/entities/notification";
import { statisticsKeys } from "@/entities/statistics";
import { reviewKeys } from "@/entities/review";

export const useProfileUpdate = (silent = false) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: IProfileUpdate) => updateProfile(token, body),
    onSuccess: (profile, body) => {
      queryClient.setQueryData(profileKeys.all, profile);
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
      // Days, streaks and "today" are counted in the user's time zone
      if (body.timeZone) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });
        queryClient.invalidateQueries({ queryKey: statisticsKeys.studyStreak() });
        queryClient.invalidateQueries({ queryKey: reviewKeys.today() });
      }
    },
    onError: (error) => {
      if (silent) return;
      // 400 is a value the server doesn't take, its title says which
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast({ title: `⚠️${t("profile.invalid")}`, variant: "error" });
        return;
      }
      logExceptionError(error, { section: "profile (update)", userID: user?.id });
      toast({ title: `❌${t("profile.error")}`, variant: "error" });
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileIsPending: mutation.isPending,
    updateProfileIsError: mutation.isError,
  };
};
