"use client";

import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { aiKeys, getAiErrorMessage } from "@/entities/ai";
import { processMaterialVideo, videoKeys } from "@/entities/video";

export const useVideoProcess = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const process = useMutation({
    mutationFn: () => processMaterialVideo(token, materialId),
    onSuccess: (video) => {
      queryClient.setQueryData(videoKeys.material(materialId), video);
      toast({ title: `✨${t("video.processed", { count: video.segments.length })}`, variant: "success" });
    },
    onError: (error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      // A private or removed video fails at the AI, which looks like the AI being down
      const message =
        status === 503
          ? t("video.errors.failed")
          : status === 422
            ? t("video.errors.noSpeech")
            : getAiErrorMessage(error, t);
      if (message !== null) {
        if (message) toast({ title: `⚠️${message}`, variant: "error" });
        return;
      }
      logExceptionError(error, { section: `ai/materials/${materialId}/video`, userID: user?.id });
      toast({ title: `❌${t("video.errors.failed")}`, variant: "error" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: aiKeys.usage() }),
  });

  return {
    processVideo: process.mutate,
    processVideoIsPending: process.isPending,
  };
};
