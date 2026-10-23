"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { createTag, ITagCreate } from "@/entities/tag";
import { tagKeys } from "@/entities/tag/lib/tag-query-keys";
import { toast } from "@/shared/radix-ui";

export const useTagCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createTagMutation = useMutation({
    mutationFn: (body: ITagCreate) => createTag(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast({
        title: "✅Tag has created",
        description: "You can use inside any material",
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
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
        title: "❌Error occured while creating tag",
        variant: "error",
      });
    },
  });

  return {
    createTag: createTagMutation.mutate,
    createTagData: createTagMutation.data,
  };
};
