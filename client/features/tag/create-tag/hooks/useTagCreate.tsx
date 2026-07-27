"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { createTag, ITagCreate } from "@/entities/tag";
import { tagKeys } from "@/entities/tag/lib/tag-query-keys";

export const useTagCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createTagMutation = useMutation({
    mutationFn: (body: ITagCreate) => createTag(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "tags/ (create)",
        userID: user?.id,
      });
    },
  });

  return {
    createTag: createTagMutation.mutate,
    createTagData: createTagMutation.data,
  };
};
