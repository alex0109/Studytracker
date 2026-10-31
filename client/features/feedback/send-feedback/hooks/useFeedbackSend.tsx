"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { sendFeedback } from "../api/sendFeedback";
import { IFeedbackCreate } from "../model/feedback.type";

export const useFeedbackSend = () => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: IFeedbackCreate) => sendFeedback(token, body),
    onSuccess: () => {
      toast({ title: `💌${t("feedback.toast.sent")}`, variant: "success" });
    },
    onError: (error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 429) {
        toast({ title: `⏳${t("feedback.toast.tooMany")}`, variant: "error" });
        return;
      }
      if (status === 400 || status === 503) {
        toast({ title: `⚠️${t("feedback.toast.notSent")}`, variant: "error" });
        return;
      }

      logExceptionError(error, { section: "feedback (send)", userID: user?.id });
      toast({ title: `❌${t("feedback.toast.notSent")}`, variant: "error" });
    },
  });

  return {
    sendFeedback: mutation.mutateAsync,
    sendFeedbackIsPending: mutation.isPending,
  };
};
