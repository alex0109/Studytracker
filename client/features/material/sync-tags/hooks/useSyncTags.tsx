import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib";
import { materialKeys, syncTags } from "@/entities/material";

export const useSyncTags = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const syncTagsMutation = useMutation({
    mutationFn: ({ id, tagIds }: { id: string; tagIds: string[] }) =>
      syncTags(token, id, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id}/tags`,
        userID: user?.id,
      });
    },
  });

  return {
    syncTags: syncTagsMutation.mutate,
  };
};

export default useSyncTags;
