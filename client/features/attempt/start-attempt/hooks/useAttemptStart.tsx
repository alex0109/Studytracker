"use client";

import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { attemptKeys, startAttempt } from "@/entities/attempt";

// Every attempt started from the site takes the material's exam settings, from a note too
export const useAttemptStart = (assessmentId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const startAttemptMutation = useMutation({
    mutationFn: () => startAttempt(token, assessmentId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
    },
    onError: (error) => {
      // 400: no active question matches the settings, the user can change them
      if (isAxiosError(error) && error.response?.status === 400) {
        toast({ title: `❌${t("exam.noQuestionsToStart")}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: "attempts/ (create)",
        userID: user?.id,
      });
      toast({ title: `❌${t("toasts.attemptNotStarted")}`, variant: "error" });
    },
  });

  return {
    attemptStart: startAttemptMutation.mutateAsync,
    startAttemptIsPending: startAttemptMutation.isPending,
  };
};
