"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { deleteTag } from "@/entities/tag";
import { tagKeys } from "@/entities/tag/lib/tag-query-keys";

export const useTagDelete = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteTagMutation = useMutation({
    mutationFn: () => deleteTag(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `tags/${id} (delete)`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteTag: deleteTagMutation.mutate,
  };
};
