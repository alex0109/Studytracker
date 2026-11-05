"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentKeys, updateAssessmentSettings } from "@/entities/assessment";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useExamSettings = (assessmentId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (timerMinutes: number | null) => updateAssessmentSettings(token, assessmentId, { timerMinutes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(assessmentId) });
    },
    onError: (error) => {
      logExceptionError(error, { section: `assessments/${assessmentId}/settings`, userID: user?.id });
      toast({ title: `❌${t("exam.saveError")}`, variant: "error" });
    },
  });

  return { saveExamSettings: mutation.mutate, saveExamSettingsIsPending: mutation.isPending };
};
