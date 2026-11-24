"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError, getLimitErrorMessage } from "@/shared/lib";
import { createTag, ITagCreate, tagKeys } from "@/entities/tag";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

export const useTagCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createTagMutation = useMutation({
    mutationFn: (body: ITagCreate) => createTag(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast({
        title: `✅${t("toasts.tagCreated")}`,
        description: t("toasts.tagCreatedText"),
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error, t);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: tagKeys.all });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: "tags/ (create)",
        userID: user?.id,
      });
      toast({
        title: `❌${t("toasts.tagCreateError")}`,
        variant: "error",
      });
    },
  });

  return {
    createTag: createTagMutation.mutate,
    createTagData: createTagMutation.data,
    createTagIsPending: createTagMutation.isPending,
  };
};
