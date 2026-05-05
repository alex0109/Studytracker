import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterialService } from "../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";

const useMaterialDelete = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: string) => deleteMaterialService(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/delete",
        userID: user?.id,
      });
    },
  });

  return {
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};

export default useMaterialDelete;
