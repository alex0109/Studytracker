"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { deadlineKeys, setMaterialDeadline } from "@/entities/deadline";
import { statisticsKeys } from "@/entities/statistics";

export const useMaterialDeadline = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (deadline: string | null) => setMaterialDeadline(token, materialId, deadline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deadlineKeys.all });
      // Deadlines are marked on the activity calendar too
      queryClient.invalidateQueries({ queryKey: statisticsKeys.calendarAll() });
    },
    onError: (error) => {
      logExceptionError(error, { section: `materials/${materialId}/deadline`, userID: user?.id });
      toast({ title: `❌${t("deadline.saveError")}`, variant: "error" });
    },
  });

  return { setDeadline: mutation.mutate, setDeadlineIsPending: mutation.isPending };
};
