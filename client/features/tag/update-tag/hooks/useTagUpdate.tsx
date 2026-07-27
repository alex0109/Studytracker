"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { tagKeys } from "@/entities/tag/lib/tag-query-keys";
import { ITagUpdate, updateTag } from "@/entities/tag";

export const useTagUpdate = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateTagMutation = useMutation({
    mutationFn: ({
      id,
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: ITagUpdate;
    }) => updateTag(token, id, dataToUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `tags/${id} (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    updateTag: updateTagMutation.mutate,
  };
};
