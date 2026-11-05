"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { deleteTag } from "@/entities/tag";
import { tagKeys } from "@/entities/tag/lib/tag-query-keys";
import { materialKeys } from "@/entities/material";

export const useTagDelete = (id: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteTagMutation = useMutation({
    mutationFn: () => deleteTag(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      // Materials carry their tags: the deleted one leaves them too
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
      toast({ title: `✅${t("toasts.tagDeleted")}`, variant: "success" });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `tags/${id} (delete)`,
        userID: user?.id,
      });
      toast({ title: `❌${t("toasts.tagDeleteError")}`, variant: "error" });
    },
  });

  return {
    deleteTag: deleteTagMutation.mutate,
    deleteTagIsPending: deleteTagMutation.isPending,
  };
};
