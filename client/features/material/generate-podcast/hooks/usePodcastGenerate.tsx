"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { aiKeys, getAiErrorMessage } from "@/entities/ai";
import { generatePodcast, podcastKeys, retryPodcast } from "@/entities/podcast";

export const usePodcastGenerate = (materialId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const onError = (section: string) => (error: unknown) => {
    // Quota, AI or voices down, too little text: tell why, this is not a bug to report
    const aiMessage = getAiErrorMessage(error, t);
    if (aiMessage) {
      toast({ title: `⚠️${aiMessage}`, variant: "error" });
      return;
    }
    logExceptionError(error, { section, userID: user?.id });
    toast({ title: `❌${t("podcast.errors.generate")}`, variant: "error" });
  };

  const generate = useMutation({
    mutationFn: (language: string) => generatePodcast(token, materialId, language),
    onSuccess: (podcast) => {
      queryClient.setQueryData(podcastKeys.material(materialId), podcast);
      if (podcast.isContentTruncated) toast({ title: `ℹ️${t("podcast.truncated")}`, variant: "success" });
    },
    onError: onError(`ai/materials/${materialId}/podcast`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: aiKeys.usage() }),
  });

  const retry = useMutation({
    mutationFn: () => retryPodcast(token, materialId),
    onSuccess: (podcast) => queryClient.setQueryData(podcastKeys.material(materialId), podcast),
    onError: onError(`ai/materials/${materialId}/podcast/retry`),
  });

  return {
    generatePodcast: generate.mutateAsync,
    generatePodcastIsPending: generate.isPending,
    retryPodcast: retry.mutate,
    retryPodcastIsPending: retry.isPending,
  };
};
