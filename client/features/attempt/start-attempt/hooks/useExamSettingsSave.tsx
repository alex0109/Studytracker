"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentKeys, IAssessmentSettings, updateAssessmentSettings } from "@/entities/assessment";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

// The choice made before a start is kept for the next one
export const useExamSettingsSave = (assessmentId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (settings: IAssessmentSettings) => updateAssessmentSettings(token, assessmentId, settings),
    onSuccess: (saved) => {
      queryClient.setQueryData(assessmentKeys.detail(assessmentId), saved);
    },
    onError: (error) => {
      logExceptionError(error, { section: `assessments/${assessmentId}/settings`, userID: user?.id });
      toast({ title: `❌${t("exam.saveError")}`, variant: "error" });
    },
  });

  return { saveExamSettings: mutation.mutateAsync, saveExamSettingsIsPending: mutation.isPending };
};
